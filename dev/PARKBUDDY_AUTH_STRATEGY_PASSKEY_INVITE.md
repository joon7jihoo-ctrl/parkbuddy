# ParkBuddy 인증 전략: 첫 연결은 카카오/초대 코드, 이후는 패스키

작성일: 2026-06-16
대상: ParkBuddy 운영 배포 인증 전략
현재 운영 도메인: `https://parkbuddy-five.vercel.app`

---

## 1. 결정 사항

ParkBuddy의 주 이용자는 모바일 환경에서 접속하는 파크골프 동호회 회원이며, 일부 사용자는 이메일 매직링크나 복잡한 브라우저 설정을 어려워할 수 있다. 또한 SMS OTP는 발송 비용이 발생하므로 주 로그인 수단에서 제외한다.

따라서 인증 전략은 다음 방향으로 정한다.

```text
첫 접속: 카카오 로그인 또는 운영자 발급 초대 코드
다음 접속: 지문 / Face ID / 기기 PIN 기반 패스키 로그인
보조 수단: 카카오 로그인 유지
비상 복구: 운영자 초대 코드 재발급, 필요 시 이메일은 관리자/비상 복구용으로만 검토
```

화면 문구에서는 `패스키`라는 기술 용어를 전면에 내세우기보다 다음처럼 표현한다.

```text
지문/Face ID로 로그인
이 기기에서 빠른 로그인 등록
```

---

## 2. 왜 이 방향인가?

### 2.1 카카오 로그인만으로는 가용성이 부족하다

모바일 데이터망, VPN, 프라이빗 DNS, iCloud 비공개 릴레이, 통신사 프록시 환경에서는 카카오 인증 중 네트워크 검증 오류가 발생할 수 있다. 같은 기기라도 PC와 동일한 Wi-Fi에서는 정상 접속되는 사례가 확인되었다.

카카오 인증 내부의 네트워크 검증은 ParkBuddy/Vercel/Supabase에서 초기화하거나 끌 수 있는 영역이 아니다. 따라서 카카오 로그인은 유지하되, 유일한 진입 수단으로 두면 운영 가용성이 떨어진다.

### 2.2 이메일 매직링크는 주 사용자층에 불편할 수 있다

이메일 매직링크는 SMS 비용이 없고 비밀번호도 필요 없지만, 사용자는 다음 과정을 거쳐야 한다.

```text
이메일 주소 입력
→ 메일 앱 열기
→ 메일 찾기
→ 링크 누르기
→ 다시 브라우저로 복귀
```

파크골프 이용자 연령대를 고려하면 주 로그인 수단으로는 불편할 가능성이 높다.

### 2.3 패스키는 모바일 웹앱 목표와 잘 맞는다

패스키는 WebAuthn 기반의 비밀번호 없는 로그인 방식이며, 사용자는 지문/Face ID/기기 PIN으로 인증한다. 모바일 앱과 가까운 사용 경험을 제공하고, SMS 비용이 없으며, 카카오 네트워크 문제에도 의존하지 않는다.

---

## 3. Supabase Passkey 적용 전 확인 사항

Supabase 공식 문서 기준으로 passkey 인증은 다음 특징을 가진다.

- WebAuthn 기반의 비밀번호 없는 인증이다.
- 사용자는 지문, Face ID, 기기 PIN, 보안 키 등으로 개인 키 소유를 증명한다.
- `@supabase/supabase-js` v2.105.0 이상이 필요하다.
- 현재 프로젝트는 `@supabase/supabase-js` `^2.108.1`이므로 버전 조건은 충족한다.
- Supabase client 생성 시 `auth.experimental.passkey = true` opt-in이 필요하다.
- Supabase Dashboard의 `Authentication → Passkeys`에서 passkey 인증을 켜야 한다.
- WebAuthn Relying Party ID는 보통 운영 도메인의 bare domain이어야 하며, 스킴/포트/경로를 포함하지 않는다.
- RP ID를 변경하면 기존 등록된 패스키를 사용할 수 없게 되므로, 본격 배포 전에 운영 도메인을 안정화해야 한다.
- Passkey 등록은 이미 로그인되어 있고 확인된 non-anonymous 사용자에게 필요하다.
- Anonymous 사용자는 passkey를 등록할 수 없다.

