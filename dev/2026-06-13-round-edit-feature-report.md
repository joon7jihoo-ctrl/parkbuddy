# ParkBuddy 개발보고서 - 라운드 수정 기능

## 작성일

2026-06-13

## 진행 내용

운영자가 라운드 기본 정보를 수정할 수 있는 페이지와 서버 액션을 추가했다.

## 변경 파일

- src/app/(app)/admin/rounds/[id]/edit/page.tsx
- src/app/(app)/admin/rounds/[id]/edit/actions.ts
- src/app/(app)/admin/rounds/page.tsx
- dev/2026-06-13-round-edit-feature-report.md

## 수정 가능 항목

- 라운드명
- 장소/코스
- 라운드 날짜
- 메모

## 보안 기준

운영자 권한을 확인한 뒤, 현재 운영자의 club_id에 속한 라운드만 수정한다.

## 참고

경기 방식, 점수 계산 방식, 상태 변경은 기존 조 편성/상태 변경 화면에서 관리한다.
