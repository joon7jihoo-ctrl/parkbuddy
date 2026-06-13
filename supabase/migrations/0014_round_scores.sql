-- =========================================================
-- ParkBuddy round scores base migration
-- File: supabase/migrations/0014_round_scores.sql
--
-- Purpose:
--   Add score input storage for round participants.
--
-- Security goals:
--   1. Only active admins can enter scores for their own club rounds.
--   2. Scores can only be entered for members already selected as participants.
--   3. Client-provided club_id is never trusted.
--   4. Score updates are logged without storing unnecessary sensitive data.
-- =========================================================

create table if not exists public.round_scores (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.rounds(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  strokes integer,
  stableford_points integer,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (round_id, member_id)
);

create index if not exists round_scores_round_member_idx
on public.round_scores (round_id, member_id);

alter table public.round_scores enable row level security;

drop policy if exists "club members can read same club round scores"
on public.round_scores;

create policy "club members can read same club round scores"
on public.round_scores
for select
to authenticated
using (
  exists (
    select 1
    from public.rounds r
    join public.members viewer
      on viewer.club_id = r.club_id
    where r.id = round_scores.round_id
      and viewer.user_id = auth.uid()
      and viewer.status = 'active'
  )
);

create or replace function public.admin_upsert_round_scores(
  p_round_id uuid,
  p_scores jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_round public.rounds;
  v_score jsonb;
  v_member_id uuid;
  v_strokes integer;
  v_points integer;
  v_memo text;
  v_saved_count integer := 0;
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
  limit 1;

  if not found then
    raise exception 'ROUND_NOT_FOUND';
  end if;

  if jsonb_typeof(coalesce(p_scores, '[]'::jsonb)) <> 'array' then
    raise exception 'INVALID_SCORES';
  end if;

  for v_score in select * from jsonb_array_elements(p_scores)
  loop
    v_member_id := nullif(v_score ->> 'memberId', '')::uuid;
    v_strokes := nullif(v_score ->> 'strokes', '')::integer;
    v_points := nullif(v_score ->> 'stablefordPoints', '')::integer;
    v_memo := nullif(trim(coalesce(v_score ->> 'memo', '')), '');

    if v_member_id is null then
      raise exception 'INVALID_MEMBER';
    end if;

    if v_strokes is not null and (v_strokes < 1 or v_strokes > 200) then
      raise exception 'INVALID_STROKES';
    end if;

    if v_points is not null and (v_points < -20 or v_points > 100) then
      raise exception 'INVALID_STABLEFORD_POINTS';
    end if;

    if not exists (
      select 1
      from public.round_participants rp
      join public.members m
        on m.id = rp.member_id
      where rp.round_id = v_round.id
        and rp.member_id = v_member_id
        and m.club_id = v_admin.club_id
        and m.status = 'active'
    ) then
      raise exception 'MEMBER_NOT_IN_ROUND';
    end if;

    insert into public.round_scores (
      round_id,
      member_id,
      strokes,
      stableford_points,
      memo
    )
    values (
      v_round.id,
      v_member_id,
      v_strokes,
      v_points,
      v_memo
    )
    on conflict (round_id, member_id)
    do update set
      strokes = excluded.strokes,
      stableford_points = excluded.stableford_points,
      memo = excluded.memo,
      updated_at = now();

    v_saved_count := v_saved_count + 1;
  end loop;

  if to_regclass('public.admin_action_logs') is not null then
    perform public.admin_log_action(
      v_admin.club_id,
      v_admin.id,
      null,
      'round.scores.update',
      jsonb_build_object(
        'round_id', v_round.id,
        'title', v_round.title,
        'saved_count', v_saved_count
      )
    );
  end if;
end;
$$;

revoke all on function public.admin_upsert_round_scores(uuid, jsonb) from public;
grant execute on function public.admin_upsert_round_scores(uuid, jsonb) to authenticated;
