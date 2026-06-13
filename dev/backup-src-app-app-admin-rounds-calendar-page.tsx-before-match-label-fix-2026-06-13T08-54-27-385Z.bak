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
  status: string | null;
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
      return '경기방식 미정';
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
      return '점수방식 미정';
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
      status,
      game_type,
      scoring_type
    `,
    )
    .eq('club_id', member.club_id)
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
    <main className="mx-auto max-w-5xl space-y-5 px-4 py-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            라운드 일정
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            {formatKoreanMonth(monthValue)}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            월별로 라운드를 모아 보고, 참가자/조 편성/스코어/결과 화면으로 이동할 수 있습니다.
          </p>
        </div>

        <Link
          href="/admin/rounds"
          className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          라운드 목록
        </Link>
      </header>

      <nav className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm">
        <Link
          href={`/admin/rounds/calendar?month=${previousMonth}`}
          className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          이전 달
        </Link>

        <strong className="text-slate-900">{formatKoreanMonth(monthValue)}</strong>

        <Link
          href={`/admin/rounds/calendar?month=${nextMonth}`}
          className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          다음 달
        </Link>
      </nav>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900">월간 라운드</h2>
          <span className="text-sm text-slate-500">{typedRounds.length}건</span>
        </div>

        {dateKeys.length ? (
          <div className="mt-4 space-y-5">
            {dateKeys.map((dateKey) => (
              <section key={dateKey} className="space-y-3">
                <h3 className="text-sm font-bold text-slate-700">
                  {formatDate(dateKey === 'undated' ? null : dateKey)}
                </h3>

                <div className="space-y-3">
                  {(groupedRounds[dateKey] ?? []).map((round) => (
                    <article
                      key={round.id}
                      className="rounded-3xl border border-slate-100 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-slate-900">
                              {round.title ?? '라운드'}
                            </h4>
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              {getStatusLabel(round.status)}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-slate-500">
                            {round.course_name ?? '장소 미정'}
                          </p>

                          <p className="mt-2 text-sm text-slate-600">
                            {getGameTypeLabel(round.game_type)} ·{' '}
                            {getScoringTypeLabel(round.scoring_type)}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/admin/rounds/${round.id}/participants`}
                            className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
                          >
                            참가자
                          </Link>
                          <Link
                            href={`/admin/rounds/${round.id}/pairings`}
                            className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
                          >
                            조 편성
                          </Link>
                          <Link
                            href={`/admin/rounds/${round.id}/scores`}
                            className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
                          >
                            스코어
                          </Link>
                          <Link
                            href={`/admin/rounds/${round.id}/results`}
                            className="rounded-2xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
                          >
                            결과
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-3xl border border-dashed border-slate-200 p-8 text-center">
            <p className="font-semibold text-slate-700">
              이 달에 등록된 라운드가 없습니다.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              라운드 목록에서 새 라운드를 등록해 주세요.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
