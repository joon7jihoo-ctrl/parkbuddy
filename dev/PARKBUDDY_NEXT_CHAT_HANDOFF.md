# ParkBuddy 다음 대화창 인수인계 문서

작성일: 2026-06-19
목적: 현재 대화창이 길어져 다음 대화창에서 안정적으로 ParkBuddy 개발을 이어가기 위한 인수인계 문서입니다.

## 1. 프로젝트 기본 정보

- 프로젝트명: ParkBuddy
- 개발 형태: Next.js App Router + Supabase 기반 골프/클럽 운영 웹앱
- 주요 사용자: 클럽 운영자와 일반 회원
- 현재 방향: 새 기능 추가보다 운영 전 안정화, 보안/RLS, 아키텍처 경계, 모바일 Dense UX, sticky CTA 일관성 점검 우선
- 운영 도메인: `https://parkbuddy-five.vercel.app`
- Supabase 프로젝트 ID로 사용 중인 값: `jefbokflyuywzjotwmhn`
- 주요 브랜치로 사용 중인 값: `feature/operator-stability-and-round-safety`

## 2. 사용자/응답 선호

다음 대화창의 데브는 아래 원칙을 유지해야 합니다.

1. 사용자는 assistant를 “데브(Dev)”라고 부릅니다.
2. 답변은 따뜻하고 전문적인 한국어로 합니다.
3. ParkBuddy 개발 답변에서는 긴 소스코드를 채팅에 직접 많이 붙이지 말고, 가능한 경우 ZIP/파일 링크와 적용 명령어 중심으로 안내합니다.
4. 단, 사용자가 명시적으로 전체 코드를 요구하면 해당 요구를 존중하되, 파일 단위 전달/문서화 방식을 우선 제안합니다.
5. 앱 코드를 변경할 때는 어떤 파일이 왜 바뀌는지 먼저 설명하고, 적용 명령어와 확인 화면을 제공합니다.
6. 모든 개발 변경 사항은 `dev/` 폴더 문서에 남깁니다.
7. 모바일 Dense UX 원칙을 계속 유지합니다.
8. 검색 기능처럼 안정화된 기능은 사용자가 명시하지 않으면 건드리지 않습니다.

## 3. 현재까지 완료된 큰 기능 흐름

### 3.1 인증/접근

- 카카오 로그인 흐름 정리
- 카카오 redirect hotfix 반영
- 운영자 발급 초대 코드 기반 회원 계정 연결 흐름 도입
- 패스키/생체 로그인 도입 전 준비 문서화
- SMS OTP는 비용 문제로 제외
- 이메일 magic link는 주 흐름이 아니라 비상/관리자 복구용으로만 고려

### 3.2 회원/운영자 관리

- 회원 관리 모바일 Dense UX 개선
- 회원 검색/필터 안정화
- 회원 등록/수정 sticky SubmitButton 적용
- 회원 연결 화면 sticky SubmitButton 적용
- 회원 카드와 상세 팝업 모바일 밀도 개선

### 3.3 일정/투표/라운딩 생성

- 일정 투표 모바일 흐름 개선
- 카카오톡 느낌의 참석/불참 투표 UI 반영
- 일정 투표 상세 모달/중앙 정렬 개선
- 마이페이지에 예정 일정 요약 추가
- 일정 참석자를 바탕으로 라운딩 생성 흐름 추가
- 라운딩 생성 전 참석/불참/미응답 검토 UI 추가
- 생성된 라운딩에 연결 일정 문맥 표시

### 3.4 라운딩 관리

- 라운딩 목록 모바일 Dense UX 적용
- 라운딩 관리 목록에서 경기 방식 표시 개선
- 라운딩 생성/수정 sticky SubmitButton 적용
- 참가자 관리 모바일 Dense UX 적용
- 조 편성 모바일 Dense UX 적용
- 경기 형태/점수 계산 방식 한글화
- 경기 방식 설명은 중복 문구 없이 간결하게 정리
- 자동 조 편성 알고리즘 도입
  - 평균 타수와 참여 횟수를 기반으로 실력 균등 분산
  - 팀 정보가 있을 경우 팀 분산 우선
  - 실제 DB에서는 `round_pairings` 테이블 없이 `round_participants` 중심 구조로 확인됨

