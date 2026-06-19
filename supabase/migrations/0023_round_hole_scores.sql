-- =========================================================
-- ParkBuddy round hole scores migration
-- File: supabase/migrations/0023_round_hole_scores.sql
--
-- Purpose:
--   Add current-flow hole-level scorecard storage for A/B/C/D course tabs.
--
-- Data source rules:
--   - Official participants: round_participants
--   - Official groups: round_groups / round_group_members
--   - Hole-level scorecard entries: round_hole_scores
--   - Official final scores: round_scores
--
-- Security goals:
--   1. Do not reuse legacy hole_scores tied to round_players.
--   2. Allow club members to read same-club scorecard entries.
--   3. Allow only club admins to write scorecard entries initially.
--   4. Validate that every score belongs to the selected round, group, and member.
--   5. Do not allow anonymous score editing.
-- =========================================================

create table if not exists public.round_hole_scores (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.rounds(id) on delete cascade,
  round_group_id uuid not null references public.round_groups(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  course_code text not null,
  hole_no integer not null,
  distance_m integer,
  par integer not null default 3,
  strokes integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.members(id) on delete set null,

  constraint round_hole_scores_course_code_check
    check (course_code in ('A', 'B', 'C', 'D')),

  constraint round_hole_scores_hole_no_check
    check (hole_no between 1 and 9),

  constraint round_hole_scores_distance_m_check
    check (distance_m is null or distance_m > 0),

  constraint round_hole_scores_par_check
    check (par between 1 and 10),

  constraint round_hole_scores_strokes_check
    check (strokes is null or strokes between 1 and 20),

  constraint round_hole_scores_unique_entry
    unique (round_id, round_group_id, member_id, course_code, hole_no)
);

create index if not exists round_hole_scores_round_id_idx
  on public.round_hole_scores(round_id);

create index if not exists round_hole_scores_round_group_id_idx
  on public.round_hole_scores(round_group_id);

create index if not exists round_hole_scores_member_id_idx
  on public.round_hole_scores(member_id);

create index if not exists round_hole_scores_course_hole_idx
  on public.round_hole_scores(round_id, round_group_id, course_code, hole_no);

create index if not exists round_hole_scores_updated_at_idx
  on public.round_hole_scores(round_id, updated_at desc);

create or replace function public.validate_round_hole_score_entry()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_club_id uuid;
begin
  select r.club_id
  into v_club_id
  from public.rounds r
  where r.id = new.round_id;

  if v_club_id is null then
    raise exception 'ROUND_NOT_FOUND';
  end if;

  if not exists (
    select 1
    from public.round_groups rg
    where rg.id = new.round_group_id
      and rg.round_id = new.round_id
  ) then
    raise exception 'ROUND_GROUP_NOT_IN_ROUND';
  end if;

  if not exists (
    select 1
    from public.round_participants rp
    join public.members m
      on m.id = rp.member_id
    where rp.round_id = new.round_id
      and rp.member_id = new.member_id
      and m.club_id = v_club_id
      and m.status = 'active'
  ) then
    raise exception 'MEMBER_NOT_IN_ROUND';
  end if;

  if not exists (
    select 1
    from public.round_group_members rgm
    where rgm.round_id = new.round_id
      and rgm.round_group_id = new.round_group_id
      and rgm.member_id = new.member_id
  ) then
    raise exception 'MEMBER_NOT_IN_GROUP';
  end if;

  if new.updated_by is not null and not exists (
    select 1
    from public.members editor
    where editor.id = new.updated_by
      and editor.club_id = v_club_id
      and editor.status = 'active'
  ) then
    raise exception 'INVALID_UPDATED_BY';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_round_hole_score_entry_before_write
on public.round_hole_scores;

create trigger validate_round_hole_score_entry_before_write
before insert or update on public.round_hole_scores
for each row execute function public.validate_round_hole_score_entry();

drop trigger if exists touch_round_hole_scores_updated_at
on public.round_hole_scores;

create trigger touch_round_hole_scores_updated_at
before update on public.round_hole_scores
for each row execute function public.touch_updated_at();

alter table public.round_hole_scores enable row level security;

drop policy if exists "club members can read same club round hole scores"
on public.round_hole_scores;

create policy "club members can read same club round hole scores"
on public.round_hole_scores
for select
to authenticated
using (
  exists (
    select 1
    from public.rounds r
    join public.members viewer
      on viewer.club_id = r.club_id
    where r.id = round_hole_scores.round_id
      and viewer.user_id = auth.uid()
      and viewer.status = 'active'
  )
);

drop policy if exists "admins can insert same club round hole scores"
on public.round_hole_scores;

create policy "admins can insert same club round hole scores"
on public.round_hole_scores
for insert
to authenticated
with check (
  exists (
    select 1
    from public.rounds r
    where r.id = round_hole_scores.round_id
      and public.is_club_admin(r.club_id)
  )
);

drop policy if exists "admins can update same club round hole scores"
on public.round_hole_scores;

create policy "admins can update same club round hole scores"
on public.round_hole_scores
for update
to authenticated
using (
  exists (
    select 1
    from public.rounds r
    where r.id = round_hole_scores.round_id
      and public.is_club_admin(r.club_id)
  )
)
with check (
  exists (
    select 1
    from public.rounds r
    where r.id = round_hole_scores.round_id
      and public.is_club_admin(r.club_id)
  )
);

drop policy if exists "admins can delete same club round hole scores"
on public.round_hole_scores;

create policy "admins can delete same club round hole scores"
on public.round_hole_scores
for delete
to authenticated
using (
  exists (
    select 1
    from public.rounds r
    where r.id = round_hole_scores.round_id
      and public.is_club_admin(r.club_id)
  )
);
