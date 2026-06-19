# ParkBuddy Scorecard Read Model and UI Plan

## 목적

`round_hole_scores` migration 적용 후, 실제 스코어카드 화면을 만들기 전에 데이터 조회 기준과 UI 동작을 고정한다.

이번 문서는 앱 코드 수정 전 설계 기준이다.

## 현재 확정된 데이터 원칙

- 공식 참가자: `round_participants`
- 공식 조편성: `round_groups` / `round_group_members`
- 홀별 스코어 원본: `round_hole_scores`
- 최종 공식 스코어: `round_scores`
- 기존 `hole_scores` / `round_players`는 현재 운영 흐름에서 사용하지 않는다.

## 목표 운영 흐름

```text
라운딩 공지
→ 참석 / 불참 확인
→ 참석자 기준 확정 라운드 생성
→ 조편성
→ 집계표에서 조원 순서 확정
→ A/B/C/D 코스별 홀 스코어 입력
→ round_hole_scores 저장
→ 회원별 총점 계산
→ round_scores 반영
→ 최종 스코어보드 확인
```

## 스코어카드 화면 URL

1차 구현 추천 URL:

```text
/scores/[roundId]/scorecard
```

관리자 전체 확인용 후속 URL:

```text
/admin/rounds/[roundId]/scorecards
```

## 접근 권한 1차 기준

1차 구현은 보수적으로 간다.

- 읽기: 같은 클럽의 로그인 회원
- 쓰기: 운영진만
- 익명 입력 링크: 아직 구현하지 않음
- 카카오톡 공유는 링크/문구 복사까지만 유지

추후 개선:

- 조별 스코어 담당자 지정
- 만료 토큰 기반 입력 링크
- 입력 담당자는 자기 조만 입력 가능

## 화면 상단 정보

스코어카드 화면 상단에는 다음을 보여준다.

```text
라운딩 일자
파크골프장 이름
내 조: n조
조 선택 드롭다운
저장 상태
```

### 로그인 회원의 조 추적

로그인한 회원의 `member_id`를 기준으로 `round_group_members`에서 해당 라운드의 조를 찾는다.

```text
round_group_members.round_id = 현재 round_id
round_group_members.member_id = 로그인 회원의 member_id
```

해당 조가 있으면 기본 선택 조로 사용한다.

운영진은 전체 조를 볼 수 있어야 하므로 조 드롭다운으로 다른 조를 선택할 수 있다.

## 집계표 탭

집계표 탭은 스코어카드의 기준 화면이다.

탭 순서:

```text
집계표 | A코스 | B코스 | C코스 | D코스
```

집계표 상단:

```text
날짜
파크골프장 이름
내 조: n조
조 선택: [n조 ▼]
```

집계표의 코스 옆 4칸은 해당 조 회원 이름 드롭다운이다.

중요 기준:

- 드롭다운은 집계표 탭에만 둔다.
- A/B/C/D 코스 탭에는 회원 드롭다운을 두지 않는다.
- 드롭다운 기본값은 현재 조편성 멤버로 자동 채운다.
- 집계표에서 선택된 4명과 순서가 A/B/C/D 코스 탭의 회원 열 순서가 된다.
- 같은 조에서 같은 회원이 중복 선택되지 않도록 한다.
- 4명 미만 조도 허용한다. 빈 칸은 `선택 안 함` 상태로 둔다.

## 코스 탭

A/B/C/D 코스 탭은 집계표에서 확정된 회원 순서를 그대로 사용한다.

각 코스 탭 구조:

```text
홀 | M | 파 | 회원1 | 회원2 | 회원3 | 회원4
1
2
3
4
5
6
7
8
9
소계
```

입력 기준:

- 코스별 9홀
- `M`은 거리
- `파`는 기준 타수
- 회원 열은 집계표 선택 순서와 동일
- 숫자 입력은 strokes
- 입력값은 `round_hole_scores`에 저장
- 소계와 총계는 클라이언트에서 즉시 계산하고 저장 후 서버 데이터 기준으로 다시 동기화한다.

## 회원 순서 저장 방식

집계표에서 선택한 회원 순서는 UI 상태로만 처리할지, DB에 저장할지 결정이 필요하다.

### 1차 구현 추천

1차 구현은 별도 순서 저장 테이블을 만들지 않는다.

기본 순서:

```text
round_group_members.position
round_group_members.created_at
member.name
```

집계표 드롭다운으로 순서를 바꾼 경우:

