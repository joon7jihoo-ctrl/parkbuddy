# PARKBUDDY_SIMPLE_UX_COPY_CLEANUP_V3

## 목적

화면에서 사용자가 이미 버튼, 카드, 입력값으로 이해할 수 있는 설명을 줄이고 명칭을 더 단순하게 정리한다.

## 변경 범위

- `src/app/(auth)/login/page.tsx`
- `src/app/(app)/admin/logs/page.tsx`
- `src/app/(app)/admin/members/page.tsx`
- `src/app/(app)/admin/rounds/status/page.tsx`
- `src/app/(app)/members/page.tsx`
- `src/app/(app)/mypage/page.tsx`
- `src/app/(app)/schedule/page.tsx`
- `dev/PARKBUDDY_OPERATOR_DEV_STATUS.md`

## 변경 내용

- `ParkBuddy Secure` 표시를 `ParkBuddy`로 단순화했다.
- 로그인 화면의 긴 접근 권한 설명을 제거했다.
- 초대 코드 입력 카드의 반복 안내 문구를 제거했다.
- 회원 관리, 회원 목록, 마이페이지, 작업 이력, 상태별 라운드 화면의 보조 설명 문구를 제거했다.
- 일정에서 라운딩 생성 카드의 중복 안내 문구를 줄였다.
- 빈 상태에서 같은 의미를 반복하는 보조 문구를 제거했다.

## 유지한 것

- 오류 메시지와 보안/권한 관련 안내는 유지했다.
- 버튼명, 제목, 상태 배지는 유지해 사용자가 다음 행동을 이해할 수 있도록 했다.
- 기능 로직과 데이터 조회는 변경하지 않았다.

## 확인

- `/login`
- `/admin/members`
- `/admin/logs`
- `/admin/rounds/status`
- `/members`
- `/mypage`
- `/schedule`

위 화면에서 안내 문구가 줄었지만 주요 행동이 자연스럽게 이해되는지 확인한다.
