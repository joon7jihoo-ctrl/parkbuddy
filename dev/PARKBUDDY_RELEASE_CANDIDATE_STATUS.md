# ParkBuddy 운영 릴리즈 후보 상태 기록

작성일: 2026-06-20
기준 브랜치: `feature/operator-stability-and-round-safety`
기준 커밋: `996895f chore: enforce dense ux audit in verify`
운영 도메인/alias: `parkbuddy-five.vercel.app`

## 결론

ParkBuddy는 현재 운영 릴리즈 후보 상태로 전환 가능하다.

이번 기록은 앱 코드 변경 없이 운영 전 안정화 결과, 배포 환경 확인 결과, Supabase 보안 확인 결과를 남기기 위한 문서이다.

## 확인 완료 항목

### Git / 로컬 검증

- Git working tree clean 확인
- 원격 push 완료
- 최신 커밋: `996895f chore: enforce dense ux audit in verify`
- `npm run verify` 통과
- `security:scan` 통과
- RLS/RPC migration audit 통과
- App Router architecture scan 통과
- Performance/Dense UX audit 통과
- ESLint 통과
- TypeScript typecheck 통과

### 모바일 QA

- 실기기 모바일 QA 완료
- 모바일 Dense UX 기준 확인
- 상단 sticky header / 하단 sticky CTA 원칙 확인
- 검색, 필터, 투표, 다중 선택/다중 액션 화면은 단일 저장 CTA 대상이 아닌 의도된 예외 흐름으로 관리
- 단일 저장/등록 화면은 sticky SubmitButton 정리 기준 유지

### Vercel Production

- Vercel Production 배포 상태: Ready
- 운영 alias: `parkbuddy-five.vercel.app`
- 최신 확인 배포 URL: `parkbuddy-pf5uuaukf-0320-s-projects.vercel.app`
- 배포 생성 시각: 2026-06-19 23:41:11 KST
- Production build duration: 약 50초

> 남은 확인: Vercel Dashboard에서 최신 Production 배포의 Git Source가 커밋 `996895f`인지 최종 확인한다.

### Supabase Auth / Redirect

- Supabase Site URL 정상 확인
- Supabase Redirect URL 정상 확인
- 운영 도메인과 `/auth/callback` 흐름 확인 대상
- localhost 개발 redirect URL은 개발 환경 유지 목적으로 관리

### Supabase RLS / Policy

핵심 테이블 RLS 활성화 확인:

- `members`
- `rounds`
- `round_participants`
- `round_scores`
- `events`
- `event_votes`
- `posts`
- `post_attachments`

추가 테이블 RLS 활성화 확인:

- `admin_action_logs`
- `hole_scores`
- `round_group_members`
- `round_groups`
- `round_players`

정책 CSV 기준:

- `anon` 대상 쓰기 개방 정책 없음
- 치명적인 익명 insert/update/delete 개방 없음
- 주요 정책은 authenticated/operator/admin 흐름 중심으로 관리

### Service Role Key

- Vercel Production에 `SUPABASE_SERVICE_ROLE_KEY` 없음
- 코드 전체 검색 결과, 앱 런타임에서 `SUPABASE_SERVICE_ROLE_KEY` 사용 없음
- 검색 결과는 `scripts/security-smoke-test.mjs`의 금지 패턴 정의에만 존재
- 현재 구조에서는 Vercel Production에 `SUPABASE_SERVICE_ROLE_KEY`가 없어도 문제 없음
- 불필요한 service role key를 운영 환경변수에 추가하지 않는 편이 더 안전함

## 운영 전 남은 확인 항목

1. Vercel Dashboard에서 최신 Production 배포의 Git Source가 `996895f`인지 최종 확인
2. 운영 도메인에서 로그인, 회원, 일정, 라운드, 참가자, 조 편성, 스코어 핵심 흐름을 한 번 더 smoke test
3. main 병합 또는 release tag 생성 전 최종 `npm run verify` 재확인

## 릴리즈 후보 판정

현재까지 확인된 코드 품질, 보안, RLS, 배포, 모바일 QA 결과 기준으로 ParkBuddy는 운영 릴리즈 후보 상태이다.

새 기능 추가보다 운영 안정성과 QA를 우선하며, 이후 변경은 다음 원칙을 따른다.

- 검색/필터/투표/다중 선택 등 안정화된 기능은 명시 요청 없이는 변경하지 않는다.
- 단일 저장/등록 화면의 모바일 CTA 일관성은 유지한다.
- 모든 개발 변경 사항은 `dev` 폴더 문서에 기록한다.
- 운영 전 변경은 최소화하고, 변경 후 `npm run verify`를 반드시 통과시킨다.
