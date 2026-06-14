# ParkBuddy Responsive Sticky CTA Polish

## 목적

하단 고정 CTA가 중앙에는 위치하지만 버튼 폭이 너무 작게 보이는 문제를 수정한다.

## 수정 원칙

- 모바일: 화면 좌우 여백을 남기되 충분한 폭을 사용한다.
- 태블릿/데스크탑: 버튼이 너무 넓게 퍼지지 않도록 최대 폭을 제한한다.
- 버튼 높이: 최소 48px 수준으로 유지해 터치 실수를 줄인다.
- 홈 버튼과 하단 CTA가 겹치지 않도록 기존 bottom 간격은 유지한다.

## 검증 화면

- /admin/members
- /admin/rounds
- /admin/rounds/[id]/participants
- /admin/rounds/[id]/pairings
- /admin/rounds/[id]/scores
- /admin/rounds/[id]/results

## 완료 기준

- npm run verify 통과
- 하단 CTA가 중앙에 보이면서도 충분히 넓게 표시됨
- 모바일에서 버튼 터치 영역이 불편하지 않음
