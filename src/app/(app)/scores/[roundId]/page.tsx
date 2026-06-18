import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TopBar } from '@/components/TopBar';
import { formatKoreanDate } from '@/lib/utils';
import { requireCurrentMember } from '@/server/auth';

type RoundInfo = {
  id: string;
  title: string | null;
  course_name: string | null;
  play_date: string | null;
  played_on: string | null;
  holes: number | null;
  club_id: string;
  deleted_at: string | null;
};

type RoundScoreRecord = {
  strokes: number | null;
  stableford_points: number | null;
  memo: string | null;
  updated_at: string | null;
};

function getRoundDate(round: RoundInfo) {
  return round.play_date ?? round.played_on;
}

export default async function RoundScorePage({ params }: { params: Promise<{ roundId: string }> }) {
  const { roundId } = await params;
  const { supabase, member } = await requireCurrentMember();

  const { data: round } = await supabase
    .from('rounds')
    .select('id, title, course_name, play_date, played_on, holes, club_id, deleted_at')
    .eq('id', roundId)
    .eq('club_id', member.club_id)
    .is('deleted_at', null)
    .maybeSingle();

  if (!round) notFound();

  const typedRound = round as RoundInfo;

  const { data: score } = await supabase
    .from('round_scores')
    .select('strokes, stableford_points, memo, updated_at')
    .eq('round_id', typedRound.id)
    .eq('member_id', member.id)
    .maybeSingle();

  const typedScore = score as RoundScoreRecord | null;
  const hasScore = typeof typedScore?.strokes === 'number' || typeof typedScore?.stableford_points === 'number';

  return (
    <main className="space-y-5">
      <TopBar
        title={typedRound.title ?? '라운딩'}
        description={`${typedRound.course_name ?? '코스 미정'} · ${typedRound.holes ?? 18}홀`}
      />

      <section className="rounded-3xl bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-extrabold text-slate-950">{typedRound.title ?? '라운딩'}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {getRoundDate(typedRound) ? formatKoreanDate(getRoundDate(typedRound) ?? '') : '날짜 미정'} · {typedRound.course_name ?? '코스 미정'}
            </p>
          </div>
        </div>

        {hasScore ? (
          <>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <article className="rounded-3xl bg-emerald-50 p-3 text-center ring-1 ring-emerald-100">
                <p className="text-xs font-black text-emerald-700">총 타수</p>
                <p className="mt-1 text-3xl font-black text-emerald-700">{typedScore?.strokes ?? '-'}</p>
              </article>
              <article className="rounded-3xl bg-slate-50 p-3 text-center ring-1 ring-slate-100">
                <p className="text-xs font-black text-slate-500">스테이블포드</p>
                <p className="mt-1 text-3xl font-black text-slate-950">{typedScore?.stableford_points ?? '-'}</p>
              </article>
            </div>

            {typedScore?.memo ? (
              <div className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                {typedScore.memo}
              </div>
            ) : null}
          </>
        ) : (
          <div className="mt-5 rounded-3xl bg-slate-50 px-4 py-6 text-center text-sm font-semibold text-slate-500">
스코어가 없습니다.
          </div>
        )}
      </section>

      <Link
        href="/scores"
        className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-black text-white shadow-sm transition active:scale-[0.99]"
      >
        목록
      </Link>
    </main>
  );
}
