import Link from 'next/link';
import { TopBar } from '@/components/TopBar';
import { EmptyState } from '@/components/EmptyState';
import { formatKoreanDateTime } from '@/lib/utils';
import { requireCurrentMember } from '@/server/auth';

export default async function BoardPage() {
  const { supabase, member } = await requireCurrentMember();

  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, content, post_type, is_pinned, is_private, author_id, created_at, members(name)')
    .eq('club_id', member.club_id)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);

  const list = posts ?? [];
  const noticeCount = list.filter((post) => post.post_type === 'notice').length;
  const pinnedCount = list.filter((post) => post.is_pinned).length;
  const privateCount = list.filter((post) => post.is_private).length;

  return (
    <main className="space-y-5 pb-24">
      <TopBar title="게시판" description="공지사항과 자유게시글을 확인합니다." action={{ href: '/board/new', label: '글쓰기' }} />

      <section className="grid grid-cols-4 gap-2.5">
        <article className="rounded-3xl bg-emerald-600 px-3 py-3 text-center text-white shadow-sm">
          <p className="text-xs font-semibold">전체</p>
          <p className="mt-1 text-2xl font-extrabold leading-none">{list.length}</p>
        </article>
        <article className="rounded-3xl bg-white px-3 py-3 text-center text-slate-900 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">공지</p>
          <p className="mt-1 text-2xl font-extrabold leading-none">{noticeCount}</p>
        </article>
        <article className="rounded-3xl bg-white px-3 py-3 text-center text-slate-900 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">고정</p>
          <p className="mt-1 text-2xl font-extrabold leading-none">{pinnedCount}</p>
        </article>
        <article className="rounded-3xl bg-white px-3 py-3 text-center text-slate-900 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">비밀</p>
          <p className="mt-1 text-2xl font-extrabold leading-none">{privateCount}</p>
        </article>
      </section>

      {list.length ? (
        <section className="space-y-2.5">
          {list.map((post) => (
            <Link key={post.id} href={`/board/${post.id}`} className="block rounded-[26px] border border-slate-100 bg-white px-4 py-3.5 shadow-sm transition hover:border-emerald-200 hover:shadow-md">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                  {post.post_type === 'notice' ? <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">공지</span> : <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">자유</span>}
                  {post.is_pinned ? <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">고정</span> : null}
                  {post.is_private ? <span className="shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700">비밀</span> : null}
                </div>
                <time className="shrink-0 text-[11px] font-medium text-slate-400">{formatKoreanDateTime(post.created_at)}</time>
              </div>

              <h2 className="mt-2 line-clamp-1 text-base font-bold text-slate-950">{post.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">{post.content}</p>
              <p className="mt-2 text-xs font-medium text-slate-400">자세히 보기</p>
            </Link>
          ))}
        </section>
      ) : (
        <EmptyState title="게시글이 없습니다" description="첫 공지나 자유게시글을 작성해 보세요." />
      )}
    </main>
  );
}
