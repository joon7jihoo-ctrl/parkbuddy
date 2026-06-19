# ParkBuddy 스코어 기록 기준 통일

## 작업 목표

운영자 스코어 입력 화면이 저장하는 `round_scores`를 ParkBuddy의 공식 스코어 기록 기준으로 사용한다.

기존에는 다음 문제가 있었다.

- 운영자 스코어 입력은 `round_scores`에 저장됨
- 마이페이지 최근 기록은 `member_round_totals`를 조회함
- 스코어 상단 통계는 `member_score_stats`를 조회함
- `/scores` 최근 라운딩은 스코어 입력 여부와 관계없이 `rounds`를 직접 조회함

그래서 스코어가 입력되어도 마이페이지에는 “입력된 스코어가 없습니다”가 나오고, `/scores` 상단 통계는 0으로 보일 수 있었다.

## 변경 파일

- `src/lib/score-records.ts`
- `src/app/(app)/mypage/page.tsx`
- `src/app/(app)/scores/page.tsx`
- `src/app/(app)/scores/[roundId]/page.tsx`
- `src/app/(app)/members/page.tsx`
- `dev/PARKBUDDY_DATA_FLOW_PRIORITY_PLAN.md`
- `dev/PARKBUDDY_OPERATOR_DEV_STATUS.md`

## 변경 내용

### 1. 공통 스코어 기록 유틸 추가

`src/lib/score-records.ts`를 추가했다.

역할:

- `round_scores + rounds` 조회 결과를 공식 기록 형태로 정규화
- 삭제된 라운드 제외
- 클럽이 다른 라운드 제외
- 총 타수/스테이블포드 포인트가 모두 없는 행 제외
- 라운딩 수, 평균, 베스트 계산
- 점수 추이 그래프용 데이터 생성
- 회원별 통계 Map 생성

### 2. 마이페이지 통일

`/mypage`에서 기존 `member_score_stats`, `member_round_totals` 조회를 제거하고 `round_scores` 기준으로 변경했다.

반영 결과:

- 상단 라운딩/평균/베스트 카드가 운영자 입력값 기준으로 표시됨
- 그래프가 운영자 입력값 기준으로 표시됨
- 최근 기록이 운영자 입력값 기준으로 표시됨

### 3. 스코어 목록 통일

`/scores`에서 기존 혼합 구조를 제거했다.

기존:

- 상단 통계: `member_score_stats`
- 그래프: `member_round_totals`
- 최근 라운딩: `rounds`

변경:

- 모두 `round_scores + rounds` 기준
- 최근 목록은 “등록된 라운딩”이 아니라 “내 스코어가 입력된 라운딩 기록”만 표시

### 4. 스코어 상세 통일

`/scores/[roundId]`는 기존 홀별 `ScoreInput` 화면을 사용하고 있었다.

변경 후:

- 내 총 타수 표시
- 내 스테이블포드 포인트 표시
- 메모 표시
- 입력된 내 스코어가 없으면 안내 표시

관리자 입력은 계속 `/admin/rounds/[id]/scores`에서만 담당한다.

### 5. 회원 목록 통계 통일

`/members`의 회원별 라운딩 수/평균/베스트도 `round_scores` 기준으로 계산하도록 변경했다.

## 검증

```powershell
npm run verify
```

결과:

```text
Security smoke test passed
eslint 통과
tsc --noEmit 통과
```

## 화면 확인 포인트

### `/mypage`

- 최근 기록에 운영자 입력 스코어가 표시되는지
- 상단 라운딩/평균/베스트가 0이 아닌 실제 기록으로 표시되는지
- 그래프가 입력 기록 기준으로 표시되는지

### `/scores`

- 최근 라운딩 목록에 스코어가 입력된 라운딩만 표시되는지
- 상단 라운딩/평균/베스트가 최근 기록과 일치하는지
- 상세 진입 시 총 타수/스테이블포드 포인트가 표시되는지

### `/members`

- 회원 카드의 라운딩/평균/베스트가 운영자 입력 스코어 기준으로 표시되는지

## 주의사항

이번 작업은 조회 기준을 통일하는 작업이다. 기존 `round_players`, `hole_scores`, `member_round_totals`, `member_score_stats`를 삭제하지 않는다.

추후 홀별 입력 기능을 다시 살릴 경우에는 `round_scores`와 홀별 입력 구조의 관계를 별도 설계해야 한다.
