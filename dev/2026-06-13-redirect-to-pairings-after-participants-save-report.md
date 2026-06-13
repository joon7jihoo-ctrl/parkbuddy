# 라운드 참가자 저장 후 조 편성 이동

## 작성일

2026-06-13

## 작업 내용

- 라운드 참가자 저장이 끝나면 조 편성 화면으로 바로 이동하도록 수정했다.
- 참가자 선택 화면의 기존 검색/토글 기능은 유지했다.
- 앱 데이터베이스 구조는 변경하지 않았다.

## 변경 파일

- src/app/(app)/admin/rounds/[id]/participants/actions.ts

## 백업 파일

- C:\parkbuddy\dev\backup-round-participants-actions-before-redirect-2026-06-13T08-14-56-163Z.ts.bak

## 확인 항목

- 참가자 선택 화면에서 참가자를 변경한다.
- 참가자 저장 버튼을 누른다.
- 저장 후 조 편성 화면으로 이동하는지 확인한다.
- npm run verify가 통과하는지 확인한다.
