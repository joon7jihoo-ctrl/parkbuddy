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
      return 'bg-blue-100 text-blue-700';
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-emerald-100 text-emerald-700';
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
    <main className="mx-auto max-w-5xl space-y-5 px-4 py-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-amber-600">
            라운드 안전 관리
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            삭제된 라운드
          </h1>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            삭제된 라운드는 기본 목록에서 숨겨집니다. 참가자, 조 편성,
            스코어, 결과 데이터는 보존되며 필요할 때 복구할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/rounds"
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            기본 라운드 목록
          </Link>
          <Link
            href="/admin"
            className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            대시보드
          </Link>
        </div>
      </header>

      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
        <p className="font-bold">복구 전 확인해 주세요.</p>
        <p className="mt-1">
          이 화면에서는 삭제된 라운드의 일반 운영 작업을 막고 복구만 제공합니다.
          복구하면 해당 라운드는 기본 라운드 목록에 다시 표시됩니다.
        </p>
      </section>

      {params.roundRestored && (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-semibold text-emerald-700">
          라운드가 복구되었습니다. 기본 라운드 목록에서 다시 확인할 수 있습니다.
        </section>
      )}

      {errorMessage && (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-700">
          {errorMessage}
        </section>
      )}

      <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-900">
            삭제된 라운드 {rounds.length}개
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            삭제된 라운드는 실제 삭제되지 않았으며, 복구 전까지 기본 목록에서만 숨겨집니다.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {rounds.length ? (
            rounds.map((round) => {
              const participantCount = participantCounts[round.id] ?? 0;

              return (
                <article
                  key={round.id}
                  className="grid gap-4 px-5 py-4 md:grid-cols-[1fr_auto]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900">
                        {round.title ?? '이름 없는 라운드'}
                      </h3>
                      <span
                        className={[
                          'rounded-full px-2 py-1 text-xs font-semibold',
                          getStatusClassName(round.status),
                        ].join(' ')}
                      >
                        {getStatusLabel(round.status)}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                        참가자 {participantCount}명
                      </span>
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                        삭제됨
                      </span>
                    </div>

                    <dl className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-3 lg:grid-cols-6">
                      <div>
                        <dt className="text-xs text-slate-400">골프장</dt>
                        <dd className="font-medium text-slate-700">
                          {round.course_name ?? '-'}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs text-slate-400">날짜</dt>
                        <dd className="font-medium text-slate-700">
                          {formatDate(round.play_date)}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs text-slate-400">시작 시간</dt>
                        <dd className="font-medium text-slate-700">
                          {formatTime(round.start_time)}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs text-slate-400">경기 형태</dt>
                        <dd className="font-medium text-slate-700">
                          {getGameTypeLabel(round.game_type)}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs text-slate-400">점수 계산</dt>
                        <dd className="font-medium text-slate-700">
                          {getScoringTypeLabel(round.scoring_type)}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs text-slate-400">삭제 시각</dt>
                        <dd className="font-medium text-slate-700">
                          {formatDeletedAt(round.deleted_at)}
                        </dd>
                      </div>
                    </dl>

                    {round.memo && (
                      <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                        {round.memo}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 md:min-w-40 md:items-end md:justify-center">
                    <form action={adminRestoreRoundAction}>
                      <input type="hidden" name="roundId" value={round.id} />
                      <ConfirmSubmitButton
                        confirmMessage={`${round.title ?? "이 라운드"}를 기본 라운드 목록으로 복구할까요?`}
                        className="w-full rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 md:w-auto"
                      >
                        라운드 복구
                      </ConfirmSubmitButton>
                    </form>
                    <p className="text-xs leading-5 text-slate-500 md:text-right">
                      복구 후 참가자, 조 편성, 스코어, 결과 데이터는 그대로 유지됩니다.
                    </p>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="px-5 py-12 text-center">
              <p className="text-sm font-semibold text-slate-700">
                삭제된 라운드가 없습니다.
              </p>
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
