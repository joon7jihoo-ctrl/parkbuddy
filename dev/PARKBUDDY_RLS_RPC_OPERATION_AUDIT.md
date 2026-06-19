# ParkBuddy RLS/RPC 운영 보안 점검

## 목적

운영 전 Supabase 보안을 반복 점검하기 위한 기준 문서입니다. 이번 단계는 화면 기능 추가가 아니라, 운영 DB의 RLS 정책과 RPC 권한을 안전하게 확인하는 데 목적이 있습니다.

## 추가된 파일

```text
supabase/PARKBUDDY_RLS_RPC_OPERATION_AUDIT.sql
scripts/rls-policy-audit.mjs
package.json
```

## 로컬 점검

```bash
npm run security:scan
```

`security:scan`은 다음 두 가지를 함께 실행합니다.

```text
1. scripts/security-smoke-test.mjs
2. scripts/rls-policy-audit.mjs
```

`rls-policy-audit.mjs`는 `supabase/migrations`의 SQL 파일을 읽어 핵심 테이블에 RLS 활성화와 정책 생성이 함께 들어 있는지 확인합니다.

## Supabase 운영 DB 점검

Supabase Dashboard의 SQL Editor에서 아래 파일 내용을 실행합니다.

```text
supabase/PARKBUDDY_RLS_RPC_OPERATION_AUDIT.sql
```

이 SQL은 읽기 전용이며 다음을 확인합니다.

```text
1. 핵심 테이블 RLS 활성화 여부
2. 핵심 테이블별 정책 목록
3. anon/public에 과도한 쓰기 권한이 있는지
4. authenticated 권한 목록
5. SECURITY DEFINER 함수와 search_path 설정
6. 주요 RPC 실행 권한
7. 운영 전 빠른 판정표
```

## 운영 전 반드시 확인할 핵심 테이블

```text
members
member_action_logs
rounds
round_participants
round_pairings
round_scores
events
event_votes
posts
post_attachments
```

## 판정 기준

### 통과 기준

- 핵심 테이블은 RLS가 켜져 있어야 합니다.
- 핵심 테이블은 최소 1개 이상의 정책이 있어야 합니다.
- `anon` 또는 `public`에 INSERT/UPDATE/DELETE 권한이 직접 열려 있으면 안 됩니다.
- SECURITY DEFINER 함수는 내부에서 `auth.uid()`와 운영자 권한을 확인해야 합니다.
- 초대 코드 계정 연결 RPC는 필요한 범위만 허용해야 합니다.

### 주의 기준

- `authenticated` 권한이 넓게 열려 있더라도 RLS 정책으로 제한된다면 정상일 수 있습니다.
- SECURITY DEFINER 함수는 존재 자체가 문제가 아니라, 내부 권한 검증이 핵심입니다.
- 운영 DB와 로컬 migration 상태가 다를 수 있으므로 Supabase SQL Editor 점검을 최종 기준으로 삼습니다.

## 다음 단계 권장

1. Supabase SQL Editor에서 운영 점검 SQL 실행
2. 결과 캡처 또는 CSV 저장
3. `CHECK_RLS_OFF`, `CHECK_POLICY_MISSING`, anon/public 쓰기 권한이 나오면 운영 전 수정
4. `npm run verify` 통과 확인
5. 모바일 실기기 QA 진행
