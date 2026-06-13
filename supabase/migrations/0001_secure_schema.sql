-- ParkBuddy secure schema migration
-- Apply in Supabase SQL Editor or via Supabase CLI.

create extension if not exists "pgcrypto";

create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  invite_code text unique,
  created_at timestamptz not null default now()
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  name text not null check (char_length(name) between 1 and 40),
  phone text check (phone is null or char_length(phone) <= 20),
  handicap numeric(5,1) not null default 0 check (handicap between -50 and 200),
  joined_on date not null default current_date,
  avatar_path text,
  role text not null default 'member' check (role in ('admin', 'member')),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists members_user_unique on public.members(user_id) where user_id is not null;
create unique index if not exists members_club_phone_unique on public.members(club_id, phone) where phone is not null;
create index if not exists members_club_status_idx on public.members(club_id, status);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 80),
  event_type text not null default 'regular' check (event_type in ('regular', 'tournament', 'casual')),
  starts_at timestamptz not null,
  course_name text not null check (char_length(course_name) between 1 and 80),
  holes int not null default 18 check (holes in (9, 18, 27, 36)),
  max_participants int check (max_participants is null or max_participants between 1 and 200),
  memo text check (memo is null or char_length(memo) <= 1000),
  created_by uuid references public.members(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists events_club_starts_idx on public.events(club_id, starts_at);

create table if not exists public.event_votes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  status text not null check (status in ('attend', 'absent', 'maybe')),
  note text check (note is null or char_length(note) <= 500),
  voted_at timestamptz not null default now(),
  unique(event_id, member_id)
);

create index if not exists event_votes_event_status_idx on public.event_votes(event_id, status);

