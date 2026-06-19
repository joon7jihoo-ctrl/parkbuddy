-- ParkBuddy round soft-delete schema verification
-- Run this in Supabase SQL Editor after applying parkbuddy_add_round_soft_delete_schema.sql.
-- This query does not modify data.

select
  'rounds_columns' as section,
  c.table_schema,
  c.table_name,
  c.column_name,
  c.data_type,
  c.is_nullable,
  c.column_default::text as detail_1,
  null::text as detail_2
from information_schema.columns c
where c.table_schema = 'public'
  and c.table_name = 'rounds'
  and c.column_name in ('deleted_at', 'deleted_by_member_id')
union all
select
  'rounds_indexes' as section,
  schemaname as table_schema,
  tablename as table_name,
  indexname as column_name,
  'index' as data_type,
  null::text as is_nullable,
  indexdef as detail_1,
  null::text as detail_2
from pg_indexes
where schemaname = 'public'
  and tablename = 'rounds'
  and (
    indexname ilike '%deleted%'
    or indexdef ilike '%deleted_at%'
  )
union all
select
  'functions' as section,
  n.nspname as table_schema,
  p.proname as table_name,
  pg_get_function_arguments(p.oid) as column_name,
  pg_get_function_result(p.oid) as data_type,
  null::text as is_nullable,
  p.oid::text as detail_1,
  null::text as detail_2
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('admin_soft_delete_round', 'admin_restore_round')
union all
select
  'admin_log_columns' as section,
  c.table_schema,
  c.table_name,
  c.column_name,
  c.data_type,
  c.is_nullable,
  c.column_default::text as detail_1,
  null::text as detail_2
from information_schema.columns c
where c.table_schema = 'public'
  and c.table_name = 'admin_action_logs'
  and c.column_name in ('metadata', 'action', 'actor_member_id', 'target_member_id')
order by section, table_name, column_name;
