# Supabase 실제 스키마 점검 v2 생성 보고서

## 작성일

2026-06-13

## 작업 내용

이전 스키마 점검 결과가 최근 관리자 작업 로그만 포함되어 있어, 테이블 컬럼과 함수 정의까지 하나의 결과표로 합쳐서 조회하는 SQL을 다시 생성했다.

## 생성 파일

- dev/2026-06-13-supabase-schema-check-v2.sql
- dev/2026-06-13-supabase-schema-check-v2-report.md

## 사용 방법

Supabase SQL Editor에서 `dev/2026-06-13-supabase-schema-check-v2.sql` 전체를 실행한 뒤 결과를 CSV로 내려받거나 표 전체를 복사한다.

## 확인 대상

- rounds 컬럼
- members 컬럼
- admin_action_logs 컬럼
- round_participants 컬럼
- round_pairings 컬럼
- round_scores 컬럼
- admin_duplicate_round 함수 정의
- admin_log_action 함수 정의
- 최근 관리자 작업 로그
