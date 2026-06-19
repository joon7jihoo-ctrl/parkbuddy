import Link from 'next/link';
import { ConfirmSubmitButton } from '@/components/confirm-submit-button';
import { requireAdmin } from '@/lib/auth/require-member';
import { adminRestoreRoundAction } from '../actions';

type AdminDeletedRoundsPageProps = {
  searchParams: Promise<{
    roundRestored?: string;
    error?: string;
  }>;
};

type Round = {
  id: string;
  title: string | null;
  course_name: string | null;
  play_date: string | null;
  start_time: string | null;
  memo: string | null;
  status: 'scheduled' | 'completed' | 'cancelled';
  game_type: string | null;
  scoring_type: string | null;
  deleted_at: string | null;
  created_at: string;
};

type RoundParticipant = {
  round_id: string;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case 'auth_required':
      return '로그인이 필요합니다.';
    case 'admin_required':
      return '운영진만 라운드를 관리할 수 있습니다.';
    case 'round_not_found':
      return '라운드를 찾을 수 없습니다.';
    case 'rpc_missing':
      return 'Supabase 라운드 관리 함수가 없습니다. 최신 SQL을 먼저 실행해 주세요.';
    case 'permission_denied':
      return '라운드 관리 권한이 없습니다.';
    case 'unknown':
      return '알 수 없는 오류가 발생했습니다.';
    default:
      return null;
  }
}

function getStatusLabel(status: Round['status']) {
  switch (status) {
    case 'scheduled':
      return '예정';
    case 'completed':
      return '완료';
    case 'cancelled':
      return '취소';
    default:
      return status;
  }
}

function getStatusClassName(status: Round['status']) {
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

  return new Date(`${value}T00:00:00`).toLocaleDateString('ko-KR');
}

function formatTime(value?: string | null) {
  if (!value) {
    return '-';
  }

  return value.slice(0, 5);
}

function formatDeletedAt(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleString('ko-KR');
}

function countParticipantsByRound(participants: RoundParticipant[]) {
  return participants.reduce<Record<string, number>>((acc, participant) => {
    acc[participant.round_id] = (acc[participant.round_id] ?? 0) + 1;
    return acc;
  }, {});
}

function actionLinkClassName(variant: 'default' | 'dark' | 'green' = 'default') {
  if (variant === 'dark') {
    return 'inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-900 px-3 py-2 text-center text-sm font-bold text-white shadow-sm transition hover:bg-slate-800';
  }

  if (variant === 'green') {
    return 'inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-600 px-3 py-2 text-center text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700';
  }

  return 'inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-100 px-3 py-2 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-200';
}

