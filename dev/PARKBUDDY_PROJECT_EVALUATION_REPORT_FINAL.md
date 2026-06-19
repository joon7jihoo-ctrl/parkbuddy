# ParkBuddy 최종 평가분석보고서

작성 기준: 현재 최종 완성형 앱 소스 코드와 `dev/` 개발 이력 문서를 함께 검토한 운영 전 평가 보고서입니다.

## 1. 종합 결론

ParkBuddy는 현재 **운영 전 QA 단계에 진입 가능한 수준**입니다. 회원 관리, 일정 투표, 일정 기반 라운딩 생성, 참가자 관리, 조 편성, 스코어 입력, 결과 확인, 게시판 보안 강화까지 핵심 흐름이 하나의 운영 흐름으로 연결되었습니다.

다만 운영 투입 전에는 Supabase 설정과 실제 모바일 기기 QA가 반드시 필요합니다.

| 평가 영역 | 현재 평가 | 판단 |
|---|---:|---|
| 보안성 | B+ | RLS/RPC 중심 구조는 적절하나 운영 DB 재검증 필요 |
| 코드 품질/아키텍처 | B+ | App Router 구조와 Server Action 분리는 양호하나 일부 대형 컴포넌트 리팩터링 여지 있음 |
| 성능/UX | B+ | 모바일 Dense UX 방향은 잘 반영되었고, 실제 기기 QA 후 추가 안정화 필요 |

## 2. 보안성 검토

### 2.1 긍정적인 부분

- Supabase RLS를 전제로 한 보안 구조를 사용합니다.
- 관리자성 작업은 클라이언트 직접 업데이트보다 Server Action/RPC 중심으로 처리합니다.
- 회원 계정 연결, 라운딩 생성, 라운딩 복제, 상태 변경, 게시판 권한 등은 DB 함수와 정책을 통해 통제하려는 방향이 명확합니다.
- 게시판 보안 강화 작업에서 비공개 글 접근, 작성자 권한, 첨부파일 접근 정책을 별도 점검 대상으로 분리했습니다.
- `scripts/security-smoke-test.mjs` 기준 보안 스모크 테스트는 통과했습니다.

### 2.2 확인이 필요한 위험 요소

#### RLS 정책 중복/누락 위험

개발 과정에서 여러 마이그레이션이 누적되었기 때문에 운영 DB에는 다음 확인이 필요합니다.

- 모든 핵심 테이블에 RLS가 활성화되어 있는지
- `members`, `rounds`, `round_participants`, `round_pairings`, `round_scores`, `events`, `event_votes`, `posts`, `attachments` 계열 정책이 의도한 권한만 허용하는지
- 익명 세션 기반 초대 코드 흐름이 회원 연결 RPC 외의 데이터를 과도하게 읽거나 수정하지 못하는지

#### Security Definer RPC 검증

운영자 RPC는 편리하지만 권한 상승 통로가 될 수 있습니다. 특히 다음 함수는 운영 DB에서 인자 검증과 권한 검증을 다시 확인해야 합니다.

- 회원 연결 RPC
- 일정에서 라운딩 생성 RPC
- 라운딩 상태 변경 RPC
- 라운딩 복제 RPC
- 게시판/첨부파일 관련 RPC

권장 기준은 다음과 같습니다.

- 함수 내부에서 `auth.uid()` 기준 사용자 확인
- 운영진 권한 확인
- 같은 클럽/조직 범위 확인
- 삭제/복원/상태 변경 시 감사 로그 기록

#### 카카오 OAuth 및 초대 코드 로그인

카카오 로그인은 외부 네트워크 환경에 따라 실패할 수 있어 초대 코드 백업 흐름을 추가했습니다. 방향은 적절합니다. 다만 초대 코드 흐름은 다음 운영 정책이 필요합니다.

- 초대 코드는 1회성 또는 짧은 유효기간 사용
- 실패 횟수 제한
- 사용 후 폐기
- 이미 연결된 회원의 재사용 제한
- 코드 원문 대신 해시 저장 권장

### 2.3 보안 권장 조치

운영 전 반드시 다음을 실행합니다.

```bash
npm run security:scan
npm run verify
```

Supabase에서는 다음을 확인합니다.

```text
Authentication → URL Configuration
Site URL: https://parkbuddy-five.vercel.app
Redirect URLs:
- https://parkbuddy-five.vercel.app/auth/callback
- https://parkbuddy-five.vercel.app/**
- http://localhost:3000/auth/callback
- http://localhost:3000/**
```

Kakao Developers에는 다음 Redirect URI를 등록해야 합니다.

```text
https://jefbokflyuywzjotwmhn.supabase.co/auth/v1/callback
```

## 3. 코드 품질 및 아키텍처 검토

### 3.1 긍정적인 부분

- Next.js App Router 기반으로 기능 경로가 명확하게 분리되어 있습니다.
- 인증 영역 `(auth)`, 앱 영역 `(app)`, 관리자 영역 `admin`이 경로 구조상 구분되어 있습니다.
- 서버 전용 Supabase 클라이언트와 브라우저 클라이언트가 분리되어 있습니다.
- 도메인성 유틸이 일부 분리되어 있습니다.
  - `score-records.ts`
  - `round-game-labels.ts`
  - `round-pairing-algorithm.ts`
  - `round-linked-event-context.ts`
- UI 컴포넌트가 일부 재사용 가능하게 분리되어 있습니다.
  - `round-pairing-form.tsx`
  - `round-score-input-form.tsx`
  - `participant-selection-enhancer.tsx`
  - `linked-event-context-card.tsx`

### 3.2 개선이 필요한 부분

#### 대형 화면 컴포넌트 분리

