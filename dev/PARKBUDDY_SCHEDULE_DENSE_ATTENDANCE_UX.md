# ParkBuddy 일정 참석 화면 Dense UX 개선

## 작업 목적

Vercel 운영 테스트 환경이 잡힌 뒤, 모바일에서 자주 확인할 수 있는 `/schedule` 화면의 스크롤 부담을 줄이고 참석 투표를 더 빠르게 처리하도록 개선했다.

## 변경 파일

```text
src/app/(app)/schedule/page.tsx
src/app/(app)/schedule/VoteButtons.tsx
dev/PARKBUDDY_SCHEDULE_DENSE_ATTENDANCE_UX.md
dev/PARKBUDDY_OPERATOR_DEV_STATUS.md
```

## 반영 내용

- 모바일에서 일정 요약 영역을 sticky 처리했다.
- 상단 요약은 `예정 / 내 참석 / 미선택` 3개 숫자로 정리했다.
- 일정 카드에서 일시/장소 2칸 정보 박스를 제거하고 제목 아래 한 줄 정보로 압축했다.
- 참석/미정/불참 집계와 투표 버튼은 3열 유지했다.
- 투표 버튼 설명 문구를 제거해 스크롤을 줄였다.
- 투표 버튼 터치 영역은 `min-h-11`로 유지해 44px 이상 터치 기준을 지켰다.
- 메모는 기본 노출 대신 `메모 보기` 접힘 영역으로 변경했다.
- 태블릿/데스크탑에서는 일정 카드가 2열로 배치되도록 유지했다.

## 검증

```text
npm run verify
```

통과 기준:

- security smoke test 통과
- eslint 통과
- typecheck 통과

## 화면 확인 체크리스트

1. 모바일 `/schedule`에서 상단 요약이 스크롤 중 고정되는지 확인한다.
2. 일정 카드가 이전보다 낮아져 한 화면에 더 많이 보이는지 확인한다.
3. 참석/미정/불참 버튼이 3열로 유지되는지 확인한다.
4. 각 버튼이 손가락으로 누르기 충분한 높이인지 확인한다.
5. 메모가 있는 일정은 `메모 보기`를 눌렀을 때만 내용이 펼쳐지는지 확인한다.
6. 태블릿/데스크탑에서 일정 카드가 2열로 자연스럽게 배치되는지 확인한다.
7. Vercel 배포 후 모바일/데스크탑 양쪽에서 동일하게 확인한다.

## 커밋 메시지 추천

```text
feat: improve schedule attendance dense ux
```
