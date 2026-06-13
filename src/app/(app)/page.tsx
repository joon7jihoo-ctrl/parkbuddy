import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: me } = await supabase
    .from('members')
    .select('id, name, role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!me) {
    redirect('/member-link');
  }

  const { data: events } = await supabase
    .from('events')
    .select('id, title, starts_at, course_name')
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })
    .limit(3);

  const { data: notices } = await supabase
    .from('posts')
    .select('id, title, created_at')
    .eq('post_type', 'notice')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <main className="space-y-5">
      <header>
        <p className="text-sm font-medium text-emerald-600">ParkBuddy</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          {me.name}님, 오늘도 즐거운 라운딩 되세요
        </h1>
      </header>

      <section className="rounded-3xl bg-emerald-600 p-5 text-white shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm opacity-90">다가오는 일정</p>
            <h2 className="mt-1 text-xl font-bold">라운딩 일정 확인</h2>
          </div>

          <Link
            href="/schedule"
            className="rounded-2xl bg-white/15 px-3 py-2 text-sm font-semibold"
          >
            전체보기
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {events?.length ? (
            events.map((event) => (
              <Link
                key={event.id}
                href="/schedule"
                className="block rounded-2xl bg-white/15 p-4 transition active:scale-[0.99]"
              >
                <p className="font-semibold">{event.title}</p>
                <p className="mt-1 text-sm opacity-90">
                  {new Date(event.starts_at).toLocaleString('ko-KR')} ·{' '}
                  {event.course_name}
                </p>
              </Link>
            ))
          ) : (
            <p className="rounded-2xl bg-white/15 p-4 text-sm opacity-90">
              등록된 일정이 없습니다.
            </p>
          )}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Link
          href="/members"
          className="rounded-3xl bg-white p-5 shadow-sm transition active:scale-[0.99]"
        >
          <p className="text-sm text-slate-500">회원</p>
          <p className="mt-2 text-lg font-bold text-slate-900">회원 목록</p>
        </Link>

        <Link
          href="/scores"
          className="rounded-3xl bg-white p-5 shadow-sm transition active:scale-[0.99]"
        >
          <p className="text-sm text-slate-500">스코어</p>
          <p className="mt-2 text-lg font-bold text-slate-900">내 기록</p>
        </Link>

        <Link
          href="/mypage"
          className="rounded-3xl bg-white p-5 shadow-sm transition active:scale-[0.99]"
        >
          <p className="text-sm text-slate-500">내 정보</p>
          <p className="mt-2 text-lg font-bold text-slate-900">마이페이지</p>
        </Link>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900">공지사항</h2>
          <Link href="/board" className="text-sm font-medium text-emerald-600">
            전체보기
          </Link>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {notices?.length ? (
            notices.map((notice) => (
              <Link key={notice.id} href="/board" className="block py-3">
                <p className="font-medium text-slate-800">{notice.title}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(notice.created_at).toLocaleDateString('ko-KR')}
                </p>
              </Link>
            ))
          ) : (
            <p className="py-3 text-sm text-slate-500">공지사항이 없습니다.</p>
          )}
        </div>
      </section>
    </main>
  );
}