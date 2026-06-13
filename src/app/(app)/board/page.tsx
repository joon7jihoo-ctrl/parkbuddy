import Link from 'next/link';
import { TopBar } from '@/components/TopBar';
import { EmptyState } from '@/components/EmptyState';
import { formatKoreanDateTime } from '@/lib/utils';
import { requireCurrentMember } from '@/server/auth';

export default async function BoardPage() {
  const { supabase, member } = await requireCurrentMember();

  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, content, post_type, is_pinned, created_at, members(name)')
    .eq('club_id', member.club_id)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);

  return (
    <main className="space-y-5">
      <TopBar title="게시판" description="공지사항과 자유게시판입니다." action={{ href: '/board/new', label: '글쓰기' }} />
      {posts?.length ? (
        <section className="space-y-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/board/${post.id}`} className="block rounded-3xl bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                {post.post_type === 'notice' ? <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">공지</span> : null}
                {post.is_pinned ? <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">고정</span> : null}
              </div>
              <h2 className="mt-3 text-lg font-bold text-slate-900">{post.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{post.content}</p>
              <p className="mt-4 text-xs text-slate-400">{formatKoreanDateTime(post.created_at)}</p>
            </Link>
          ))}
        </section>
      ) : (
        <EmptyState title="게시글이 없습니다" description="첫 공지나 자유게시글을 작성해 보세요." />
      )}
    </main>
  );
}
