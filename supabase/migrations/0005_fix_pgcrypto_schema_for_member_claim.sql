-- =========================================================
-- ParkBuddy pgcrypto schema fix for member claim
-- File: supabase/migrations/0005_fix_pgcrypto_schema_for_member_claim.sql
--
-- Purpose:
--   Fix "function crypt(text, text) does not exist" in Supabase.
--
-- Why this happens:
--   In Supabase, pgcrypto functions such as crypt() and gen_salt()
--   are usually installed in the extensions schema.
--
--   Our security definer RPC uses:
--     set search_path = public
--
--   This is safer than relying on a broad search_path, but it means
--   unqualified calls like crypt(...) cannot find extensions.crypt(...).
--
-- Fix:
--   Use explicit schema-qualified function calls:
--     extensions.crypt(...)
--     extensions.gen_salt(...)
--
-- Development test claim info:
--   name: 운영자
--   phone: 01012345678
--   claim code: 123456
--
-- Important:
--   This script resets the development test admin member claim state.
--   Do not run this blindly in production.
-- =========================================================

create extension if not exists "pgcrypto" with schema extensions;

alter table public.members
add column if not exists claim_code_hash text,
add column if not exists claim_code_expires_at timestamptz,
add column if not exists claimed_at timestamptz;

create or replace function public.normalize_phone(input text)
returns text
language sql
immutable
set search_path = public
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
  v_existing_member public.members;
  v_normalized_phone text;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into v_existing_member
  from public.members
  where user_id = auth.uid()
    and status = 'active'
  limit 1;

  if found then
    raise exception 'ALREADY_CLAIMED';
  end if;

  if length(trim(coalesce(p_name, ''))) < 2 then
    raise exception 'INVALID_NAME';
  end if;

  v_normalized_phone := public.normalize_phone(p_phone);

  if length(v_normalized_phone) < 8 then
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
    and public.normalize_phone(phone) = v_normalized_phone
    and claim_code_hash is not null
    and claim_code_expires_at is not null
    and claim_code_expires_at > now()
    and claim_code_hash = extensions.crypt(trim(p_claim_code), claim_code_hash)
  order by created_at desc
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

insert into public.clubs (name, invite_code)
values ('파크버디 동호회', 'PARKBUDDY')
on conflict (invite_code) do nothing;

do $$
declare
  v_club_id uuid;
  v_target_member_id uuid;
begin
  select id
  into v_club_id
  from public.clubs
  where invite_code = 'PARKBUDDY'
  limit 1;

  if v_club_id is null then
    raise exception 'PARKBUDDY club was not created.';
  end if;

  select id
  into v_target_member_id
  from public.members
  where club_id = v_club_id
    and public.normalize_phone(phone) = public.normalize_phone('01012345678')
  order by created_at desc
  limit 1;

  if v_target_member_id is null then
    select id
    into v_target_member_id
    from public.members
    where club_id = v_club_id
      and lower(trim(name)) = lower(trim('운영자'))
    order by created_at desc
    limit 1;
  end if;

  if v_target_member_id is null then
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
      extensions.crypt('123456', extensions.gen_salt('bf')),
      now() + interval '7 days'
    )
    returning id into v_target_member_id;
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
    claim_code_hash = extensions.crypt('123456', extensions.gen_salt('bf')),
    claim_code_expires_at = now() + interval '7 days',
    updated_at = now()
  where id = v_target_member_id;

  update public.members
  set
    status = 'inactive',
    user_id = null,
    claimed_at = null,
    claim_code_hash = null,
    claim_code_expires_at = null,
    updated_at = now()
  where club_id = v_club_id
    and id <> v_target_member_id
    and (
      public.normalize_phone(phone) = public.normalize_phone('01012345678')
      or lower(trim(name)) = lower(trim('운영자'))
    );
end $$;

select
  m.id,
  c.name as club_name,
  c.invite_code,
  m.name,
  m.phone,
  public.normalize_phone(m.phone) as normalized_phone,
  m.role,
  m.status,
  m.user_id,
  m.claimed_at,
  m.claim_code_hash is not null as has_claim_code,
  m.claim_code_expires_at,
  m.claim_code_expires_at > now() as claim_code_is_valid,
  case
    when m.claim_code_hash is null then false
    else m.claim_code_hash = extensions.crypt('123456', m.claim_code_hash)
  end as claim_code_123456_matches
from public.members m
join public.clubs c on c.id = m.club_id
where c.invite_code = 'PARKBUDDY'
order by
  case when m.status = 'active' then 0 else 1 end,
  m.created_at desc;