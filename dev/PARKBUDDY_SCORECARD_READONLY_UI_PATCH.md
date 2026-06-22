# ParkBuddy Scorecard Read-only UI Patch

## Purpose

This patch adds the first scorecard screen for ParkBuddy after the `round_hole_scores` migration.

The goal is to introduce the scorecard view safely before implementing write/save actions.

## Added Route

```text
/scores/[roundId]/scorecard
```

## Added Files

```text
src/app/(app)/scores/[roundId]/scorecard/page.tsx
src/app/(app)/scores/[roundId]/scorecard/ScorecardTabs.tsx
dev/PARKBUDDY_SCORECARD_READONLY_UI_PATCH.md
```

## Data Sources

The page follows the current official ParkBuddy data flow:

```text
Official round: rounds
Official participants: round_participants
Official groups: round_groups / round_group_members
Hole-level source: round_hole_scores
Official final score: round_scores
```

## UX Rules Implemented

### Summary Tab

The summary tab shows:

- Rounding date
- Park golf course name
- Logged-in member's assigned group
- Group selector
- Four member dropdown slots

The four dropdown slots are populated from the currently selected group.
Their default values come from the existing group assignment order.

### A/B/C/D Course Tabs

Course tabs do not have member dropdowns.
They follow the four-member order selected on the summary tab.

This matches the required behavior:

```text
집계표에서 멤버 순서 결정
→ A/B/C/D 코스 탭은 같은 멤버 순서를 그대로 표시
```

## Scope

This is a read-only first implementation.

It does not yet include:

- Score input fields
- Save action
- Scorekeeper token links
- round_scores aggregation update
- Operator all-scorecard review screen

## Next Recommended Step

After this page passes local verification and visual QA, the next step is to add a write action for `round_hole_scores` with admin-only permissions first.
