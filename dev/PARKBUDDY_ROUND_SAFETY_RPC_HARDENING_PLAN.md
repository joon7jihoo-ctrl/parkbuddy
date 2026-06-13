# ParkBuddy 라운드 삭제/복구 RPC 권한 보강 계획

## 1. 작업 목적

라운드 soft delete / restore 기능은 앱 UI에서 접근 차단을 마쳤더라도 DB RPC 권한이 넓게 열려 있으면 운영 안전성 측면에서 아쉬움이 남는다.

이번 단계의 목적은 Supabase PostgreSQL에서 다음 두 RPC의 실행 권한을 점검하고, 익명 사용자 또는 PUBLIC role의 불필요한 실행 권한을 줄이는 것이다.

- public.admin_soft_delete_round(uuid)
- public.admin_restore_round(uuid)

## 2. 현재 원칙

라운드 삭제/복구 RPC는 다음 조건을 모두 만족해야 한다.

1. 로그인하지 않은 사용자는 실행할 수 없어야 한다.
2. 로그인했더라도 active member가 아니면 실패해야 한다.
3. 같은 club의 라운드가 아니면 실패해야 한다.
4. admin role이 아니면 실패해야 한다.
5. 실제 삭제가 아니라 deleted_at 기반 soft delete로 처리해야 한다.
6. 참가자, 조 편성, 스코어, 결과 데이터는 삭제하지 않아야 한다.
7. 관리자 작업 로그가 남아야 한다.

## 3. 이번 패키지에 추가된 SQL

### 3.1 읽기 전용 점검 SQL

파일:

```text
supabase/parkbuddy_round_safety_rpc_permission_check.sql
```

역할:

- 두 RPC가 존재하는지 확인
- SECURITY DEFINER 여부 확인
- search_path 고정 여부 확인
- PUBLIC execute 권한 여부 확인
- anon execute 권한 여부 확인
- authenticated execute 권한 여부 확인

기대 결과:

```text
has_public_execute = false
has_anon_execute = false
has_authenticated_execute = true
security_definer = true
audit_result = PASS
```

### 3.2 권한 보강 SQL

파일:

```text
supabase/parkbuddy_harden_round_safety_rpc_permissions.sql
```

역할:

- PUBLIC 실행 권한 회수
- anon 실행 권한 회수
- authenticated 실행 권한 유지
- 함수 설명 comment 추가

이 SQL은 데이터를 변경하지 않는다. 함수 본문도 교체하지 않는다.

## 4. Supabase SQL Editor 실행 순서

1. 먼저 아래 파일을 실행한다.

```text
supabase/parkbuddy_round_safety_rpc_permission_check.sql
```

2. 결과에서 `has_public_execute` 또는 `has_anon_execute`가 `true`이면 아래 파일을 실행한다.

```text
supabase/parkbuddy_harden_round_safety_rpc_permissions.sql
```

3. 다시 점검 SQL을 실행한다.

```text
supabase/parkbuddy_round_safety_rpc_permission_check.sql
```

4. 최종 결과가 아래와 같으면 통과다.

```text
has_public_execute = false
has_anon_execute = false
has_authenticated_execute = true
audit_result = PASS
```

## 5. 앱 검증 기준

Supabase SQL 실행 후 로컬 앱에서 다음을 확인한다.

```powershell
npm run verify
```

화면 확인:

- 운영자 계정으로 라운드 삭제 가능
- 운영자 계정으로 삭제된 라운드 복구 가능
- 삭제/복구 로그가 한글로 표시됨
- 삭제된 라운드는 일반 운영 화면에서 차단됨

가능하면 일반 회원 계정에서도 확인한다.

- 일반 회원은 라운드 삭제/복구 UI에 접근할 수 없어야 함
- 일반 회원이 직접 RPC를 실행할 수 없어야 함

## 6. 커밋 기준

이번 단계에서 앱 소스 변경은 없다. 다음 파일만 커밋한다.

```text
supabase/parkbuddy_round_safety_rpc_permission_check.sql
supabase/parkbuddy_harden_round_safety_rpc_permissions.sql
dev/PARKBUDDY_ROUND_SAFETY_RPC_HARDENING_PLAN.md
dev/PARKBUDDY_OPERATOR_DEV_STATUS.md
```

권장 커밋 메시지:

```text
Add round safety RPC permission hardening scripts
```

## 7. 다음 단계 후보

이 단계가 끝나면 다음에는 “운영자 UX 패턴 통일” 작업으로 넘어간다.

후보 작업명:

```text
Improve admin safety UI patterns
```

대상:

- 위험 작업 안내 박스 통일
- 삭제/복구/비활성화/상태 변경 버튼 톤 통일
- 성공 메시지 문구 통일
- 모바일 터치 영역 점검
- 운영자 대시보드 최근 작업 로그 가독성 개선
