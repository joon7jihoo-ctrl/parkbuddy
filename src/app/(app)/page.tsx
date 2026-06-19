import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

type HomeMenuCardProps = {
  href: string;
  eyebrow: string;
  title: string;
  description?: string;
  accent?: 'emerald' | 'slate';
};

function HomeMenuCard({ href, eyebrow, title, description, accent = 'slate' }: HomeMenuCardProps) {
  const isPrimary = accent === 'emerald';

  return (
    <Link
      href={href}
      className={[
        'group rounded-3xl border p-5 shadow-sm transition active:scale-[0.99]',
        isPrimary
          ? 'border-emerald-200 bg-emerald-600 text-white shadow-emerald-900/10'
          : 'border-slate-200 bg-white text-slate-900 shadow-slate-900/5',
      ].join(' ')}
    >
      <p className={isPrimary ? 'text-xs font-bold text-emerald-50' : 'text-xs font-bold text-emerald-600'}>
        {eyebrow}
      </p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
          {description ? (
            <p className={isPrimary ? 'mt-1 text-sm leading-5 text-emerald-50' : 'mt-1 text-sm leading-5 text-slate-500'}>
              {description}
            </p>
          ) : null}
        </div>
        <span
          className={[
            'grid size-10 shrink-0 place-items-center rounded-2xl text-lg font-black transition group-active:translate-x-0.5',
            isPrimary ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-700',
          ].join(' ')}
          aria-hidden
        >
          →
        </span>
      </div>
    </Link>
  );
}

export default async function HomePage() {
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

  const isAdmin = me.role === 'admin';

  const { data: events } = await supabase
    .from('events')
    .select('id, title, starts_at, course_name')
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })
    .limit(1);

  const { data: notices } = await supabase
    .from('posts')
    .select('id, title, created_at')
    .eq('post_type', 'notice')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(1);

  const recentEvent = events?.[0];
  const recentNotice = notices?.[0];

  return (
    <main className="mx-auto max-w-5xl space-y-5 pb-6">
      <header className="space-y-1">
        <p className="text-sm font-bold text-emerald-600">ParkBuddy</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          {me.name}님
        </h1>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <HomeMenuCard
          href={isAdmin ? '/admin/members' : '/members'}
          eyebrow={isAdmin ? '운영진 메뉴' : '회원 메뉴'}
          title="회원 목록"
          accent="emerald"
        />

        {isAdmin ? (
          <>
            <HomeMenuCard
              href="/admin/rounds"
              eyebrow="운영진 메뉴"
              title="확정 라운드"
            />
            <HomeMenuCard
              href="/admin/logs"
              eyebrow="운영진 메뉴"
              title="작업 관리"
            />
          </>
        ) : (
          <>
            <HomeMenuCard
              href="/schedule"
              eyebrow="회원 메뉴"
              title="라운딩 공지"
            />
            <HomeMenuCard
              href="/scores"
              eyebrow="회원 메뉴"
              title="스코어"
            />
          </>
        )}
      </section>

      {!isAdmin && (
        <section className="grid gap-3 sm:grid-cols-2">
          <HomeMenuCard
            href="/board"
            eyebrow="소식"
            title="게시판"
          />
          <HomeMenuCard
            href="/mypage"
            eyebrow="내 정보"
            title="마이페이지"
          />
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-2">
        <HomeMenuCard
          href="/schedule"
          eyebrow="라운딩 공지"
          title={recentEvent?.title ?? '최근 라운딩'}
          description={
            recentEvent
              ? `${new Date(recentEvent.starts_at).toLocaleString('ko-KR')} · ${recentEvent.course_name}`
              : '등록된 라운딩 공지가 없습니다.'
          }
        />
        <HomeMenuCard
          href="/board"
          eyebrow="게시판"
          title={recentNotice?.title ?? '게시판'}
          description={
            recentNotice
              ? new Date(recentNotice.created_at).toLocaleDateString('ko-KR')
              : '게시글이 없습니다.'
          }
        />
      </section>
    </main>
  );
}
