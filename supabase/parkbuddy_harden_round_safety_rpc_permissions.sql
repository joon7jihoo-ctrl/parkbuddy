-- ParkBuddy round safety RPC permission hardening
-- Purpose: reduce unnecessary execution surface for round soft-delete / restore RPCs.
--
-- Safe scope:
-- - No data is changed.
-- - The RPC bodies are not replaced.
-- - Anonymous/public execution is revoked.
-- - Authenticated execution is kept because the RPC body still checks active admin membership.
--
-- Run this in Supabase SQL Editor after reviewing the check SQL result.

begin;

revoke execute on function public.admin_soft_delete_round(uuid) from public;
revoke execute on function public.admin_restore_round(uuid) from public;

revoke execute on function public.admin_soft_delete_round(uuid) from anon;
revoke execute on function public.admin_restore_round(uuid) from anon;

-- Keep authenticated access. The function body validates active member, same club, and admin role.
grant execute on function public.admin_soft_delete_round(uuid) to authenticated;
grant execute on function public.admin_restore_round(uuid) to authenticated;

comment on function public.admin_soft_delete_round(uuid)
  is 'ParkBuddy admin-only round soft delete RPC. Execute is granted to authenticated users; function body checks active same-club admin.';

comment on function public.admin_restore_round(uuid)
  is 'ParkBuddy admin-only round restore RPC. Execute is granted to authenticated users; function body checks active same-club admin.';

commit;

-- Recommended verification after commit:
-- Run supabase/parkbuddy_round_safety_rpc_permission_check.sql again.