create table if not exists public.rounds (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null,
  title text not null check (char_length(title) between 1 and 80),
  played_on date not null default current_date,
  course_name text not null check (char_length(course_name) between 1 and 80),
  holes int not null default 18 check (holes in (9, 18, 27, 36)),
  memo text check (memo is null or char_length(memo) <= 1000),
  created_by uuid references public.members(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists rounds_club_played_idx on public.rounds(club_id, played_on desc);

create table if not exists public.round_players (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.rounds(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  memo text check (memo is null or char_length(memo) <= 500),
  created_at timestamptz not null default now(),
  unique(round_id, member_id)
);

create index if not exists round_players_member_idx on public.round_players(member_id);

create table if not exists public.hole_scores (
  id uuid primary key default gen_random_uuid(),
  round_player_id uuid not null references public.round_players(id) on delete cascade,
  hole_no int not null check (hole_no between 1 and 36),
  par int not null default 3 check (par between 2 and 6),
  strokes int not null check (strokes between 1 and 20),
  unique(round_player_id, hole_no)
);

create index if not exists hole_scores_round_player_idx on public.hole_scores(round_player_id);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  author_id uuid references public.members(id) on delete set null,
  post_type text not null default 'free' check (post_type in ('notice', 'free')),
  title text not null check (char_length(title) between 1 and 100),
  content text not null check (char_length(content) between 1 and 5000),
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_club_created_idx on public.posts(club_id, is_pinned desc, created_at desc);

create table if not exists public.post_attachments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  file_path text not null,
  content_type text check (content_type in ('image/jpeg', 'image/png', 'image/webp')),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists post_attachments_post_idx on public.post_attachments(post_id, sort_order);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_members_updated_at on public.members;
create trigger touch_members_updated_at before update on public.members for each row execute function public.touch_updated_at();

drop trigger if exists touch_posts_updated_at on public.posts;
create trigger touch_posts_updated_at before update on public.posts for each row execute function public.touch_updated_at();


create or replace function public.prevent_member_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if not public.is_club_admin(old.club_id) then
    if new.club_id is distinct from old.club_id
       or new.user_id is distinct from old.user_id
       or new.role is distinct from old.role
       or new.status is distinct from old.status
       or new.joined_on is distinct from old.joined_on then
      raise exception 'not allowed to update protected member fields';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_member_privilege_escalation on public.members;
create trigger prevent_member_privilege_escalation before update on public.members for each row execute function public.prevent_member_privilege_escalation();

create or replace function public.prevent_post_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if not public.is_club_admin(old.club_id) then
    if new.club_id is distinct from old.club_id
       or new.author_id is distinct from old.author_id
       or new.post_type is distinct from old.post_type
       or new.is_pinned is distinct from old.is_pinned then
      raise exception 'not allowed to update protected post fields';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_post_privilege_escalation on public.posts;
create trigger prevent_post_privilege_escalation before update on public.posts for each row execute function public.prevent_post_privilege_escalation();

create or replace function public.current_member_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.members where user_id = auth.uid() and status = 'active' limit 1
$$;

create or replace function public.current_club_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select club_id from public.members where user_id = auth.uid() and status = 'active' limit 1
$$;

create or replace function public.is_club_admin(target_club_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.members
    where user_id = auth.uid()
      and club_id = target_club_id
      and role = 'admin'
      and status = 'active'
  )
$$;

alter table public.clubs enable row level security;
alter table public.members enable row level security;
alter table public.events enable row level security;
alter table public.event_votes enable row level security;
alter table public.rounds enable row level security;
alter table public.round_players enable row level security;
alter table public.hole_scores enable row level security;
alter table public.posts enable row level security;
alter table public.post_attachments enable row level security;

-- Clubs
create policy "members can read their club" on public.clubs for select to authenticated using (id = public.current_club_id());
create policy "admins can update their club" on public.clubs for update to authenticated using (public.is_club_admin(id)) with check (public.is_club_admin(id));

-- Members
create policy "members can read same club members" on public.members for select to authenticated using (club_id = public.current_club_id());
create policy "admins can insert same club members" on public.members for insert to authenticated with check (public.is_club_admin(club_id));
create policy "admins can update same club members" on public.members for update to authenticated using (public.is_club_admin(club_id)) with check (public.is_club_admin(club_id));
create policy "members can update own limited profile" on public.members for update to authenticated using (id = public.current_member_id()) with check (id = public.current_member_id() and club_id = public.current_club_id());

-- Events
create policy "members can read club events" on public.events for select to authenticated using (club_id = public.current_club_id());
create policy "admins can insert club events" on public.events for insert to authenticated with check (public.is_club_admin(club_id));
create policy "admins can update club events" on public.events for update to authenticated using (public.is_club_admin(club_id)) with check (public.is_club_admin(club_id));
create policy "admins can delete club events" on public.events for delete to authenticated using (public.is_club_admin(club_id));

-- Event votes
create policy "members can read club votes" on public.event_votes for select to authenticated using (
  exists (select 1 from public.events e where e.id = event_votes.event_id and e.club_id = public.current_club_id())
);
create policy "members can insert own vote" on public.event_votes for insert to authenticated with check (
  member_id = public.current_member_id()
  and exists (select 1 from public.events e where e.id = event_votes.event_id and e.club_id = public.current_club_id())
);
create policy "members can update own vote" on public.event_votes for update to authenticated using (member_id = public.current_member_id()) with check (member_id = public.current_member_id());
create policy "admins can manage club votes" on public.event_votes for all to authenticated using (
  exists (select 1 from public.events e where e.id = event_votes.event_id and public.is_club_admin(e.club_id))
) with check (
  exists (select 1 from public.events e where e.id = event_votes.event_id and public.is_club_admin(e.club_id))
);

-- Rounds
create policy "members can read club rounds" on public.rounds for select to authenticated using (club_id = public.current_club_id());
create policy "admins can insert club rounds" on public.rounds for insert to authenticated with check (public.is_club_admin(club_id));
create policy "admins can update club rounds" on public.rounds for update to authenticated using (public.is_club_admin(club_id)) with check (public.is_club_admin(club_id));
create policy "admins can delete club rounds" on public.rounds for delete to authenticated using (public.is_club_admin(club_id));

-- Round players
create policy "members can read club round players" on public.round_players for select to authenticated using (
  exists (select 1 from public.rounds r where r.id = round_players.round_id and r.club_id = public.current_club_id())
);
create policy "members can insert own round player" on public.round_players for insert to authenticated with check (
  member_id = public.current_member_id()
  and exists (select 1 from public.rounds r where r.id = round_players.round_id and r.club_id = public.current_club_id())
);
create policy "admins can manage club round players" on public.round_players for all to authenticated using (
  exists (select 1 from public.rounds r where r.id = round_players.round_id and public.is_club_admin(r.club_id))
) with check (
  exists (select 1 from public.rounds r where r.id = round_players.round_id and public.is_club_admin(r.club_id))
);

-- Hole scores
create policy "members can read club hole scores" on public.hole_scores for select to authenticated using (
  exists (
    select 1 from public.round_players rp join public.rounds r on r.id = rp.round_id
    where rp.id = hole_scores.round_player_id and r.club_id = public.current_club_id()
  )
);
create policy "members can insert own hole scores" on public.hole_scores for insert to authenticated with check (
  exists (
    select 1 from public.round_players rp join public.rounds r on r.id = rp.round_id
    where rp.id = hole_scores.round_player_id and rp.member_id = public.current_member_id() and r.club_id = public.current_club_id()
  )
);
create policy "members can update own hole scores" on public.hole_scores for update to authenticated using (
  exists (
    select 1 from public.round_players rp join public.rounds r on r.id = rp.round_id
    where rp.id = hole_scores.round_player_id and rp.member_id = public.current_member_id() and r.club_id = public.current_club_id()
  )
) with check (
  exists (
    select 1 from public.round_players rp join public.rounds r on r.id = rp.round_id
    where rp.id = hole_scores.round_player_id and rp.member_id = public.current_member_id() and r.club_id = public.current_club_id()
  )
);
create policy "admins can manage club hole scores" on public.hole_scores for all to authenticated using (
  exists (
    select 1 from public.round_players rp join public.rounds r on r.id = rp.round_id
    where rp.id = hole_scores.round_player_id and public.is_club_admin(r.club_id)
  )
) with check (
  exists (
    select 1 from public.round_players rp join public.rounds r on r.id = rp.round_id
    where rp.id = hole_scores.round_player_id and public.is_club_admin(r.club_id)
  )
);

-- Posts
create policy "members can read club posts" on public.posts for select to authenticated using (club_id = public.current_club_id());
create policy "members can create free posts and admins can create notices" on public.posts for insert to authenticated with check (
  club_id = public.current_club_id()
  and author_id = public.current_member_id()
  and ((post_type = 'free' and is_pinned = false) or public.is_club_admin(club_id))
);
create policy "authors or admins can update posts" on public.posts for update to authenticated using (
  author_id = public.current_member_id() or public.is_club_admin(club_id)
) with check (
  public.is_club_admin(club_id)
  or (
    author_id = public.current_member_id()
    and club_id = public.current_club_id()
    and post_type = 'free'
    and is_pinned = false
  )
);
create policy "authors or admins can delete posts" on public.posts for delete to authenticated using (
  author_id = public.current_member_id() or public.is_club_admin(club_id)
);

-- Post attachments
create policy "members can read club attachments" on public.post_attachments for select to authenticated using (
  exists (select 1 from public.posts p where p.id = post_attachments.post_id and p.club_id = public.current_club_id())
);
create policy "authors or admins can insert attachments" on public.post_attachments for insert to authenticated with check (
  exists (
    select 1 from public.posts p
    where p.id = post_attachments.post_id
      and post_attachments.file_path like p.club_id::text || '/' || p.id::text || '/%'
      and (p.author_id = public.current_member_id() or public.is_club_admin(p.club_id))
  )
);

create or replace view public.member_round_totals
with (security_invoker = true) as
select
  rp.id as round_player_id,
  r.id as round_id,
  r.club_id,
  r.played_on,
  r.course_name,
  m.id as member_id,
  m.name as member_name,
  sum(hs.strokes)::int as total_strokes
from public.round_players rp
join public.rounds r on r.id = rp.round_id
join public.members m on m.id = rp.member_id
join public.hole_scores hs on hs.round_player_id = rp.id
group by rp.id, r.id, r.club_id, r.played_on, r.course_name, m.id, m.name;

create or replace view public.member_score_stats
with (security_invoker = true) as
select
  member_id,
  member_name,
  count(*)::int as rounds_count,
  round(avg(total_strokes)::numeric, 1) as avg_score,
  min(total_strokes)::int as best_score
from public.member_round_totals
group by member_id, member_name;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true), ('post-images', 'post-images', false)
on conflict (id) do nothing;

create policy "members can upload own avatar" on storage.objects for insert to authenticated with check (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = public.current_member_id()::text
);
create policy "members can manage own avatar" on storage.objects for update to authenticated using (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = public.current_member_id()::text
) with check (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = public.current_member_id()::text
);
create policy "club members can read post images" on storage.objects for select to authenticated using (
  bucket_id = 'post-images' and (storage.foldername(name))[1] = public.current_club_id()::text
);
create policy "club members can upload post images" on storage.objects for insert to authenticated with check (
  bucket_id = 'post-images' and (storage.foldername(name))[1] = public.current_club_id()::text
);
create policy "admins can delete club post images" on storage.objects for delete to authenticated using (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] ~* '^[0-9a-f-]{36}$'
  and public.is_club_admin((storage.foldername(name))[1]::uuid)
);
