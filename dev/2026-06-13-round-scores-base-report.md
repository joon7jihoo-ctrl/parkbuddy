ParkBuddy 개발보고서 - 라운드 스코어 입력 기반 추가

작성일: 2026-06-13

라운드 참가자별 스코어 입력 기반 기능을 추가했다.

변경 파일:
- supabase/migrations/0014_round_scores.sql
- src/app/(app)/admin/rounds/[id]/scores/page.tsx
- src/app/(app)/admin/rounds/[id]/scores/actions.ts
- dev/2026-06-13-round-scores-base-report.md

완료 기준:
- Supabase SQL Editor에서 0014_round_scores.sql 실행
- npm run verify 통과
- /admin/rounds/[id]/scores 접속 가능
- 참가자별 타수/포인트/메모 저장 가능
- 관리자 로그에 round.scores.update 기록
