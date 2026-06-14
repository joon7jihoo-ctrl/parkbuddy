import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

type HomeMenuCardProps = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
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
          <p className={isPrimary ? 'mt-1 text-sm leading-5 text-emerald-50' : 'mt-1 text-sm leading-5 text-slate-500'}>
            {description}
          </p>
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
          {me.name}님, 필요한 메뉴를 바로 선택하세요
        </h1>
        <p className="text-sm leading-6 text-slate-500">
          하단에는 홈 버튼만 두고, 주요 기능은 이 화면에서 빠르게 이동합니다.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <HomeMenuCard
          href={isAdmin ? '/admin/members' : '/members'}
          eyebrow={isAdmin ? '운영진 메뉴' : '회원 메뉴'}
          title="회원 목록"
          description={isAdmin ? '회원 등록, 검색, 수정, 비활성화를 관리합니다.' : '동호회 회원 연락처와 정보를 확인합니다.'}
          accent="emerald"
        />

        {isAdmin ? (
          <>
            <HomeMenuCard
              href="/admin/rounds"
              eyebrow="운영진 메뉴"
              title="라운딩 관리"
              description="라운드 생성, 참가자, 조 편성, 스코어를 관리합니다."
            />
            <HomeMenuCard
              href="/admin/logs"
              eyebrow="운영진 메뉴"
              title="작업 관리"
              description="운영자 작업 기록과 주요 변경 이력을 확인합니다."
            />
          </>
        ) : (
          <>
            <HomeMenuCard
              href="/schedule"
              eyebrow="회원 메뉴"
              title="일정"
              description="다가오는 라운딩 일정과 참석 여부를 확인합니다."
            />
            <HomeMenuCard
              href="/scores"
              eyebrow="회원 메뉴"
              title="스코어"
              description="내 최근 기록과 평균, 베스트 스코어를 확인합니다."
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
            description="공지사항과 동호회 소식을 확인합니다."
          />
          <HomeMenuCard
            href="/mypage"
            eyebrow="내 정보"
            title="마이페이지"
            description="내 회원 정보와 계정 연결 상태를 확인합니다."
          />
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-2">
        <HomeMenuCard
          href="/schedule"
          eyebrow="최근 라운딩"
          title={recentEvent?.title ?? '최근 라운딩'}
          description={
            recentEvent
              ? `${new Date(recentEvent.starts_at).toLocaleString('ko-KR')} · ${recentEvent.course_name}`
              : '등록된 일정이 없습니다.'
          }
        />
        <HomeMenuCard
          href="/board"
          eyebrow="최근 공지"
          title={recentNotice?.title ?? '최근 공지'}
          description={
            recentNotice
              ? new Date(recentNotice.created_at).toLocaleDateString('ko-KR')
              : '최근 공지가 없습니다.'
          }
        />
      </section>
    </main>
  );
}
