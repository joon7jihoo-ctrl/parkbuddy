-- =========================================================
-- ParkBuddy admin member deactivate migration
-- File: supabase/migrations/0008_admin_deactivate_member.sql
--
-- Purpose:
--   Allow club admins to deactivate active members safely.
--
-- Security goals:
--   1. Never trust client-provided club_id.
--   2. Only active admins can deactivate members in their own club.
--   3. Prevent an admin from deactivating themself.
--   4. Prevent deactivating the last active admin in a club.
--   5. Do not hard-delete member rows.
-- =========================================================

create or replace function public.admin_deactivate_member(
  p_member_id uuid
)
returns public.members
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_target public.members;
  v_admin_count integer;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into v_admin
  from public.members
  where user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  limit 1;

  if not found then
    raise exception 'ADMIN_REQUIRED';
  end if;

  select *
  into v_target
  from public.members
  where id = p_member_id
    and club_id = v_admin.club_id
    and status = 'active'
  limit 1
  for update;

  if not found then
    raise exception 'MEMBER_NOT_FOUND';
  end if;

  if v_target.id = v_admin.id then
    raise exception 'CANNOT_DEACTIVATE_SELF';
  end if;

  if v_target.role = 'admin' then
    select count(*)
    into v_admin_count
    from public.members m
    where m.club_id = v_admin.club_id
      and m.role = 'admin'
      and m.status = 'active';

    if v_admin_count <= 1 then
      raise exception 'LAST_ADMIN_REQUIRED';
    end if;
  end if;

  update public.members
  set
    status = 'inactive',
    claim_code_hash = null,
    claim_code_expires_at = null,
    updated_at = now()
  where id = v_target.id
  returning * into v_target;

  return v_target;
end;
$$;

revoke all on function public.admin_deactivate_member(uuid) from public;
grant execute on function public.admin_deactivate_member(uuid) to authenticated;
