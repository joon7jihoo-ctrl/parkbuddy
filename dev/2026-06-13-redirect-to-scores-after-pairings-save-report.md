# 조 편성 저장 후 스코어 입력 이동 적용 보고서

## 작성일
2026-06-13

## 작업 목적
조 편성 저장이 끝나면 운영자가 바로 스코어 입력으로 이어서 작업할 수 있도록 흐름을 개선했다.

## 변경 파일
- src/app/(app)/admin/rounds/[id]/pairings/actions.ts
- dev/2026-06-13-redirect-to-scores-after-pairings-save-report.md

## 변경 내용
- 조 편성 저장 성공 후 기존 조 편성 화면 재진입 대신 스코어 입력 화면으로 이동하도록 변경했다.
- 스코어 입력 화면 캐시 갱신 경로를 추가했다.
- 기존 조 편성 저장 로직과 검증 로직은 유지했다.

## 확인 항목
- npm run verify 통과
- 참가자 선택 후 조 편성 화면 진입
- 조 편성 저장 후 /admin/rounds/[id]/scores 로 이동
- 스코어 입력 화면에서 참가자 목록 표시
