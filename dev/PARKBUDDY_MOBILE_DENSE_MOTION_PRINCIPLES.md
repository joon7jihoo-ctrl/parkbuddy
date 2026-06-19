# ParkBuddy 모바일 Dense Layout & Motion UX 원칙 반영

작성일: 2026-06-15

## 목적

앞으로 ParkBuddy 화면을 개선할 때 모바일 사용성을 기본 기준으로 삼기 위해 공통 UX 원칙과 최소 CSS 기반 모션 토대를 추가했다.

## 이번 반영 범위

- `src/components/AppShell.tsx`
- `src/app/globals.css`
- `dev/PARKBUDDY_OPERATOR_DEV_STATUS.md`

## 적용 원칙

### 1. 모바일 뷰포트 최적화

- 모바일에서는 카드 여백과 폰트 크기를 불필요하게 키우지 않는다.
- 데이터 확인 화면은 스크롤을 줄이고 한눈에 비교할 수 있는 밀도를 우선한다.
- 주요 버튼은 최소 44px 이상의 터치 영역을 확보한다.
- 필요할 경우 축소 모드, sticky header, sticky CTA를 우선 검토한다.

### 2. 모션 기반 네비게이션

- 페이지 전환 시 갑작스러운 전환 대신 짧은 slide-up/fade 전환을 적용한다.
- 사용자가 이동 방향을 인지할 수 있도록 과하지 않은 모션을 우선한다.
- `prefers-reduced-motion` 사용자는 애니메이션을 비활성화한다.
- 추후 모달/상세 화면은 아래에서 위로 올라오는 slide-up 패턴을 우선 적용한다.

## 실제 코드 변경

- 보호된 앱 영역의 페이지 컨테이너에 `pb-page-motion` 클래스를 추가했다.
- `globals.css`에 다음 공통 클래스를 추가했다.
  - `pb-page-motion`: 앱 영역 페이지 진입 시 짧은 slide-up/fade 효과
  - `pb-touch-target`: 최소 44px 터치 영역 확보용 유틸리티
  - `pb-compact-card`: 모바일 콤팩트 카드 기본 여백 토대
- 접근성을 위해 `prefers-reduced-motion: reduce`에서는 페이지 모션을 비활성화한다.

## 검증

```powershell
npm run verify
```

통과 확인.

## 다음 적용 후보

- 회원 상세 팝업: slide-up sheet 패턴 적용
- 일정/스코어 탭성 화면: 좌우 스와이프 또는 탭 전환 모션 검토
- 스코어 입력/라운딩 상세: sticky compact header 추가 여부 검토
