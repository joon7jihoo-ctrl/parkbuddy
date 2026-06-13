-- =========================================================
-- ParkBuddy round participants migration
-- File: supabase/migrations/0012_round_participants.sql
--
-- Purpose:
--   Allow club admins to select participants for a round.
--
-- Security goals:
--   1. Never trust client-provided club_id.
--   2. Only active admins can update participants for rounds in their club.
--   3. Only active members in the same club can be selected.
--   4. Participant updates are stored in one DB transaction.
-- =========================================================

create table if not exists public.round_participants (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  round_id uuid not null references public.rounds(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  status text not null default 'confirmed',
  team_no integer,
  position_no integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (round_id, member_id)
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'round_participants_status_check'
      and conrelid = 'public.round_participants'::regclass
  ) then
    alter table public.round_participants
      add constraint round_participants_status_check
      check (status in ('confirmed', 'cancelled'));
  end if;
end;
$$;

create index if not exists round_participants_round_idx
on public.round_participants (round_id, created_at);

create index if not exists round_participants_member_idx
on public.round_participants (member_id, created_at desc);

alter table public.round_participants enable row level security;

drop policy if exists "club members can read same club round participants"
on public.round_participants;

create policy "club members can read same club round participants"
on public.round_participants
for select
to authenticated
using (
  exists (
    select 1
    from public.members m
    where m.user_id = auth.uid()
      and m.club_id = round_participants.club_id
      and m.status = 'active'
  )
);

create or replace function public.admin_set_round_participants(
  p_round_id uuid,
  p_member_ids uuid[] default '{}'::uuid[]
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_round public.rounds;
  v_member_ids uuid[];
  v_invalid_count integer;
  v_participant_count integer;
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

  select array(
    select distinct member_id
    from unnest(coalesce(p_member_ids, '{}'::uuid[])) as member_id
    where member_id is not null
  )
  into v_member_ids;

  select count(*)
  into v_invalid_count
  from unnest(v_member_ids) as selected_member_id
  where not exists (
    select 1
    from public.members m
    where m.id = selected_member_id
      and m.club_id = v_admin.club_id
      and m.status = 'active'
  );

  if v_invalid_count > 0 then
    raise exception 'INVALID_PARTICIPANT';
  end if;

  delete from public.round_participants rp
  where rp.round_id = v_round.id
    and rp.club_id = v_admin.club_id
    and not (rp.member_id = any(v_member_ids));

  insert into public.round_participants (
    club_id,
    round_id,
    member_id,
    status
  )
  select
    v_admin.club_id,
    v_round.id,
    selected_member_id,
    'confirmed'
  from unnest(v_member_ids) as selected_member_id
  on conflict (round_id, member_id)
  do update set
    status = 'confirmed',
    updated_at = now();

  select count(*)
  into v_participant_count
  from public.round_participants rp
  where rp.round_id = v_round.id
    and rp.status = 'confirmed';

  if to_regprocedure('public.admin_log_action(uuid,uuid,uuid,text,jsonb)') is not null then
    perform public.admin_log_action(
      v_admin.club_id,
      v_admin.id,
      null,
      'round.participants.update',
      jsonb_build_object(
        'round_id', v_round.id,
        'round_title', v_round.title,
        'participant_count', v_participant_count
      )
    );
  end if;

  return v_participant_count;
end;
$$;

revoke all on function public.admin_set_round_participants(uuid, uuid[]) from public;
grant execute on function public.admin_set_round_participants(uuid, uuid[]) to authenticated;
