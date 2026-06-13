-- Optional local seed. Replace the UUID values before use.
insert into public.clubs (id, name, invite_code)
values ('00000000-0000-0000-0000-000000000001', '파크버디 샘플 동호회', 'PARKBUDDY')
on conflict (id) do nothing;

-- After a real user signs in, copy auth.users.id and set user_id for the first admin.
insert into public.members (club_id, name, phone, handicap, role, status)
values ('00000000-0000-0000-0000-000000000001', '운영진', null, 0, 'admin', 'active');
