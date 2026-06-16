# ParkBuddy 데이터 흐름 정리 우선순위

## 결정 배경

일정 관리, 라운딩 관리, 스코어 기록 화면이 서로 비슷한 정보를 보여주지만 현재는 서로 다른 데이터 소스를 보고 있다.

- 일정 관리: `events`, `event_votes`
- 라운딩 관리: `rounds`, `round_participants`, `round_scores`
- 기존 개인 스코어 기록: `round_players`, `hole_scores`, `member_round_totals`, `member_score_stats`

최근 운영자 스코어 입력 화면은 `round_scores`를 공식 저장소로 사용하고 있으므로, 앞으로의 조회/통계 화면도 이 기준으로 통일한다.

## 앞으로의 개발 순서

1. **스코어 데이터 기준 통일**
   - `round_scores`를 공식 스코어 기록 기준으로 사용한다.
   - 마이페이지, 스코어 화면, 최근 기록, 평균/베스트 통계를 `round_scores` 기준으로 맞춘다.

2. **일정 → 라운딩 연결 구조 만들기**
   - `events`의 참석 투표 결과를 바탕으로 `rounds`를 생성한다.
   - 생성된 라운드는 `rounds.event_id`로 원본 일정과 연결한다.
   - 참석자는 `round_participants`에 자동 등록한다.

3. **일정 화면에 라운딩 생성 액션 추가**
   - 운영자가 일정 카드에서 “참석자 기준 라운딩 생성”을 실행할 수 있게 한다.
   - 이미 생성된 라운딩이 있으면 중복 생성되지 않도록 막는다.

4. **라운딩 관리 화면에 연결된 일정 표시**
   - 라운딩 목록/상세/조 편성/스코어 입력 화면에서 원본 일정 정보를 확인할 수 있게 한다.

5. **데이터 흐름 안정화 후 모바일 Dense UX / Motion UX 재개**
   - 데이터 기준이 통일된 뒤 화면 밀도, sticky CTA, slide-up modal, swipe 흐름을 이어서 개선한다.

## 완료된 1순위 작업

이번 작업에서 `round_scores` 기준 조회로 1순위 작업을 시작했다.

### 변경된 기준

- `/mypage` 최근 기록과 통계는 `round_scores` 기반으로 조회한다.
- `/scores` 상단 라운딩/평균/베스트는 `round_scores` 기반으로 계산한다.
- `/scores` 최근 목록은 단순 라운드 목록이 아니라 내 스코어가 입력된 라운딩 기록만 표시한다.
- `/scores/[roundId]`는 기존 홀별 입력 화면 대신 내 총 타수/스테이블포드 포인트 상세 화면으로 변경했다.
- `/members` 회원 카드 통계도 `round_scores` 기반으로 계산한다.

### 이번 작업에서 새 SQL은 추가하지 않음

이번 단계는 원격 Supabase SQL 적용 없이 화면 쿼리와 공통 계산 유틸을 통해 통일했다. 추후 성능이나 화면이 늘어나면 `round_scores` 기반 view를 별도 SQL로 만드는 것을 검토한다.

## 다음 작업 후보

다음 단계는 2순위인 **일정 → 라운딩 연결 구조**다.

권장 작업명:

`PARKBUDDY_EVENT_TO_ROUND_LINK_FLOW`

예상 범위:

- `events` 참석자 조회
- `rounds.event_id` 연결
- `round_participants` 자동 생성
- 중복 라운드 생성 방지
- 운영자 전용 액션/RPC 또는 server action 설계
