-- ParkBuddy: fix admin_duplicate_round to use members.user_id
-- Run this file in Supabase SQL Editor.

create or replace function public.admin_duplicate_round(p_round_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin record;
  v_source record;
  v_new_round_id uuid;
begin
  select m.id, m.club_id, m.role, m.status
    into v_admin
  from public.members m
  where m.user_id = auth.uid()
    and m.status = 'active'
    and m.role in ('admin', 'owner')
  limit 1;

  if v_admin.id is null then
    raise exception 'Only active admins can duplicate rounds.';
  end if;

  select r.*
    into v_source
  from public.rounds r
  where r.id = p_round_id
    and r.club_id = v_admin.club_id
  limit 1;

  if v_source.id is null then
    raise exception 'Round was not found.';
  end if;

  insert into public.rounds (
    club_id,
    title,
    course_name,
    play_date,
    status,
    game_type,
    scoring_type,
    memo
  )
  values (
    v_source.club_id,
    coalesce(v_source.title, '라운드') || ' 복사본',
    v_source.course_name,
    v_source.play_date,
    'scheduled',
    v_source.game_type,
    v_source.scoring_type,
    v_source.memo
  )
  returning id into v_new_round_id;
return v_new_round_id;
end;
$$;

grant execute on function public.admin_duplicate_round(uuid) to authenticated;
