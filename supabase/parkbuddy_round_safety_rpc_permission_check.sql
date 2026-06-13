-- ParkBuddy round safety RPC permission check
-- Purpose: verify that round soft-delete / restore RPCs are not executable by anonymous users
-- and that the functions keep security-definer safeguards.
--
-- How to use:
-- 1. Open Supabase Dashboard > SQL Editor.
-- 2. Run this file.
-- 3. Confirm that the two target functions show:
--    - security_definer = true
--    - has_public_execute = false
--    - has_anon_execute = false
--    - has_authenticated_execute = true
--    - search_path contains public
--
-- This SQL is read-only. It does not change data or permissions.

with target_functions as (
  select
    p.oid,
    n.nspname as schema_name,
    p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as arguments,
    pg_get_function_result(p.oid) as result_type,
    p.prosecdef as security_definer,
    p.proconfig as config
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname in ('admin_soft_delete_round', 'admin_restore_round')
)
select
  schema_name,
  function_name,
  arguments,
  result_type,
  security_definer,
  config,
  has_function_privilege('public', oid, 'execute') as has_public_execute,
  has_function_privilege('anon', oid, 'execute') as has_anon_execute,
  has_function_privilege('authenticated', oid, 'execute') as has_authenticated_execute,
  case
    when not security_definer then 'FAIL: function should be SECURITY DEFINER'
    when has_function_privilege('anon', oid, 'execute') then 'FAIL: anon should not execute this RPC'
    when has_function_privilege('public', oid, 'execute') then 'WARN: PUBLIC execute should be revoked'
    when not has_function_privilege('authenticated', oid, 'execute') then 'FAIL: authenticated should execute this RPC'
    when config::text not ilike '%search_path=public%' then 'WARN: search_path should be pinned to public'
    else 'PASS'
  end as audit_result
from target_functions
order by function_name;
