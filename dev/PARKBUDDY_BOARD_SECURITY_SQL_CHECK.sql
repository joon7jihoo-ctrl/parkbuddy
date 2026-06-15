-- ParkBuddy board private security read-only verification
-- Purpose: Run this in Supabase SQL Editor after applying supabase/parkbuddy_board_private_security.sql.
-- This query does not change data. It checks the column, policies, trigger, and storage bucket policies needed for private board posts.

with expected_items as (
  select * from (values
    ('column', 'public.posts.is_private'),
    ('policy', 'public.posts.members can read allowed club posts'),
    ('policy', 'public.posts.members can create free posts and admins can create notices'),
    ('policy', 'public.posts.authors or admins can update posts'),
    ('policy', 'public.posts.authors or admins can delete posts'),
    ('policy', 'public.post_attachments.members can read allowed post attachments'),
    ('policy', 'storage.objects.members can read allowed post images'),
    ('policy', 'storage.objects.authors or admins can upload post images'),
    ('trigger', 'public.posts.prevent_post_privilege_escalation')
  ) as t(item_type, item_name)
), actual_items as (
  select
    'column' as item_type,
    table_schema || '.' || table_name || '.' || column_name as item_name,
    data_type || '; nullable=' || is_nullable || '; default=' || coalesce(column_default, 'null') as detail
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'posts'
    and column_name = 'is_private'

  union all

  select
    'policy' as item_type,
    schemaname || '.' || tablename || '.' || policyname as item_name,
    'cmd=' || cmd || '; roles=' || coalesce(roles::text, 'null') || '; permissive=' || permissive as detail
  from pg_policies
  where (schemaname = 'public' and tablename in ('posts', 'post_attachments'))
     or (schemaname = 'storage' and tablename = 'objects')

  union all

  select
    'trigger' as item_type,
    event_object_schema || '.' || event_object_table || '.' || trigger_name as item_name,
    action_timing || ' ' || event_manipulation || '; enabled' as detail
  from information_schema.triggers
  where event_object_schema = 'public'
    and event_object_table = 'posts'
    and trigger_name = 'prevent_post_privilege_escalation'
)
select
  e.item_type,
  e.item_name,
  case when a.item_name is null then 'FAIL' else 'PASS' end as check_result,
  coalesce(a.detail, 'missing') as detail
from expected_items e
left join actual_items a
  on a.item_type = e.item_type
 and a.item_name = e.item_name
order by
  case when a.item_name is null then 0 else 1 end,
  e.item_type,
  e.item_name;
