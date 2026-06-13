# 스코어 저장 후 결과 보기 이동 작업 보고서

## 작업 목적

스코어 입력을 저장한 뒤 같은 화면에 머무르지 않고 라운드 결과 보기 화면으로 바로 이동하도록 수정했습니다.

## 변경 파일

- src/app/(app)/admin/rounds/[id]/scores/actions.ts
- dev/2026-06-13-redirect-to-results-after-scores-save-report.md

## 백업 파일

- C:\parkbuddy\dev\backup-scores-actions-before-redirect-to-results-2026-06-13T10-29-16-661Z.ts.bak

## 확인 항목

1. 스코어 입력 화면에서 참가자별 스코어를 입력합니다.
2. 저장 버튼을 누릅니다.
3. 저장 후 /admin/rounds/[id]/results 화면으로 이동하는지 확인합니다.
4. 결과 화면에 입력한 스코어가 반영되는지 확인합니다.

## 비고

DB 스키마 변경은 없습니다.
