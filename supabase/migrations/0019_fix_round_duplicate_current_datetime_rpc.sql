
-- ParkBuddy 라운드 복제 날짜/시간 현재값 보정
-- 작성일: 2026-06-13
-- 목적:
-- - 라운드 복제 시 경기 형태와 점수 계산 방식은 기존 라운드 기준 유지
-- - 라운드 복제 시 날짜와 시작시간은 복제 실행 시점(Asia/Seoul) 기준으로 생성
-- - 참가자, 조 편성, 스코어는 복사하지 않음

create or replace function public.admin_duplicate_round(p_round_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_member public.members%rowtype;
  v_source_round public.rounds%rowtype;
  v_new_round_id uuid;
  v_now_kst timestamp;
begin
  select *
    into v_actor_member
    from public.members
   where user_id = auth.uid()
   limit 1;

  if v_actor_member.id is null then
    raise exception '운영자 회원 정보를 찾을 수 없습니다.';
  end if;

  if coalesce(v_actor_member.role, '') <> 'admin' then
    raise exception '운영자만 라운드를 복제할 수 있습니다.';
  end if;

  select *
    into v_source_round
    from public.rounds
   where id = p_round_id
     and club_id = v_actor_member.club_id
   limit 1;

  if v_source_round.id is null then
    raise exception '복제할 라운드를 찾을 수 없습니다.';
  end if;

  v_now_kst := now() at time zone 'Asia/Seoul';

  insert into public.rounds (
    club_id,
    title,
    course_name,
    play_date,
    start_time,
    memo,
    status,
    game_type,
    scoring_type
  )
  values (
    v_source_round.club_id,
    coalesce(v_source_round.title, '라운드') || ' 복사본',
    v_source_round.course_name,
    v_now_kst::date,
    v_now_kst::time(0),
    v_source_round.memo,
    'scheduled',
    v_source_round.game_type,
    v_source_round.scoring_type
  )
  returning id into v_new_round_id;

  perform public.admin_log_action(
    v_actor_member.club_id,
    v_actor_member.id,
    null,
    'round.duplicate',
    jsonb_build_object(
      'source_round_id', v_source_round.id,
      'new_round_id', v_new_round_id,
      'title', coalesce(v_source_round.title, '라운드'),
      'play_date', v_now_kst::date,
      'start_time', to_char(v_now_kst, 'HH24:MI')
    )
  );

  return v_new_round_id;
end;
$$;

grant execute on function public.admin_duplicate_round(uuid) to authenticated;
