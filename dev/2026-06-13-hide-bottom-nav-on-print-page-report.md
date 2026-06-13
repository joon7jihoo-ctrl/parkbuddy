# ParkBuddy development report - hide bottom navigation on print result page

Date: 2026-06-13

## Summary

The print result page should not show the mobile bottom navigation such as Home, Members, and Schedule.

## Changed files

- src/app/(app)/admin/rounds/[id]/results/print/page.tsx
- src/app/globals.css
- dev/2026-06-13-hide-bottom-nav-on-print-page-report.md

## Verification

- npm run verify
- Open /admin/rounds/[id]/results/print
- Confirm the bottom navigation is hidden on the print page