import Link from 'next/link';
import { CopyCurrentUrlButton } from '@/components/copy-current-url-button';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-member';
import { DeletedRoundOperationBlocked } from '@/components/admin/deleted-round-operation-blocked';

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

  const leader = rankedScores.find((score) => score.rank === 1);

  return (
    <main className="mx-auto max-w-5xl space-y-5 px-4 py-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            스코어 결과
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            {typedRound.title ?? '라운드 결과'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {typedRound.course_name ?? '-'} · {formatDate(typedRound.play_date)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <CopyCurrentUrlButton label="결과 링크 복사" copiedLabel="링크 복사 완료" />
          <Link
            href="/admin/rounds"
            className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            라운드 목록
          </Link>
          <Link
            href={`/admin/rounds/${typedRound.id}/scores`}
            className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            스코어 입력
          </Link>
          <Link
            href={`/admin/rounds/${typedRound.id}/results/print`}
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            인쇄용 결과표
          </Link>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">경기 형태</p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {getGameTypeLabel(typedRound.game_type)}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">점수 계산</p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {getScoringTypeLabel(typedRound.scoring_type)}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">스코어 입력</p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {rankedScores.filter((score) => score.hasScore).length}명
          </p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">현재 1위</p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {leader?.member?.name ?? '-'}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">미입력 인원</p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {rankedScores.filter((score) => !score.hasScore).length}명
          </p>
        </div>
      </section>

      
      <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-800">
        <p className="font-bold text-emerald-900">결과 입력 현황</p>
        <p className="mt-1">
          입력 완료 {rankedScores.filter((score) => score.hasScore).length}명 ·
          미입력 {rankedScores.filter((score) => !score.hasScore).length}명
        </p>
      </section>

<section className="rounded-3xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-800">
        {getCalculationNote(typedRound.scoring_type)}
        {rankedScores.some((score) => !score.hasScore) && (
          <p className="mt-2 font-semibold">
            스코어 미입력 회원은 순위에서 제외됩니다.
          </p>
        )}
      </section>


      {rankedScores.some((score) => !score.hasScore) && (
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-amber-900">미입력 스코어가 있습니다</h2>
              <p className="mt-1 text-sm leading-6 text-amber-800">
                아직 스코어가 입력되지 않은 회원이 있습니다. 결과를 확정하기 전에 스코어 입력 화면에서 누락된 값을 확인해 주세요.
              </p>
            </div>
            <Link
              href={`/admin/rounds/${typedRound.id}/scores`}
              className="rounded-2xl bg-amber-600 px-4 py-2 text-center text-sm font-semibold text-white"
            >
              스코어 입력하러 가기
            </Link>
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-900">결과 순위</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {rankedScores.length ? (
            rankedScores.map((score) => (
              <article
                key={score.member_id}
                className="grid gap-3 px-5 py-4 sm:grid-cols-[80px_1fr_220px]"
              >
                <div className="flex items-center">
                  <span className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700">
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

                <div className="flex flex-col justify-center gap-1 sm:items-end">
                  <span className="text-xl font-bold text-emerald-700">
                    {score.hasScore ? score.displayScore : '스코어 미입력'}
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
                아직 입력된 스코어가 없습니다.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                스코어 입력 화면에서 참가자별 스코어를 먼저 저장하세요.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
