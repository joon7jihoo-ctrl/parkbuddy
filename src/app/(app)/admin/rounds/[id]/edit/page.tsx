import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-member';
import { DeletedRoundOperationBlocked } from '@/components/admin/deleted-round-operation-blocked';
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
  deleted_at: string | null;
};

export default async function EditRoundPage({ params }: EditRoundPageProps) {
  const routeParams = await params;
  const { supabase, member } = await requireAdmin();

  const { data: round, error } = await supabase
    .from('rounds')
    .select('id, title, course_name, play_date, memo, club_id, deleted_at')
    .eq('id', routeParams.id)
    .eq('club_id', member.club_id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!round) {
    notFound();
  }

  if (round.deleted_at) {
    return <DeletedRoundOperationBlocked roundTitle={round.title} />;
  }

  const typedRound = round as RoundInfo;

  return (
    <main className="mx-auto max-w-5xl space-y-4 px-3 py-4 sm:px-4 sm:py-5">
      <header className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div>
          <p className="text-sm font-semibold text-emerald-600">라운드 수정</p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {typedRound.title ?? '라운드'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            라운드명, 장소, 날짜, 메모를 수정합니다.
          </p>
        </div>

        <Link
          href="/admin/rounds"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-100 px-4 py-2 text-center text-sm font-semibold text-slate-700"
        >
          라운드 목록
        </Link>
      </header>

      <form action={updateRoundAction} className="grid gap-4 rounded-3xl bg-white p-4 shadow-sm sm:p-5 md:grid-cols-2">
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

        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-slate-700">메모</span>
          <textarea
            name="memo"
            rows={5}
            defaultValue={typedRound.memo ?? ''}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <div className="grid gap-2 sm:grid-cols-2 md:col-span-2">
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
