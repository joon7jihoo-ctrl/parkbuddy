-- ParkBuddy Scorecard Schema Inspection
-- Purpose: inspect existing scorecard-related tables before implementing group scorecard input.
-- Run this in Supabase SQL Editor.
-- This script is read-only.

-- 1. Check whether target tables exist.
select
  table_schema,
  table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'rounds',
    'members',
    'round_participants',
    'round_groups',
    'round_group_members',
    'round_scores',
    'hole_scores',
    'round_players'
  )
order by table_name;

-- 2. Inspect columns for scorecard-related tables.
select
  table_name,
  ordinal_position,
  column_name,
  data_type,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name in (
    'round_participants',
    'round_groups',
    'round_group_members',
    'round_scores',
    'hole_scores',
    'round_players'
  )
order by table_name, ordinal_position;

-- 3. Inspect foreign keys between these tables.
select
  tc.table_name as source_table,
  kcu.column_name as source_column,
  ccu.table_name as target_table,
  ccu.column_name as target_column,
  tc.constraint_name
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
 and tc.table_schema = kcu.table_schema
join information_schema.constraint_column_usage ccu
  on ccu.constraint_name = tc.constraint_name
 and ccu.table_schema = tc.table_schema
where tc.constraint_type = 'FOREIGN KEY'
  and tc.table_schema = 'public'
  and tc.table_name in (
    'round_participants',
    'round_groups',
    'round_group_members',
    'round_scores',
    'hole_scores',
    'round_players'
  )
order by tc.table_name, kcu.column_name;

-- 4. Inspect indexes and uniqueness rules.
select
  schemaname,
  tablename,
  indexname,
  indexdef
from pg_indexes
where schemaname = 'public'
  and tablename in (
    'round_participants',
    'round_groups',
    'round_group_members',
    'round_scores',
    'hole_scores',
    'round_players'
  )
order by tablename, indexname;

-- 5. Check RLS status.
select
  schemaname,
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'round_participants',
    'round_groups',
    'round_group_members',
    'round_scores',
    'hole_scores',
    'round_players'
  )
order by tablename;

-- 6. Inspect policies.
select
  schemaname,
  tablename,
  policyname,
  cmd,
  roles,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename in (
    'round_participants',
    'round_groups',
    'round_group_members',
    'round_scores',
    'hole_scores',
    'round_players'
  )
order by tablename, policyname;

-- 7. Count records to understand whether legacy tables contain production data.
select 'round_participants' as table_name, count(*) as row_count from public.round_participants
union all
select 'round_scores' as table_name, count(*) as row_count from public.round_scores
union all
select 'round_groups' as table_name, count(*) as row_count from public.round_groups
union all
select 'round_group_members' as table_name, count(*) as row_count from public.round_group_members
union all
select 'hole_scores' as table_name, count(*) as row_count from public.hole_scores
union all
select 'round_players' as table_name, count(*) as row_count from public.round_players
order by table_name;
