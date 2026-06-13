# ParkBuddy 라운드 안전 권한 점검 보고서

작성 시각: 2026-06-13T15:11:49.766Z

## 1. 점검 기준

이번 점검은 `Finalize round safety UI and log labels` 이후 다음 단계인 `Audit round safety permissions`를 위한 1차 정적 분석입니다.

목표는 라운드 soft delete/restore 기능이 다음 원칙을 지키는지 확인하는 것입니다.

- 일반 회원이 라운드 삭제/복구 RPC를 실행할 수 없어야 한다.
- 다른 동호회의 라운드를 삭제/복구할 수 없어야 한다.
- 삭제된 라운드는 기본 목록과 일반 운영 화면에서 노출되지 않아야 한다.
- 실제 삭제 대신 `deleted_at`, `deleted_by_member_id` 기반 soft delete를 유지해야 한다.
- 참가자, 조 편성, 스코어, 결과 데이터는 삭제하지 않아야 한다.
- 운영자 로그로 삭제/복구 이력이 추적되어야 한다.
- service_role 키는 클라이언트 코드에 노출되면 안 된다.

## 2. 현재 Git 상태

| 항목 | 값 |
|---|---|
| 브랜치 | `feature/operator-stability-and-round-safety` |
| 작업 트리 | clean |

## 3. 권한/RPC 점검 결과

| 점검 항목 | 결과 | 메모 |
|---|---:|---|
| 삭제 서버 액션에서 `requireAdmin()` 선검증 | 통과 | 앱 레벨에서 운영자 확인 후 RPC 호출 |
| 복구 서버 액션에서 `requireAdmin()` 선검증 | 통과 | 앱 레벨에서 운영자 확인 후 RPC 호출 |
| 삭제 RPC 내부 관리자/동호회 검증 | 통과 | DB 레벨에서 `auth.uid()`, active member, club match, admin check 확인 |
| 복구 RPC 내부 관리자/동호회 검증 | 통과 | DB 레벨에서 `auth.uid()`, active member, club match, admin check 확인 |
| RPC execute grant | 주의 포함 통과 | `authenticated`에 grant되어 있으나 함수 내부에서 관리자 검증함. 현재 구조에서는 허용 가능 |
| 삭제/복구 후 redirect 피드백 | 통과 | 성공 메시지 쿼리스트링 흐름 확인 |
| soft delete 검증 SQL 존재 | 통과 | Supabase SQL Editor에서 별도 확인 가능 |

## 4. 클라이언트 비밀키 노출 점검

| 점검 항목 | 결과 | 메모 |
|---|---:|---|
| `src` 안 service role 관련 문자열 | 통과 | 앱 소스에서 service_role 참조를 찾지 못함 |
| `.env.example` 공개 service key 의심 문자열 | 통과 | 공개 anon key만 사용하는 방향 |

## 5. 삭제된 라운드 노출 가능성 점검

`rounds` 테이블을 직접 조회하는 파일 중 `deleted_at` 조건이 보이지 않는 파일을 표시합니다. 이 목록은 “반드시 오류”라는 뜻은 아니고, 삭제된 라운드 직접 접근 차단 여부를 다음 패치에서 확인해야 하는 후보입니다.

| 등급 | 파일 | 확인 필요 내용 |
|---|---|---|
| 주의 | `src/app/(app)/admin/rounds/calendar/page.tsx` | `rounds` 조회에 `deleted_at` 필터가 보이지 않습니다. 삭제된 라운드가 상세/운영 화면에 직접 접근될 수 있는지 확인이 필요합니다. |
| 주의 | `src/app/(app)/admin/rounds/status/page.tsx` | `rounds` 조회에 `deleted_at` 필터가 보이지 않습니다. 삭제된 라운드가 상세/운영 화면에 직접 접근될 수 있는지 확인이 필요합니다. |
| 주의 | `src/app/(app)/admin/rounds/[id]/edit/actions.ts` | `rounds` 조회에 `deleted_at` 필터가 보이지 않습니다. 삭제된 라운드가 상세/운영 화면에 직접 접근될 수 있는지 확인이 필요합니다. |
| 주의 | `src/app/(app)/admin/rounds/[id]/edit/page.tsx` | `rounds` 조회에 `deleted_at` 필터가 보이지 않습니다. 삭제된 라운드가 상세/운영 화면에 직접 접근될 수 있는지 확인이 필요합니다. |
| 주의 | `src/app/(app)/admin/rounds/[id]/pairings/actions.ts` | `rounds` 조회에 `deleted_at` 필터가 보이지 않습니다. 삭제된 라운드가 상세/운영 화면에 직접 접근될 수 있는지 확인이 필요합니다. |
| 주의 | `src/app/(app)/admin/rounds/[id]/pairings/page.tsx` | `rounds` 조회에 `deleted_at` 필터가 보이지 않습니다. 삭제된 라운드가 상세/운영 화면에 직접 접근될 수 있는지 확인이 필요합니다. |
| 주의 | `src/app/(app)/admin/rounds/[id]/participants/page.tsx` | `rounds` 조회에 `deleted_at` 필터가 보이지 않습니다. 삭제된 라운드가 상세/운영 화면에 직접 접근될 수 있는지 확인이 필요합니다. |
| 주의 | `src/app/(app)/admin/rounds/[id]/results/page.tsx` | `rounds` 조회에 `deleted_at` 필터가 보이지 않습니다. 삭제된 라운드가 상세/운영 화면에 직접 접근될 수 있는지 확인이 필요합니다. |
| 주의 | `src/app/(app)/admin/rounds/[id]/results/print/page.tsx` | `rounds` 조회에 `deleted_at` 필터가 보이지 않습니다. 삭제된 라운드가 상세/운영 화면에 직접 접근될 수 있는지 확인이 필요합니다. |
| 주의 | `src/app/(app)/admin/rounds/[id]/scores/page.tsx` | `rounds` 조회에 `deleted_at` 필터가 보이지 않습니다. 삭제된 라운드가 상세/운영 화면에 직접 접근될 수 있는지 확인이 필요합니다. |
| 주의 | `src/app/(app)/scores/page.tsx` | `rounds` 조회에 `deleted_at` 필터가 보이지 않습니다. 삭제된 라운드가 상세/운영 화면에 직접 접근될 수 있는지 확인이 필요합니다. |
| 주의 | `src/app/(app)/scores/[roundId]/page.tsx` | `rounds` 조회에 `deleted_at` 필터가 보이지 않습니다. 삭제된 라운드가 상세/운영 화면에 직접 접근될 수 있는지 확인이 필요합니다. |
| 주의 | `src/server/actions/scores.ts` | `rounds` 조회에 `deleted_at` 필터가 보이지 않습니다. 삭제된 라운드가 상세/운영 화면에 직접 접근될 수 있는지 확인이 필요합니다. |

