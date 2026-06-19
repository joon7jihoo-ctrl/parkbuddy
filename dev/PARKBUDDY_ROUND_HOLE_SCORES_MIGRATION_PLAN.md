# ParkBuddy round_hole_scores Migration Plan

## Decision

Use a new `round_hole_scores` table for the upcoming scorecard feature.

Do not reuse the existing `hole_scores` table for the new scorecard flow.

## Evidence from Production Schema Inspection

### Row Counts

Current production row counts showed:

```text
hole_scores,0
round_players,0
round_scores,37
round_participants,77
round_groups,16
round_group_members,61
```

This means the active production flow already uses:

- `round_participants` for confirmed participants
- `round_groups` and `round_group_members` for pairing / grouping
- `round_scores` for official final score records

The legacy tables `hole_scores` and `round_players` are currently unused in production data.

### Foreign Key Result

The schema inspection showed:

```text
hole_scores.round_player_id -> round_players.id
```

This confirms that the existing `hole_scores` table is tied to the legacy `round_players` structure.

The current official ParkBuddy flow is no longer `round_players` based, so using `hole_scores` would reintroduce a conflicting score source.

## Final Data Source Rule

Keep these official data rules:

```text
Official participants = round_participants
Official groups = round_groups / round_group_members
Official final scores = round_scores
Hole-level scorecard entries = round_hole_scores
```

## Recommended New Table

Create a new table:

```text
round_hole_scores
```

Purpose:

- Store hole-level scorecard inputs for A/B/C/D courses.
- Use current confirmed participant and group structures.
- Aggregate into `round_scores` as the official final score source.

## Recommended Columns

```text
id uuid primary key default gen_random_uuid()
round_id uuid not null references rounds(id) on delete cascade
round_group_id uuid not null references round_groups(id) on delete cascade
member_id uuid not null references members(id) on delete cascade
course_code text not null check (course_code in ('A', 'B', 'C', 'D'))
hole_no integer not null check (hole_no between 1 and 9)
distance_m integer null check (distance_m is null or distance_m > 0)
par integer not null default 3 check (par > 0)
strokes integer null check (strokes is null or strokes > 0)
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
updated_by uuid null references members(id) on delete set null
```

## Recommended Unique Constraint

Each member should have at most one score per round, group, course, and hole.

```text
unique(round_id, round_group_id, member_id, course_code, hole_no)
```

## Required Validation Rule

Application and/or RPC logic must ensure:

```text
round_group_id belongs to round_id
member_id is in round_participants for round_id
member_id is in round_group_members for round_group_id
```

This validation is important because PostgreSQL cannot enforce this entire cross-table relationship with a simple foreign key alone.

## RLS Direction

Enable RLS on `round_hole_scores`.

Initial safe policy direction:

- Authenticated users can read scorecards.
- Operators/admins can insert, update, and delete all scorecard entries.
- A future scorekeeper-specific permission model can narrow edit rights by assigned group.

Do not allow anonymous unrestricted score editing.

## Aggregation Direction

The scorecard feature should calculate totals from:

```text
round_hole_scores
```

Then update or upsert official totals into:

```text
round_scores
```

This keeps My Page, score detail, averages, best score, and final scoreboard aligned with the existing official score source.

## UI Dependency

The scorecard UI should use:

- Group selector from `round_groups`
- Group members from `round_group_members`
- Confirmed participants from `round_participants`
- Hole scores from `round_hole_scores`
- Final scoreboard from `round_scores`

## Scorecard Member Order Rule

The `집계표` tab decides the displayed member order.

- The 4 member boxes next to the course labels in the summary table are dropdowns.
- Default values come from the current `round_group_members.position` order.
- A/B/C/D course tabs follow the selected order from the summary tab.
- A/B/C/D course tabs do not have separate member dropdowns.

## Development Phases

### Phase 1: Migration Draft

Create `round_hole_scores` with RLS and indexes.

### Phase 2: Read Model

Build a server-side query that loads:

- round info
- group list
- selected group members
- existing hole scores
- official final scores

### Phase 3: Scorecard Input UI

Build:

```text
/scores/[roundId]/scorecard
```

Tabs:

```text
집계표 | A코스 | B코스 | C코스 | D코스
```

### Phase 4: Save Flow

Implement save action/RPC for hole-level scores.

### Phase 5: Aggregation

Update `round_scores` from hole-level totals.

### Phase 6: Operator Review

Build:

```text
/admin/rounds/[roundId]/scorecards
```

Operators can view all groups and completion status.

## Non-goals for the First Migration

Do not implement yet:

- Kakao API integration
- Anonymous public edit tokens
- PDF export
- Print layout
- Realtime collaborative editing
- Offline score entry

## Recommendation

Proceed with a new `round_hole_scores` migration rather than reusing `hole_scores`.

This keeps the scorecard feature aligned with the current production data model and avoids reviving the legacy `round_players` path.
