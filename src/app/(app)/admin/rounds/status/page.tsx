import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/require-member';

type StatusPageProps = {
  searchParams?: Promise<{
    status?: string;
  }>;
};

type RoundRow = {
  id: string;
  title: string | null;
  course_name: string | null;
  play_date: string | null;
  status: string | null;
  game_type: string | null;
  scoring_type: string | null;
};

const STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'scheduled', label: '예정' },
  { value: 'completed', label: '완료' },
  { value: 'cancelled', label: '취소' },
];

function getStatusLabel(value?: string | null) {
  switch (value) {
    case 'scheduled':
      return '예정';
    case 'completed':
      return '완료';
    case 'cancelled':
      return '취소';
    default:
      return '예정';
  }
}

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
      return '스트로크';
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

  return new Date(value + 'T00:00:00').toLocaleDateString('ko-KR');
}

function normalizeStatus(value?: string) {
  if (value === 'scheduled' || value === 'completed' || value === 'cancelled') {
    return value;
  }

  return 'all';
}

export default async function RoundStatusPage({ searchParams }: StatusPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const selectedStatus = normalizeStatus(resolvedSearchParams.status);
  const { supabase, member } = await requireAdmin();

  let query = supabase
    .from('rounds')
    .select('id, title, course_name, play_date, status, game_type, scoring_type')
    .eq('club_id', member.club_id)
    .order('play_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (selectedStatus !== 'all') {
    query = query.eq('status', selectedStatus);
  }

  const { data: rounds, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const typedRounds = (rounds ?? []) as RoundRow[];

  return (
    <main className="mx-auto max-w-5xl space-y-5 px-4 py-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-600">라운드 관리</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            상태별 라운드 보기
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            예정, 완료, 취소 상태별로 라운드를 확인합니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin"
            className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            관리자 홈
          </Link>
          <Link
            href="/admin/rounds"
            className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            라운드 목록
          </Link>
        </div>
      </header>

      <section className="rounded-3xl bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => {
            const isActive = option.value === selectedStatus;

            return (
              <Link
                key={option.value}
                href={
                  option.value === 'all'
                    ? '/admin/rounds/status'
                    : '/admin/rounds/status?status=' + option.value
                }
                className={
                  isActive
                    ? 'rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white'
                    : 'rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700'
                }
              >
                {option.label}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        {typedRounds.length ? (
          typedRounds.map((round) => (
            <article key={round.id} className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">
                      {round.title ?? '라운드'}
                    </h2>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {getStatusLabel(round.status)}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {round.course_name ?? '-'} · {formatDate(round.play_date)}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                      경기 형태: {getGameTypeLabel(round.game_type)}
                    </span>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                      점수 계산: {getScoringTypeLabel(round.scoring_type)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <Link
                    href={'/admin/rounds/' + round.id + '/participants'}
                    className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
                  >
                    참가자
                  </Link>
                  <Link
                    href={'/admin/rounds/' + round.id + '/pairings'}
                    className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
                  >
                    조 편성
                  </Link>
                  <Link
                    href={'/admin/rounds/' + round.id + '/scores'}
                    className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
                  >
                    스코어
                  </Link>
                  <Link
                    href={'/admin/rounds/' + round.id + '/results'}
                    className="rounded-2xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
                  >
                    결과
                  </Link>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="font-semibold text-slate-700">
              조건에 맞는 라운드가 없습니다.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              다른 상태 필터를 선택하거나 새 라운드를 만들어 주세요.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