- 1차는 화면 내 상태로만 반영
- 저장 시 `round_hole_scores`에는 member_id 기준으로 저장
- 화면 새로고침 후에는 조편성 기본 순서로 돌아갈 수 있음

### 2차 개선

조별 스코어카드 표시 순서를 영구 저장하려면 별도 테이블 또는 컬럼이 필요하다.

후보:

```text
round_scorecard_members
- id
- round_id
- round_group_id
- slot_no: 1~4
- member_id
- created_at
- updated_at
```

단, 1차 구현에서는 범위를 키우지 않기 위해 보류한다.

## round_hole_scores 저장 규칙

한 셀은 다음 unique key로 식별된다.

```text
round_id
round_group_id
member_id
course_code
hole_no
```

업서트 기준:

```text
round_id + round_group_id + member_id + course_code + hole_no
```

저장할 값:

```text
distance_m
par
strokes
updated_by
updated_at
```

## round_scores 반영

홀별 스코어 입력 후 최종 점수를 `round_scores`에 반영해야 한다.

1차 구현 추천:

- 스코어카드 저장 액션에서 회원별 총점을 계산한다.
- 각 회원의 A/B/C/D 합계를 구한다.
- `round_scores`에 upsert한다.
- `round_scores`는 계속 공식 최종 스코어 소스로 유지한다.

주의:

- 기존 마이페이지/스코어보드/평균/베스트 스코어는 `round_scores` 기준을 유지해야 한다.
- `round_hole_scores`를 직접 최종 스코어 화면의 공식 소스로 사용하지 않는다.

## 1차 구현 범위

포함:

- `/scores/[roundId]/scorecard` 페이지 생성 또는 보강
- 라운드 기본 정보 조회
- 조 목록 조회
- 로그인 회원의 조 기본 선택
- 집계표 탭
- A/B/C/D 코스 탭
- 집계표 회원 드롭다운
- 코스 탭 점수 입력
- 저장 버튼
- `round_hole_scores` upsert
- `round_scores` upsert
- 모바일 Dense UX
- 하단 sticky 저장 CTA

제외:

- 익명 입력 링크
- Kakao API 직접 전송
- PDF 출력
- 실시간 다중 사용자 편집
- 조별 입력 담당자 권한
- 영구적인 집계표 회원 순서 저장

## 필요한 코드 작업 후보

예상 파일:

```text
src/app/(app)/scores/[roundId]/scorecard/page.tsx
src/app/(app)/scores/[roundId]/scorecard/actions.ts
src/components/scorecard/ScorecardTabs.tsx
src/components/scorecard/ScorecardSummaryTab.tsx
src/components/scorecard/ScorecardCourseTab.tsx
src/components/scorecard/ScorecardSaveBar.tsx
src/lib/scorecard.ts
```

실제 파일 구조는 현재 프로젝트 상태를 확인한 뒤 최소 변경으로 결정한다.

## QA 기준

기능 QA:

- 운영진이 스코어카드 화면에 접근 가능
- 로그인 회원의 조가 기본 선택됨
- 운영진은 조 선택 가능
- 집계표에서 조원 4칸 드롭다운 기본값이 조편성 멤버로 채워짐
- 코스 탭은 집계표 선택 순서를 그대로 표시
- A/B/C/D 각 9홀 입력 가능
- 저장 후 새로고침해도 점수 유지
- `round_hole_scores` row 생성 확인
- `round_scores` 총점 반영 확인
- 최종 스코어보드와 마이페이지가 기존 공식 점수 기준을 유지

보안 QA:

- anon 입력 불가
- 비운영진 쓰기 불가
- 같은 클럽 회원 읽기 가능
- 다른 클럽 데이터 노출 없음

모바일 QA:

- 탭 터치 영역 충분
- 점수 입력 칸이 너무 작지 않음
- 키보드가 하단 저장 CTA를 과하게 가리지 않음
- 가로 스크롤이 필요한 표는 의도적으로 처리
- 저장 완료 상태가 명확히 보임

## 다음 단계

이 문서 커밋 후 다음 작업은 실제 1차 화면 구현이다.

추천 브랜치:

```powershell
git checkout main
git pull origin main
git checkout -b feature/scorecard-input-v1
```

추천 첫 구현:

1. 페이지 라우트와 데이터 조회만 먼저 만든다.
2. 읽기 전용 집계표/A/B/C/D 탭을 만든다.
3. 그 다음 입력/저장 액션을 붙인다.
4. 마지막에 `round_scores` 자동 반영을 붙인다.
