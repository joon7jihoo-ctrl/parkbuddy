# ParkBuddy App Router Architecture Boundary Audit

작성일: 2026-06-19

## 목적

운영 전 안정화 2단계로, Next.js App Router 프로젝트에서 Server Component, Client Component, Server Action 경계가 무너지는 문제를 자동으로 점검한다.

화면 코드는 변경하지 않고 다음 파일만 추가/수정했다.

- `scripts/architecture-boundary-audit.mjs`
- `package.json`
- `dev/PARKBUDDY_ARCHITECTURE_BOUNDARY_AUDIT.md`
- `dev/PARKBUDDY_OPERATOR_DEV_STATUS.md`

## 추가된 명령어

```bash
npm run architecture:scan
```

`npm run verify`에도 포함했다.

```bash
npm run verify
```

실행 순서:

1. 보안 스모크 테스트
2. RLS/RPC 마이그레이션 점검
3. App Router 아키텍처 경계 점검
4. ESLint
5. TypeScript typecheck

## 점검 항목

### 1. Client Component의 서버 전용 import 차단

`'use client'` 파일에서 아래 서버 전용 의존성을 직접 가져오면 실패한다.

- `@/lib/supabase/server`
- `@/server/auth`
- `@/lib/auth/require-member`
- `next/headers`
- `next/cache`
- `server-only`

Server Action은 Next.js에서 Client Component가 호출할 수 있는 공식 흐름이므로 금지하지 않는다. 단, Server Action 파일 자체는 반드시 `'use server'`를 가져야 한다.

### 2. 서버 전용 모듈의 Client Component화 방지

아래 파일이 실수로 `'use client'`가 되면 실패한다.

- `src/lib/supabase/server.ts`
- `src/lib/auth/require-member.ts`
- `src/server/auth.ts`

### 3. Server Action 지시어 확인

`src/server/actions/*.ts` 파일은 반드시 첫 의미 있는 문장이 `'use server'`여야 한다.

### 4. Server Action에서 브라우저 Supabase 클라이언트 사용 방지

`src/server/actions/*.ts`에서 브라우저 Supabase 클라이언트가 사용되면 실패한다.

## 현재 점검 결과

현재 소스 기준으로 아래 명령은 통과했다.

```bash
node scripts/architecture-boundary-audit.mjs
```

결과:

```text
Architecture boundary audit passed.
```

## 운영상 의미

이 점검은 다음 사고를 예방한다.

- Client Component에서 서버 Supabase client를 직접 import하는 문제
- Client Component 번들에 서버 권한 코드가 섞이는 문제
- `next/headers`, `next/cache` 같은 서버 전용 API가 클라이언트로 넘어가는 문제
- Server Action 파일에서 `'use server'` 지시어가 빠지는 문제
- Server Action이 브라우저 client를 사용하는 구조 붕괴

## 다음 리팩터링 권장 순서

앱 코드 자체를 바로 바꾸기보다, 현재 점검을 통과한 상태에서 아래 순서로 천천히 분리한다.

1. `round-pairing-form.tsx`를 경기 방식 카드, 조 편성 카드, 저장 영역으로 분리
2. `round-score-input-form.tsx`를 입력 카드, 필터, 저장 요약으로 분리
3. `schedule/page.tsx`에서 일정 카드와 라운딩 생성 검토 영역 분리
4. 도메인 타입을 `src/types/domain.ts` 중심으로 정리
5. 운영자 주요 흐름의 E2E 점검 스크립트 추가 검토

## 주의 사항

- Server Action을 Client Component에서 import하는 것은 현재 구조상 허용한다.
- 이 스크립트는 정적 텍스트 점검이므로 모든 아키텍처 문제를 잡지는 않는다.
- 최종 품질 보증은 `npm run verify`, 실제 모바일 QA, Supabase 운영 DB 점검을 함께 통과해야 한다.
