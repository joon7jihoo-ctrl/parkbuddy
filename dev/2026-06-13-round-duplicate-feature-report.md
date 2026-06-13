# ParkBuddy 개발보고서 - 라운드 복제 기능

## 작성일

2026-06-13

## 진행 내용

기존 라운드를 복사해 새 예정 라운드로 만드는 기능을 추가했다.

## 변경 파일

- supabase/migrations/0016_admin_duplicate_round.sql
- src/app/(app)/admin/rounds/actions.ts
- src/app/(app)/admin/rounds/page.tsx
- dev/2026-06-13-round-duplicate-feature-report.md

## 동작 방식

- 라운드 목록에서 라운드 복제 버튼을 누른다.
- 원본 라운드의 코스, 날짜, 메모, 경기 방식, 점수 계산 방식을 복사한다.
- 새 라운드 상태는 예정으로 생성한다.
- 참가자, 조 편성, 스코어는 복사하지 않는다.
- 생성 후 새 라운드의 참가자 선택 화면으로 이동한다.

## 보안

- 운영진만 실행 가능하다.
- 현재 운영진의 동호회 라운드만 복제할 수 있다.
- 작업은 관리자 로그에 round.duplicate로 기록된다.