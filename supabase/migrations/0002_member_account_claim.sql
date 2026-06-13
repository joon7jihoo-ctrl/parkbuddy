-- =========================================================
-- ParkBuddy member account claim migration
-- Purpose:
--   Safely connect authenticated Kakao users to pre-registered club members.
--
-- Security goals:
--   1. Do not trust client-provided user_id or club_id.
--   2. Store claim codes as hashes, never as plain text.
--   3. Allow claim code to be used only once.
--   4. Expire claim codes.
--   5. Prevent one auth user from claiming multiple member rows.
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

create or replace function public.claim_member_account(
  p_name text,
  p_phone text,
  p_claim_code text
)
returns public.members
language plpgsql
security definer
set search_path = public
as $$
declare
  v_member public.members;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if exists (
    select 1
    from public.members
    where user_id = auth.uid()
      and status = 'active'
  ) then
    raise exception 'ALREADY_CLAIMED';
  end if;

  if length(trim(coalesce(p_name, ''))) < 2 then
    raise exception 'INVALID_NAME';
  end if;

  if length(public.normalize_phone(p_phone)) < 8 then
    raise exception 'INVALID_PHONE';
  end if;

  if length(trim(coalesce(p_claim_code, ''))) < 6 then
    raise exception 'INVALID_CLAIM_CODE';
  end if;

  select *
  into v_member
  from public.members
  where user_id is null
    and status = 'active'
    and lower(trim(name)) = lower(trim(p_name))
    and public.normalize_phone(phone) = public.normalize_phone(p_phone)
    and claim_code_hash is not null
    and claim_code_expires_at > now()
    and claim_code_hash = crypt(trim(p_claim_code), claim_code_hash)
  limit 1
  for update;

  if not found then
    raise exception 'CLAIM_FAILED';
  end if;

  update public.members
  set
    user_id = auth.uid(),
    claim_code_hash = null,
    claim_code_expires_at = null,
    claimed_at = now(),
    updated_at = now()
  where id = v_member.id
  returning * into v_member;

  return v_member;
end;
$$;

revoke all on function public.claim_member_account(text, text, text) from public;
grant execute on function public.claim_member_account(text, text, text) to authenticated;

-- =========================================================
-- Optional initial seed for local development.
-- Run only if the club/member does not exist yet.
--
-- Test claim info:
--   name: 운영자
--   phone: 01012345678
--   claim code: 123456
-- =========================================================

insert into public.clubs (name, invite_code)
values ('파크버디 동호회', 'PARKBUDDY')
on conflict (invite_code) do nothing;

insert into public.members (
  club_id,
  name,
  phone,
  handicap,
  role,
  status,
  claim_code_hash,
  claim_code_expires_at
)
select
  c.id,
  '운영자',
  '01012345678',
  0,
  'admin',
  'active',
  crypt('123456', gen_salt('bf')),
  now() + interval '7 days'
from public.clubs c
where c.invite_code = 'PARKBUDDY'
  and not exists (
    select 1
    from public.members m
    where m.club_id = c.id
      and public.normalize_phone(m.phone) = public.normalize_phone('01012345678')
  );