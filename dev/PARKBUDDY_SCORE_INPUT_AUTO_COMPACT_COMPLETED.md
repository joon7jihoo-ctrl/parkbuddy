# ParkBuddy Score Input Auto Compact Completed Cards

## Date
2026-06-15

## Goal
Reduce mobile scroll burden by removing the separate completed-collapse toggle button and making completed score cards compact by default.

## Scope
- `src/components/admin/round-score-input-form.tsx`
- `dev/PARKBUDDY_OPERATOR_DEV_STATUS.md`

## Changes
- Removed the `완료자 접기/펼치기` button.
- Completed participants are now automatically displayed as compact summary cards.
- Selecting a compact completed card expands only that participant back into editable inputs.
- Existing hidden inputs remain in compact cards so saved values are preserved.
- Missing participants remain fully editable.
- `미입력만 보기` behavior remains unchanged.

## Verification
- `npm run verify` passed.
- Security smoke test passed.
- ESLint passed.
- TypeScript check passed.

## Manual Check
1. Open `/admin/rounds/[id]/scores`.
2. Confirm completed participants appear as compact cards without a separate toggle button.
3. Select a completed card and confirm it expands into editable inputs.
4. Edit or leave the score and save.
5. Confirm compact cards preserve hidden score values when saving.
