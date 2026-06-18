# PARKBUDDY_OPERATOR_DEV_STATUS

## Latest Update

- Hotfix: Kakao OAuth redirect URL stabilization.
- Kakao login button now builds an absolute `/auth/callback` URL from `window.location.origin`.
- OAuth redirect is assigned explicitly from the Supabase returned URL to reduce browser/Supabase redirect ambiguity.

## Verify

```powershell
npm run verify
npm run dev
```

Check:

```text
http://localhost:3000/login
https://parkbuddy-five.vercel.app/login
```

The callback must return to `/auth/callback`, not to the Supabase project domain path.
