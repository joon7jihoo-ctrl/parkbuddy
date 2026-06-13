# ParkBuddy 개발보고서 - 라운드 기본 SQL play_date 오류 수정

## 작성일

2026-06-13

## 문제 상황

Supabase SQL Editor에서 `0011_rounds_base.sql` 실행 중 아래 오류가 발생했다.

```txt
ERROR: 42703: column "play_date" does not exist
```

## 원인

Supabase에 `rounds` 테이블이 이미 있거나 일부만 생성된 상태에서, SQL이 `play_date` 컬럼이 존재한다고 가정하고 인덱스 또는 함수 생성을 진행했을 가능성이 있다.

## 조치 내용

`0011_rounds_base.sql`을 idempotent 방식으로 교체했다.

기존 `rounds` 테이블이 있어도 필요한 컬럼을 `alter table ... add column if not exists` 방식으로 보강한다.

## 변경 파일

```txt
supabase/migrations/0011_rounds_base.sql
dev/2026-06-13-fix-rounds-play-date-migration-report.md
```

## 완료 기준

```txt
1. Supabase SQL Editor에서 0011_rounds_base.sql 재실행 성공
2. npm run verify 통과
3. /admin/rounds 접속 가능
4. /admin/rounds/new에서 라운드 생성 가능
5. 생성된 라운드가 목록에 표시
```