중요한 결론:

```text
초대 코드만으로 바로 passkey를 등록하려면 먼저 Supabase Auth 사용자 세션을 만들어야 한다.
```

즉, `초대 코드 → 바로 패스키 등록`은 단순 UI 작업이 아니라 `초대 코드로 어떤 방식의 Supabase Auth 세션을 만들 것인가`를 먼저 결정해야 한다.

---

## 4. 현재 ParkBuddy 인증 구조

현재 구현 상태는 다음과 같다.

```text
/login
- Kakao OAuth 로그인

/member-link
- 이미 로그인한 사용자가 이름/연락처/연결 코드로 members row를 auth.users와 연결

members
- user_id로 Supabase auth.users와 연결
- claim_code_hash / claim_code_expires_at / claimed_at 보유

claim_member_account RPC
- auth.uid()가 있는 사용자만 실행 가능
- 이름/연락처/연결 코드 검증
- 1회성 claim code 사용
```

현재의 연결 코드는 `로그인 후 회원 연결` 용도다. 즉, 카카오 등으로 이미 Supabase Auth 세션을 가진 사용자만 회원 연결을 할 수 있다.

따라서 카카오가 실패한 사용자를 위한 진짜 백업 경로를 만들려면 `로그인 전 초대 코드로 Auth 세션 생성`이 추가로 필요하다.

---

## 5. 권장 구현 흐름

### 5.1 최종 사용자 흐름

```text
첫 접속
1. 카카오로 시작하기
2. 카카오가 안 되면 초대 코드로 시작하기
3. 회원 프로필 연결 완료
4. 지문/Face ID 로그인 등록 안내

다음 접속
1. 지문/Face ID로 로그인
2. 실패/미등록 시 카카오 또는 초대 코드 사용
```

### 5.2 로그인 화면 우선순위

패스키 등록 전:

```text
[카카오로 시작하기]
카카오 로그인이 안 되나요?
[초대 코드로 시작하기]
```

패스키 등록 후:

```text
[지문/Face ID로 로그인]

다른 방법
[카카오로 로그인]
[초대 코드로 시작하기]
```

---

## 6. 초대 코드 백업 로그인 구현 선택지

### 선택지 A: 운영자 발급 로그인 ID + 임시 비밀번호

운영자가 회원에게 초기 로그인 정보를 전달한다.

```text
로그인 ID: 회원번호 또는 운영자가 지정한 ID
임시 비밀번호 또는 초대 코드: 1회성
```

서버 액션에서 Supabase Auth의 email/password 구조를 내부적으로 사용할 수 있다. 사용자에게는 이메일을 요구하지 않고 `회원번호 + 초대 코드`처럼 보이게 만들 수 있다.

장점:

- SMS 비용 없음
- 이메일 앱을 열 필요 없음
- Supabase Auth 세션과 RLS 흐름을 유지하기 쉬움
- 이후 passkey 등록이 가능해짐

주의:

- 내부 synthetic email 또는 login_id 매핑 전략이 필요하다.
- 초대 코드는 1회성/만료/실패 횟수 제한이 필요하다.
- 첫 로그인 후 반드시 패스키 등록을 유도하고 임시 비밀번호는 폐기 또는 회전해야 한다.

데브 추천: **가장 현실적인 방식**.

### 선택지 B: 초대 코드 전용 커스텀 세션

ParkBuddy 자체 세션 쿠키를 만들고 Supabase Auth를 우회한다.

장점:

- 이메일/비밀번호 구조가 필요 없다.

단점:

- 현재 Supabase RLS가 `auth.uid()`를 기준으로 설계되어 있으므로 앱 전체 보안 구조를 크게 바꿔야 한다.
- 구현/운영 리스크가 크다.

데브 추천: **비추천**.

### 선택지 C: 이메일 매직링크 백업

