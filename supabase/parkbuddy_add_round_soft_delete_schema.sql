-- ParkBuddy round soft-delete schema migration
-- Safe scope: database schema/RPC only. No app code changes.

begin;

-- 1) Add soft-delete columns to rounds.
alter table public.rounds
  add column if not exists deleted_at timestamptz null,
  add column if not exists deleted_by_member_id uuid null references public.members(id) on delete set null;

-- 2) Helpful indexes for normal list and deleted list views.
create index if not exists idx_rounds_club_deleted_at
  on public.rounds (club_id, deleted_at);

create index if not exists idx_rounds_deleted_at
  on public.rounds (deleted_at);

-- 3) Soft delete RPC.
create or replace function public.admin_soft_delete_round(p_round_id uuid)
returns public.rounds
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor public.members%rowtype;
  v_round public.rounds%rowtype;
begin
  select *
    into v_actor
    from public.members
   where user_id = auth.uid()
     and status = 'active'
   limit 1;

  if v_actor.id is null then
    raise exception 'ACTIVE_MEMBER_NOT_FOUND';
  end if;

  select *
    into v_round
    from public.rounds
   where id = p_round_id
   for update;

  if v_round.id is null then
    raise exception 'ROUND_NOT_FOUND';
  end if;

  if v_round.club_id <> v_actor.club_id then
    raise exception 'ROUND_CLUB_MISMATCH';
  end if;

  if not public.is_club_admin(v_round.club_id) then
    raise exception 'ADMIN_REQUIRED';
  end if;

  update public.rounds
     set deleted_at = coalesce(deleted_at, now()),
         deleted_by_member_id = coalesce(deleted_by_member_id, v_actor.id),
         updated_at = now()
   where id = p_round_id
   returning * into v_round;

  perform public.admin_log_action(
    v_round.club_id,
    v_actor.id,
    null,
    'round_soft_delete',
    jsonb_build_object(
      'round_id', v_round.id,
      'round_title', v_round.title,
      'deleted_at', v_round.deleted_at
    )
  );

  return v_round;
end;
$$;

-- 4) Restore RPC.
create or replace function public.admin_restore_round(p_round_id uuid)
returns public.rounds
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor public.members%rowtype;
  v_round public.rounds%rowtype;
begin
  select *
    into v_actor
    from public.members
   where user_id = auth.uid()
     and status = 'active'
   limit 1;

  if v_actor.id is null then
    raise exception 'ACTIVE_MEMBER_NOT_FOUND';
  end if;

  select *
    into v_round
    from public.rounds
   where id = p_round_id
   for update;

  if v_round.id is null then
    raise exception 'ROUND_NOT_FOUND';
  end if;

  if v_round.club_id <> v_actor.club_id then
    raise exception 'ROUND_CLUB_MISMATCH';
  end if;

  if not public.is_club_admin(v_round.club_id) then
    raise exception 'ADMIN_REQUIRED';
  end if;

  update public.rounds
     set deleted_at = null,
         deleted_by_member_id = null,
         updated_at = now()
   where id = p_round_id
   returning * into v_round;

  perform public.admin_log_action(
    v_round.club_id,
    v_actor.id,
    null,
    'round_restore',
    jsonb_build_object(
      'round_id', v_round.id,
      'round_title', v_round.title
    )
  );

  return v_round;
end;
$$;

-- 5) Permissions for authenticated users; function body still checks active admin.
grant execute on function public.admin_soft_delete_round(uuid) to authenticated;
grant execute on function public.admin_restore_round(uuid) to authenticated;

commit;

-- Verification queries after running the migration:
-- select column_name, data_type, is_nullable
-- from information_schema.columns
-- where table_schema = 'public'
--   and table_name = 'rounds'
--   and column_name in ('deleted_at', 'deleted_by_member_id')
-- order by column_name;
--
-- select proname, pg_get_function_arguments(oid) as arguments, pg_get_function_result(oid) as result_type
-- from pg_proc
-- where pronamespace = 'public'::regnamespace
--   and proname in ('admin_soft_delete_round', 'admin_restore_round')
-- order by proname;
