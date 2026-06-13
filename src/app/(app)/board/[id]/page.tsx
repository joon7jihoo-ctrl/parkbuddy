import Image from 'next/image';
import { notFound } from 'next/navigation';
import { TopBar } from '@/components/TopBar';
import { formatKoreanDateTime } from '@/lib/utils';
import { requireCurrentMember } from '@/server/auth';

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, member } = await requireCurrentMember();

  const { data: post } = await supabase
    .from('posts')
    .select('id, title, content, post_type, created_at, author_id, members(name), post_attachments(file_path, content_type)')
    .eq('id', id)
    .eq('club_id', member.club_id)
    .maybeSingle();

  if (!post) notFound();

  const attachments = post.post_attachments ?? [];
  const signedUrls = await Promise.all(
    attachments.map(async (attachment: { file_path: string }) => {
      const { data } = await supabase.storage.from('post-images').createSignedUrl(attachment.file_path, 60 * 10);
      return data?.signedUrl ?? null;
    })
  );

  return (
    <main className="space-y-5">
      <TopBar title="게시글" />
      <article className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          {post.post_type === 'notice' ? <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">공지</span> : null}
        </div>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">{post.title}</h1>
        <p className="mt-2 text-xs text-slate-500">{formatKoreanDateTime(post.created_at)}</p>
        <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-700">{post.content}</div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {signedUrls.filter(Boolean).map((url) => (
            <Image key={url} src={url as string} alt="게시글 첨부 이미지" width={800} height={600} className="h-auto w-full rounded-2xl object-cover" />
          ))}
        </div>
      </article>
    </main>
  );
}
