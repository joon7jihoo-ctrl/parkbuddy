# ParkBuddy 개발보고서 - 라운드 목록 수정 버튼 추가

## 작성일

2026-06-13

## 진행 내용

라운드 목록에서 기존 라운드 수정 화면으로 바로 이동할 수 있는 수정 버튼을 추가했다.

## 변경 파일

- src/app/(app)/admin/rounds/page.tsx
- dev/2026-06-13-add-round-edit-button-report.md

## 완료 기준

- npm run verify 통과
- /admin/rounds 라운드 카드에 수정 버튼 표시
- 수정 버튼 클릭 시 /admin/rounds/[id]/edit 이동