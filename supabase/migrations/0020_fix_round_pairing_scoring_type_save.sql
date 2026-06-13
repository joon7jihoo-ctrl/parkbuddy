
-- ParkBuddy: 조 편성 저장 후 라운드 경기 형태/점수 계산 방식 동기화
-- 작성일: 2026-06-13
-- 목적: admin_save_round_pairings 저장 성공 후 rounds.scoring_type이 비어 목록에서 "미지정"으로 보이는 문제 보정

create or replace function public.admin_save_round_game_settings(
  p_round_id uuid,
  p_game_type text,
  p_scoring_type text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_round record;
  v_actor record;
  v_valid boolean := false;
begin
  select id, club_id
    into v_round
    from public.rounds
   where id = p_round_id;

  if v_round.id is null then
    raise exception 'ROUND_NOT_FOUND';
  end if;

  select id, club_id, role
    into v_actor
    from public.members
   where user_id = auth.uid()
     and club_id = v_round.club_id
   limit 1;

  if v_actor.id is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if coalesce(v_actor.role::text, '') not in ('owner', 'admin', 'manager', '운영자', '운영진') then
    raise exception 'ADMIN_REQUIRED';
  end if;

  v_valid :=
    (p_game_type = 'individual' and p_scoring_type in ('stroke', 'new_peoria', 'match', 'stableford'))
    or (p_game_type = 'foursome' and p_scoring_type in ('stroke', 'match'))
    or (p_game_type = 'fourball' and p_scoring_type in ('stroke', 'match', 'stableford'))
    or (p_game_type = 'scramble' and p_scoring_type in ('stroke', 'match'))
    or (p_game_type = 'team_match' and p_scoring_type in ('stroke', 'new_peoria', 'match'));

  if not v_valid then
    raise exception 'INVALID_GAME_COMBINATION';
  end if;

  if exists (
    select 1
      from information_schema.columns
     where table_schema = 'public'
       and table_name = 'rounds'
       and column_name = 'updated_at'
  ) then
    update public.rounds
       set game_type = p_game_type,
           scoring_type = p_scoring_type,
           updated_at = now()
     where id = p_round_id
       and club_id = v_round.club_id;
  else
    update public.rounds
       set game_type = p_game_type,
           scoring_type = p_scoring_type
     where id = p_round_id
       and club_id = v_round.club_id;
  end if;
end;
$$;

grant execute on function public.admin_save_round_game_settings(uuid, text, text) to authenticated;
