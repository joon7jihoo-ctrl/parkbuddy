# ParkBuddy Universal Dense Sticky UX

## 목적

단계별 패치가 누적되면서 화면마다 모바일 밀도와 sticky CTA 동작이 조금씩 달라질 수 있어, 앱 전역에서 같은 사용자 경험을 제공하도록 공통 UX 레이어를 추가했다.

## 변경 파일

- `src/components/AppShell.tsx`
- `src/components/PageQuickActions.tsx`
- `src/components/SubmitButton.tsx`
- `src/components/TopBar.tsx`
- `src/app/globals.css`
- `dev/PARKBUDDY_UNIVERSAL_DENSE_STICKY_UX.md`
- `dev/PARKBUDDY_OPERATOR_DEV_STATUS.md`

## 적용 내용

### 1. 모바일 Dense UX 전역화

`AppShell`에 `pb-app-shell`, `pb-app-content` 클래스를 추가하고, `globals.css`에서 모바일 공통 밀도 규칙을 적용했다.

- 모바일 기본 여백 축소
- 카드 radius와 padding 정리
- 섹션 간격 축소
- 입력/버튼 터치 영역 최소 44px 유지
- 화면별 중복 padding 차이를 완화

### 2. 상단 Sticky Header 전역 적용

앱 영역의 각 `main` 첫 번째 `header`를 모바일에서 sticky header로 동작하게 했다.

- 스크롤 중 현재 화면 제목 유지
- 반투명 white surface + blur + shadow
- 모바일 제목 크기 compact화
- 데스크톱에서는 기존 레이아웃 유지

### 3. 하단 Sticky CTA 표준화

기존 `parkbuddy-sticky-cta` 패턴을 전역 규칙으로 보정했다.

- 모바일 safe-area 대응
- 하단 홈 버튼과 겹치지 않도록 위치 조정
- CTA width/radius/gap/button height 표준화
- print 페이지에서는 sticky CTA 숨김

### 4. SubmitButton sticky화

`SubmitButton`을 사용하는 입력/등록 화면은 별도 화면 수정 없이 하단 sticky 저장 CTA를 사용한다.

대상 예시:

- 일정 등록
- 게시글 등록
- 회원용 스코어 입력

### 5. 목록/조회 화면용 빠른 실행 CTA 추가

`PageQuickActions`를 추가해 폼 저장 CTA가 없는 목록/조회 화면에 공통 하단 빠른 실행 버튼을 제공한다.

예시:

- 홈: 일정 / 게시판
- 게시판: 글쓰기 / 일정
- 회원 목록: 일정 / 스코어
- 스코어: 마이페이지 / 일정
- 운영진 회원 관리: 회원 등록 / 라운딩 관리
- 라운딩 관리: 라운드 생성 / 달력
- 결과 화면: 스코어 / 인쇄

폼 화면이나 이미 저장 CTA가 있는 화면에서는 중복 CTA를 피하기 위해 빠른 실행 CTA를 숨긴다.

## QA 체크리스트

1. 모바일에서 모든 주요 화면의 제목 영역이 sticky로 유지되는지 확인한다.
2. 홈 버튼과 하단 CTA가 겹치지 않는지 확인한다.
3. 등록/수정/스코어 입력 화면에서 저장 버튼이 하단 sticky로 보이는지 확인한다.
4. 조 편성/스코어 운영자 입력 화면처럼 기존 sticky 저장 CTA가 있던 화면에서 중복 CTA가 생기지 않는지 확인한다.
5. 인쇄 화면에서 하단 네비게이션과 CTA가 숨겨지는지 확인한다.
6. 데스크톱 화면에서는 기존 레이아웃이 과도하게 변하지 않는지 확인한다.

## 검증

현재 환경에서 가능한 보안 스모크 테스트는 통과했다.

```bash
npm run security:scan
```

결과:

```text
Security smoke test passed.
```

전체 `npm run verify`는 의존성 설치가 없는 실행 환경에서는 완료할 수 없으므로, 로컬 프로젝트에서 실행해야 한다.
