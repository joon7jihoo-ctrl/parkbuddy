# 라운드 복제 날짜/시작시간 및 생성 기본값 수정 보고서

## 작성일

2026-06-13

## 작업 목적

라운드 복제와 라운드 생성 시 날짜/시작시간 기본값을 운영자가 기대하는 방식으로 정리했다.

## 반영 내용

- 라운드 복제 시 경기 형태와 점수 계산 방식은 기존 라운드 값을 유지한다.
- 라운드 복제 시 날짜는 복제 실행 시점의 한국 날짜로 생성되도록 SQL을 보정했다.
- 라운드 복제 시 시작시간은 복제 실행 시점의 한국 시간으로 생성되도록 SQL을 보정했다.
- 라운드 생성 화면의 날짜 기본값을 현재 한국 날짜로 표시하도록 수정했다.
- 라운드 생성 화면의 시작시간 기본값을 현재 한국 시간으로 표시하도록 수정했다.

## 변경 파일

- supabase/migrations/0018_fix_round_duplicate_current_datetime.sql
- src/app/(app)/admin/rounds/new/page.tsx
- dev/2026-06-13-fix-round-duplicate-and-create-default-datetime-report.md

## Supabase 적용 필요

아래 SQL 파일을 Supabase SQL Editor에서 실행해야 라운드 복제 RPC 변경이 실제 DB에 적용된다.

- supabase/migrations/0018_fix_round_duplicate_current_datetime.sql

## 확인 항목

- 라운드 생성 화면에 현재 날짜가 기본 입력되는지 확인한다.
- 라운드 생성 화면에 현재 시간이 기본 입력되는지 확인한다.
- 기존 라운드를 복제했을 때 경기 형태와 점수 계산 방식은 유지되는지 확인한다.
- 기존 라운드를 복제했을 때 날짜와 시작시간은 복제 실행 시점 기준으로 생성되는지 확인한다.
