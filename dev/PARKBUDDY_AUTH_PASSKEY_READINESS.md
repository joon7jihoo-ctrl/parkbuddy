# ParkBuddy 인증 고도화 준비 점검 - 패스키 + 초대 코드

작성일: 2026-06-16
작업명: `PARKBUDDY_AUTH_PASSKEY_READINESS`

## 1. 결론

ParkBuddy의 최종 인증 방향은 다음과 같이 유지한다.

```text
첫 접속: 카카오 또는 운영자 발급 초대 코드
다음 접속: 지문 / Face ID / 기기 PIN 기반 패스키
비상 복구: 운영자 초대 코드 재발급
SMS OTP: 비용 문제로 제외
이메일 매직링크: 주 로그인 제외, 필요 시 관리자/비상 복구용만 검토
```

다만 Supabase native passkey를 바로 붙이기 전에 중요한 제약이 확인되었다.

```text
Supabase native passkey 등록은 기존 confirmed non-anonymous 사용자에게 필요하다.
SSO 사용자, 즉 Kakao OAuth 사용자에게는 passkey 등록 제한이 있다.
```

따라서 현재 Kakao OAuth 계정으로 로그인한 사용자가 곧바로 Supabase native passkey를 등록하는 흐름은 바로 적용하지 않는다.

## 2. 확인한 Supabase Passkey 조건

현재 ParkBuddy 패키지 버전은 다음 조건을 만족한다.

```text
@supabase/supabase-js: ^2.108.1
필요 조건: v2.105.0 이상
```

하지만 실제 사용에는 아래 조건이 필요하다.

```text
1. Supabase Dashboard에서 Passkeys 활성화
2. WebAuthn RP Display Name 설정
3. WebAuthn RP ID 설정
4. WebAuthn RP Origins 설정
5. 클라이언트 생성 시 auth.experimental.passkey = true opt-in
6. 사용자는 confirmed non-anonymous 상태여야 함
7. RP ID는 안정적인 운영 도메인으로 결정해야 함
```

## 3. 가장 중요한 제약

Supabase 문서 기준으로 passkey는 아직 experimental이며, 클라이언트에서 명시적으로 opt-in해야 한다.

또한 passkey 등록은 이미 로그인된 confirmed non-anonymous 사용자에게 필요하고, SSO 사용자는 passkey 등록이 제한된다.

ParkBuddy 현재 첫 로그인은 Kakao OAuth 기반이다. Kakao OAuth는 SSO 계정이므로 native Supabase passkey 등록 흐름과 바로 맞지 않는다.

## 4. ParkBuddy에 맞는 수정된 인증 설계

기존 아이디어:

```text
Kakao 로그인
→ 회원 연결
→ passkey 등록
```

문제:

```text
Kakao OAuth 사용자는 Supabase native passkey 등록 제한에 걸릴 수 있음
```

수정된 권장 구조:

```text
A. 단기 운영 안정화
- Kakao 로그인 유지
- 로그인 실패 시 안내 추가
- 운영자 초대 코드 기반 백업 첫 접속 설계

B. 패스키 도입 준비
- 운영 도메인 확정
- Supabase Passkeys 활성화 가능 여부 확인
- SSO 제약을 피할 non-SSO 계정 생성/연결 방식 결정

C. 실제 패스키 도입
- 초대 코드 또는 운영자 발급 계정으로 confirmed non-anonymous 사용자 확보
- 로그인 후 패스키 등록 UX 제공
- 다음 로그인부터 passkey 사용
```

## 5. 초대 코드 기반 첫 접속의 역할

초대 코드는 단순한 안내 코드가 아니라, Kakao가 실패하는 사용자를 위한 첫 접속 대체 경로다.

다만 초대 코드만으로 Supabase Auth 세션을 만드는 것은 별도 설계가 필요하다. ParkBuddy는 RLS와 `auth.uid()` 기반 흐름을 쓰고 있으므로, 초대 코드 확인 후에도 최종적으로는 Supabase Auth 사용자와 `members.user_id`가 연결되어야 한다.

가능한 구현 후보는 다음과 같다.

### 후보 1. 운영자 발급 로그인 ID + 임시 PIN

```text
운영자가 회원별 로그인 ID/PIN 발급
사용자는 첫 접속 때 ID/PIN 입력
성공 후 비밀번호 변경 또는 패스키 등록 유도
```

장점:

```text
SMS 비용 없음
이메일 매직링크 불필요
연령대 높은 사용자에게 설명 가능
confirmed non-anonymous 계정 확보에 유리
```

주의:

```text
PIN 정책, 실패 횟수 제한, 재발급, 초기 PIN 만료가 필요
```

### 후보 2. 초대 코드 + 관리자 승인형 연결

```text
사용자가 이름/초대 코드 입력
운영자가 연결 승인
승인 후 다음 접속 수단 설정
```

장점:

```text
오등록 위험 감소
운영자 통제 가능
```

주의:

```text
즉시 로그인 경험은 떨어짐
```

### 후보 3. 별도 custom WebAuthn 구현

```text
Supabase native passkey 대신 자체 WebAuthn 테이블/서버 액션 구현
```

장점:

```text
SSO 제한을 우회할 수 있음
```

주의:

```text
보안 구현 난도가 높고 RLS/Auth 연동이 복잡함
현재 단계에서는 비추천
```

## 6. 데브 추천

다음 실제 개발은 native passkey 버튼을 바로 붙이는 것이 아니라, 아래 순서로 진행한다.

```text
1. 로그인 화면에 모바일 가용성 안내 추가
2. 운영자 발급 초대 코드/로그인 ID 정책 설계
3. Supabase Auth와 연결 가능한 non-SSO 첫 접속 흐름 결정
4. 그 다음 passkey 등록/로그인 구현
```

## 7. 다음 작업명

```text
PARKBUDDY_AUTH_INVITE_CODE_ACCOUNT_FLOW
```

목표:

```text
Kakao OAuth가 실패하는 사용자를 위해 SMS/이메일 비용 없이 운영자가 발급한 초대 코드 또는 로그인 ID로 첫 접속할 수 있는 구조를 설계하고 구현한다.
```

구현 전 결정해야 할 질문:

```text
1. 회원별 로그인 ID를 운영자가 발급할 것인가?
2. 초기 PIN 또는 초대 코드는 몇 자리로 할 것인가?
3. 유효기간과 실패 횟수 제한은 어떻게 할 것인가?
4. 로그인 성공 후 패스키 등록을 강하게 유도할 것인가, 선택으로 둘 것인가?
5. 장기 운영 도메인은 parkbuddy-five.vercel.app로 갈 것인가, 커스텀 도메인을 붙일 것인가?
```

## 8. 이번 단계에서 코드 구현을 보류한 이유

패스키는 RP ID와 계정 타입에 강하게 묶인다. 지금 native passkey API를 로그인 화면에 바로 연결하면 다음 문제가 생길 수 있다.

```text
- Supabase Dashboard passkey 미활성화 시 로그인 실패
- Kakao SSO 사용자 passkey 등록 제한
- 운영 도메인 변경 시 기존 passkey 무효화
- 사용자가 passkey를 등록할 수 없는 상태에서 버튼만 노출되는 UX 문제
```

따라서 이번 단계는 문서화와 기술 제약 확인으로 마무리하고, 다음 단계에서 초대 코드/운영자 발급 계정 흐름부터 구현한다.
