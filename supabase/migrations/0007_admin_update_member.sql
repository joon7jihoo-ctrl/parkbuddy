-- =========================================================
-- ParkBuddy admin member update migration
-- File: supabase/migrations/0007_admin_update_member.sql
--
-- Purpose:
--   Allow club admins to update active members safely.
--
-- Security goals:
--   1. Never trust client-provided club_id.
--   2. Only active admins can update members in their own club.
--   3. Prevent duplicate active phone numbers in the same club.
--   4. Prevent an admin from demoting their own admin role.
--   5. Prevent removing the last admin role in a club.
-- =========================================================

create or replace function public.admin_update_member(
  p_member_id uuid,
  p_name text,
  p_phone text,
  p_handicap numeric default 0,
  p_role text default 'member'
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

  if length(trim(coalesce(p_name, ''))) < 2 then
    raise exception 'INVALID_NAME';
  end if;

  if length(public.normalize_phone(p_phone)) < 8 then
    raise exception 'INVALID_PHONE';
  end if;

  if p_role not in ('member', 'admin') then
    raise exception 'INVALID_ROLE';
  end if;

  if p_handicap < -100 or p_handicap > 200 then
    raise exception 'INVALID_HANDICAP';
  end if;

  if exists (
    select 1
    from public.members m
    where m.club_id = v_admin.club_id
      and m.id <> v_target.id
      and public.normalize_phone(m.phone) = public.normalize_phone(p_phone)
      and m.status <> 'inactive'
  ) then
    raise exception 'DUPLICATE_PHONE';
  end if;

  if v_target.id = v_admin.id and p_role <> 'admin' then
    raise exception 'CANNOT_DEMOTE_SELF';
  end if;

  if v_target.role = 'admin' and p_role <> 'admin' then
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
    name = trim(p_name),
    phone = public.normalize_phone(p_phone),
    handicap = p_handicap,
    role = p_role,
    updated_at = now()
  where id = v_target.id
  returning * into v_target;

  return v_target;
end;
$$;

revoke all on function public.admin_update_member(uuid, text, text, numeric, text) from public;
grant execute on function public.admin_update_member(uuid, text, text, numeric, text) to authenticated;
