-- =========================================================
-- ParkBuddy development repair migration
-- File: supabase/migrations/0003_reset_admin_claim_code.sql
--
-- Purpose:
--   Reissue the initial admin member claim code for local development.
--
-- Test claim info:
--   name: 운영자
--   phone: 01012345678
--   claim code: 123456
--
-- Important:
--   This script resets user_id and claimed_at for the test admin member.
--   Use this only in local/development setup.
-- =========================================================

create extension if not exists "pgcrypto";

alter table public.members
add column if not exists claim_code_hash text,
add column if not exists claim_code_expires_at timestamptz,
add column if not exists claimed_at timestamptz;

create or replace function public.normalize_phone(input text)
returns text
language sql
immutable
as $$
  select regexp_replace(coalesce(input, ''), '\D', '', 'g')
$$;

insert into public.clubs (name, invite_code)
values ('파크버디 동호회', 'PARKBUDDY')
on conflict (invite_code) do nothing;

do $$
declare
  v_club_id uuid;
  v_member_id uuid;
begin
  select id
  into v_club_id
  from public.clubs
  where invite_code = 'PARKBUDDY'
  limit 1;

  if v_club_id is null then
    raise exception 'PARKBUDDY club was not created.';
  end if;

  update public.members
  set
    name = '운영자',
    phone = '01012345678',
    handicap = 0,
    role = 'admin',
    status = 'active',
    user_id = null,
    claimed_at = null,
    claim_code_hash = crypt('123456', gen_salt('bf')),
    claim_code_expires_at = now() + interval '7 days',
    updated_at = now()
  where club_id = v_club_id
    and (
      public.normalize_phone(phone) = public.normalize_phone('01012345678')
      or lower(trim(name)) = lower(trim('운영자'))
    )
  returning id into v_member_id;

  if v_member_id is null then
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
      v_club_id,
      '운영자',
      '01012345678',
      0,
      'admin',
      'active',
      null,
      null,
      crypt('123456', gen_salt('bf')),
      now() + interval '7 days'
    )
    returning id into v_member_id;
  end if;
end $$;