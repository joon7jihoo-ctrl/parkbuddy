import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-member';
import { DeletedRoundOperationBlocked } from '@/components/admin/deleted-round-operation-blocked';
import { PrintButton } from '@/components/print-button';

type PrintResultsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type RoundInfo = {
  id: string;
  title: string | null;
  course_name: string | null;
  play_date: string | null;
  game_type: string | null;
  scoring_type: string | null;
  club_id: string;
  deleted_at: string | null;
};

type ScoreRow = {
  member_id: string;
  strokes: number | null;
  stableford_points: number | null;
  memo: string | null;
  member:
    | {
        id: string;
        name: string;
        handicap: number | null;
      }
    | null;
};

type RankedScore = ScoreRow & {
  rank: number | null;
  grossLabel: string;
  netLabel: string;
  resultLabel: string;
  sortValue: number;
  hasScore: boolean;
};

function getGameTypeLabel(value?: string | null) {
  switch (value) {
    case 'individual':
      return '개인전';
    case 'foursome':
      return '포섬';
    case 'fourball':
      return '포볼';
    case 'scramble':
      return '스크램블';
    case 'team_match':
      return '청백전';
    default:
      return '미지정';
  }
}

function getScoringTypeLabel(value?: string | null) {
  switch (value) {
    case 'stroke':
      return '스트로크 플레이';
    case 'new_peoria':
      return '신페리오';
    case 'match':
    case 'match_play':
      return '매치 플레이';
    case 'stableford':
      return '스테이블포드';
    default:
      return '미지정';
  }
}

function formatDate(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString('ko-KR');
}

function rankScores(scores: ScoreRow[], scoringType?: string | null): RankedScore[] {
  const usesStableford = scoringType === 'stableford';

  const ranked = scores
    .map((score) => {
      const handicap = score.member?.handicap ?? 0;
      const grossScore = score.strokes;
      const stablefordPoints = score.stableford_points;
      const hasScore = usesStableford
        ? typeof stablefordPoints === 'number'
        : typeof grossScore === 'number';
      const netScore = typeof grossScore === 'number' ? grossScore - handicap : null;

      return {
        ...score,
        rank: null,
        hasScore,
        sortValue: hasScore
          ? usesStableford
            ? -(stablefordPoints ?? 0)
            : netScore ?? grossScore ?? Number.POSITIVE_INFINITY
          : Number.POSITIVE_INFINITY,
        grossLabel: typeof grossScore === 'number' ? `${grossScore}타` : '스코어 미입력',
        netLabel: typeof netScore === 'number' ? `${netScore}타` : '스코어 미입력',
        resultLabel: hasScore
          ? usesStableford
            ? `${stablefordPoints}점`
            : typeof netScore === 'number'
              ? `${netScore}타`
              : `${grossScore}타`
          : '스코어 미입력',
      };
    })
    .sort((left, right) => {
      if (left.hasScore !== right.hasScore) {
        return left.hasScore ? -1 : 1;
      }

      if (left.sortValue !== right.sortValue) {
        return left.sortValue - right.sortValue;
      }

      return (left.member?.name ?? '').localeCompare(right.member?.name ?? '');
    });

  let previousSortValue: number | null = null;
  let previousRank = 0;

  return ranked.map((score, index) => {
    if (!score.hasScore) {
      return {
        ...score,
        rank: null,
      };
    }

    const nextRank =
      previousSortValue === score.sortValue ? previousRank : index + 1;

    previousSortValue = score.sortValue;
    previousRank = nextRank;

    return {
      ...score,
      rank: nextRank,
    };
  });
}

