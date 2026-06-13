# ParkBuddy 개발보고서 - 라운드 복제 로그 함수 시그니처 오류 수정

## 작성일

2026-06-13

## 수정 내용

라운드 복제 RPC에서 현재 DB와 시그니처가 맞지 않는 admin_log_action 직접 호출을 제거했다.

## 변경 파일

- supabase/migrations/0016_admin_duplicate_round.sql
- dev/2026-06-13-fix-round-duplicate-log-signature-report.md

## 확인 기준

- Supabase SQL Editor에서 0016_admin_duplicate_round.sql 재실행
- 라운드 복제 버튼 클릭 시 admin_log_action 시그니처 오류가 발생하지 않음
- 새 라운드가 예정 상태로 생성됨

## 후속 작업

관리자 로그 함수 시그니처를 전체 프로젝트 기준으로 정리한 뒤 라운드 복제 로그를 다시 연결한다.
