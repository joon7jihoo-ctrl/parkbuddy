# ParkBuddy Operator Dev Status

## 현재 기준

- 기준일: 2026-06-18
- 현재 단계: 운영 배포 전 안정화 / 모바일 Dense UX / 문구 단순화 정리
- 현재 우선순위: 새 기능 추가보다 **운영자가 실제로 쓰면서 헷갈리지 않는 흐름**을 먼저 안정화한다.
- 앱 코드 변경 여부: 이번 문서 정리 작업에서는 앱 코드를 변경하지 않는다.

## 최근 완료된 큰 흐름

1. **게시판 보안 강화**
   - 비공개/공지/자유글 접근 정책 정리
   - RLS, trigger, policy 재실행 충돌 대응
   - 보안 검증 체크리스트 작성

2. **스코어 데이터 기준 통일**
   - My Page, Scores, 최근 기록, 상세, 평균/베스트 기록을 `round_scores` 기준으로 통일
   - 기존 `round_players`/`hole_scores` 기반 화면과 혼선 줄임

3. **일정 투표 → 라운딩 생성 연결**
   - `events` / `event_votes`에서 참석자 기준으로 `rounds` / `round_participants` 생성
   - 중복 생성 방지
   - 생성 전 참석/불참/미선택 인원 확인 UX 추가
   - 생성된 라운딩에서 연결된 일정 맥락 표시

4. **로그인 가용성 보완**
   - 카카오 모바일 데이터망 오류 대응 전략 수립
   - 초대 코드 기반 첫 접속 경로 추가
   - 운영자용 초대 코드 공유 UX 추가
   - 카카오 OAuth redirect 안정화 핫픽스
   - 패스키는 장기 방향으로 문서화하되, Supabase native passkey 제약으로 즉시 구현은 보류

5. **라운딩 관리 모바일 Dense UX**
   - 라운딩 목록 compact 카드/필터 복구 및 정리
   - 참가자 관리 화면 compact화
   - 조 편성 화면 compact화
   - 경기 방식 한글화 및 스마트 조 편성 초안 도입
   - 스코어/결과 화면 문구와 카드 밀도 정리

6. **심플한 UX 문구 정리**
   - 홈, 게시판, 일정, 회원, 마이페이지, 스코어/결과 화면의 반복 설명 제거
   - `ParkBuddy` 외 불필요한 영어 표기 정리
   - “최근 공지”처럼 같은 화면을 다른 명칭으로 부르는 표현을 게시판 기준으로 정리

## 현재 확인이 필요한 핵심 화면

### 인증/접속

- `/login`
- `/login?invite=1`

확인 항목:

- 카카오 로그인 redirect가 `https://parkbuddy-five.vercel.app/auth/callback` 또는 `http://localhost:3000/auth/callback`으로 돌아오는지
- 초대 코드 로그인 화면이 불필요하게 장황하지 않은지
- Supabase Anonymous sign-ins가 켜져 있는지
- Supabase Site URL / Redirect URL / Kakao Developers callback 설정이 맞는지

### 일정/라운딩 연결

- `/schedule`
- `/admin/rounds`
- `/admin/rounds/[id]/participants`
- `/admin/rounds/[id]/pairings`
- `/admin/rounds/[id]/scores`
- `/admin/rounds/[id]/results`

확인 항목:

- 일정에서 라운딩 생성 전 참석/불참/미선택 수가 맞는지
- 생성 후 “생성된 라운딩 보기”로 전환되는지
- 생성된 라운딩에서 연결 일정 정보가 보이는지
- 수동 생성 라운딩은 연결 일정 카드가 보이지 않는지

### 스코어/기록

- `/scores`
- `/scores/[roundId]`
- `/mypage`
- `/admin/rounds/[id]/scores`
- `/admin/rounds/[id]/results`
- `/admin/rounds/[id]/results/print`

확인 항목:

- My Page, Scores, 최근 기록, 상세 기록이 같은 스코어 데이터를 기준으로 보이는지
- `round_scores`에 입력한 기록이 사용자 화면에도 반영되는지
- 계산 기준 접이식 영역이 필요한 경우에만 보이는지

## 다음 개발 흐름 추천

새 기능을 바로 추가하기보다 아래 순서로 안정화한다.

1. **운영자 QA 체크리스트 고정**
   - 주요 화면별 확인 항목을 문서화하고 배포 전 반복 점검 기준으로 사용한다.

