# ParkBuddy Schedule Kakao Poll Layout

## 2026-06-16 작업 목적

`/schedule` 일정 카드에서 내부 값인 `regular`가 그대로 노출되는 문제를 줄이고, 사용자가 카카오톡 투표처럼 빠르게 참석 여부를 선택할 수 있도록 일정 카드 레이아웃을 정리한다.

## 변경 파일

```text
src/app/(app)/schedule/page.tsx
src/app/(app)/schedule/VoteButtons.tsx
dev/PARKBUDDY_SCHEDULE_KAKAO_POLL_LAYOUT.md
dev/PARKBUDDY_OPERATOR_DEV_STATUS.md
```

## 반영 내용

- 일정 유형 내부값을 사용자용 한국어 배지로 변환했다.
  - `regular` → `정기 라운딩`
  - `tournament` → `대회`
  - `casual` → `번개`
- 일정 카드를 카카오톡 투표형 구조로 변경했다.
- 참석 여부 선택지를 `참석 / 불참` 2개로 단순화했다.
- 기존 `maybe` 값은 새로 선택할 수 없도록 제거했다.
- 기존 DB에 남아 있을 수 있는 `maybe` 값은 화면에서 `미선택`처럼 안전하게 처리한다.
- 참석/불참 투표 현황은 카드 내부에서 2열 카운트로 보여준다.
- 투표 버튼은 2열 유지, 최소 44px 이상 터치 영역을 유지한다.
- 메모는 기존처럼 기본 접힘 상태를 유지한다.

## 검증 기준

```powershell
npm run verify
```

## 화면 확인 기준

- `/schedule`에서 일정 유형이 `regular`처럼 보이지 않고 한국어 배지로 표시되는지 확인한다.
- 카드가 `일정 정보 → 참석 투표 현황 → 참석/불참 선택 버튼 → 메모` 흐름으로 보이는지 확인한다.
- 참석/불참 버튼만 표시되는지 확인한다.
- 참석 또는 불참을 누르면 내 선택 배지와 투표 카운트가 갱신되는지 확인한다.
- 모바일에서 버튼 터치 영역이 충분한지 확인한다.
- 태블릿/데스크탑에서 2열 카드 배치가 유지되는지 확인한다.
