# ParkBuddy Scorecard Compact UI Hotfix

## Purpose

This patch tightens the first read-only scorecard screen based on mobile review feedback.

## Changes

- Removed the round title and course name from the page-level scorecard title area.
- Removed the explanatory text from the scorecard card.
- Moved date, park golf course name, my assigned group, and group selector into the compact scorecard control card.
- Made the scorecard control card sticky.
- Kept the scorecard control card laid out horizontally on mobile.
- Increased the `내 조` label to match the group selector font weight and size.
- Removed separate member picker cards from the summary tab.
- Moved member selection directly into the four member header cells next to `구분`.
- Reduced table spacing so the summary table can fit mobile width without horizontal scrolling.
- Removed redundant course/group heading text from A/B/C/D tabs.
- Reduced course table spacing for a denser mobile view.

## Scope

This patch only changes the read-only scorecard UI layout. It does not add score editing, save actions, aggregation logic, or permission changes.

## Next Step

After this patch passes verification and mobile review, proceed to connect scorecard navigation from round/detail screens or add score input save actions in a separate small patch.
