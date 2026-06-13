-- =========================================================
-- ParkBuddy admin member management migration
-- File: supabase/migrations/0006_admin_member_management.sql
--
-- Purpose:
--   Allow club admins to create members and reissue claim codes
--   without using Supabase SQL Editor manually.
--
-- Security goals:
--   1. Never trust client-provided club_id.
--   2. Only active admins can create members.
--   3. Claim codes are generated inside DB and stored as hashes.
--   4. Plain claim code is returned only once to the admin.
--   5. Claim code cannot be reissued for already linked members.
-- =========================================================

create extension if not exists "pgcrypto" with schema extensions;

alter table public.members
add column if not exists claim_code_hash text,
add column if not exists claim_code_expires_at timestamptz,
add column if not exists claimed_at timestamptz;

create or replace function public.generate_member_claim_code()
returns text
language sql
volatile
set search_path = public
as $$
  select upper(substr(encode(extensions.gen_random_bytes(8), 'hex'), 1, 8))
$$;

create or replace function public.admin_create_member(
  p_name text,
  p_phone text,
  p_handicap numeric default 0,
  p_role text default 'member'
)
returns table (
  member_id uuid,
  member_name text,
  member_phone text,
  member_role text,
  claim_code text,
  claim_code_expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_claim_code text;
  v_member public.members;
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
      and public.normalize_phone(m.phone) = public.normalize_phone(p_phone)
      and m.status <> 'inactive'
  ) then
    raise exception 'DUPLICATE_PHONE';
  end if;

  v_claim_code := public.generate_member_claim_code();

  insert into public.members (
    club_id,
    name,
    phone,
    handicap,
    role,
    status,
    user_id,
    claimed_at,
    claim_code_hash,
    claim_code_expires_at
  )
  values (
    v_admin.club_id,
    trim(p_name),
    public.normalize_phone(p_phone),
    p_handicap,
    p_role,
    'active',
    null,
    null,
    extensions.crypt(v_claim_code, extensions.gen_salt('bf')),
    now() + interval '7 days'
  )
  returning * into v_member;

  return query
  select
    v_member.id,
    v_member.name,
    v_member.phone,
    v_member.role,
    v_claim_code,
    v_member.claim_code_expires_at;
end;
$$;

create or replace function public.admin_reissue_member_claim_code(
  p_member_id uuid
)
returns table (
  member_id uuid,
  member_name text,
  member_phone text,
  claim_code text,
  claim_code_expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_target public.members;
  v_claim_code text;
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

  if v_target.user_id is not null then
    raise exception 'MEMBER_ALREADY_LINKED';
  end if;

  v_claim_code := public.generate_member_claim_code();

  update public.members
  set
    claim_code_hash = extensions.crypt(v_claim_code, extensions.gen_salt('bf')),
    claim_code_expires_at = now() + interval '7 days',
    claimed_at = null,
    updated_at = now()
  where id = v_target.id
  returning * into v_target;

  return query
  select
    v_target.id,
    v_target.name,
    v_target.phone,
    v_claim_code,
    v_target.claim_code_expires_at;
end;
$$;

revoke all on function public.generate_member_claim_code() from public;
revoke all on function public.admin_create_member(text, text, numeric, text) from public;
revoke all on function public.admin_reissue_member_claim_code(uuid) from public;

grant execute on function public.admin_create_member(text, text, numeric, text) to authenticated;
grant execute on function public.admin_reissue_member_claim_code(uuid) to authenticated;