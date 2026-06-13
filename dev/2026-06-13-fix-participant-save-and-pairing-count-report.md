# 참가자 저장 및 조 편성 참가자 수 오류 수정 보고서

## 작성일

2026-06-13

## 수정 내용

- 참가자 선택 화면의 체크박스가 서버 액션에 안정적으로 제출되도록 보정했습니다.
- 참가자 저장 액션이 여러 가능한 체크박스 이름을 안전하게 읽도록 보정했습니다.
- 화면에서 8명을 선택했지만 조 편성 페이지에서 0명으로 읽히는 문제를 줄였습니다.

## 변경 파일

- src/app/(app)/admin/rounds/[id]/participants/page.tsx
- src/app/(app)/admin/rounds/[id]/participants/actions.ts

## 백업 파일

- C:\parkbuddy\dev\backup-participants-page-before-save-fix-2026-06-13T08-28-50-335Z.bak
- C:\parkbuddy\dev\backup-participants-actions-before-save-fix-2026-06-13T08-28-50-335Z.bak

## 확인 항목

- 참가자 선택 후 저장하면 조 편성 화면에서 참가자 수가 3명 이상으로 인식되는지 확인합니다.
- 청백전 + 스트로크 플레이 저장이 가능한지 확인합니다.