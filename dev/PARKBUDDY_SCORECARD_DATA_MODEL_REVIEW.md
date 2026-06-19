# ParkBuddy Scorecard Data Model Review

## 목적

이 문서는 `라운딩 공지 → 참석 확인 → 확정 라운드 생성 → 조편성 → 조별 스코어카드 입력 → 최종 스코어보드` 흐름 중 **스코어카드 데이터 모델을 확정하기 전 점검해야 할 항목**을 정리한다.

이번 단계에서는 앱 코드를 수정하지 않는다. 먼저 현재 Supabase 운영 DB의 스코어 관련 테이블 구조를 확인하고, 기존 `hole_scores`를 재사용할지 또는 새 `round_hole_scores` 테이블을 만들지 결정한다.

---

## 현재 유지해야 할 공식 기준

v0.10.0 이후 ParkBuddy의 공식 데이터 기준은 다음과 같다.

| 영역 | 공식 기준 |
|---|---|
| 확정 참가자 | `round_participants` |
| 조편성 | `round_groups`, `round_group_members` |
| 최종 스코어 | `round_scores` |
| 참석 모집 | `events`, `event_votes` |

스코어카드 기능을 추가하더라도 이 기준은 유지한다.

---

## 왜 바로 화면을 만들지 않는가

첨부된 실제 스코어카드 형태는 `집계표`, `A코스`, `B코스`, `C코스`, `D코스`로 구성된다.

이 화면을 만들려면 홀별 점수를 저장해야 한다. 현재 프로젝트에는 `hole_scores`, `round_players`, `round_scores`, `round_groups`, `round_group_members`, `round_participants`가 함께 존재한다.

문제는 기존 `hole_scores`가 현재 공식 참가자 기준인 `round_participants`가 아니라 예전 구조인 `round_players`와 연결되어 있을 가능성이 있다는 점이다.

따라서 먼저 실제 DB 구조를 확인한 뒤 다음 중 하나를 결정해야 한다.

1. 기존 `hole_scores`를 안전하게 재사용한다.
2. 새 `round_hole_scores` 테이블을 만든다.

---

## 점검 대상 테이블

Supabase SQL Editor에서 `supabase/PARKBUDDY_SCORECARD_SCHEMA_INSPECTION.sql`을 실행해 아래 테이블을 확인한다.

- `round_scores`
- `hole_scores`
- `round_groups`
- `round_group_members`
- `round_participants`
- `round_players`
- `rounds`
- `members`

---

## 확인할 핵심 질문

### 1. `hole_scores`가 어떤 기준과 연결되어 있는가

확인할 것:

- `hole_scores`에 `round_id`가 있는가
- `hole_scores`에 `member_id`가 있는가
- `hole_scores`에 `round_participant_id`가 있는가
- `hole_scores`에 `round_player_id`가 있는가
- `hole_scores`에 `round_group_id` 또는 group 관련 컬럼이 있는가

판단:

- `round_id + member_id + group_id + course_code + hole_no` 구조면 재사용 가능성이 있다.
- `round_player_id` 중심이면 기존 구조 재사용은 위험하다.

### 2. `round_players`가 현재 화면에서 실제로 쓰이는가

확인할 것:

- 현재 운영 화면의 공식 참가자 소스가 `round_participants`인지 유지한다.
- `round_players`가 과거 잔존 테이블이라면 새 기능에서 사용하지 않는다.

### 3. 최종 점수는 어디서 계산되어야 하는가

기준:

- 홀별 입력 원본은 `hole_scores` 또는 새 `round_hole_scores`가 될 수 있다.
- 최종 공식 기록은 반드시 `round_scores`로 집계되어야 한다.
- 마이페이지, 스코어 목록, 평균, 베스트 스코어는 계속 `round_scores` 기준이어야 한다.

---

## 권장 방향

기존 `hole_scores`가 `round_participants`/`round_groups`와 깨끗하게 맞지 않으면 새 테이블을 만든다.

권장 새 테이블 이름:

```text
round_hole_scores
```

권장 컬럼:

```text
id
round_id
round_group_id
member_id
course_code       -- A/B/C/D
hole_no           -- 1~9
distance_m
par
strokes
updated_by
created_at
updated_at
```

권장 제약:

```text
unique(round_id, round_group_id, member_id, course_code, hole_no)
course_code in ('A', 'B', 'C', 'D')
hole_no between 1 and 9
strokes is null or strokes >= 1
```

집계 방향:

```text
round_hole_scores
→ 코스별/회원별 합계 계산
→ round_scores에 최종 점수 반영
```

---

## 스코어카드 UI 기준

### 집계표 탭

집계표 탭에서만 회원 순서를 선택한다.

상단 표시:

```text
날짜
파크골프장 이름
내 조: 1조
```

운영자일 경우:

```text
조 선택 드롭다운
```

집계표의 코스 옆 4칸:

- 해당 조 회원 이름을 드롭다운으로 선택한다.
- 기본값은 현재 조편성 멤버로 자동 채운다.
- 여기서 선택한 순서가 A/B/C/D 코스 탭의 회원 열 순서가 된다.

### A/B/C/D 코스 탭

- 별도 회원 드롭다운을 두지 않는다.
- 집계표에서 선택된 4명과 순서를 그대로 보여준다.
- 1~9홀 점수를 입력한다.
- 회원별 소계를 자동 계산한다.

---

## 이번 단계 완료 조건

이번 단계는 코드 구현이 아니라 설계 확정 전 점검이다.

완료 조건:

1. `PARKBUDDY_SCORECARD_SCHEMA_INSPECTION.sql` 실행 결과를 확인한다.
2. `hole_scores` 재사용 가능 여부를 판단한다.
3. `round_hole_scores` 신규 생성이 필요한지 결정한다.
4. 결정 내용을 dev 문서에 추가한다.

---

## 다음 단계 후보

점검 결과에 따라 다음 중 하나로 진행한다.

### A. 기존 `hole_scores` 재사용

조건:

- `rounds`, `members`, `round_groups`와 안정적으로 연결 가능
- `round_participants` 기준과 충돌 없음
- RLS/정책 정비 가능

다음 작업:

- `hole_scores` 기준 스코어카드 화면 설계
- `round_scores` 자동 집계 로직 설계

### B. 새 `round_hole_scores` 생성

조건:

- 기존 `hole_scores`가 `round_players` 중심
- 현재 공식 참가자/조편성 기준과 충돌 가능성 있음

다음 작업:

- `round_hole_scores` migration 작성
- RLS 정책 작성
- 저장 RPC 또는 server action 설계
- `round_scores` 집계 동기화 설계

---

## 현재 권장 판단

현재까지의 운영 안정성 기준을 고려하면, 기존 `hole_scores`가 `round_players`와 강하게 연결되어 있다면 **새 `round_hole_scores` 테이블을 만드는 것이 더 안전하다.**

공식 기준은 계속 다음처럼 유지한다.

```text
참석 모집: events / event_votes
확정 참가자: round_participants
조편성: round_groups / round_group_members
홀별 입력: round_hole_scores 또는 검증된 hole_scores
최종 공식 점수: round_scores
```