비용은 없지만 사용자 UX가 떨어진다.

데브 추천: **비상 복구용으로만 검토**.

---

## 7. 단계별 개발 계획

### 1단계: 인증 전략 문서화

작업명:

```text
PARKBUDDY_AUTH_STRATEGY_PASSKEY_INVITE
```

목표:

```text
첫 접속은 카카오 또는 초대 코드, 이후 접속은 패스키 중심으로 간다는 제품/기술 방향을 고정한다.
```

상태: 완료.

### 2단계: Passkey readiness 점검

작업명:

```text
PARKBUDDY_AUTH_PASSKEY_READINESS
```

작업:

```text
Supabase Dashboard Passkeys 활성화 여부 확인
Relying Party ID/Origins 결정
운영 도메인 고정 여부 판단
Supabase client experimental passkey opt-in 준비
/login에 passkey 버튼을 숨김/안전 상태로 추가할 수 있는지 검토
```

권장 RP 설정:

```text
RP Display Name: ParkBuddy
RP ID: parkbuddy-five.vercel.app 또는 향후 고정 커스텀 도메인
RP Origins: https://parkbuddy-five.vercel.app
```

주의: 커스텀 도메인을 쓸 계획이 있다면 passkey를 본격 배포하기 전에 도메인을 먼저 확정하는 것이 좋다.

### 3단계: 로그인 후 패스키 등록 UX

작업명:

```text
PARKBUDDY_AUTH_PASSKEY_ENROLLMENT
```

작업:

```text
로그인 성공 후 회원 연결이 완료된 사용자에게 패스키 등록 안내
/mypage 또는 /mypage/security에 “지문/Face ID 로그인 등록” 추가
등록 성공/취소/미지원 브라우저 안내
```

### 4단계: 패스키 로그인 버튼 추가

작업명:

```text
PARKBUDDY_AUTH_PASSKEY_LOGIN
```

작업:

```text
/login 상단에 “지문/Face ID로 로그인” 버튼 추가
실패 시 카카오/초대 코드 fallback 안내
미지원 브라우저에서는 버튼 숨김 또는 안내 표시
```

### 5단계: 초대 코드 기반 백업 첫 로그인

작업명:

```text
PARKBUDDY_AUTH_INVITE_CODE_FALLBACK
```

작업:

```text
운영자 회원 상세에서 로그인 초대 코드 발급/재발급
/login에 “초대 코드로 시작하기” 추가
초대 코드 검증 후 Supabase Auth 사용자 세션 생성
해당 auth user와 members row 연결
첫 연결 후 패스키 등록 유도
```

### 6단계: 카카오 로그인은 보조로 유지

작업:

```text
카카오 로그인 버튼 유지
모바일 데이터망 오류 가능성 안내는 작고 부드럽게 표시
사용자가 설정 변경을 강요받지 않도록 초대 코드/패스키 경로 제공
```

---

## 8. 다음 실제 개발 추천

바로 다음 작업은 코드를 크게 바꾸기보다 다음 순서가 안전하다.

```text
1. Supabase Passkeys Dashboard 설정 가능 여부 확인
2. 운영 도메인을 parkbuddy-five.vercel.app으로 유지할지, 커스텀 도메인을 먼저 붙일지 결정
3. PARKBUDDY_AUTH_PASSKEY_READINESS 작업으로 client opt-in과 안전한 UI 준비
4. 패스키 등록/로그인 최소 구현
5. 초대 코드 fallback 구현
```

다만 카카오 실패자를 위한 백업이 시급하다면, passkey보다 먼저 `초대 코드 기반 첫 로그인`의 Auth 세션 생성 설계를 확정해야 한다.

데브 추천 순서:

```text
1. PASSKEY_READINESS
2. PASSKEY_ENROLLMENT
3. PASSKEY_LOGIN
4. INVITE_CODE_FALLBACK
```

단, 운영 도메인이 아직 임시 Vercel 도메인이라면:

```text
1. 커스텀 도메인 결정
2. PASSKEY_READINESS
```

을 먼저 처리한다.
