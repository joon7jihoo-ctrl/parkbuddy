-- =========================================================
-- ParkBuddy round pairings migration
-- File: supabase/migrations/0013_round_pairings.sql
--
-- Purpose:
--   Store round game settings and group assignments.
--
-- Security goals:
--   1. Only active admins can save pairings for their own club rounds.
--   2. Only active participants of the round can be assigned to groups.
--   3. Each group must have 3 or 4 players.
--   4. Game type and scoring type combinations are validated in the DB.
-- =========================================================

alter table public.rounds
  add column if not exists game_type text,
  add column if not exists scoring_type text,
  add column if not exists pairings_updated_at timestamptz;

create table if not exists public.round_groups (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.rounds(id) on delete cascade,
  group_no integer not null,
  game_type text not null,
  scoring_type text not null,
  created_at timestamptz not null default now(),
  unique (round_id, group_no)
);

create table if not exists public.round_group_members (
  id uuid primary key default gen_random_uuid(),
  round_group_id uuid not null references public.round_groups(id) on delete cascade,
  round_id uuid not null references public.rounds(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  position integer not null default 1,
  created_at timestamptz not null default now(),
  unique (round_id, member_id)
);

create index if not exists round_groups_round_id_idx
on public.round_groups (round_id, group_no);

create index if not exists round_group_members_round_id_idx
on public.round_group_members (round_id, member_id);

alter table public.round_groups enable row level security;
alter table public.round_group_members enable row level security;

drop policy if exists "club members can read same club round groups"
on public.round_groups;

create policy "club members can read same club round groups"
on public.round_groups
for select
to authenticated
using (
  exists (
    select 1
    from public.rounds r
    join public.members m on m.club_id = r.club_id
    where r.id = round_groups.round_id
      and m.user_id = auth.uid()
      and m.status = 'active'
  )
);

drop policy if exists "club members can read same club round group members"
on public.round_group_members;

create policy "club members can read same club round group members"
on public.round_group_members
for select
to authenticated
using (
  exists (
    select 1
    from public.rounds r
    join public.members m on m.club_id = r.club_id
    where r.id = round_group_members.round_id
      and m.user_id = auth.uid()
      and m.status = 'active'
  )
);

create or replace function public.is_valid_round_game_combination(
  p_game_type text,
  p_scoring_type text
)
returns boolean
language sql
immutable
as $$
  select case p_game_type
    when 'individual' then p_scoring_type in ('stroke', 'new_peoria', 'match', 'stableford')
    when 'foursome' then p_scoring_type in ('stroke', 'match')
    when 'fourball' then p_scoring_type in ('stroke', 'match', 'stableford')
    when 'scramble' then p_scoring_type in ('stroke', 'match')
    when 'team_match' then p_scoring_type in ('stroke', 'new_peoria', 'match')
    else false
  end;
$$;

create or replace function public.admin_save_round_pairings(
  p_round_id uuid,
  p_game_type text,
  p_scoring_type text,
  p_assignments jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_round public.rounds;
  v_total integer;
  v_item jsonb;
  v_member_id uuid;
  v_group_no integer;
  v_position integer;
  v_group public.round_groups;
  v_invalid_group_count integer;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into v_admin
  from public.members
  where user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  limit 1;

  if not found then
    raise exception 'ADMIN_REQUIRED';
  end if;

  select *
  into v_round
  from public.rounds
  where id = p_round_id
    and club_id = v_admin.club_id
  limit 1
  for update;

  if not found then
    raise exception 'ROUND_NOT_FOUND';
  end if;

  if not public.is_valid_round_game_combination(p_game_type, p_scoring_type) then
    raise exception 'INVALID_GAME_COMBINATION';
  end if;

  if jsonb_typeof(p_assignments) <> 'array' then
    raise exception 'INVALID_ASSIGNMENTS';
  end if;

  select count(*)
  into v_total
  from jsonb_array_elements(p_assignments);

  if v_total < 3 then
    raise exception 'NOT_ENOUGH_PARTICIPANTS';
  end if;

  create temporary table tmp_round_pairings (
    member_id uuid primary key,
    group_no integer not null,
    position integer not null
  ) on commit drop;

  for v_item in select * from jsonb_array_elements(p_assignments)
  loop
    v_member_id := (v_item ->> 'member_id')::uuid;
    v_group_no := (v_item ->> 'group_no')::integer;
    v_position := coalesce((v_item ->> 'position')::integer, 1);

    if v_group_no < 1 then
      raise exception 'INVALID_GROUP_NO';
    end if;

    insert into tmp_round_pairings (member_id, group_no, position)
    values (v_member_id, v_group_no, v_position);
  end loop;

  if (select count(*) from tmp_round_pairings) <> v_total then
    raise exception 'DUPLICATE_PARTICIPANT';
  end if;

  if exists (
    select 1
    from tmp_round_pairings tp
    where not exists (
      select 1
      from public.round_participants rp
      join public.members m on m.id = rp.member_id
      where rp.round_id = p_round_id
        and rp.member_id = tp.member_id
        and m.club_id = v_admin.club_id
        and m.status = 'active'
    )
  ) then
    raise exception 'INVALID_PARTICIPANT';
  end if;

  select count(*)
  into v_invalid_group_count
  from (
    select group_no, count(*) as player_count
    from tmp_round_pairings
    group by group_no
    having count(*) < 3 or count(*) > 4
  ) invalid_groups;

  if v_invalid_group_count > 0 then
    raise exception 'INVALID_GROUP_SIZE';
  end if;

  delete from public.round_groups
  where round_id = p_round_id;

  for v_group_no in
    select distinct group_no
    from tmp_round_pairings
    order by group_no
  loop
    insert into public.round_groups (
      round_id,
      group_no,
      game_type,
      scoring_type
    )
    values (
      p_round_id,
      v_group_no,
      p_game_type,
      p_scoring_type
    )
    returning * into v_group;

    insert into public.round_group_members (
      round_group_id,
      round_id,
      member_id,
      position
    )
    select
      v_group.id,
      p_round_id,
      tp.member_id,
      tp.position
    from tmp_round_pairings tp
    where tp.group_no = v_group_no
    order by tp.position, tp.member_id;
  end loop;

  update public.rounds
  set
    game_type = p_game_type,
    scoring_type = p_scoring_type,
    pairings_updated_at = now(),
    updated_at = now()
  where id = p_round_id;

  if to_regclass('public.admin_action_logs') is not null then
    perform public.admin_log_action(
      v_admin.club_id,
      v_admin.id,
      null,
      'round.pairings.update',
      jsonb_build_object(
        'round_id', p_round_id,
        'game_type', p_game_type,
        'scoring_type', p_scoring_type,
        'participant_count', v_total
      )
    );
  end if;
end;
$$;

revoke all on function public.is_valid_round_game_combination(text, text) from public;
revoke all on function public.admin_save_round_pairings(uuid, text, text, jsonb) from public;

grant execute on function public.is_valid_round_game_combination(text, text) to authenticated;
grant execute on function public.admin_save_round_pairings(uuid, text, text, jsonb) to authenticated;