### 3.5 스코어/결과

- `round_scores`를 공식 스코어 원천으로 통일
- 마이페이지, 스코어 목록, 상세, 최근 기록, 평균/최고 기록 흐름 정리
- 스코어 입력 모바일 Dense UX와 완료 카드 자동 접기 적용
- sticky summary/save 개선
- 스코어/결과 화면 불필요한 설명 문구 제거
- 결과 화면 `Top 3` → `상위 3명` 한글화
- 계산 기준은 기본 노출 대신 접이식 영역으로 이동

### 3.6 게시판/보안

- 게시판 비공개 글/공지/첨부파일 접근 보안 강화
- 게시판 문구 단순화
- 게시글 카드의 “자세히 보기” 제거
- “최근 공지”와 “게시판”처럼 같은 내용을 다른 명칭으로 부르는 표현 정리

### 3.7 전역 UX

- 모바일 Dense UX 전역 스타일 보강
- 상단 sticky header 기준 적용
- 하단 sticky CTA 기준 적용
- 공통 `SubmitButton`, `TopBar`, `AppShell`, `PageQuickActions` 도입
- 저장/등록 화면 일부를 sticky SubmitButton 기준으로 정리

## 4. 운영 전 안정화 상태

### 4.1 보안/RLS/RPC 점검

사용자가 로컬에서 아래를 실행했고 통과했습니다.

```powershell
npm run security:scan
npm run verify
```

확인된 결과:

```text
Security smoke test passed.
RLS/RPC migration audit passed.
lint passed.
typecheck passed.
```

로컬 RLS/RPC 스캔 결과:

```text
ok        members                  rls=yes policy=yes
not-found member_action_logs       rls=no policy=no
ok        rounds                   rls=yes policy=yes
ok        round_participants       rls=yes policy=yes
not-found round_pairings           rls=no policy=no
ok        round_scores             rls=yes policy=yes
ok        events                   rls=yes policy=yes
ok        event_votes              rls=yes policy=yes
ok        posts                    rls=yes policy=yes
ok        post_attachments         rls=yes policy=yes
security definer occurrences: 29
function declarations scanned: 35
RLS/RPC migration audit passed.
```

판정:

- `member_action_logs`: 현재 실제 사용 여부 불명확. 없으면 문제 없음.
- `round_pairings`: 실제 Supabase DB에서 존재하지 않고 `round_participants`만 확인됨. 현재 구조에서는 문제 없음.
- 실제 RLS 정책 CSV도 확인했고 치명적인 `{anon}` INSERT/UPDATE/DELETE 개방 정책은 보이지 않았음.
- 주요 정책은 `{authenticated}` 중심이며 `current_club_id()`, `current_member_id()`, `auth.uid()`, `is_club_admin()` 기반으로 제한됨.

운영 전 안정화 1단계 판정: 통과

### 4.2 App Router 아키텍처 점검

사용자가 아래를 실행했고 통과했습니다.

```powershell
npm run architecture:scan
npm run verify
```

결과:

```text
Architecture boundary audit passed.
```

운영 전 안정화 2단계 판정: 통과

### 4.3 Performance/Dense UX 점검

사용자가 `npm run verify`에서 `performance:ux`를 실행했고, pass 되었으나 경고가 있었습니다.

경고 항목:

```text
src/app/(app)/admin/members/new/page.tsx
src/app/(app)/admin/members/[id]/edit/page.tsx
src/app/(app)/admin/rounds/deleted/page.tsx
src/app/(app)/admin/rounds/new/page.tsx
src/app/(app)/admin/rounds/[id]/edit/page.tsx
src/app/(app)/admin/rounds/[id]/pairings/page.tsx
src/app/(app)/admin/rounds/[id]/participants/page.tsx
src/app/(app)/board/page.tsx
src/app/(app)/member-link/page.tsx
src/app/(app)/schedule/page.tsx
src/app/(auth)/login/page.tsx
```

이후 1차 수정 패치로 실제 저장/등록 액션이 있는 5개 화면을 공통 sticky SubmitButton 기준으로 정리했습니다.

수정 완료 대상으로 안내한 파일:

