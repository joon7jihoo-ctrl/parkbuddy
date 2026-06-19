import Link from 'next/link';
import { ShareResultSummaryButton } from '@/components/share-result-summary-button';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-member';

type ResultsPageProps = {
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
  rank: number;
  displayScore: string;
  grossScore: string;
  netScore: string;
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

function getNetScore(strokes: number | null, handicap: number | null) {
  if (typeof strokes !== 'number') {
    return null;
  }

  return strokes - (handicap ?? 0);
}

function rankScores(scores: ScoreRow[], scoringType?: string | null): RankedScore[] {
  const usesStableford = scoringType === 'stableford';
  const usesNetScore = scoringType === 'new_peoria';

  const ranked = scores
    .map((score) => {
      const netScore = getNetScore(score.strokes, score.member?.handicap ?? 0);
      const scoreValue = usesStableford
        ? score.stableford_points
        : usesNetScore
          ? netScore
          : score.strokes;

      const hasScore = typeof scoreValue === 'number';

      return {
        ...score,
        rank: 0,
        hasScore,
        grossScore:
          typeof score.strokes === 'number' ? `${score.strokes}타` : '미입력',
        netScore: typeof netScore === 'number' ? `${netScore}타` : '미입력',
        sortValue: hasScore
          ? usesStableford
            ? -scoreValue
            : scoreValue
          : Number.POSITIVE_INFINITY,
        displayScore: hasScore
          ? usesStableford
            ? `${scoreValue}점`
            : `${scoreValue}타`
          : '미입력',
      };
    })
    .sort((left, right) => {
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
        rank: 0,
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

function getCalculationNote(scoringType?: string | null) {
  switch (scoringType) {
    case 'stroke':
      return '총 타수가 낮을수록 높은 순위로 계산합니다.';
    case 'stableford':
      return '스테이블포드 포인트가 높을수록 높은 순위로 계산합니다.';
    case 'new_peoria':
      return '현재는 회원 핸디캡을 반영한 보정 타수 기준으로 임시 순위를 계산합니다. 정식 신페리오 숨김홀 계산은 홀별 스코어 입력 후 확장합니다.';
    case 'match':
      return '현재는 입력된 총 타수 기준 임시 순위입니다. 홀별 매치 승점 계산은 홀별 스코어 입력 후 확장합니다.';
    default:
      return '경기 방식이 아직 지정되지 않았습니다. 조 편성에서 경기 방식과 점수 계산 방식을 먼저 저장하세요.';
  }
}

export default async function RoundResultsPage({ params }: ResultsPageProps) {
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
      club_id
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

  const leader = rankedScores.find((score) => score.rank === 1);
  const completedScoreCount = rankedScores.filter((score) => score.hasScore).length;
  const missingScoreCount = rankedScores.filter((score) => !score.hasScore).length;
  const completionRate = rankedScores.length
    ? Math.round((completedScoreCount / rankedScores.length) * 100)
    : 0;
  const podiumScores = rankedScores.filter((score) => score.rank > 0 && score.rank <= 3);
  const podiumSummary = podiumScores.length
    ? podiumScores
        .map(
          (score) =>
            `${score.rank}위 ${score.member?.name ?? '이름 없는 회원'} ${score.displayScore}`,
        )
        .join('\n')
    : '아직 순위가 없습니다.';
  const shareSummary = [
    `[ParkBuddy] ${typedRound.title ?? '라운드 결과'}`,
    `일시: ${formatDate(typedRound.play_date)}`,
    `장소: ${typedRound.course_name ?? '-'}`,
    `현재 1위: ${leader?.member?.name ?? '-'} ${leader?.displayScore ?? ''}`.trim(),
    '상위 3명:',
    podiumSummary,
    `입력 완료: ${completedScoreCount}/${rankedScores.length}명 (${completionRate}%)`,
    missingScoreCount > 0 ? `미입력: ${missingScoreCount}명` : '모든 스코어 입력 완료',
  ].join('\n');

  return (
    <main className="mx-auto max-w-7xl space-y-4 px-3 pb-32 pt-4 sm:px-4 sm:pb-28 sm:pt-5">
      <header className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            스코어 결과
          </p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {typedRound.title ?? '라운드 결과'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {typedRound.course_name ?? '-'} · {formatDate(typedRound.play_date)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-3xl bg-white p-3 text-center shadow-sm lg:grid-cols-1 lg:text-left">
          <div className="rounded-2xl bg-slate-50 px-3 py-2">
            <p className="text-xs text-slate-500">경기 형태</p>
            <p className="mt-1 text-sm font-bold text-slate-900">
              {getGameTypeLabel(typedRound.game_type)}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-3 py-2">
            <p className="text-xs text-slate-500">점수 계산</p>
            <p className="mt-1 text-sm font-bold text-slate-900">
              {getScoringTypeLabel(typedRound.scoring_type)}
            </p>
          </div>
        </div>
      </header>

      <section data-result-summary-ux className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
          <div>
            <p className="text-xs font-bold text-emerald-700">결과 요약</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-black text-emerald-950">
                현재 1위 · {leader?.member?.name ?? '-'}
              </h2>
              <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-emerald-800 shadow-sm">
                {leader?.displayScore ?? '-'}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-emerald-800">
              입력 완료 {completedScoreCount}/{rankedScores.length}명 · 완료율 {completionRate}%
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/80">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: completionRate + '%' }} />
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 p-3">
            <p className="text-xs font-bold text-emerald-700">상위 3명</p>
            <div className="mt-2 grid gap-1 text-sm text-emerald-950">
              {podiumScores.length ? (
                podiumScores.map((score) => (
                  <p key={score.member_id} className="truncate font-semibold">
                    {score.rank}위 · {score.member?.name ?? '이름 없는 회원'} · {score.displayScore}
                  </p>
                ))
              ) : (
                <p className="text-emerald-800">아직 순위가 없습니다.</p>
              )}
            </div>
          </div>
        </div>

        <details className="mt-3 rounded-2xl border border-emerald-200 bg-white/80 p-3">
          <summary className="cursor-pointer text-sm font-bold text-emerald-900">
            공유/인쇄
          </summary>
          <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <p className="whitespace-pre-line rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                {shareSummary}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 lg:w-56 lg:grid-cols-1">
              <ShareResultSummaryButton
                summary={shareSummary}
                label="요약 복사"
                copiedLabel="요약 복사 완료"
              />
              <Link
                href={`/admin/rounds/${typedRound.id}/results/print`}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white"
              >
                인쇄용 결과표
              </Link>
            </div>
          </div>
        </details>
      </section>

      <details className="rounded-3xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-800">
        <summary className="cursor-pointer font-bold text-blue-900">계산 기준</summary>
        <p className="mt-2">{getCalculationNote(typedRound.scoring_type)}</p>
      </details>

      <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3 sm:px-5 sm:py-4">
          <h2 className="font-bold text-slate-900">결과 순위</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {rankedScores.length ? (
            rankedScores.map((score) => (
              <article
                key={score.member_id}
                className={`${score.hasScore ? 'bg-white' : 'bg-amber-50/50'} grid grid-cols-[auto_minmax(0,1fr)] gap-3 px-4 py-3 sm:grid-cols-[80px_minmax(0,1fr)_220px] sm:px-5 sm:py-4`}
              >
                <div className="flex items-center">
                  <span className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">
                    {score.rank ? `${score.rank}위` : '미입력'}
                  </span>
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    {score.member?.name ?? '이름 없는 회원'}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    핸디캡 {score.member?.handicap ?? 0}
                  </p>
                  {score.memo && (
                    <p className="mt-2 text-sm text-slate-500">{score.memo}</p>
                  )}
                </div>

                <div className="col-span-2 flex flex-row flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-50 px-3 py-2 sm:col-span-1 sm:flex-col sm:items-end sm:justify-center sm:bg-transparent sm:px-0 sm:py-0">
                  <span className="text-lg font-bold text-emerald-700 sm:text-xl">
                    {score.hasScore ? score.displayScore : '미입력'}
                  </span>
                  <span className="text-sm text-slate-500">
                    총 타수 {score.grossScore}
                  </span>
                  <span className="text-sm text-slate-500">
                    보정 타수 {score.netScore}
                  </span>
                </div>
              </article>
            ))
          ) : (
            <div className="px-5 py-12 text-center">
              <p className="text-sm font-semibold text-slate-700">
                스코어가 없습니다.
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="parkbuddy-sticky-cta">
        <div data-parkbuddy-sticky-cta="true" className="parkbuddy-sticky-cta__inner">
          <Link
            href="/admin/rounds"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-100 px-4 py-2 text-center text-sm font-bold text-slate-700"
          >
            라운드 목록
          </Link>
          <Link
            href={`/admin/rounds/${typedRound.id}/scores`}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-center text-sm font-bold text-white"
          >
            스코어 입력
          </Link>
        </div>
      </div>
    </main>
  );
}
