# PARKBUDDY_AUTH_KAKAO_REDIRECT_HOTFIX

## 목적

Kakao OAuth 이후 브라우저가 Supabase 프로젝트 URL 아래의 잘못된 경로로 이동하는 문제를 방어한다.

잘못된 예:

```text
https://jefbokflyuywzjotwmhn.supabase.co/parkbuddy-five.vercel.app?code=...
```

정상 콜백:

```text
https://parkbuddy-five.vercel.app/auth/callback?code=...
http://localhost:3000/auth/callback?code=...
```

## 변경

- `src/components/auth/kakao-login-button.tsx`
  - 현재 브라우저 origin 기준으로 `/auth/callback` 절대 URL을 생성한다.
  - `http:`/`https:` 프로토콜만 허용한다.
  - Supabase가 반환한 OAuth URL을 명시적으로 `window.location.assign()`으로 이동시킨다.
  - 중복 클릭 방지를 위해 로딩 상태를 추가한다.

## 운영 확인 필요

Supabase Dashboard의 Auth URL 설정은 아래처럼 유지해야 한다.

```text
Site URL: https://parkbuddy-five.vercel.app
Redirect URLs:
- https://parkbuddy-five.vercel.app/auth/callback
- http://localhost:3000/auth/callback
```

와일드카드를 사용할 경우:

```text
https://parkbuddy-five.vercel.app/**
http://localhost:3000/**
```

`parkbuddy-five.vercel.app`처럼 `https://`가 빠진 값은 사용하지 않는다.
