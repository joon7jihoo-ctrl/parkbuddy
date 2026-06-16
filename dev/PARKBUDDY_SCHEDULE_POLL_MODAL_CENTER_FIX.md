# ParkBuddy Schedule Poll Modal Center Fix

## 목적

일정 참석 투표 명단 팝업이 모바일에서 하단 시트처럼 표시되던 동작을 화면 중앙 팝업으로 통일한다.

## 변경 사항

- `src/app/(app)/schedule/VoteButtons.tsx`
  - 팝업 오버레이 정렬을 `items-end md:items-center`에서 `items-center`로 변경
  - 모바일/태블릿/데스크탑 모두 화면 중앙에 팝업 표시
  - 하단 시트용 손잡이 UI 제거
  - 기존 명단 표시, 닫기 버튼, 배경 클릭 닫기 동작 유지

## 검증

- `npm run verify` 통과 필요
- `/schedule`에서 참석/불참 선택 시 명단 팝업이 화면 중앙에 표시되는지 확인
- `투표 n명` 선택 시 전체 명단 팝업도 중앙에 표시되는지 확인
