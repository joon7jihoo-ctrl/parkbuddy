-- ParkBuddy round soft delete schema check
-- Run this in Supabase SQL Editor, then export or copy the results.

select
  'rounds_columns' as section,
  c.table_schema,
  c.table_name,
  c.column_name,
  c.data_type,
  c.is_nullable,
  c.column_default,
  c.ordinal_position::text as extra_1,
  null::text as extra_2
from information_schema.columns c
where c.table_schema = 'public'
  and c.table_name = 'rounds'

union all

select
  'round_related_tables' as section,
  c.table_schema,
  c.table_name,
  c.column_name,
  c.data_type,
  c.is_nullable,
  c.column_default,
  c.ordinal_position::text as extra_1,
  null::text as extra_2
from information_schema.columns c
where c.table_schema = 'public'
  and c.table_name in (
    'rounds',
    'round_participants',
    'round_pairings',
    'round_scores',
    'admin_action_logs'
  )

union all

select
  'functions' as section,
  n.nspname as table_schema,
  p.proname as table_name,
  pg_get_function_identity_arguments(p.oid) as column_name,
  pg_get_function_result(p.oid) as data_type,
  null::text as is_nullable,
  null::text as column_default,
  p.oid::text as extra_1,
  null::text as extra_2
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and (
    p.proname ilike '%round%'
    or p.proname ilike '%admin_log%'
  )

union all

select
  'policies' as section,
  schemaname as table_schema,
  tablename as table_name,
  policyname as column_name,
  cmd as data_type,
  permissive as is_nullable,
  roles::text as column_default,
  qual as extra_1,
  with_check as extra_2
from pg_policies
where schemaname = 'public'
  and tablename in (
    'rounds',
    'round_participants',
    'round_pairings',
    'round_scores',
    'admin_action_logs'
  )
order by section, table_name, extra_1, column_name;
