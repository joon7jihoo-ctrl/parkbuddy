# ParkBuddy Operator Dev Status

## Latest update

- 작업명: `PARKBUDDY_ROUND_PARTICIPANTS_MOBILE_DENSE_UX`
- 목적: 라운딩 참가자 관리 화면을 모바일에서 더 빠르게 검색/선택/저장할 수 있도록 compact하게 정리
- 변경 파일:
  - `src/app/(app)/admin/rounds/[id]/participants/page.tsx`
  - `src/components/admin/participant-selection-enhancer.tsx`
  - `dev/PARKBUDDY_ROUND_PARTICIPANTS_MOBILE_DENSE_UX.md`
  - `dev/PARKBUDDY_OPERATOR_DEV_STATUS.md`

## Current auth direction

- 첫 접속: 카카오 또는 운영자 발급 초대 코드
- 다음 접속: 패스키/지문/Face ID/기기 PIN 방향
- SMS OTP 제외
- 이메일 매직링크는 주 로그인 제외, 필요 시 비상 복구용만 검토

## Current data flow priority

1. `round_scores` 기준 스코어 기록/통계 통일 완료
2. 일정 투표 → 라운딩 생성 연결 완료
3. 라운딩 관리에서 연결된 일정 정보 표시 완료
4. 일정 → 라운딩 생성 검토 UX 완료
5. 라운딩 관리 모바일 Dense UX 진행 중

## Verification required

Run locally after applying the patch:

```powershell
npm run verify
```

Manual screen check:

- `/admin/rounds/[id]/participants`
- 모바일 폭에서 검색/선택/저장 UX 확인
- 선택 수 실시간 갱신 확인
