# ParkBuddy Auth Invite Code Account Flow

## 목적

카카오 로그인이 모바일 데이터망 또는 브라우저 보안 환경에서 실패해도 사용자가 ParkBuddy에 첫 접속할 수 있도록, 운영자 발급 초대 코드를 로그인 화면의 백업 진입점으로 추가한다.

## 이번 단계 범위

- 로그인 화면을 서버 컴포넌트 기반으로 재구성했다.
- 기존 카카오 OAuth 버튼은 클라이언트 컴포넌트로 분리했다.
- `/login?invite=1`에서 초대 코드 입력 폼을 보여준다.
- 초대 코드 흐름은 다음 값을 입력받는다.
  - 이름
  - 연락처
  - 초대 코드
- 로그인 세션이 없는 사용자는 Supabase anonymous sign-in으로 임시 auth 세션을 만든 뒤 기존 `claim_member_account` RPC를 사용해 회원 row와 연결한다.
- 기존 `claim_member_account`의 보안 조건을 그대로 사용한다.
  - 회원 이름 일치
  - 연락처 정규화 후 일치
  - 코드 해시 일치
  - 코드 만료 확인
  - 1회 사용 후 폐기
  - 이미 연결된 회원 중복 연결 방지

## 변경 파일

- `src/app/(auth)/login/page.tsx`
- `src/components/auth/kakao-login-button.tsx`
- `dev/PARKBUDDY_AUTH_INVITE_CODE_ACCOUNT_FLOW.md`
- `dev/PARKBUDDY_OPERATOR_DEV_STATUS.md`

## Supabase 설정 필요

이 흐름은 Supabase Auth의 anonymous sign-in을 사용한다. 운영 환경에서 테스트하기 전에 Supabase Dashboard에서 anonymous sign-in을 켜야 한다.

권장 확인 경로:

1. Supabase Dashboard 접속
2. Authentication 설정 확인
3. Anonymous sign-ins 활성화
4. 기존 `claim_member_account` RPC가 배포되어 있는지 확인
5. 회원 관리 화면에서 연결 코드 발급 또는 재발급

## 사용자 UX

기본 화면:

```text
카카오로 시작하기
초대 코드로 시작하기
```

초대 코드 화면:

```text
이름
연락처
초대 코드
ParkBuddy 시작하기
```

하단 안내:

```text
카카오 로그인이 모바일 데이터망에서 실패하면 초대 코드로 시작해 주세요.
초대 코드는 동호회 운영진이 회원 관리 화면에서 발급할 수 있습니다.
```

## 보안 메모

- 초대 코드는 평문 저장하지 않고 기존 `claim_code_hash`와 `crypt()` 비교를 사용한다.
- 코드 재사용은 기존 RPC에서 `claim_code_hash = null` 처리로 막는다.
- 로그인 화면에서 직접 `member_id`, `club_id`, `user_id`를 받지 않는다.
- anonymous session은 백업 첫 접속용이다. 장기적으로는 passkey 또는 운영자 재발급 흐름과 함께 고도화한다.

## 검증 결과

```text
npm run verify
```

결과:

```text
Security smoke test passed.
eslint passed.
tsc --noEmit passed.
```

## 다음 단계

1. 운영 Supabase에서 Anonymous sign-ins 활성화 여부 확인
2. Vercel 배포 후 모바일 데이터망에서 `/login?invite=1` 직접 테스트
3. 초대 코드 첫 접속 성공 후 세션 유지 상태 확인
4. 이후 passkey 등록 UX 또는 운영자 재발급 UX로 확장
