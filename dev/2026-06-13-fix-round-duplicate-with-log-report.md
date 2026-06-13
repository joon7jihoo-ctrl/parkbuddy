# ParkBuddy 개발 보고서 - 라운드 복제 및 관리자 로그 안정화

## 작성일

2026-06-13

## 작업 목적

Supabase 실제 스키마 점검 결과를 기준으로 라운드 복제 RPC를 안정화했다.

## 확인된 실제 스키마 기준

- `members.user_id` 컬럼 존재
- `rounds.deleted_at` 컬럼 없음
- `admin_log_action` 함수 인자 구조:
  - `p_club_id uuid`
  - `p_actor_member_id uuid`
  - `p_target_member_id uuid`
  - `p_action text`
  - `p_metadata jsonb`

## 변경 파일

- `supabase/migrations/0017_fix_admin_duplicate_round_with_log.sql`
- `dev/2026-06-13-fix-round-duplicate-with-log-report.md`

## 반영 내용

- 라운드 복제 RPC를 실제 컬럼 기준으로 재정의
- 존재하지 않는 `deleted_at`, `auth_user_id` 참조 제거
- 복제 성공 시 관리자 작업 로그에 `round.duplicate` 기록
- 새 라운드는 항상 `scheduled` 상태로 생성
- 참가자, 조 편성, 스코어는 복사하지 않음

## Supabase에서 실행해야 할 SQL

`supabase/migrations/0017_fix_admin_duplicate_round_with_log.sql`

## 확인 항목

1. 라운드 목록에서 라운드 복제 버튼 클릭
2. 새 라운드가 예정 상태로 생성되는지 확인
3. 새 라운드에 참가자/조 편성/스코어가 복사되지 않았는지 확인
4. 관리자 작업 로그에 `round.duplicate`가 기록되는지 확인