## 6. 1차 결론

현재 삭제/복구 RPC 자체는 앱 레벨과 DB 레벨에서 모두 운영자 권한 및 동호회 일치 검증을 갖춘 구조로 보입니다. 따라서 “일반 회원이 RPC를 직접 호출해 삭제/복구하는 위험”은 낮습니다.

다만 `rounds` 직접 조회 화면 중 일부는 `deleted_at` 필터가 보이지 않습니다. 기본 목록은 이미 삭제된 라운드를 숨기지만, 상세 URL을 직접 입력했을 때 참가자 선택, 조 편성, 스코어 입력, 결과 화면으로 접근 가능한지 추가 보완이 필요합니다.

## 7. 다음 개발 작업 제안

다음 작업명은 아래로 잡는 것을 권장합니다.

`Hide deleted rounds from operational routes`

수정 후보 파일은 1차 점검 결과에 따라 다음과 같습니다.

- `src/app/(app)/admin/rounds/[id]/participants/page.tsx`
- `src/app/(app)/admin/rounds/[id]/pairings/page.tsx`
- `src/app/(app)/admin/rounds/[id]/scores/page.tsx`
- `src/app/(app)/admin/rounds/[id]/results/page.tsx`
- `src/app/(app)/admin/rounds/[id]/results/print/page.tsx`
- `src/app/(app)/admin/rounds/[id]/edit/page.tsx`
- `src/app/(app)/admin/rounds/calendar/page.tsx`
- `src/app/(app)/admin/rounds/status/page.tsx`
- 필요 시 `src/app/(app)/scores/page.tsx`, `src/app/(app)/scores/[roundId]/page.tsx`

권장 정책은 다음과 같습니다.

- 일반 운영 화면은 `deleted_at is null` 라운드만 허용한다.
- 삭제된 라운드 상세 접근은 `/admin/rounds/deleted`로 안내하거나 접근을 차단한다.
- 결과 조회/인쇄 화면은 정책을 정해야 한다. 보수적으로는 삭제된 라운드도 일반 경로에서는 숨기는 것이 안전하다.
- DB RPC는 현재 구조를 유지하되, Supabase SQL Editor에서 검증 SQL을 실행해 실제 배포 DB 상태를 확인한다.

## 8. Supabase SQL Editor 수동 확인

아래 파일을 Supabase SQL Editor에서 실행해 실제 DB 상태를 확인한다.

- `supabase/parkbuddy_verify_round_soft_delete_schema.sql`

확인 포인트:

- `rounds.deleted_at`, `rounds.deleted_by_member_id` 존재
- soft delete 관련 index 존재
- `admin_soft_delete_round`, `admin_restore_round` 존재
- `admin_action_logs`에 action/metadata 컬럼 존재

## 9. 화면 확인 항목

다음 패치 전후로 브라우저에서 확인한다.

- 삭제된 라운드 ID를 알고 있을 때 `/admin/rounds/{id}/participants` 접근 가능 여부
- 삭제된 라운드 ID를 알고 있을 때 `/admin/rounds/{id}/pairings` 접근 가능 여부
- 삭제된 라운드 ID를 알고 있을 때 `/admin/rounds/{id}/scores` 접근 가능 여부
- 삭제된 라운드 ID를 알고 있을 때 `/admin/rounds/{id}/results` 접근 가능 여부
- 삭제된 라운드가 캘린더/상태 필터/회원 스코어 화면에 노출되는지 여부
