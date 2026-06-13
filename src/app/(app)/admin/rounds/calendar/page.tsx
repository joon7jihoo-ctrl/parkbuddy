import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/require-member';

type CalendarPageProps = {
  searchParams?: Promise<{
    month?: string;
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

function getMonthValue(value?: string | null) {
  if (value && /^\d{4}-\d{2}$/.test(value)) {
    return value;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}`;
}

function getMonthRange(monthValue: string) {
  const [yearText, monthText] = monthValue.split('-');
  const year = Number(yearText);
  const month = Number(monthText);

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

function shiftMonth(monthValue: string, offset: number) {
  const [yearText, monthText] = monthValue.split('-');
  const year = Number(yearText);
  const month = Number(monthText);

  const date = new Date(year, month - 1 + offset, 1);
  const nextYear = date.getFullYear();
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0');

  return `${nextYear}-${nextMonth}`;
}

function formatKoreanMonth(monthValue: string) {
  const [yearText, monthText] = monthValue.split('-');

  return `${yearText}년 ${Number(monthText)}월`;
}

function formatDate(value?: string | null) {
  if (!value) {
    return '일자 미정';
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

function formatShortDate(value?: string | null) {
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

function getStatusLabel(value?: string | null) {
  switch (value) {
    case 'completed':
      return '완료';
    case 'cancelled':
      return '취소';
    case 'scheduled':
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
      return '매치';
    case 'stableford':
      return '스테이블포드';
    default:
      return '미정';
  }
}

function groupRoundsByDate(rounds: RoundRow[]) {
  return rounds.reduce<Record<string, RoundRow[]>>((acc, round) => {
    const key = round.play_date ?? 'undated';

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(round);

    return acc;
  }, {});
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

export default async function RoundCalendarPage({
  searchParams,
}: CalendarPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const monthValue = getMonthValue(resolvedSearchParams.month);
  const { startDate, endDate } = getMonthRange(monthValue);
  const previousMonth = shiftMonth(monthValue, -1);
  const nextMonth = shiftMonth(monthValue, 1);

  const { supabase, member } = await requireAdmin();

  const { data: rounds, error } = await supabase
    .from('rounds')
    .select(
      `
      id,
      title,
      course_name,
      play_date,
      start_time,
      status,
      game_type,
      scoring_type
    `,
    )
    .eq('club_id', member.club_id)
    .is('deleted_at', null)
    .gte('play_date', startDate)
    .lt('play_date', endDate)
    .order('play_date', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const typedRounds = (rounds ?? []) as RoundRow[];
  const groupedRounds = groupRoundsByDate(typedRounds);
  const dateKeys = Object.keys(groupedRounds).sort();

  return (
    <main className="mx-auto max-w-7xl space-y-4 px-3 py-4 sm:px-4 sm:py-5 lg:px-6">
      <header className="rounded-[2rem] bg-white/80 p-4 shadow-sm ring-1 ring-slate-100 sm:p-5 lg:flex lg:items-end lg:justify-between lg:gap-6">
        <div className="min-w-0">
          <p className="text-sm font-bold text-emerald-600">라운드 일정</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            {formatKoreanMonth(monthValue)}
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            월별 라운드를 날짜별 카드로 확인하고, 필요한 운영 화면으로 바로 이동합니다.
          </p>
        </div>

        <nav className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 lg:mt-0 lg:min-w-[28rem]">
          <Link href="/admin/rounds" className={actionLinkClassName()}>
            라운드 목록
          </Link>
          <Link href="/admin/rounds/status" className={actionLinkClassName('dark')}>
            상태별 보기
          </Link>
          <Link href="/admin/rounds/new" className={actionLinkClassName('green')}>
            라운드 생성
          </Link>
        </nav>
      </header>

      <nav className="grid grid-cols-3 items-center gap-2 rounded-[2rem] bg-white p-3 shadow-sm ring-1 ring-slate-100">
        <Link href={`/admin/rounds/calendar?month=${previousMonth}`} className={actionLinkClassName()}>
          이전 달
        </Link>
        <strong className="text-center text-sm font-black text-slate-950 sm:text-base">
          {formatKoreanMonth(monthValue)}
        </strong>
        <Link href={`/admin/rounds/calendar?month=${nextMonth}`} className={actionLinkClassName()}>
          다음 달
        </Link>
      </nav>

      <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
          <h2 className="font-black text-slate-950">월간 라운드 {typedRounds.length}건</h2>
          <p className="hidden text-xs font-semibold text-slate-400 sm:block">
            날짜별로 묶고, 각 카드의 핵심 작업만 먼저 보여줍니다.
          </p>
        </div>

        {dateKeys.length ? (
          <div className="divide-y divide-slate-100">
            {dateKeys.map((dateKey) => (
              <section key={dateKey} className="px-4 py-4 sm:px-5 lg:py-5">
                <h3 className="mb-3 text-sm font-black text-slate-700">
                  {formatDate(dateKey === 'undated' ? null : dateKey)}
                </h3>

                <div className="space-y-3">
                  {(groupedRounds[dateKey] ?? []).map((round) => {
                    const roundTitle = round.title ?? '라운드';

                    return (
                      <article key={round.id} className="rounded-[1.75rem] border border-slate-100 bg-white p-3 shadow-sm sm:p-4">
                        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_17rem] xl:items-start">
                          <div className="min-w-0 space-y-3">
                            <div className="flex min-w-0 flex-wrap items-center gap-2">
                              <h4 className="min-w-0 truncate text-lg font-black tracking-tight text-slate-950">
                                {roundTitle}
                              </h4>
                              <span
                                className={[
                                  'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-black ring-1',
                                  getStatusClassName(round.status),
                                ].join(' ')}
                              >
                                {getStatusLabel(round.status)}
                              </span>
                            </div>

                            <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                              <div className="rounded-2xl bg-slate-50 px-3 py-2">
                                <dt className="text-[11px] font-bold text-slate-400">골프장</dt>
                                <dd className="mt-1 truncate font-bold text-slate-800">{round.course_name ?? '-'}</dd>
                              </div>
                              <div className="rounded-2xl bg-slate-50 px-3 py-2">
                                <dt className="text-[11px] font-bold text-slate-400">날짜</dt>
                                <dd className="mt-1 font-bold text-slate-800">{formatShortDate(round.play_date)}</dd>
                              </div>
                              <div className="rounded-2xl bg-slate-50 px-3 py-2">
                                <dt className="text-[11px] font-bold text-slate-400">시간</dt>
                                <dd className="mt-1 font-bold text-slate-800">{formatTime(round.start_time)}</dd>
                              </div>
                              <div className="rounded-2xl bg-slate-50 px-3 py-2">
                                <dt className="text-[11px] font-bold text-slate-400">경기/점수</dt>
                                <dd className="mt-1 truncate font-bold text-slate-800">
                                  {getGameTypeLabel(round.game_type)} · {getScoringTypeLabel(round.scoring_type)}
                                </dd>
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
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <p className="font-bold text-slate-700">이 달에 등록된 라운드가 없습니다.</p>
            <p className="mt-1 text-sm text-slate-500">라운드 목록에서 새 라운드를 등록해 주세요.</p>
          </div>
        )}
      </section>
    </main>
  );
}