다음 파일은 기능이 커지면서 화면 구성, 데이터 변환, 상태 관리가 한 파일에 모이는 경향이 있습니다.

- `src/components/admin/round-pairing-form.tsx`
- `src/components/admin/round-score-input-form.tsx`
- `src/app/(app)/schedule/page.tsx`
- `src/app/(app)/admin/rounds/page.tsx`

향후 리팩터링 방향은 다음과 같습니다.

```text
화면 페이지: 데이터 조회와 큰 레이아웃만 담당
도메인 유틸: 계산/분류/정렬 담당
클라이언트 컴포넌트: 최소 상태와 사용자 입력 담당
작은 UI 컴포넌트: 카드/필터/버튼 단위 재사용
```

#### 타입 정리

경기 형태, 점수 계산 방식, 라운드 상태, 투표 상태는 문자열로 흩어지기 쉬운 영역입니다. `src/types/domain.ts` 또는 별도 타입 파일에서 enum-like union 타입을 강화하는 것이 좋습니다.

### 3.3 코드 품질 권장 조치

다음 순서의 리팩터링을 권장합니다.

1. `round-pairing-form.tsx`를 경기 방식 카드, 추천 요약, 조 편성 그리드, 저장 바 컴포넌트로 분리
2. `round-score-input-form.tsx`에서 스코어 입력 카드와 저장 요약 분리
3. `schedule/page.tsx`에서 일정 카드와 라운딩 생성 확인 영역 분리
4. 라운드/스코어/일정 관련 타입을 `src/types/domain.ts`에 통합

## 4. 성능 및 UX 최적화 검토

### 4.1 긍정적인 부분

- 모바일 Dense UX 원칙이 여러 핵심 화면에 적용되었습니다.
- 불필요한 설명 문구를 제거해 화면 밀도를 높였습니다.
- 하단/상단 sticky CTA가 스코어 입력, 조 편성, 상태 필터 등에 적용되어 모바일 조작성이 좋아졌습니다.
- 검색/필터/카드 UI는 운영자 사용 흐름에 맞춰 점차 간결해졌습니다.
- 과도한 화면 전환 모션은 줄이고, 모바일에서만 은은한 motion을 적용하는 방향으로 안정화했습니다.

### 4.2 성능상 확인할 부분

#### 조 편성 화면

회원 수가 많아질수록 조 편성 카드가 많아지고 select 상태가 증가합니다. 현재는 모바일 compact grid로 밀도를 줄였지만, 향후 50명 이상 편성에서는 다음 검토가 필요합니다.

- 조별 필터
- 선택된 조만 보기
- 가상 스크롤 또는 페이지 단위 렌더링
- 자동 편성 재계산 시 불필요한 전체 리렌더링 방지

#### 스코어 입력 화면

스코어 입력은 사용자 입력이 잦고 상태 변화가 많습니다. 현재 완료 카드 자동 접기와 sticky summary가 적용되어 UX는 좋아졌지만, 다음 사항을 계속 확인해야 합니다.

- 입력 중 카드가 의도치 않게 접히지 않는지
- 저장 전후 값이 사라지지 않는지
- 완료/미입력 필터가 실제 입력값 기준으로 동작하는지

#### 게시판/첨부파일

첨부파일이 많아질 경우 파일 크기 제한, MIME 검증, 이미지 미리보기 최적화가 필요합니다.

### 4.3 UX 평가

ParkBuddy의 현재 UX 방향은 적절합니다.

- 설명보다 행동 중심
- 한글 중심 화면
- 모바일 우선 compact layout
- 운영자 주요 행동을 버튼으로 명확히 노출
- 단순 조회 화면은 문구를 줄이고 정보 밀도를 높임

다만 연령대가 있는 사용자를 고려하면, 설명을 제거한 화면에서 다음은 유지되어야 합니다.

- 실패 시 오류 메시지는 친절하게 표시
- 초대 코드/로그인처럼 낯선 흐름은 최소 안내 유지
- 저장/삭제/상태 변경처럼 위험한 행동은 확인 문구 유지

## 5. 운영 전 최종 QA 체크리스트

### 필수 명령어

```bash
npm run verify
npm run build
```

### 필수 화면 점검

```text
/login
/schedule
/admin/members
/admin/rounds
/admin/rounds/[id]/participants
/admin/rounds/[id]/pairings
/admin/rounds/[id]/scores
/admin/rounds/[id]/results
/scores
/mypage
/board
```

### 필수 운영 시나리오

1. 카카오 로그인
2. 초대 코드 로그인
3. 회원 등록/수정/비활성화/복원
4. 일정 생성
5. 일정 투표
6. 참석자 기준 라운딩 생성
7. 라운딩 참가자 편집
8. 자동 조 편성 및 수동 변경
9. 스코어 입력
10. 결과 확인/공유/인쇄
11. 게시글 작성/상세 확인/비공개 접근 제어

## 6. 다음 개발 권장 순서

운영 전에는 새 기능보다 안정화가 우선입니다.

1. Supabase 운영 DB RLS/RPC 점검
2. 실기기 모바일 QA
3. 조 편성 알고리즘 실제 데이터 검증
4. 스코어 입력 장시간 사용성 테스트
5. 게시판 첨부파일 보안 최종 점검
6. 패스키 도입은 운영 도메인 확정 후 재검토

## 7. 최종 판단

현재 ParkBuddy는 단순 프로토타입을 넘어 **운영 전 검증 단계의 클럽 운영 웹앱** 수준에 도달했습니다. 다음 단계는 기능 추가보다 운영 데이터와 실제 사용 환경에서 안정성을 검증하는 것입니다.
