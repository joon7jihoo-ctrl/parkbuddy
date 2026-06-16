# PARKBUDDY_EVENT_TO_ROUND_LINK_FLOW

## 목적

일정 참석 투표(`events`, `event_votes`)를 실제 라운딩 운영(`rounds`, `round_participants`)과 연결한다.

기존에는 일정과 라운딩이 별도로 생성되어 운영 흐름이 분리되어 있었다. 이번 작업부터 일정은 라운딩 생성의 출발점이 된다.

## 적용 흐름

1. 운영자가 일정을 등록한다.
2. 회원이 `/schedule`에서 참석 또는 불참을 선택한다.
3. 운영자가 일정 카드에서 `참석자 기준 라운딩 생성`을 누른다.
4. Supabase RPC `admin_create_round_from_event`가 실행된다.
5. 참석으로 투표한 활성 회원만 `round_participants`에 자동 등록된다.
6. 생성된 라운딩은 `rounds.event_id`로 원본 일정과 연결된다.
7. 생성 후 `/admin/rounds/[roundId]/participants`로 이동해 참가자를 확인한다.
8. 이미 생성된 일정은 `/schedule`에서 `생성된 라운딩 보기`로 표시해 중복 생성을 막는다.

## 변경 파일

- `src/server/actions/event-rounds.ts`
- `src/app/(app)/schedule/page.tsx`
- `supabase/parkbuddy_event_to_round_link.sql`
- `supabase/migrations/0022_event_to_round_link.sql`
- `dev/PARKBUDDY_EVENT_TO_ROUND_LINK_FLOW.md`
- `dev/PARKBUDDY_OPERATOR_DEV_STATUS.md`

## Supabase SQL

반드시 먼저 아래 SQL을 Supabase SQL Editor에서 실행한다.

```text
supabase/parkbuddy_event_to_round_link.sql
```

이 SQL은 다음을 추가한다.

- `rounds.event_id` 컬럼 보강
- `rounds.event_id` 조회 인덱스
- `event_votes(event_id, status, member_id)` 조회 인덱스
- `admin_create_round_from_event(p_event_id uuid)` RPC

## RPC 동작

`admin_create_round_from_event`는 다음 순서로 동작한다.

1. 로그인 여부 확인
2. 현재 사용자가 활성 운영자인지 확인
3. 일정이 현재 운영자의 클럽 일정인지 확인
4. 일정 ID 기준 advisory lock으로 동시 클릭 중복 생성 방지
5. 이미 `rounds.event_id = events.id`인 라운딩이 있으면 기존 라운딩 ID 반환
6. 참석 투표자가 0명이면 `NO_ATTENDEES` 예외 발생
7. 일정 제목/장소/일시/홀 수/메모로 라운딩 생성
8. 참석 투표자만 `round_participants`에 `confirmed`로 등록
9. 관리자 작업 로그에 `round.create_from_event` 기록
10. 생성된 라운딩 ID 반환

## UI 동작

`/schedule`에서 운영자에게만 추가 버튼이 보인다.

- 참석자가 있으면: `참석자 기준 라운딩 생성`
- 참석자가 없으면: `참석자 필요` 비활성화
- 이미 생성된 일정이면: `생성된 라운딩 보기`

일반 회원에게는 기존 투표 UI만 보인다.

## 확인 절차

1. Supabase SQL Editor에서 `supabase/parkbuddy_event_to_round_link.sql` 실행
2. 로컬 적용 후 `npm run verify`
3. `/schedule` 접속
4. 참석자가 있는 일정에서 `참석자 기준 라운딩 생성` 클릭
5. `/admin/rounds/[roundId]/participants`로 이동하는지 확인
6. 참가자 목록에 참석자만 선택되어 있는지 확인
7. `/schedule`로 돌아와 버튼이 `생성된 라운딩 보기`로 바뀌었는지 확인
8. 같은 일정에서 중복 라운딩이 생성되지 않는지 확인

## 다음 작업

다음 단계는 `PARKBUDDY_SCHEDULE_TO_ROUND_CREATION_UI`다.

목표:

- 생성 버튼의 모바일 위치와 안내를 더 다듬는다.
- 생성 완료 후 라운딩 관리 화면에 원본 일정 정보를 표시한다.
- 라운딩 목록/상세에서 `원본 일정: 7월 월례대회` 맥락을 보여준다.