2. **모바일 실사용 화면 점검**
   - 운영자 계정으로 모바일 Chrome에서 `/login`, `/schedule`, `/admin/rounds`, `/admin/rounds/[id]/pairings`, `/admin/rounds/[id]/scores`, `/admin/rounds/[id]/results`를 순서대로 확인한다.

3. **조 편성 알고리즘 검증**
   - 참가자 3~4명: 1조 정상
   - 참가자 6명 이상: 여러 조 분산 확인
   - 경기 형태 변경 시 조 편성이 다시 계산되는지 확인
   - 저장 후 재진입 시 조 편성이 유지되는지 확인

4. **문구/명칭 3차 점검**
   - 화면에 꼭 필요하지 않은 설명이 남아 있는지 확인한다.
   - 같은 기능이 여러 이름으로 불리는지 확인한다.

5. **그 다음 기능 후보**
   - 패스키는 운영 도메인 확정 후 재검토
   - 팀/소속 데이터가 필요하면 회원 테이블 설계 후 청백전/포섬/포볼 팀 기반 조편성 고도화
   - 삭제/복구 라운드, 월간 보기, 결과 공유 UX 추가 정리

## 작업 원칙

- 앱 코드를 변경하기 전에는 현재 화면과 데이터 흐름을 먼저 확인한다.
- 한 번에 넓은 화면을 건드릴 때는 이전에 안정화한 UX가 원복되지 않도록 주의한다.
- 회원 검색, 스코어 입력, 일정 투표처럼 안정화된 핵심 흐름은 요청 없이는 건드리지 않는다.
- `npm run verify` 통과 후 커밋/푸시한다.
- 배포 후 모바일 화면 캡처를 기준으로 다음 수정 여부를 판단한다.


## 2026-06-19 - Universal Dense Sticky UX

- 앱 전역 모바일 Dense UX 규칙을 `AppShell`/`globals.css` 기준으로 정리했다.
- 모든 앱 화면의 첫 번째 헤더가 모바일에서 sticky top header로 동작하도록 공통 규칙을 추가했다.
- `SubmitButton`을 사용하는 등록/저장 화면은 하단 sticky 저장 CTA를 사용하도록 변경했다.
- 목록/조회 화면에는 `PageQuickActions`를 통해 화면별 빠른 실행 CTA를 제공한다.
- 조 편성/운영자 스코어 입력처럼 이미 저장 CTA가 있는 화면은 빠른 실행 CTA를 숨겨 중복을 피한다.
- 인쇄 화면에서는 하단 네비게이션과 sticky CTA가 모두 숨겨진다.

## 2026-06-19 - RLS/RPC 운영 보안 점검 도구

- 운영 전 Supabase RLS/RPC 점검을 반복할 수 있도록 읽기 전용 SQL 점검 파일을 추가했다.
- 로컬 마이그레이션에 RLS 활성화와 정책 생성이 빠져 있는지 확인하는 `security:rls` 스크립트를 추가했다.
- 기존 `security:scan`은 보안 스모크 테스트 후 RLS 마이그레이션 점검까지 함께 실행하도록 확장했다.
- 이 단계는 앱 화면 코드를 변경하지 않고 운영 안정성 점검 기준을 강화하는 작업이다.

### 추가 점검 명령

```bash
npm run security:scan
npm run verify
```

### Supabase SQL Editor 점검 파일

```text
supabase/PARKBUDDY_RLS_RPC_OPERATION_AUDIT.sql
```

운영 DB에서 위 SQL을 실행해 핵심 테이블 RLS, 정책 목록, anon/public 쓰기 권한, SECURITY DEFINER RPC, RPC 실행 권한을 확인한다.

## 2026-06-19 - App Router 아키텍처 경계 점검 도구

- Server/Client Component 경계가 무너지지 않도록 `architecture:scan` 스크립트를 추가했다.
- Client Component에서 서버 Supabase client, 서버 인증 모듈, `next/headers`, `next/cache`를 직접 import하면 실패하도록 했다.
- `src/server/actions/*.ts`는 반드시 `'use server'`로 시작하는지 점검한다.
- Server Action에서 브라우저 Supabase client를 사용하지 않는지도 확인한다.
- `npm run verify` 흐름에 아키텍처 점검을 포함했다.

### 추가 점검 명령

```bash
npm run architecture:scan
npm run verify
```

### 관련 문서

```text
dev/PARKBUDDY_ARCHITECTURE_BOUNDARY_AUDIT.md
```
