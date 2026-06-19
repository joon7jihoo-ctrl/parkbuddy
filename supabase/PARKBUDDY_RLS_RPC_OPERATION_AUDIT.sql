-- ParkBuddy 운영 전 RLS/RPC 보안 점검 SQL
-- 목적: 운영 DB에서 RLS, 정책, RPC 권한, 공개 권한을 눈으로 확인하기 위한 읽기 전용 점검 스크립트입니다.
-- 사용 위치: Supabase Dashboard > SQL Editor
-- 주의: 이 파일은 데이터를 변경하지 않습니다.

-- 1) 핵심 테이블 RLS 활성화 여부
select
  n.nspname as schema_name,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as force_rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
  and c.relname in (
    'members',
    'member_action_logs',
    'rounds',
    'round_participants',
    'round_pairings',
    'round_scores',
    'events',
    'event_votes',
    'posts',
    'post_attachments'
  )
order by c.relname;

-- 2) 핵심 테이블별 정책 목록
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename in (
    'members',
    'member_action_logs',
    'rounds',
    'round_participants',
    'round_pairings',
    'round_scores',
    'events',
    'event_votes',
    'posts',
    'post_attachments'
  )
order by tablename, policyname;

-- 3) anon/public에 과도한 쓰기 권한이 열려 있는지 확인
select
  table_schema,
  table_name,
  privilege_type,
  grantee
from information_schema.role_table_grants
where table_schema = 'public'
  and grantee in ('anon', 'public')
  and privilege_type in ('INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER')
order by table_name, grantee, privilege_type;

-- 4) authenticated 권한 확인: RLS 정책과 함께 의도한 범위인지 점검
select
  table_schema,
  table_name,
  privilege_type,
  grantee
from information_schema.role_table_grants
where table_schema = 'public'
  and grantee = 'authenticated'
order by table_name, privilege_type;

-- 5) SECURITY DEFINER 함수 목록과 search_path 확인
select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments,
  p.prosecdef as security_definer,
  array_to_string(p.proconfig, ', ') as function_config
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.prosecdef = true
order by p.proname;

-- 6) RPC 실행 권한 확인
select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments,
  r.rolname as grantee,
  has_function_privilege(r.rolname, p.oid, 'EXECUTE') as can_execute
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
cross join pg_roles r
where n.nspname = 'public'
  and r.rolname in ('anon', 'authenticated', 'public')
  and p.proname in (
    'claim_member_account',
    'admin_update_member',
    'admin_deactivate_member',
    'admin_restore_member',
    'admin_update_round_status',
    'admin_duplicate_round',
    'create_round_from_event'
  )
order by p.proname, r.rolname;

-- 7) 운영 전 빠른 판정표
with target_tables(table_name) as (
  values
    ('members'),
    ('member_action_logs'),
    ('rounds'),
    ('round_participants'),
    ('round_pairings'),
    ('round_scores'),
    ('events'),
    ('event_votes'),
    ('posts'),
    ('post_attachments')
), table_status as (
  select
    t.table_name,
    coalesce(c.relrowsecurity, false) as rls_enabled,
    count(p.policyname) as policy_count
  from target_tables t
  left join pg_class c on c.relname = t.table_name
  left join pg_namespace n on n.oid = c.relnamespace and n.nspname = 'public'
  left join pg_policies p on p.schemaname = 'public' and p.tablename = t.table_name
  group by t.table_name, c.relrowsecurity
)
select
  table_name,
  case
    when rls_enabled and policy_count > 0 then 'OK'
    when not rls_enabled then 'CHECK_RLS_OFF'
    else 'CHECK_POLICY_MISSING'
  end as audit_status,
  rls_enabled,
  policy_count
from table_status
order by table_name;
