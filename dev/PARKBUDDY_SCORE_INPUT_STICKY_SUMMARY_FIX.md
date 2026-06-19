# ParkBuddy Score Input Sticky Summary Fix

## Purpose

Make the score input screen easier to operate on mobile after the soft motion fix.

This step keeps the recently approved score-card layout unchanged and only improves the summary/action area density.

## Scope

Changed file:

- `src/components/admin/round-score-input-form.tsx`
- `dev/PARKBUDDY_SCORE_INPUT_STICKY_SUMMARY_FIX.md`
- `dev/PARKBUDDY_OPERATOR_DEV_STATUS.md`

## Changes

- Reduced vertical spacing in the score input form on mobile.
- Made the summary area sticky on mobile so the operator can keep seeing:
  - date
  - participant count
  - entered count
  - missing-only toggle
- Kept the summary area static on tablet/desktop to avoid unnecessary fixed UI.
- Reduced small summary-card padding on mobile.
- Preserved 44px minimum touch target for the missing-only toggle.
- Did not change score save logic, Supabase logic, board security, or member search logic.

## Verification

Command:

```text
npm run verify
```

Result:

```text
Security smoke test passed
eslint passed
typecheck passed
```

## Manual QA checklist

1. Open `/admin/rounds/[id]/scores` on mobile width.
2. Scroll down the participant score cards.
3. Confirm the date/participant/entered/missing-only summary remains visible near the top.
4. Confirm the bottom save button remains visible and does not overlap input fields in a broken way.
5. Confirm tablet/desktop layout remains the same as the approved previous screen.
6. Enter scores and confirm the entered count changes immediately.
7. Toggle missing-only view and confirm hidden completed participants are still saved correctly.
