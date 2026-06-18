# ParkBuddy Round Linked Event Context

## 작업 목적

일정 투표에서 생성된 라운딩을 운영자가 관리할 때, 해당 라운딩이 어떤 일정에서 만들어졌는지 바로 알 수 있도록 연결 일정 맥락을 표시한다.

## 배경

이전 단계에서 `/schedule`의 참석 투표를 기준으로 라운딩을 생성하고 `rounds.event_id`로 원본 일정과 연결하는 흐름을 추가했다. 이번 단계는 생성된 라운딩의 관리 화면에서 원본 일정 제목, 일정 종류, 일시, 장소, 투표 요약을 노출하는 UX 보강이다.

## 변경 파일

- `src/lib/round-linked-event-context.ts`
  - `rounds.event_id`가 가리키는 `events`와 `event_votes`를 조회해 연결 일정 맥락을 구성한다.
  - 참석/불참/총 투표 수를 계산한다.
- `src/components/admin/linked-event-context-card.tsx`
  - 라운딩 상세 관리 화면용 연결 일정 카드와 라운딩 목록용 인라인 배지를 제공한다.
- `src/app/(app)/admin/rounds/page.tsx`
  - 라운딩 목록 카드에 연결 일정 배지를 표시한다.
- `src/app/(app)/admin/rounds/[id]/participants/page.tsx`
  - 참가자 선택 화면 상단에 연결 일정 카드를 표시한다.
- `src/app/(app)/admin/rounds/[id]/pairings/page.tsx`
  - 조 편성 화면 상단에 연결 일정 카드를 표시한다.
- `src/app/(app)/admin/rounds/[id]/scores/page.tsx`
  - 스코어 입력 화면 상단에 연결 일정 카드를 표시한다.

## 표시 내용

연결 일정이 있는 라운딩에서만 다음 정보를 표시한다.

- 일정 제목
- 일정 종류: 정기 라운딩 / 대회 / 번개
- 일정 일시
- 장소
- 참석 수
- 불참 수
- 총 투표 수
- 일정 보기 버튼

`event_id`가 없는 수동 생성 라운딩은 기존 화면과 동일하게 보인다.

## 보안/권한 기준

- 조회는 운영진 화면에서만 수행된다.
- `events.club_id`가 현재 운영진의 `club_id`와 일치하는 일정만 표시한다.
- 원본 일정이 없거나 삭제된 경우 카드를 표시하지 않는다.
- 새 SQL은 필요 없다. 기존 `rounds.event_id`, `events`, `event_votes`를 사용한다.

## 검증 포인트

1. `/admin/rounds`에서 일정으로 생성된 라운딩에 `연결 일정` 배지가 보이는지 확인한다.
2. `/admin/rounds/[id]/participants`에서 상단 연결 일정 카드가 보이는지 확인한다.
3. `/admin/rounds/[id]/pairings`에서 상단 연결 일정 카드가 보이는지 확인한다.
4. `/admin/rounds/[id]/scores`에서 상단 연결 일정 카드가 보이는지 확인한다.
5. 수동 생성 라운딩에서는 연결 일정 카드가 표시되지 않는지 확인한다.
6. `npm run verify`를 실행해 보안 스모크 테스트, lint, typecheck를 통과하는지 확인한다.

## 다음 단계

- 일정 → 라운딩 생성 전 참석자 미리보기 UX 고도화
- 운영자가 일정 생성 라운딩과 수동 라운딩을 목록에서 더 쉽게 구분할 수 있는 필터 검토