export default async function RoundResultsPrintPage({ params }: PrintResultsPageProps) {
  const routeParams = await params;
  const { supabase, member } = await requireAdmin();

  const { data: round, error: roundError } = await supabase
    .from('rounds')
    .select(
      `
      id,
      title,
      course_name,
      play_date,
      game_type,
      scoring_type,
      club_id,
      deleted_at
    `,
    )
    .eq('id', routeParams.id)
    .eq('club_id', member.club_id)
    .maybeSingle();

  if (roundError) {
    throw new Error(roundError.message);
  }

  if (!round) {
    notFound();
  }

  if (round.deleted_at) {
    return <DeletedRoundOperationBlocked roundTitle={round.title} />;
  }

  const typedRound = round as RoundInfo;

  const { data: scores, error: scoresError } = await supabase
    .from('round_scores')
    .select(
      `
      member_id,
      strokes,
      stableford_points,
      memo,
      member:member_id (
        id,
        name,
        handicap
      )
    `,
    )
    .eq('round_id', typedRound.id)
    .order('strokes', { ascending: true, nullsFirst: false });

  if (scoresError && scoresError.code !== '42P01') {
    throw new Error(scoresError.message);
  }

  const rankedScores = rankScores(
    (scores ?? []) as unknown as ScoreRow[],
    typedRound.scoring_type,
  );
  const enteredCount = rankedScores.filter((score) => score.hasScore).length;
  const missingCount = rankedScores.length - enteredCount;

  return (
    <main className="mx-auto max-w-5xl bg-white px-6 py-8 text-slate-900 print:max-w-none print:px-0 print:py-0">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href={`/admin/rounds/${typedRound.id}/results`}
          className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          결과 화면으로 돌아가기
        </Link>
        <PrintButton />
      </div>

      <section className="rounded-3xl border border-slate-200 p-6 print:rounded-none print:border-0 print:p-0">
        <header className="border-b border-slate-200 pb-5">
          <p className="text-sm font-semibold text-emerald-700">ParkBuddy 라운드 결과표</p>
          <h1 className="mt-2 text-3xl font-black">{typedRound.title ?? '라운드 결과'}</h1>
          <p className="mt-2 text-sm text-slate-600">
            {typedRound.course_name ?? '-'} · {formatDate(typedRound.play_date)}
          </p>
        </header>

        <section className="mt-5 grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 p-4 print:border print:border-slate-200 print:bg-white">
            <p className="text-xs font-semibold text-slate-500">경기 형태</p>
            <p className="mt-1 font-bold">{getGameTypeLabel(typedRound.game_type)}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 print:border print:border-slate-200 print:bg-white">
            <p className="text-xs font-semibold text-slate-500">점수 계산 방식</p>
            <p className="mt-1 font-bold">{getScoringTypeLabel(typedRound.scoring_type)}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 print:border print:border-slate-200 print:bg-white">
            <p className="text-xs font-semibold text-slate-500">입력 완료</p>
            <p className="mt-1 font-bold">{enteredCount}명</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 print:border print:border-slate-200 print:bg-white">
            <p className="text-xs font-semibold text-slate-500">미입력</p>
            <p className="mt-1 font-bold">{missingCount}명</p>
          </div>
        </section>

        {missingCount > 0 && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 print:bg-white">
            스코어 미입력 회원은 순위에서 제외됩니다.
          </div>
        )}

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-100 print:bg-white">
              <tr>
                <th className="border-b border-slate-200 px-4 py-3">순위</th>
                <th className="border-b border-slate-200 px-4 py-3">회원명</th>
                <th className="border-b border-slate-200 px-4 py-3">핸디캡</th>
                <th className="border-b border-slate-200 px-4 py-3">총 타수</th>
                <th className="border-b border-slate-200 px-4 py-3">보정 타수</th>
                <th className="border-b border-slate-200 px-4 py-3">결과</th>
                <th className="border-b border-slate-200 px-4 py-3">메모</th>
              </tr>
            </thead>
            <tbody>
              {rankedScores.length ? (
                rankedScores.map((score) => (
                  <tr key={score.member_id} className={!score.hasScore ? 'text-slate-400' : ''}>
                    <td className="border-b border-slate-100 px-4 py-3 font-bold">
                      {score.rank ? `${score.rank}위` : '미입력'}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3 font-semibold">
                      {score.member?.name ?? '이름 없는 회원'}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3">
                      {score.member?.handicap ?? 0}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3">{score.grossLabel}</td>
                    <td className="border-b border-slate-100 px-4 py-3">{score.netLabel}</td>
                    <td className="border-b border-slate-100 px-4 py-3 font-bold">
                      {score.resultLabel}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3">{score.memo ?? '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                    아직 입력된 스코어가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <footer className="mt-6 text-xs text-slate-500">
          출력일: {new Date().toLocaleString('ko-KR')}
        </footer>
      </section>
    </main>
  );
}
