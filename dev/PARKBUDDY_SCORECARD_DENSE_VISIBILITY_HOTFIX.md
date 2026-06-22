# ParkBuddy Scorecard Dense Visibility Hotfix

## 목적

스코어카드 읽기 전용 화면이 기존 ParkBuddy 화면과 다르게 보이고, 모바일에서 글자가 작아 시인성이 떨어지는 문제를 보정한다.

## 변경 범위

- `src/app/(app)/scores/[roundId]/scorecard/page.tsx`
- `src/app/(app)/scores/[roundId]/scorecard/ScorecardTabs.tsx`

## 적용 내용

1. 상단 정보 카드 sticky 위치를 TopBar 아래로 보정했다.
   - 기존 `top-0` 계열은 TopBar sticky와 겹칠 수 있어 모바일에서 `top-[5.25rem]` 기준으로 조정했다.
   - 탭 메뉴도 정보 카드 아래에 이어지도록 `top-[9.65rem]` 기준으로 보정했다.

2. 기존 ParkBuddy 카드 톤과 맞췄다.
   - `pb-dense-card`, `rounded-[24px]`, `border-slate-200`, `shadow-sm`, `bg-white/95` 계열을 사용했다.
   - 다른 목록/관리 페이지와 유사한 카드 밀도와 배경감을 유지한다.

3. 모바일 글자 크기를 키웠다.
   - 테이블 기본 글자를 `text-xs` 이상으로 올렸다.
   - 점수 뱃지는 `text-sm`, 최소 32px 크기로 보정했다.
   - 내 조/확인할 조/날짜/장소 정보도 `13px~14px` 수준으로 맞췄다.

4. 모바일 Dense UX를 유지했다.
   - 집계표는 `구분 + 회원 4명`이 한 화면에 들어오도록 `table-fixed`와 고정 비율을 유지했다.
   - 코스별 표는 홀/M/파/회원 4명 칼럼이 가로스크롤 없이 보이도록 칼럼 폭과 여백을 재조정했다.
   - 긴 회원명과 장소명은 `truncate` 처리해 레이아웃 깨짐을 방지한다.

## 확인 기준

- `npm run verify` 통과
- 모바일에서 TopBar, 정보 카드, 탭 메뉴가 겹치지 않음
- 글자가 지나치게 작아 보이지 않음
- 집계표와 코스별 표가 기존 ParkBuddy 카드 UI와 이질감이 적음
- 모바일에서 불필요한 가로스크롤 없이 주요 정보가 한 화면에 들어옴
