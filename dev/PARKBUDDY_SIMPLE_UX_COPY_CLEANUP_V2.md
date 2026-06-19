# PARKBUDDY_SIMPLE_UX_COPY_CLEANUP_V2

## 목적

ParkBuddy 화면에서 사용자가 이미 화면 구조로 이해할 수 있는 안내 문구를 줄이고, 같은 기능을 서로 다른 이름으로 부르는 표현을 줄인다.

## 변경 원칙

- `ParkBuddy` 브랜드명을 제외하고 화면 노출 영어는 계속 줄인다.
- 버튼, 카드, 목록에서 사용자가 이미 행동을 예측할 수 있는 설명은 제거한다.
- 같은 화면으로 이동하는 항목은 같은 명칭을 사용한다.
- 상태, 수량, 날짜처럼 실제 판단에 필요한 정보는 유지한다.

## 변경 파일

- `src/app/(app)/admin/logs/page.tsx`
- `src/app/(app)/admin/members/page.tsx`
- `src/app/(app)/admin/rounds/page.tsx`
- `src/app/(app)/admin/rounds/status/page.tsx`
- `src/app/(app)/admin/rounds/[id]/participants/page.tsx`
- `src/app/(app)/members/page.tsx`
- `src/app/(app)/mypage/page.tsx`
- `src/app/(app)/schedule/page.tsx`
- `src/app/(app)/scores/page.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/components/admin/participant-selection-enhancer.tsx`

## 적용 내용

- 관리자 작업 로그, 회원 관리, 라운드 목록, 상태별 라운드, 회원 목록, 마이페이지, 일정, 스코어 화면의 반복 안내 문구를 제거했다.
- 참가자 선택 화면의 안내 문구를 `선택 n명` 중심으로 줄였다.
- 회원 검색 영역의 보조 설명을 삭제하고 검색 입력과 선택 수만 남겼다.
- 로그인 화면의 긴 접근 권한 설명을 제거해 첫 화면을 더 단순하게 만들었다.

## 확인 항목

1. 각 화면의 제목과 주요 버튼만으로 흐름이 자연스러운지 확인한다.
2. 불필요한 설명 삭제 후에도 사용자가 다음 행동을 이해할 수 있는지 확인한다.
3. 참가자 선택 수가 정상 갱신되는지 확인한다.
4. 모바일에서 화면 밀도가 더 좋아졌는지 확인한다.
