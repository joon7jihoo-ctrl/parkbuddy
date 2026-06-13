-- =========================================================
-- ParkBuddy admin action logs migration
-- File: supabase/migrations/0009_admin_action_logs.sql
--
-- Purpose:
--   Record important admin actions for auditability.
--
-- Security goals:
--   1. Logs are append-only from application flows.
--   2. Users can read logs only for their own club.
--   3. Admin RPC functions write logs inside the same DB transaction.
--   4. Sensitive claim code plaintext is never written to logs.
-- =========================================================

create table if not exists public.admin_action_logs (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  actor_member_id uuid references public.members(id) on delete set null,
  target_member_id uuid references public.members(id) on delete set null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.admin_action_logs enable row level security;

drop policy if exists "club members can read same club admin action logs"
on public.admin_action_logs;

create policy "club members can read same club admin action logs"
on public.admin_action_logs
for select
to authenticated
using (
  exists (
    select 1
    from public.members m
    where m.user_id = auth.uid()
      and m.club_id = admin_action_logs.club_id
      and m.status = 'active'
  )
);

create index if not exists admin_action_logs_club_created_idx
on public.admin_action_logs (club_id, created_at desc);

create index if not exists admin_action_logs_target_member_idx
on public.admin_action_logs (target_member_id, created_at desc);

create or replace function public.admin_log_action(
  p_club_id uuid,
  p_actor_member_id uuid,
  p_target_member_id uuid,
  p_action text,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_action is null or length(trim(p_action)) < 2 then
    raise exception 'INVALID_ADMIN_ACTION';
  end if;

  insert into public.admin_action_logs (
    club_id,
    actor_member_id,
    target_member_id,
    action,
    metadata
  )
  values (
    p_club_id,
    p_actor_member_id,
    p_target_member_id,
    trim(p_action),
    coalesce(p_metadata, '{}'::jsonb)
  );
end;
$$;

revoke all on function public.admin_log_action(uuid, uuid, uuid, text, jsonb) from public;

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

  perform public.admin_log_action(
    v_admin.club_id,
    v_admin.id,
    v_member.id,
    'member.create',
    jsonb_build_object(
      'member_name', v_member.name,
      'member_role', v_member.role
    )
  );

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

  perform public.admin_log_action(
    v_admin.club_id,
    v_admin.id,
    v_target.id,
    'member.claim_code.reissue',
    jsonb_build_object('member_name', v_target.name)
  );

  return query
  select
    v_target.id,
    v_target.name,
    v_target.phone,
    v_claim_code,
    v_target.claim_code_expires_at;
end;
$$;

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
  v_before public.members;
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

  v_before := v_target;

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

  perform public.admin_log_action(
    v_admin.club_id,
    v_admin.id,
    v_target.id,
    'member.update',
    jsonb_build_object(
      'before', jsonb_build_object(
        'name', v_before.name,
        'phone', v_before.phone,
        'handicap', v_before.handicap,
        'role', v_before.role
      ),
      'after', jsonb_build_object(
        'name', v_target.name,
        'phone', v_target.phone,
        'handicap', v_target.handicap,
        'role', v_target.role
      )
    )
  );

  return v_target;
end;
$$;

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

  perform public.admin_log_action(
    v_admin.club_id,
    v_admin.id,
    v_target.id,
    'member.deactivate',
    jsonb_build_object(
      'member_name', v_target.name,
      'member_role', v_target.role
    )
  );

  return v_target;
end;
$$;

revoke all on function public.admin_create_member(text, text, numeric, text) from public;
revoke all on function public.admin_reissue_member_claim_code(uuid) from public;
revoke all on function public.admin_update_member(uuid, text, text, numeric, text) from public;
revoke all on function public.admin_deactivate_member(uuid) from public;

grant execute on function public.admin_create_member(text, text, numeric, text) to authenticated;
grant execute on function public.admin_reissue_member_claim_code(uuid) to authenticated;
grant execute on function public.admin_update_member(uuid, text, text, numeric, text) to authenticated;
grant execute on function public.admin_deactivate_member(uuid) to authenticated;
