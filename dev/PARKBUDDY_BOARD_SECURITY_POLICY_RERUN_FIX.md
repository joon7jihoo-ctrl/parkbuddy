# ParkBuddy Board Security Policy Re-run Fix

## Issue

Supabase SQL Editor failed with:

```text
ERROR: 42710: policy "members can read allowed club posts" for table "posts" already exists
```

## Cause

The board security SQL dropped legacy policy names, but did not drop every current policy name before recreating policies. PostgreSQL does not support `CREATE POLICY IF NOT EXISTS`, so re-running the SQL can fail when a policy already exists.

## Fix

Updated both SQL files to drop all legacy and current policy names before `CREATE POLICY` statements:

- `supabase/parkbuddy_board_private_security.sql`
- `supabase/migrations/0021_board_private_security.sql`

Covered policies:

- `members can read allowed club posts`
- `members can read allowed post attachments`
- `members can read allowed post images`
- `authors or admins can upload post images`

## Next Steps

1. Copy the updated files into the project.
2. Re-run `supabase/parkbuddy_board_private_security.sql` in Supabase SQL Editor.
3. Re-run `dev/PARKBUDDY_BOARD_SECURITY_SQL_CHECK.sql`.
4. Confirm every check returns `PASS`.
5. Run `npm run verify` locally.
