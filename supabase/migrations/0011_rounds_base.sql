-- =========================================================
-- ParkBuddy rounds base migration v2
-- File: supabase/migrations/0011_rounds_base.sql
--
-- Purpose:
--   Create or repair the base rounds table and admin_create_round RPC.
--
-- Why v2:
--   Some projects may already have a partial rounds table.
--   This migration is intentionally idempotent and adds missing columns
--   instead of assuming a fresh table.
-- =========================================================

create table if not exists public.rounds (
  id uuid primary key default gen_random_uuid()
);

alter table public.rounds
  add column if not exists club_id uuid references public.clubs(id) on delete cascade,
  add column if not exists title text,
  add column if not exists course_name text,
  add column if not exists play_date date,
  add column if not exists start_time time,
  add column if not exists memo text,
  add column if not exists status text not null default 'scheduled',
  add column if not exists created_by_member_id uuid references public.members(id) on delete set null,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

update public.rounds
set status = 'scheduled'
where status is null;

alter table public.rounds
  alter column status set default 'scheduled',
  alter column status set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'rounds_status_check'
      and conrelid = 'public.rounds'::regclass
  ) then
    alter table public.rounds
      add constraint rounds_status_check
      check (status in ('scheduled', 'completed', 'cancelled'));
  end if;
end;
$$;

create index if not exists rounds_club_play_date_idx
on public.rounds (club_id, play_date desc, created_at desc);

alter table public.rounds enable row level security;

drop policy if exists "club members can read same club rounds"
on public.rounds;

create policy "club members can read same club rounds"
on public.rounds
for select
to authenticated
using (
  exists (
    select 1
    from public.members m
    where m.user_id = auth.uid()
      and m.club_id = rounds.club_id
      and m.status = 'active'
  )
);

create or replace function public.admin_create_round(
  p_title text,
  p_course_name text,
  p_play_date date,
  p_start_time time default null,
  p_memo text default null
)
returns public.rounds
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_round public.rounds;
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

  if length(trim(coalesce(p_title, ''))) < 2 then
    raise exception 'INVALID_TITLE';
  end if;

  if length(trim(coalesce(p_course_name, ''))) < 2 then
    raise exception 'INVALID_COURSE_NAME';
  end if;

  if p_play_date is null then
    raise exception 'INVALID_PLAY_DATE';
  end if;

  insert into public.rounds (
    club_id,
    title,
    course_name,
    play_date,
    start_time,
    memo,
    status,
    created_by_member_id
  )
  values (
    v_admin.club_id,
    trim(p_title),
    trim(p_course_name),
    p_play_date,
    p_start_time,
    nullif(trim(coalesce(p_memo, '')), ''),
    'scheduled',
    v_admin.id
  )
  returning * into v_round;

  if to_regclass('public.admin_action_logs') is not null then
    perform public.admin_log_action(
      v_admin.club_id,
      v_admin.id,
      null,
      'round.create',
      jsonb_build_object(
        'round_id', v_round.id,
        'title', v_round.title,
        'course_name', v_round.course_name,
        'play_date', v_round.play_date
      )
    );
  end if;

  return v_round;
end;
$$;

revoke all on function public.admin_create_round(text, text, date, time, text) from public;
grant execute on function public.admin_create_round(text, text, date, time, text) to authenticated;
