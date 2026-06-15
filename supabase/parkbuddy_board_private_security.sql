-- ParkBuddy board private posts and security hardening
-- Apply this in Supabase SQL Editor before checking the board UI.

alter table public.posts
  add column if not exists is_private boolean not null default false;

create index if not exists posts_club_private_created_idx
  on public.posts(club_id, is_private, is_pinned desc, created_at desc);

-- Keep post privacy changes explicit and safe.
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
create trigger prevent_post_privilege_escalation
before update on public.posts
for each row
execute function public.prevent_post_privilege_escalation();

-- Posts: private posts are readable only by the author or club admins.
-- Drop both legacy and current policy names so this file can be safely re-run in Supabase SQL Editor.
drop policy if exists "members can read club posts" on public.posts;
drop policy if exists "members can read allowed club posts" on public.posts;
drop policy if exists "members can create free posts and admins can create notices" on public.posts;
drop policy if exists "authors or admins can update posts" on public.posts;
drop policy if exists "authors or admins can delete posts" on public.posts;

create policy "members can read allowed club posts" on public.posts
for select to authenticated
using (
  club_id = public.current_club_id()
  and (
    is_private = false
    or author_id = public.current_member_id()
    or public.is_club_admin(club_id)
  )
);

create policy "members can create free posts and admins can create notices" on public.posts
for insert to authenticated
with check (
  club_id = public.current_club_id()
  and author_id = public.current_member_id()
  and ((post_type = 'free' and is_pinned = false) or public.is_club_admin(club_id))
);

create policy "authors or admins can update posts" on public.posts
for update to authenticated
using (
  author_id = public.current_member_id() or public.is_club_admin(club_id)
)
with check (
  public.is_club_admin(club_id)
  or (
    author_id = public.current_member_id()
    and club_id = public.current_club_id()
    and post_type = 'free'
    and is_pinned = false
  )
);

create policy "authors or admins can delete posts" on public.posts
for delete to authenticated
using (
  author_id = public.current_member_id() or public.is_club_admin(club_id)
);

-- Attachments inherit post visibility. This prevents private post files from being discoverable by other members.
drop policy if exists "members can read club attachments" on public.post_attachments;
drop policy if exists "members can read allowed post attachments" on public.post_attachments;

create policy "members can read allowed post attachments" on public.post_attachments
for select to authenticated
using (
  exists (
    select 1
    from public.posts p
    where p.id = post_attachments.post_id
      and p.club_id = public.current_club_id()
      and (
        p.is_private = false
        or p.author_id = public.current_member_id()
        or public.is_club_admin(p.club_id)
      )
  )
);

-- Storage object policies mirror post visibility and ownership.
drop policy if exists "club members can read post images" on storage.objects;
drop policy if exists "members can read allowed post images" on storage.objects;
drop policy if exists "club members can upload post images" on storage.objects;
drop policy if exists "authors or admins can upload post images" on storage.objects;

create policy "members can read allowed post images" on storage.objects
for select to authenticated
using (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] ~* '^[0-9a-f-]{36}$'
  and (storage.foldername(name))[2] ~* '^[0-9a-f-]{36}$'
  and exists (
    select 1
    from public.posts p
    where p.club_id = public.current_club_id()
      and p.club_id::text = (storage.foldername(name))[1]
      and p.id = ((storage.foldername(name))[2])::uuid
      and (
        p.is_private = false
        or p.author_id = public.current_member_id()
        or public.is_club_admin(p.club_id)
      )
  )
);

create policy "authors or admins can upload post images" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] ~* '^[0-9a-f-]{36}$'
  and (storage.foldername(name))[2] ~* '^[0-9a-f-]{36}$'
  and exists (
    select 1
    from public.posts p
    where p.club_id = public.current_club_id()
      and p.club_id::text = (storage.foldername(name))[1]
      and p.id = ((storage.foldername(name))[2])::uuid
      and (p.author_id = public.current_member_id() or public.is_club_admin(p.club_id))
  )
);
