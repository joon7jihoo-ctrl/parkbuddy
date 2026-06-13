# ParkBuddy 개발보고서 - Supabase 실제 스키마 점검 단계

## 작성일

2026-06-13

## 진행 목적

라운드 복제 기능에서 `deleted_at`, `auth_user_id`, `admin_log_action` 함수 시그니처처럼 실제 DB와 다른 가정이 반복되었다.

앞으로 비슷한 오류를 줄이기 위해 Supabase의 실제 테이블 컬럼과 RPC 함수 구조를 먼저 확인하는 점검 SQL을 생성했다.

## 생성 파일

- dev/2026-06-13-supabase-schema-check.sql
- dev/2026-06-13-supabase-schema-check-report.md

## 확인 대상

- public.rounds 컬럼
- public.members 컬럼
- public.admin_action_logs 컬럼
- 라운드/회원/로그 관련 RPC 함수 목록
- admin_duplicate_round 함수 정의
- admin_log_action 함수 정의
- 최근 관리자 작업 로그 샘플

## 다음 작업 기준

Supabase SQL Editor에서 점검 SQL을 실행한 뒤 결과를 확인한다.

그 결과를 기준으로 다음 단계에서 라운드 복제 기능과 관리자 로그 연결을 실제 DB 구조에 맞게 안정화한다.
