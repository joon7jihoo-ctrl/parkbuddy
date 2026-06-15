# ParkBuddy Soft Motion Fix

## 목적

이전 모바일 Dense/Motion foundation 적용 후 페이지 이동 시 전체 화면이 크게 밀려 들어오는 느낌이 발생했다. 실제 확인 영상 기준으로 데스크탑/태블릿에서는 산만하게 느껴지고, 하단 네비게이션까지 화면 기준점이 흔들리는 것처럼 보일 수 있어 모션 강도를 낮춘다.

## 변경 범위

- `src/app/globals.css`
- `dev/PARKBUDDY_SOFT_MOTION_FIX.md`
- `dev/PARKBUDDY_OPERATOR_DEV_STATUS.md`

## 변경 내용

- `.pb-page-motion`의 이동 거리를 `10px`에서 `2px`로 축소했다.
- 애니메이션 시간을 `180ms`에서 `110ms`로 줄였다.
- 시작 opacity를 `0`에서 `0.96`으로 바꿔 화면 전체가 새로 뜨는 느낌을 줄였다.
- `will-change`를 제거해 불필요한 합성 레이어 힌트를 줄였다.
- `md` 이상 화면에서는 페이지 진입 모션을 비활성화했다.
- `prefers-reduced-motion: reduce`에서는 기존처럼 모션을 비활성화한다.

## 의도

- 모바일에서는 아주 약한 피드백만 남긴다.
- 태블릿/데스크탑에서는 페이지가 흔들리거나 밀려 들어오는 느낌을 없앤다.
- 하단 네비게이션은 계속 고정 기준점처럼 보이도록 한다.

## 확인 항목

1. `npm run verify` 통과
2. 데스크탑에서 홈, 라운딩 관리, 스코어 입력 화면 이동 시 화면이 출렁이지 않는지 확인
3. 모바일에서만 아주 약한 fade/미세 이동이 느껴지는지 확인
4. 하단 네비게이션이 움직이는 것처럼 보이지 않는지 확인

## 커밋 메시지 제안

```text
fix: soften page transition motion
```