```text
src/app/(app)/admin/members/new/page.tsx
src/app/(app)/admin/members/[id]/edit/page.tsx
src/app/(app)/admin/rounds/new/page.tsx
src/app/(app)/admin/rounds/[id]/edit/page.tsx
src/app/(app)/member-link/page.tsx
```

그 다음 `performance:ux`에서 반복 경고를 줄이기 위해 예외 정책 패치도 제안했습니다.

예외 처리 대상:

```text
/admin/rounds/deleted
/admin/rounds/[id]/pairings
/admin/rounds/[id]/participants
/board
/schedule
/login
```

중요: 사용자가 `parkbuddy-performance-ux-exception-policy.zip` 패치를 실제로 적용/커밋했는지는 마지막 대화 기준으로 확인되지 않았습니다. 다음 대화창에서는 먼저 이 패치의 적용 여부를 확인해야 합니다.

## 5. 다음 대화창에서 가장 먼저 확인할 것

다음 창을 열면 무조건 아래 순서로 확인합니다.

### 5.1 현재 Git 상태 확인

```powershell
cd C:\parkbuddy
git status
git log --oneline -5
```

확인할 커밋:

- `feat: unify sticky submit cta on form screens` 또는 유사 커밋이 있는지
- `chore: document dense ux form exceptions` 또는 유사 커밋이 있는지

두 번째 커밋이 없으면 `parkbuddy-performance-ux-exception-policy.zip` 적용 여부를 확인해야 합니다.

### 5.2 verify 확인

```powershell
npm run verify
```

기대 결과:

```text
security:scan 통과
architecture:scan 통과
performance:ux 통과
lint 통과
typecheck 통과
```

`performance:ux`에서 경고가 계속 뜨면 다음 판단 기준을 적용합니다.

- 저장/등록 단일 액션 화면이면 수정 대상
- 검색/필터/투표/다중 액션 화면이면 예외 정책 문서화 대상

## 6. 다음 개발 흐름 제안

새 대화창에서는 새 기능으로 바로 가지 말고 아래 순서로 안정화합니다.

1. `performance:ux` 경고가 더 이상 반복되지 않는지 확인
2. Vercel production 배포 상태 확인
3. Supabase 운영 DB SQL migration 적용 여부 확인
4. 실제 모바일 기기에서 핵심 운영 시나리오 QA
5. QA에서 발견된 치명/높음 우선순위 이슈만 수정
6. 이후 기능 개선은 작은 단위로 진행

## 7. 다음 단계 우선순위

### 우선순위 A: 운영 QA

- 로그인/초대 코드
- 회원 관리
- 일정 투표
- 일정 → 라운딩 생성
- 참가자 관리
- 조 편성 자동/수동
- 스코어 입력
- 결과 확인
- 게시판 권한

### 우선순위 B: 예외 정책/문서 정리

- Performance/Dense UX 예외 정책 커밋 여부 확인
- `dev/PARKBUDDY_PERFORMANCE_UX_EXCEPTION_POLICY.md` 존재 여부 확인
- `scripts/performance-dense-ux-audit.mjs`에 예외 목록이 반영됐는지 확인

### 우선순위 C: 운영 배포 점검

- Vercel production branch
- Supabase Redirect URL
- Kakao Developers Redirect URI
- 환경변수
- SQL migration 적용 상태

## 8. 다음 대화창에서 데브가 지켜야 할 작업 방식

1. 무조건 먼저 현재 파일/커밋 상태를 확인합니다.
2. 이미 안정화된 앱 코드는 임의로 크게 바꾸지 않습니다.
3. UX 통일 작업은 경고 제거보다 실제 사용자 흐름을 우선합니다.
4. 앱 코드를 변경할 경우 dev 문서도 함께 갱신합니다.
5. 사용자가 지쳐 있으므로 한 번에 큰 개발을 강요하지 말고, 검증 가능한 작은 단위로 안내합니다.
6. 패치 ZIP을 만들 때 루트에 `src/`, `scripts/`, `dev/`가 바로 오도록 구성합니다. 중첩 폴더를 만들지 않습니다.

## 9. 현재 판단

현재 ParkBuddy는 운영 전 안정화 흐름에 들어왔고, 보안/RLS/RPC 및 App Router 경계는 통과된 상태입니다. 남은 핵심은 `performance:ux` 예외 정책 적용 여부 확인과 실제 모바일/운영 QA입니다.
