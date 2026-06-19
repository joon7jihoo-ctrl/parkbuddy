import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TopBar } from '@/components/TopBar';
import { formatKoreanDateTime } from '@/lib/utils';
import { requireCurrentMember } from '@/server/auth';

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, member } = await requireCurrentMember();

  const { data: post } = await supabase
    .from('posts')
    .select('id, title, content, post_type, is_private, created_at, author_id, members(name), post_attachments(file_path, content_type)')
    .eq('id', id)
    .eq('club_id', member.club_id)
    .maybeSingle();

  if (!post) notFound();

  const canReadPrivatePost = !post.is_private || post.author_id === member.id || member.role === 'admin';
  if (!canReadPrivatePost) notFound();

  const attachments = post.post_attachments ?? [];
  const signedUrls = await Promise.all(
    attachments.map(async (attachment: { file_path: string }) => {
      const { data } = await supabase.storage.from('post-images').createSignedUrl(attachment.file_path, 60 * 10);
      return data?.signedUrl ?? null;
    })
  );

  return (
    <main className="space-y-5 pb-24">
      <TopBar title="게시글" />
      <article className="rounded-[30px] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {post.post_type === 'notice' ? <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">공지</span> : <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">자유</span>}
            {post.is_private ? <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-700">비밀글</span> : null}
          </div>
          <time className="text-xs font-medium text-slate-400">{formatKoreanDateTime(post.created_at)}</time>
        </div>

        <h1 className="mt-4 text-2xl font-extrabold leading-tight tracking-[-0.02em] text-slate-950">{post.title}</h1>
        <div className="mt-5 whitespace-pre-wrap rounded-3xl bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">{post.content}</div>

        {signedUrls.filter(Boolean).length ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {signedUrls.filter(Boolean).map((url) => (
              <Image key={url} src={url as string} alt="게시글 첨부 이미지" width={800} height={600} className="h-auto w-full rounded-2xl object-cover" />
            ))}
          </div>
        ) : null}
      </article>

      <Link href="/board" className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-slate-900 px-4 text-sm font-bold text-white shadow-sm">
        게시판으로 돌아가기
      </Link>
    </main>
  );
}
