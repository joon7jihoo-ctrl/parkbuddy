# ParkBuddy round_hole_scores Migration Apply Plan

## Purpose

This patch finalizes the database migration direction for the upcoming scorecard feature.

The new table is `round_hole_scores`.

It is intentionally separate from the legacy `hole_scores` table because production inspection showed:

```text
hole_scores.round_player_id -> round_players.id
round_players row_count = 0
hole_scores row_count = 0
round_participants row_count = 77
round_group_members row_count = 61
round_scores row_count = 37
```

## Data Source Rule

Keep these official data rules:

```text
Official participants = round_participants
Official groups = round_groups / round_group_members
Hole-level scorecard source = round_hole_scores
Official final scores = round_scores
```

## Files Added

```text
supabase/migrations/0023_round_hole_scores.sql
supabase/PARKBUDDY_ROUND_HOLE_SCORES_VERIFY.sql
```

## File Updated

```text
scripts/rls-policy-audit.mjs
```

The audit script should include `round_hole_scores` in the expected table list so `npm run verify` checks that the new migration has RLS and policies.

## Migration Security

The migration includes:

- RLS enabled on `round_hole_scores`
- Read policy for authenticated same-club active members
- Insert/update/delete policies for same-club admins
- No anonymous write policy
- Validation trigger to ensure:
  - `round_group_id` belongs to `round_id`
  - `member_id` is in `round_participants` for the round
  - `member_id` is in `round_group_members` for the group
  - `updated_by` belongs to the same club when provided

## Application Impact

This patch does not create scorecard UI yet.

Next app phase after migration:

```text
/scores/[roundId]/scorecard
```

with tabs:

```text
집계표 | A코스 | B코스 | C코스 | D코스
```

## Manual Supabase Step

After this patch is committed and reviewed, run this migration in Supabase SQL Editor or through the project's normal migration flow:

```text
supabase/migrations/0023_round_hole_scores.sql
```

Then run:

```text
supabase/PARKBUDDY_ROUND_HOLE_SCORES_VERIFY.sql
```

Expected result:

- `rowsecurity = true`
- four policies for select / insert / update / delete
- zero rows initially
- no anon write policy

## Next Development Step

After Supabase verification succeeds, implement the scorecard read model:

- Load round info
- Load group list
- Resolve logged-in member's group
- Load selected group members in position order
- Load existing `round_hole_scores`
- Prepare summary-tab member order defaults
