-- ParkBuddy round_hole_scores migration draft
-- Purpose: add a current-flow hole-level score table for scorecard input.
-- Review before running in production.

create table if not exists public.round_hole_scores (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.rounds(id) on delete cascade,
  round_group_id uuid not null references public.round_groups(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  course_code text not null,
  hole_no integer not null,
  distance_m integer null,
  par integer not null default 3,
  strokes integer null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  updated_by uuid null references public.members(id) on delete set null,

  constraint round_hole_scores_course_code_check
    check (course_code in ('A', 'B', 'C', 'D')),

  constraint round_hole_scores_hole_no_check
    check (hole_no between 1 and 9),

  constraint round_hole_scores_distance_m_check
    check (distance_m is null or distance_m > 0),

  constraint round_hole_scores_par_check
    check (par > 0),

  constraint round_hole_scores_strokes_check
    check (strokes is null or strokes > 0),

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

alter table public.round_hole_scores enable row level security;

-- NOTE:
-- Policy names and helper function names must be adjusted to match the current ParkBuddy auth/role helpers.
-- Keep policies conservative. Do not allow anonymous score editing.

-- Example read policy. Replace the role helper condition if the project uses a different convention.
-- create policy "round_hole_scores_select_authenticated"
--   on public.round_hole_scores
--   for select
--   to authenticated
--   using (true);

-- Example write policy for operators/admins. Replace with the actual ParkBuddy role helper.
-- create policy "round_hole_scores_write_operator"
--   on public.round_hole_scores
--   for all
--   to authenticated
--   using (public.is_operator())
--   with check (public.is_operator());

-- Recommended follow-up:
-- Add an RPC or server action validation that ensures:
-- 1. round_group_id belongs to round_id.
-- 2. member_id exists in round_participants for round_id.
-- 3. member_id exists in round_group_members for round_group_id.