export default async function AdminDeletedRoundsPage({
  searchParams,
}: AdminDeletedRoundsPageProps) {
  const params = await searchParams;
  const { supabase, member } = await requireAdmin();

  const { data, error } = await supabase
    .from('rounds')
    .select(
      `
      id,
      title,
      course_name,
      play_date,
      start_time,
      memo,
      status,
      game_type,
      scoring_type,
      deleted_at,
      created_at
    `,
    )
    .eq('club_id', member.club_id)
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false })
    .order('created_at', { ascending: false });

  if (error && error.code !== '42P01') {
    throw new Error(error.message);
  }

  const rounds = (data ?? []) as Round[];
  const roundIds = rounds.map((round) => round.id);

  const { data: participantsData, error: participantsError } = roundIds.length
    ? await supabase
        .from('round_participants')
        .select('round_id')
        .in('round_id', roundIds)
    : { data: [], error: null };

  if (participantsError && participantsError.code !== '42P01') {
    throw new Error(participantsError.message);
  }

  const participantCounts = countParticipantsByRound(
    (participantsData ?? []) as RoundParticipant[],
  );
  const errorMessage = getErrorMessage(params.error);

  return (
    <main className="mx-auto max-w-7xl space-y-4 px-3 py-4 sm:px-4 sm:py-5 lg:px-6">
      <header className="rounded-[2rem] bg-white/80 p-4 shadow-sm ring-1 ring-slate-100 sm:p-5 lg:flex lg:items-end lg:justify-between lg:gap-6">
        <div className="min-w-0">
          <p className="text-sm font-bold text-amber-600">라운드 안전 관리</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            삭제된 라운드
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            삭제된 라운드는 기본 목록에서 숨겨집니다. 복구 전까지 일반 운영 작업은 막고, 데이터는 그대로 보존합니다.
          </p>
        </div>

        <nav className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 lg:mt-0 lg:min-w-[28rem]">
          <Link href="/admin/rounds" className={actionLinkClassName('dark')}>
            라운드 목록
          </Link>
          <Link href="/admin/rounds/calendar" className={actionLinkClassName()}>
            월별 일정
          </Link>
          <Link href="/admin" className={actionLinkClassName()}>
            대시보드
          </Link>
        </nav>
      </header>

      <section className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
        <p className="font-black">복구 전 확인해 주세요.</p>
        <p className="mt-1">
          복구하면 해당 라운드는 기본 라운드 목록에 다시 표시되고, 참가자/조 편성/스코어/결과 데이터는 그대로 유지됩니다.
        </p>
      </section>

      {params.roundRestored && (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          라운드가 복구되었습니다. 기본 라운드 목록에서 다시 확인할 수 있습니다.
        </section>
      )}

      {errorMessage && (
        <section className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-700">
          {errorMessage}
        </section>
      )}

      <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
          <h2 className="font-black text-slate-950">삭제된 라운드 {rounds.length}개</h2>
          <p className="hidden text-xs font-semibold text-slate-400 sm:block">
            복구 중심으로 단순화했습니다.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {rounds.length ? (
            rounds.map((round) => {
              const participantCount = participantCounts[round.id] ?? 0;
              const roundTitle = round.title ?? '이름 없는 라운드';

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
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">
                          참가자 {participantCount}명
                        </span>
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-700">
                          삭제됨
                        </span>
                      </div>

                      <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 lg:grid-cols-6">
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
                        <div className="rounded-2xl bg-slate-50 px-3 py-2">
                          <dt className="text-[11px] font-bold text-slate-400">점수</dt>
                          <dd className="mt-1 truncate font-bold text-slate-800">{getScoringTypeLabel(round.scoring_type)}</dd>
                        </div>
                        <div className="rounded-2xl bg-amber-50 px-3 py-2">
                          <dt className="text-[11px] font-bold text-amber-500">삭제</dt>
                          <dd className="mt-1 truncate font-bold text-amber-800">{formatDeletedAt(round.deleted_at)}</dd>
                        </div>
                      </dl>

                      {round.memo && (
                        <details className="group rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-600 sm:px-4 sm:py-3">
                          <summary className="cursor-pointer list-none font-bold text-slate-700">
                            <span className="inline-flex items-center gap-2">
                              메모
                              <span className="text-xs text-slate-400 group-open:hidden">펼치기</span>
                              <span className="hidden text-xs text-slate-400 group-open:inline">접기</span>
                            </span>
                          </summary>
                          <p className="mt-2 whitespace-pre-wrap leading-6">{round.memo}</p>
                        </details>
                      )}
                    </div>

                    <div className="space-y-2 xl:rounded-3xl xl:bg-slate-50 xl:p-3">
                      <form action={adminRestoreRoundAction}>
                        <input type="hidden" name="roundId" value={round.id} />
                        <ConfirmSubmitButton
                          confirmMessage={`${roundTitle}를 기본 라운드 목록으로 복구할까요?`}
                          className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700"
                        >
                          라운드 복구
                        </ConfirmSubmitButton>
                      </form>
                      <p className="rounded-2xl bg-white px-3 py-2 text-xs leading-5 text-slate-500 ring-1 ring-slate-100 xl:bg-transparent xl:ring-0">
                        복구 후 일반 운영 화면에서 참가자, 조 편성, 스코어를 다시 관리할 수 있습니다.
                      </p>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="px-5 py-12 text-center">
              <p className="text-sm font-bold text-slate-700">삭제된 라운드가 없습니다.</p>
              <p className="mt-1 text-sm text-slate-500">
                삭제된 라운드가 생기면 이 화면에서 확인하고 복구할 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
