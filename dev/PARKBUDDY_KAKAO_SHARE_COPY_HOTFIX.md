# ParkBuddy Kakao Share Copy Hotfix

## Summary

This hotfix repairs the Kakao attendance share copy implementation on the schedule page.

## Fixed

- Restored broken `CopyButton` JSX caused by Windows PowerShell Korean encoding issues.
- Replaced visible Korean labels in JSX with Unicode escape string literals to avoid future mojibake.
- Ensured `attendanceUrl` and `kakaoAttendanceMessage` are declared inside each event card.
- Preserved the intended first version: copy KakaoTalk announcement text and attendance link manually.

## Scope

Changed files:

- `src/app/(app)/schedule/page.tsx`
- `dev/PARKBUDDY_KAKAO_SHARE_COPY_HOTFIX.md`

## Notes

This patch does not integrate Kakao API. It keeps the safer copy-to-clipboard flow for operators.
