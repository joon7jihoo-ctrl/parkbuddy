-- =========================================================
-- ParkBuddy event to round link flow
-- File: supabase/parkbuddy_event_to_round_link.sql
--
-- Purpose:
--   Let club admins create one linked round from an event's attend votes.
--   The created round is linked through rounds.event_id and attendees are
--   inserted into round_participants automatically.
--
-- Apply:
--   Run this file in Supabase SQL Editor, then run npm run verify locally.
-- =========================================================

alter table public.events
  add column if not exists holes integer not null default 18;

alter table public.rounds
  add column if not exists event_id uuid references public.events(id) on delete set null,
  add column if not exists played_on date,
  add column if not exists holes integer not null default 18,
  add column if not exists created_by uuid references public.members(id) on delete set null,
  add column if not exists game_type text,
  add column if not exists scoring_type text;

create index if not exists rounds_event_id_idx
on public.rounds (event_id);

create index if not exists event_votes_event_status_member_idx
on public.event_votes (event_id, status, member_id);

create or replace function public.admin_create_round_from_event(p_event_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_event public.events;
  v_existing_round_id uuid;
  v_round public.rounds;
  v_attendee_count integer;
  v_play_date date;
  v_start_time time;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if p_event_id is null then
    raise exception 'INVALID_EVENT';
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

  -- Prevent duplicate rounds when two admins click the button at nearly the same time.
  perform pg_advisory_xact_lock(hashtextextended(p_event_id::text, 0));

  select *
  into v_event
  from public.events
  where id = p_event_id
    and club_id = v_admin.club_id
  limit 1
  for update;

  if not found then
    raise exception 'EVENT_NOT_FOUND';
  end if;

  select id
  into v_existing_round_id
  from public.rounds
  where event_id = v_event.id
    and club_id = v_admin.club_id
  order by created_at desc
  limit 1;

  if v_existing_round_id is not null then
    return v_existing_round_id;
  end if;

  select count(*)
  into v_attendee_count
  from public.event_votes ev
  join public.members m
    on m.id = ev.member_id
  where ev.event_id = v_event.id
    and ev.status = 'attend'
    and m.club_id = v_admin.club_id
    and m.status = 'active';

  if coalesce(v_attendee_count, 0) <= 0 then
    raise exception 'NO_ATTENDEES';
  end if;

  v_play_date := (v_event.starts_at at time zone 'Asia/Seoul')::date;
  v_start_time := (v_event.starts_at at time zone 'Asia/Seoul')::time;

  insert into public.rounds (
    club_id,
    event_id,
    title,
    played_on,
    course_name,
    holes,
    memo,
    created_by,
    play_date,
    start_time,
    status,
    created_by_member_id,
    game_type,
    scoring_type
  )
  values (
    v_admin.club_id,
    v_event.id,
    coalesce(nullif(trim(v_event.title), ''), '라운딩'),
    v_play_date,
    coalesce(nullif(trim(v_event.course_name), ''), '미정'),
    coalesce(v_event.holes, 18),
    v_event.memo,
    v_admin.id,
    v_play_date,
    v_start_time,
    'scheduled',
    v_admin.id,
    case v_event.event_type
      when 'tournament' then 'tournament'
      when 'casual' then 'casual'
      else 'regular'
    end,
    'stableford'
  )
  returning * into v_round;

  insert into public.round_participants (
    club_id,
    round_id,
    member_id,
    status
  )
  select
    v_admin.club_id,
    v_round.id,
    ev.member_id,
    'confirmed'
  from public.event_votes ev
  join public.members m
    on m.id = ev.member_id
  where ev.event_id = v_event.id
    and ev.status = 'attend'
    and m.club_id = v_admin.club_id
    and m.status = 'active'
  on conflict (round_id, member_id)
  do update set
    status = 'confirmed',
    updated_at = now();

  if to_regprocedure('public.admin_log_action(uuid,uuid,uuid,text,jsonb)') is not null then
    perform public.admin_log_action(
      v_admin.club_id,
      v_admin.id,
      null,
      'round.create_from_event',
      jsonb_build_object(
        'event_id', v_event.id,
        'round_id', v_round.id,
        'title', v_round.title,
        'attendee_count', v_attendee_count
      )
    );
  end if;

  return v_round.id;
end;
$$;

revoke all on function public.admin_create_round_from_event(uuid) from public;
grant execute on function public.admin_create_round_from_event(uuid) to authenticated;
