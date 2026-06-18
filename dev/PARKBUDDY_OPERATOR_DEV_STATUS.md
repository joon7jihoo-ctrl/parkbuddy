# ParkBuddy Operator Dev Status

## 현재 작업

- 작업명: `PARKBUDDY_SIMPLE_UX_COPY_CLEANUP_V2`
- 목적: 화면의 반복 안내 문구를 추가로 제거하고, 명칭 혼선을 줄여 사용자 경험을 더 단순하게 만든다.

## 이번 변경 파일

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
- `dev/PARKBUDDY_SIMPLE_UX_COPY_CLEANUP_V2.md`
- `dev/PARKBUDDY_OPERATOR_DEV_STATUS.md`

## 확인 필요

1. 홈, 게시판 외 다른 화면에서도 불필요한 설명 문구가 줄었는지 확인한다.
2. `/admin/rounds`, `/admin/members`, `/members`, `/mypage`, `/schedule`, `/scores` 화면이 설명 없이도 자연스러운지 확인한다.
3. `/admin/rounds/[id]/participants`에서 선택 인원 수가 정상 표시되는지 확인한다.
4. 로그인 화면이 너무 불친절하지 않은지 확인한다.

## 다음 후보 작업

- 라운딩 조 편성 알고리즘 결과 검증
- 스코어 입력/결과 화면의 불필요한 문구 추가 정리
- 모바일 화면별 카드 높이 추가 점검
