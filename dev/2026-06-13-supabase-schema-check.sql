-- ParkBuddy Supabase 스키마 점검 SQL
-- 작성일: 2026-06-13
-- 목적: 라운드/회원/관리자 로그/함수 구조를 실제 DB 기준으로 확인한다.

-- 1. 라운드 테이블 컬럼 확인
select
  'rounds_columns' as section,
  column_name,
  data_type,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'rounds'
order by ordinal_position;

-- 2. 회원 테이블 컬럼 확인
select
  'members_columns' as section,
  column_name,
  data_type,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'members'
order by ordinal_position;

-- 3. 관리자 작업 로그 테이블 컬럼 확인
select
  'admin_action_logs_columns' as section,
  column_name,
  data_type,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'admin_action_logs'
order by ordinal_position;

-- 4. 라운드 관련 RPC/함수 확인
select
  'round_functions' as section,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments,
  pg_get_function_result(p.oid) as return_type
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and (
    p.proname ilike '%round%'
    or p.proname ilike '%log%'
    or p.proname ilike '%member%'
  )
order by p.proname, arguments;

-- 5. 현재 admin_duplicate_round 함수 정의 확인
select
  'admin_duplicate_round_definition' as section,
  pg_get_functiondef(p.oid) as definition
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'admin_duplicate_round';

-- 6. 현재 admin_log_action 함수 정의 확인
select
  'admin_log_action_definition' as section,
  pg_get_functiondef(p.oid) as definition
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'admin_log_action';

-- 7. 최근 관리자 작업 로그 샘플 확인
select
  'recent_admin_action_logs' as section,
  *
from public.admin_action_logs
order by created_at desc
limit 20;
