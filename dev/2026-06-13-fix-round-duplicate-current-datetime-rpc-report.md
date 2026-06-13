# 라운드 복제 날짜/시간 현재값 보정 보고서

## 작성일

2026-06-13

## 수정 목적

라운드 복제 후 날짜와 시작시간이 기존 라운드 기준으로 남는 문제를 수정했다.

## 수정 내용

- `admin_duplicate_round` RPC를 다시 정의했다.
- 라운드 복제 시 `play_date`는 복제 실행 시점의 한국 날짜로 저장한다.
- 라운드 복제 시 `start_time`은 복제 실행 시점의 한국 시간으로 저장한다.
- 경기 형태와 점수 계산 방식은 기존 라운드 기준으로 유지한다.
- 참가자, 조 편성, 스코어는 복사하지 않는다.
- 복제 작업은 관리자 작업 로그에 `round.duplicate`로 기록한다.

## 변경 파일

- `supabase/migrations/0019_fix_round_duplicate_current_datetime_rpc.sql`
- `dev/2026-06-13-fix-round-duplicate-current-datetime-rpc-report.md`

## 적용 방법

1. 스크립트를 실행한다.
2. 생성된 SQL 파일을 Supabase SQL Editor에서 실행한다.
3. 기존 라운드를 복제한다.
4. 새 라운드의 날짜와 시작시간이 복제 실행 시점 기준인지 확인한다.

## 주의사항

이 수정은 앱 화면 코드가 아니라 Supabase RPC 함수 수정이다.
따라서 SQL Editor에서 migration SQL을 반드시 다시 실행해야 반영된다.
