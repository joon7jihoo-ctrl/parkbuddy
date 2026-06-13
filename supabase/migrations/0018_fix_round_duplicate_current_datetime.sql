-- ParkBuddy 라운드 복제 기능 안정화
-- 작성일: 2026-06-13
-- 목적: 실제 Supabase 스키마 기준으로 admin_duplicate_round RPC를 재정의하고 관리자 작업 로그를 다시 기록한다.

create or replace function public.admin_duplicate_round(p_round_id uuid)
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_admin public.members;
  v_source public.rounds;
  v_new_round public.rounds;
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
  into v_source
  from public.rounds
  where id = p_round_id
    and club_id = v_admin.club_id
  limit 1;

  if not found then
    raise exception 'ROUND_NOT_FOUND';
  end if;

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
    v_source.club_id,
    v_source.event_id,
    coalesce(nullif(trim(v_source.title), ''), '라운드') || ' 복사본',
    coalesce(v_source.played_on, current_date),
    v_source.course_name,
    coalesce(v_source.holes, 18),
    v_source.memo,
    v_source.created_by,
    v_source.play_date,
    v_source.start_time,
    'scheduled',
    v_admin.id,
    v_source.game_type,
    v_source.scoring_type
  )
  returning * into v_new_round;

  perform public.admin_log_action(
    v_admin.club_id,
    v_admin.id,
    null,
    'round.duplicate',
    jsonb_build_object(
      'source_round_id', v_source.id,
      'new_round_id', v_new_round.id,
      'title', v_new_round.title,
      'course_name', v_new_round.course_name,
      'play_date', v_new_round.play_date,
      'status', v_new_round.status,
      'game_type', v_new_round.game_type,
      'scoring_type', v_new_round.scoring_type
    )
  );

  return v_new_round.id;
end;
$function$;

grant execute on function public.admin_duplicate_round(uuid) to authenticated;
