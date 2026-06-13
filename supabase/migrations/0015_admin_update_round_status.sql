-- =========================================================
-- ParkBuddy round status migration
-- File: supabase/migrations/0015_admin_update_round_status.sql
--
-- Purpose:
--   Allow club admins to update a round status safely.
-- =========================================================

create or replace function public.admin_update_round_status(
  p_round_id uuid,
  p_status text
)
returns public.rounds
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_round public.rounds;
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

  if p_status not in ('scheduled', 'completed', 'cancelled') then
    raise exception 'INVALID_ROUND_STATUS';
  end if;

  select *
  into v_round
  from public.rounds
  where id = p_round_id
    and club_id = v_admin.club_id
  limit 1
  for update;

  if not found then
    raise exception 'ROUND_NOT_FOUND';
  end if;

  update public.rounds
  set
    status = p_status,
    updated_at = now()
  where id = v_round.id
  returning * into v_round;

  if to_regclass('public.admin_action_logs') is not null then
    perform public.admin_log_action(
      v_admin.club_id,
      v_admin.id,
      null,
      'round.status.update',
      jsonb_build_object(
        'round_id', v_round.id,
        'title', v_round.title,
        'status', v_round.status
      )
    );
  end if;

  return v_round;
end;
$$;

revoke all on function public.admin_update_round_status(uuid, text) from public;
grant execute on function public.admin_update_round_status(uuid, text) to authenticated;
