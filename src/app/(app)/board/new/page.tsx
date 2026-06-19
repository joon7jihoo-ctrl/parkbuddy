import Link from 'next/link';
import { SubmitButton } from '@/components/SubmitButton';
import { TopBar } from '@/components/TopBar';
import { createPost } from '@/server/actions/posts';
import { requireCurrentMember } from '@/server/auth';

export default async function NewPostPage() {
  const { member } = await requireCurrentMember();

  return (
    <main className="space-y-5 pb-24">
      <TopBar title="글쓰기" />
      <form action={createPost} className="space-y-4 rounded-[30px] bg-white p-5 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700">
          게시판 유형
          <select name="post_type" defaultValue="free" className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="free">자유글</option>
            {member.role === 'admin' ? <option value="notice">공지</option> : null}
          </select>
        </label>
        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
          <input name="is_private" type="checkbox" className="mt-1 size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
          <span>
            비밀글로 작성
            <span className="mt-1 block text-xs font-normal leading-5 text-slate-500">비밀글은 작성자와 운영진만 서버 권한 검증을 통과해 조회할 수 있습니다.</span>
          </span>
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          제목
          <input name="title" required maxLength={100} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-emerald-500" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          내용
          <textarea name="content" required maxLength={5000} rows={8} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          사진 첨부
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
        </label>
        <p className="rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">이미지는 5MB 이하의 jpg, png, webp만 허용되며 서버에서 실제 파일 서명을 한 번 더 검사합니다.</p>
        <div className="grid grid-cols-2 gap-2.5">
          <SubmitButton label="게시글 등록" />
          <Link href="/board" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-100 px-4 text-sm font-bold text-slate-700">
            취소
          </Link>
        </div>
      </form>
    </main>
  );
}
