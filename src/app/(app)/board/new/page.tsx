import { SubmitButton } from '@/components/SubmitButton';
import { TopBar } from '@/components/TopBar';
import { createPost } from '@/server/actions/posts';
import { requireCurrentMember } from '@/server/auth';

export default async function NewPostPage() {
  const { member } = await requireCurrentMember();

  return (
    <main className="space-y-5">
      <TopBar title="글쓰기" />
      <form action={createPost} className="space-y-4 rounded-3xl bg-white p-5 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700">게시판 유형<select name="post_type" defaultValue="free" className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-emerald-500"><option value="free">자유게시판</option>{member.role === 'admin' ? <option value="notice">공지사항</option> : null}</select></label>
        <label className="block text-sm font-semibold text-slate-700">제목<input name="title" required maxLength={100} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
        <label className="block text-sm font-semibold text-slate-700">내용<textarea name="content" required maxLength={5000} rows={8} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
        <label className="block text-sm font-semibold text-slate-700">사진 첨부<input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" /></label>
        <p className="text-xs leading-5 text-slate-500">이미지는 5MB 이하의 jpg, png, webp만 허용됩니다.</p>
        <SubmitButton label="게시글 등록" />
      </form>
    </main>
  );
}
