-- =========================================================
-- ParkBuddy admin restore member migration
-- File: supabase/migrations/0010_admin_restore_member.sql
--
-- Purpose:
--   Allow club admins to restore inactive members safely.
--
-- Security goals:
--   1. Never trust client-provided club_id.
--   2. Only active admins can restore members in their own club.
--   3. Prevent restoring a member when their phone number conflicts
--      with another active member in the same club.
--   4. Do not recreate claim codes automatically during restore.
--      Admins can reissue a claim code after restore when needed.
-- =========================================================

create or replace function public.admin_restore_member(
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
    and status = 'inactive'
  limit 1
  for update;

  if not found then
    raise exception 'MEMBER_NOT_FOUND';
  end if;

  if exists (
    select 1
    from public.members m
    where m.club_id = v_admin.club_id
      and m.id <> v_target.id
      and m.status = 'active'
      and public.normalize_phone(m.phone) = public.normalize_phone(v_target.phone)
  ) then
    raise exception 'DUPLICATE_PHONE';
  end if;

  update public.members
  set
    status = 'active',
    updated_at = now()
  where id = v_target.id
  returning * into v_target;

  -- Core audit logic: never store sensitive claim code plaintext in logs.
  perform public.admin_log_action(
    v_admin.club_id,
    v_admin.id,
    v_target.id,
    'member.restore',
    jsonb_build_object(
      'member_name', v_target.name,
      'member_role', v_target.role
    )
  );

  return v_target;
end;
$$;

revoke all on function public.admin_restore_member(uuid) from public;
grant execute on function public.admin_restore_member(uuid) to authenticated;
