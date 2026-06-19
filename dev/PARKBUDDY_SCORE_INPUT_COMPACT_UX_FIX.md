# ParkBuddy Score Input Compact UX Fix

## Purpose

스코어 입력 화면에서 중복 설명을 줄이고, 모바일 현장 입력 중 `미입력만 보기` 상태에서 한 자리 입력 직후 참가자 카드가 사라지는 문제를 수정한다.

## Changed Files

- `src/app/(app)/admin/rounds/[id]/scores/page.tsx`
- `src/components/admin/round-score-input-form.tsx`

## Changes

1. 스코어 입력 상단의 `조 편성`, `라운드 목록` 버튼을 삭제했다.
2. 모바일 요약 카드의 `일자`, `참가`, `입력` 글씨 크기와 굵기를 키웠다.
3. `입력` 요약 숫자가 클라이언트 입력 상태에 맞춰 실시간 변경되도록 요약 카드를 스코어 입력 폼 안으로 이동했다.
4. `미입력만 보기` 버튼을 모바일 요약 카드 아래에 배치했다.
5. `미입력만 보기` / `전체 보기` 버튼에서 인원수 카운트를 제거했다.
6. 참가자 스코어 제목/설명 문구, 입력 진행률 카드, 미입력 안내 문구를 삭제했다.
7. 참가자별 메모 입력 UI를 삭제했다.
8. 기존 메모 값은 숨김 input으로 보존하여 저장 시 의도치 않게 삭제되지 않도록 했다.
9. `미입력만 보기` 상태에서 숫자 입력 중인 참가자는 포커스가 유지되는 동안 목록에 남도록 수정했다.
10. 입력 중인 참가자는 숨김 input 중복 생성 대상에서 제외하여 같은 회원 스코어가 중복 submit되지 않도록 했다.

## Verification

```powershell
npm run verify
```

Result:

- Security smoke test passed
- ESLint passed
- TypeScript typecheck passed

## Manual Check

1. `/admin/rounds/[id]/scores` 접속
2. 상단 `조 편성`, `라운드 목록` 버튼이 사라졌는지 확인
3. 모바일 요약 카드의 글씨가 이전보다 커졌는지 확인
4. `미입력만 보기` 선택 후 총 타수에 `60`을 입력해도 첫 자리 `6` 입력 순간 카드가 사라지지 않는지 확인
5. 저장 후 실제 점수가 `60`으로 저장되는지 확인
6. 중복 설명, 입력 진행률 카드, 메모 입력 UI가 사라졌는지 확인
