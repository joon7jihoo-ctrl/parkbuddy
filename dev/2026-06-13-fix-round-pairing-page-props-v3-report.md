ParkBuddy development report - fix round pairing page props v3

Date: 2026-06-13

Changed files:
- src/app/(app)/admin/rounds/[id]/pairings/page.tsx
- dev/2026-06-13-fix-round-pairing-page-props-v3-report.md

Summary:
Updated RoundPairingForm prop names in the pairings page.
This script avoids PowerShell here-strings to prevent parser errors.

Done criteria:
- npm run verify passes
- /admin/rounds opens
- pairings page opens
- pairings can be saved
