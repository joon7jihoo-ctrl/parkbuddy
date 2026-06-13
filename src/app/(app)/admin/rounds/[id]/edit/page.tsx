import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-member';
import { updateRoundAction } from './actions';

type EditRoundPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type RoundInfo = {
  id: string;
  title: string | null;
  course_name: string | null;
  play_date: string | null;
  memo: string | null;
  club_id: string;
};

export default async function EditRoundPage({ params }: EditRoundPageProps) {
  const routeParams = await params;
  const { supabase, member } = await requireAdmin();

  const { data: round, error } = await supabase
    .from('rounds')
    .select('id, title, course_name, play_date, memo, club_id')
    .eq('id', routeParams.id)
    .eq('club_id', member.club_id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!round) {
    notFound();
  }

  const typedRound = round as RoundInfo;

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-600">라운드 수정</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            {typedRound.title ?? '라운드'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            라운드명, 장소, 날짜, 메모를 수정합니다.
          </p>
        </div>

        <Link
          href="/admin/rounds"
          className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          라운드 목록
        </Link>
      </header>

      <form action={updateRoundAction} className="space-y-4 rounded-3xl bg-white p-5 shadow-sm">
        <input type="hidden" name="roundId" value={typedRound.id} />

        <label className="block">
          <span className="text-sm font-medium text-slate-700">라운드명</span>
          <input
            name="title"
            required
            defaultValue={typedRound.title ?? ''}
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">장소/코스</span>
          <input
            name="courseName"
            defaultValue={typedRound.course_name ?? ''}
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">라운드 날짜</span>
          <input
            type="date"
            name="playDate"
            required
            defaultValue={typedRound.play_date ?? ''}
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">메모</span>
          <textarea
            name="memo"
            rows={5}
            defaultValue={typedRound.memo ?? ''}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="submit"
            className="h-12 flex-1 rounded-2xl bg-emerald-600 px-4 font-bold text-white"
          >
            수정 저장
          </button>
          <Link
            href="/admin/rounds"
            className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-slate-100 px-4 font-bold text-slate-700"
          >
            취소
          </Link>
        </div>
      </form>
    </main>
  );
}
