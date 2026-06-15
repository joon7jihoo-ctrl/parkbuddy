# ParkBuddy Board Security Trigger Fix

Date: 2026-06-15

## Issue

Supabase verification CSV showed one failure:

- `trigger public.posts.prevent_post_privilege_escalation`: `FAIL missing`

The function `public.prevent_post_privilege_escalation()` existed in the SQL patch, but the trigger binding on `public.posts` was missing from the board-specific SQL files.

## Files updated

- `supabase/parkbuddy_board_private_security.sql`
- `supabase/migrations/0021_board_private_security.sql`

## Fix

Added an idempotent trigger creation block after the function definition:

- Drop existing trigger if present
- Create `prevent_post_privilege_escalation` trigger
- Run it `before update` on `public.posts`
- Execute `public.prevent_post_privilege_escalation()`

## Verification

Local verification passed:

```text
npm run verify
Security smoke test passed.
eslint . passed.
tsc --noEmit passed.
```

## Operator steps

1. Copy the updated files into the project.
2. Run `supabase/parkbuddy_board_private_security.sql` in Supabase SQL Editor again.
3. Run `dev/PARKBUDDY_BOARD_SECURITY_SQL_CHECK.sql` again.
4. Confirm all rows show `PASS`.
5. Run `npm run verify` locally.
6. Continue with `dev/PARKBUDDY_BOARD_SECURITY_SCREEN_CHECKLIST.md`.
