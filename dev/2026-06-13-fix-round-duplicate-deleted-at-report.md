# ParkBuddy 개발보고서 - 라운드 복제 deleted_at 오류 수정

## 작성일

2026-06-13

## 수정 내용

라운드 복제 기능에서 현재 rounds 테이블에 존재하지 않는 deleted_at 컬럼을 참조하지 않도록 수정했다.

## 변경 파일

- supabase/migrations/0016_admin_duplicate_round.sql
- src/app/(app)/admin/rounds/actions.ts
- dev/2026-06-13-fix-round-duplicate-deleted-at-report.md

## 후속 작업

Supabase SQL Editor에서 0016_admin_duplicate_round.sql을 다시 실행해야 한다.