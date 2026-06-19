# ParkBuddy Performance / Dense UX Audit

## 목적

운영 전 안정화 3단계 작업입니다. 보안 점검과 App Router 아키텍처 점검에 이어, 모바일 Dense UX와 상단/하단 sticky CTA 기준이 이후 개발 과정에서 깨지지 않도록 정적 점검 스크립트를 추가합니다.

## 추가된 명령어

```bash
npm run performance:ux
```

`npm run verify`에도 포함되어, 앞으로 기능 추가 후 전체 검증을 실행하면 다음 항목이 함께 점검됩니다.

## 점검 항목

### 1. 전역 UX 레이어 존재 여부

다음 공통 파일이 존재하는지 확인합니다.

- `src/components/AppShell.tsx`
- `src/components/PageQuickActions.tsx`
- `src/components/SubmitButton.tsx`
- `src/components/TopBar.tsx`
- `src/app/globals.css`

### 2. 상단 sticky header 기준

`TopBar`가 모바일에서 sticky header 역할을 유지하는지 확인합니다.

### 3. 하단 sticky CTA 기준

`SubmitButton`과 `PageQuickActions`가 표준 CTA wrapper를 사용하는지 확인합니다.

- `parkbuddy-sticky-cta`
- `parkbuddy-sticky-cta__inner`
- `data-parkbuddy-sticky-cta`
- `data-parkbuddy-quick-actions`

### 4. 모바일 터치 영역 기준

전역 CSS에 최소 44px 터치 영역 기준이 유지되는지 확인합니다.

### 5. App Router 성능 기준

다음 항목을 경고로 표시합니다.

- 전체 페이지가 Client Component로 바뀌는 경우
- Server Component에서 브라우저 전용 객체를 직접 사용하는 경우
- form이 있으나 공유 sticky submit 흐름을 쓰지 않는 경우
- raw `<img>` 사용 가능성이 있는 경우

## 운영 기준

이 스크립트는 성능을 실제 측정하는 Lighthouse가 아니라, ParkBuddy 프로젝트에서 반복적으로 깨질 수 있는 UX/구조 기준을 자동으로 확인하는 정적 점검 도구입니다.

운영 배포 전에는 아래 명령을 모두 실행합니다.

```bash
npm run verify
npm run build
```

모바일 실기기에서는 다음을 확인합니다.

1. 상단 제목이 스크롤 중 자연스럽게 유지되는지
2. 하단 CTA가 홈 버튼과 겹치지 않는지
3. 저장 버튼이 중복 노출되지 않는지
4. 입력 화면의 CTA가 엄지 조작 범위에 있는지
5. 데스크톱 화면이 과도하게 compact해지지 않는지

## 다음 개선 후보

- Lighthouse 모바일 점수 측정 자동화
- Playwright 기반 주요 화면 스크린샷 비교
- 조 편성/스코어 입력 화면 리렌더링 프로파일링
- 회원 수 50명 이상 기준 목록 성능 테스트
