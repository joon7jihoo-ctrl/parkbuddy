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
  start_time: string | null;
  status: 'scheduled' | 'completed' | 'cancelled' | null;
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

function getStatusClassName(status?: string | null) {
  switch (status) {
    case 'completed':
      return 'bg-blue-100 text-blue-700 ring-blue-200';
    case 'cancelled':
      return 'bg-red-100 text-red-700 ring-red-200';
    default:
      return 'bg-emerald-100 text-emerald-700 ring-emerald-200';
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
      return '미정';
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
      return '미정';
  }
}

function formatDate(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString('ko-KR');
}

function formatTime(value?: string | null) {
  if (!value) {
    return '-';
  }

  return value.slice(0, 5);
}

function normalizeStatus(value?: string) {
  if (value === 'scheduled' || value === 'completed' || value === 'cancelled') {
    return value;
  }

  return 'all';
}

function actionLinkClassName(variant: 'default' | 'dark' | 'green' = 'default') {
  if (variant === 'dark') {
    return 'inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-900 px-3 py-2 text-center text-sm font-bold text-white shadow-sm transition hover:bg-slate-800';
  }

  if (variant === 'green') {
    return 'inline-flex min-h-11 items-center justify-center rounded-2xl bg-emerald-600 px-3 py-2 text-center text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700';
  }

  return 'inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-100 px-3 py-2 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-200';
}

export default async function RoundStatusPage({ searchParams }: StatusPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const selectedStatus = normalizeStatus(resolvedSearchParams.status);
  const { supabase, member } = await requireAdmin();

  let query = supabase
    .from('rounds')
    .select('id, title, course_name, play_date, start_time, status, game_type, scoring_type')
    .eq('club_id', member.club_id)
    .is('deleted_at', null)
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
    <main className="mx-auto max-w-7xl space-y-4 px-3 py-4 sm:px-4 sm:py-5 lg:px-6">
      <header className="rounded-[2rem] bg-white/80 p-4 shadow-sm ring-1 ring-slate-100 sm:p-5 lg:flex lg:items-end lg:justify-between lg:gap-6">
        <div className="min-w-0">
          <p className="text-sm font-bold text-emerald-600">라운드 관리</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            상태별 라운드 보기
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            예정, 완료, 취소 상태별로 라운드를 빠르게 확인하고 운영 화면으로 이동합니다.
          </p>
        </div>

        <nav className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 lg:mt-0 lg:min-w-[28rem]">
          <Link href="/admin/rounds" className={actionLinkClassName()}>
            라운드 목록
          </Link>
          <Link href="/admin/rounds/calendar" className={actionLinkClassName()}>
            월별 일정
          </Link>
          <Link href="/admin/rounds/new" className={actionLinkClassName('green')}>
            라운드 생성
          </Link>
        </nav>
      </header>

      <section className="rounded-[2rem] bg-white p-3 shadow-sm ring-1 ring-slate-100">
        <div className="grid grid-cols-4 gap-2">
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
                    ? 'inline-flex min-h-11 items-center justify-center rounded-2xl bg-emerald-600 px-3 py-2 text-center text-sm font-black text-white shadow-sm'
                    : 'inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-100 px-3 py-2 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-200'
                }
              >
                {option.label}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
          <h2 className="font-black text-slate-950">라운드 {typedRounds.length}건</h2>
          <p className="hidden text-xs font-semibold text-slate-400 sm:block">
            목록 화면과 동일한 카드 레이아웃을 사용합니다.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {typedRounds.length ? (
            typedRounds.map((round) => {
              const roundTitle = round.title ?? '라운드';

              return (
                <article key={round.id} className="px-4 py-4 sm:px-5 lg:py-5">
                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_17rem] xl:items-start">
                    <div className="min-w-0 space-y-3">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <h3 className="min-w-0 truncate text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                          {roundTitle}
                        </h3>
                        <span
                          className={[
                            'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-black ring-1',
                            getStatusClassName(round.status),
                          ].join(' ')}
                        >
                          {getStatusLabel(round.status)}
                        </span>
                      </div>

                      <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 lg:grid-cols-5">
                        <div className="rounded-2xl bg-slate-50 px-3 py-2">
                          <dt className="text-[11px] font-bold text-slate-400">골프장</dt>
                          <dd className="mt-1 truncate font-bold text-slate-800">{round.course_name ?? '-'}</dd>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-3 py-2">
                          <dt className="text-[11px] font-bold text-slate-400">날짜</dt>
                          <dd className="mt-1 font-bold text-slate-800">{formatDate(round.play_date)}</dd>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-3 py-2">
                          <dt className="text-[11px] font-bold text-slate-400">시간</dt>
                          <dd className="mt-1 font-bold text-slate-800">{formatTime(round.start_time)}</dd>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-3 py-2">
                          <dt className="text-[11px] font-bold text-slate-400">경기</dt>
                          <dd className="mt-1 truncate font-bold text-slate-800">{getGameTypeLabel(round.game_type)}</dd>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-3 py-2 sm:col-span-2 lg:col-span-1">
                          <dt className="text-[11px] font-bold text-slate-400">점수</dt>
                          <dd className="mt-1 truncate font-bold text-slate-800">{getScoringTypeLabel(round.scoring_type)}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-2 xl:rounded-3xl xl:bg-slate-50 xl:p-3">
                      <Link href={`/admin/rounds/${round.id}/participants`} className={actionLinkClassName()}>
                        참가자
                      </Link>
                      <Link href={`/admin/rounds/${round.id}/pairings`} className={actionLinkClassName()}>
                        조 편성
                      </Link>
                      <Link href={`/admin/rounds/${round.id}/scores`} className={actionLinkClassName('dark')}>
                        스코어
                      </Link>
                      <Link href={`/admin/rounds/${round.id}/results`} className={actionLinkClassName('green')}>
                        결과
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="px-5 py-12 text-center">
              <p className="font-bold text-slate-700">조건에 맞는 라운드가 없습니다.</p>
              <p className="mt-1 text-sm text-slate-500">
                다른 상태 필터를 선택하거나 새 라운드를 만들어 주세요.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
