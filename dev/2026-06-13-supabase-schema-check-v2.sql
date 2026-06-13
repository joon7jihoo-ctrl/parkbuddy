-- ParkBuddy Supabase 실제 스키마 점검 v2
-- 목적: 여러 결과셋이 아니라 하나의 표(section, item_name, detail)로 합쳐서 복사/CSV 다운로드가 쉽도록 만든 점검 SQL입니다.

with table_columns as (
  select
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
  from information_schema.columns
  where table_schema = 'public'
    and table_name in (
      'rounds',
      'members',
      'admin_action_logs',
      'round_participants',
      'round_pairings',
      'round_scores'
    )
), functions as (
  select
    p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as arguments,
    pg_get_function_result(p.oid) as result_type,
    pg_get_functiondef(p.oid) as definition
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname in (
      'admin_duplicate_round',
      'admin_log_action',
      'admin_create_round',
      'admin_update_round_status',
      'admin_update_round_scores',
      'admin_update_round_pairings',
      'admin_update_round_participants'
    )
), recent_logs as (
  select
    id,
    action,
    metadata,
    created_at
  from public.admin_action_logs
  order by created_at desc
  limit 20
)
select
  'table_columns' as section,
  table_name || '.' || column_name as item_name,
  concat(
    'type=', data_type,
    '; nullable=', is_nullable,
    '; default=', coalesce(column_default, 'null'),
    '; order=', ordinal_position::text
  ) as detail
from table_columns

union all

select
  'functions' as section,
  function_name as item_name,
  concat(
    'args=', arguments,
    E'\nresult=', result_type,
    E'\ndefinition=', definition
  ) as detail
from functions

union all

select
  'recent_admin_action_logs' as section,
  action as item_name,
  concat(
    'id=', id::text,
    E'\nmetadata=', metadata::text,
    E'\ncreated_at=', created_at::text
  ) as detail
from recent_logs

order by section, item_name;
