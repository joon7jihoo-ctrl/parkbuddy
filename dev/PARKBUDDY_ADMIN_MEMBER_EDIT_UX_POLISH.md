# ParkBuddy Admin Member Edit UX Polish

## 목표
- 회원관리 목록에서 회원명 자체가 수정 화면 링크 역할을 하므로 중복 수정 버튼을 제거한다.
- 회원 수정 화면 하단 액션을 수정 저장 / 취소 순서로 정리하고 모바일에서도 가로 2열로 유지한다.
- 회원 수정 연락처 입력값을 하이픈 포함 형식으로 표시한다.

## 변경 파일
- src/app/(app)/admin/members/page.tsx
- src/app/(app)/admin/members/[id]/edit/page.tsx
- dev/PARKBUDDY_OPERATOR_DEV_STATUS.md

## 확인 포인트
- /admin/members 에서 회원명 클릭 시 수정 화면으로 이동한다.
- /admin/members 에서 별도 수정 버튼은 보이지 않는다.
- /admin/members/[id]/edit 화면 상단 목록 버튼이 없다.
- 하단 버튼은 모바일에서도 수정 저장 / 취소 순서로 가로 배치된다.
- 연락처 입력값에 하이픈이 표시된다.
