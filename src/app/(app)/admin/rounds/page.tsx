import Link from 'next/link';
import { ConfirmSubmitButton } from '@/components/confirm-submit-button';
import { LinkedEventInlineBadge } from '@/components/admin/linked-event-context-card';
import { requireAdmin } from '@/lib/auth/require-member';
import { getRoundLinkedEventContexts } from '@/lib/round-linked-event-context';
import { updateRoundStatusAction, duplicateRoundAction, adminSoftDeleteRoundAction } from './actions';

type RoundStatus = 'scheduled' | 'completed' | 'cancelled';
type RoundStatusFilter = 'all' | RoundStatus;

type AdminRoundsPageProps = {
  searchParams: Promise<{ created?: string; statusUpdated?: string; roundDeleted?: string; error?: string; status?: string }>;
};

type Round = {
  id: string;
  title: string | null;
  course_name: string | null;
  play_date: string | null;
  start_time: string | null;
  memo: string | null;
  status: RoundStatus;
  game_type: string | null;
  scoring_type: string | null;
  created_at: string;
  event_id: string | null;
};

type RoundParticipant = { round_id: string };

function getErrorMessage(error?: string) {
  switch (error) {
    case 'auth_required': return '로그인이 필요합니다.';
    case 'admin_required': return '운영진만 라운드를 관리할 수 있습니다.';
    case 'invalid_round_status': return '라운드 상태 값이 올바르지 않습니다.';
    case 'round_not_found': return '라운드를 찾을 수 없습니다.';
    case 'rpc_missing': return 'Supabase 라운드 관리 함수가 없습니다. 최신 SQL을 먼저 실행해 주세요.';
    case 'permission_denied': return '라운드 관리 권한이 없습니다.';
    case 'unknown': return '알 수 없는 오류가 발생했습니다.';
    default: return null;
  }
}

function getStatusFilter(value?: string): RoundStatusFilter {
  return value === 'scheduled' || value === 'completed' || value === 'cancelled' ? value : 'all';
}

function getStatusLabel(status: Round['status']) {
  switch (status) {
    case 'scheduled': return '예정';
    case 'completed': return '완료';
    case 'cancelled': return '취소';
    default: return status;
  }
}

function getStatusClassName(status: Round['status']) {
  switch (status) {
    case 'completed': return 'bg-blue-100 text-blue-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    default: return 'bg-emerald-100 text-emerald-700';
  }
}

function getScoringTypeLabel(value?: string | null) {
  switch (value) {
    case 'stroke': return '스트로크';
    case 'new_peoria': return '신페리오';
    case 'match':
    case 'match_play': return '매치 플레이';
    case 'stableford': return '스테이블포드';
    default: return '미지정';
  }
}

function formatDate(value?: string | null) {
  return value ? new Date(value + 'T00:00:00').toLocaleDateString('ko-KR') : '-';
}

function formatTime(value?: string | null) {
  return value ? value.slice(0, 5) : '-';
}

function countParticipantsByRound(participants: RoundParticipant[]) {
  return participants.reduce<Record<string, number>>((acc, participant) => {
    acc[participant.round_id] = (acc[participant.round_id] ?? 0) + 1;
    return acc;
  }, {});
}

function StatusCard({ href, label, value, active }: { href: string; label: string; value: number; active: boolean }) {
  return (
    <Link
      href={href}
      className={[
        'flex min-h-14 flex-col items-center justify-center rounded-2xl border px-2 py-2 text-center shadow-sm transition active:scale-[0.99] md:min-h-16 md:px-3',
        active
          ? 'border-emerald-500 bg-emerald-600 text-white'
          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
      ].join(' ')}
    >
      <p className={['text-[11px] font-bold md:text-xs', active ? 'text-emerald-50' : 'text-slate-500'].join(' ')}>{label}</p>
      <p className="mt-0.5 text-lg font-black leading-none md:text-xl">{value}</p>
    </Link>
  );
}

export default async function AdminRoundsPage({ searchParams }: AdminRoundsPageProps) {
  const params = await searchParams;
  const statusFilter = getStatusFilter(params.status);
  const { supabase, member } = await requireAdmin();

  const { data, error } = await supabase
    .from('rounds')
    .select('id, title, course_name, play_date, start_time, memo, status, game_type, scoring_type, created_at, event_id')
    .eq('club_id', member.club_id)
    .is('deleted_at', null)
    .order('play_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error && error.code !== '42P01') {
    throw new Error(error.message);
  }

  const rounds = (data ?? []) as Round[];
  const visibleRounds = statusFilter === 'all' ? rounds : rounds.filter((round) => round.status === statusFilter);
  const roundIds = visibleRounds.map((round) => round.id);

  const { data: participantsData, error: participantsError } = roundIds.length
    ? await supabase.from('round_participants').select('round_id').in('round_id', roundIds)
    : { data: [], error: null };

  if (participantsError && participantsError.code !== '42P01') {
    throw new Error(participantsError.message);
  }

  const participantCounts = countParticipantsByRound((participantsData ?? []) as RoundParticipant[]);
  const linkedEventContexts = await getRoundLinkedEventContexts(
    supabase,
    member.club_id,
    visibleRounds.map((round) => round.event_id),
  );
  const errorMessage = getErrorMessage(params.error);
  const scheduledCount = rounds.filter((round) => round.status === 'scheduled').length;
  const completedCount = rounds.filter((round) => round.status === 'completed').length;
  const cancelledCount = rounds.filter((round) => round.status === 'cancelled').length;

  return (
    <main className="mx-auto max-w-7xl space-y-4 px-4 py-4 pb-28 md:space-y-5 md:py-6 md:pb-32">
      <header className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:border-0 md:bg-transparent md:p-0 md:shadow-none">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-extrabold text-emerald-600 md:text-sm">라운드 관리</p>
            <h1 className="mt-1 text-xl font-black leading-tight text-slate-900 md:text-2xl">라운드 목록</h1>
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-500 md:text-sm">일정, 참가자, 조 편성, 스코어를 빠르게 관리합니다.</p>
          </div>
          <Link href="/admin/rounds/new" className="hidden min-h-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-extrabold text-white shadow-sm transition active:scale-[0.99] sm:flex">
            라운드 생성
          </Link>
        </div>
      </header>

      {params.created && <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-semibold text-emerald-700">라운드가 생성되었습니다.</section>}
      {params.statusUpdated && <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-semibold text-emerald-700">라운드 상태가 변경되었습니다.</section>}
      {params.roundDeleted && <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold text-amber-800">라운드가 삭제된 라운드 목록으로 이동했습니다.</section>}
      {errorMessage && <section className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-700">{errorMessage}</section>}

      <section className="sticky top-0 z-20 -mx-4 border-y border-slate-200 bg-slate-50/95 px-4 py-2 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
        <StatusCard href="/admin/rounds" label="전체" value={rounds.length} active={statusFilter === 'all'} />
        <StatusCard href="/admin/rounds?status=scheduled" label="예정" value={scheduledCount} active={statusFilter === 'scheduled'} />
        <StatusCard href="/admin/rounds?status=completed" label="완료" value={completedCount} active={statusFilter === 'completed'} />
        <StatusCard href="/admin/rounds?status=cancelled" label="취소" value={cancelledCount} active={statusFilter === 'cancelled'} />
        </div>
      </section>

      <section className="space-y-3">
        {visibleRounds.length ? (
          visibleRounds.map((round) => {
            const participantCount = participantCounts[round.id] ?? 0;
            const linkedEventContext = round.event_id ? linkedEventContexts.get(round.event_id) : null;
            return (
              <article key={round.id} className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm md:p-4">
                <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[1fr_340px] lg:gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-black leading-tight text-slate-900 md:text-lg">{round.title ?? '이름 없는 라운드'}</h3>
                      <span className={['rounded-full px-2 py-1 text-[11px] font-bold md:text-xs', getStatusClassName(round.status)].join(' ')}>{getStatusLabel(round.status)}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600 md:text-xs">참가자 {participantCount}명</span>
                    </div>

                    <dl className="mt-3 grid grid-cols-2 gap-1.5 text-xs text-slate-600 sm:grid-cols-4 lg:max-w-3xl">
                      <div className="rounded-2xl bg-slate-50 px-3 py-2"><dt className="text-[11px] font-bold text-slate-400">골프장</dt><dd className="mt-0.5 truncate font-bold text-slate-700">{round.course_name ?? '-'}</dd></div>
                      <div className="rounded-2xl bg-slate-50 px-3 py-2"><dt className="text-[11px] font-bold text-slate-400">날짜</dt><dd className="mt-0.5 font-bold text-slate-700">{formatDate(round.play_date)}</dd></div>
                      <div className="rounded-2xl bg-slate-50 px-3 py-2"><dt className="text-[11px] font-bold text-slate-400">시작 시간</dt><dd className="mt-0.5 font-bold text-slate-700">{formatTime(round.start_time)}</dd></div>
                      <div className="rounded-2xl bg-slate-50 px-3 py-2"><dt className="text-[11px] font-bold text-slate-400">점수 계산</dt><dd className="mt-0.5 font-bold text-slate-700">{getScoringTypeLabel(round.scoring_type)}</dd></div>
                    </dl>

                    {linkedEventContext && <LinkedEventInlineBadge context={linkedEventContext} />}

                    {round.memo && <details className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600"><summary className="cursor-pointer font-semibold text-slate-700">메모 보기</summary><p className="mt-2">{round.memo}</p></details>}
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-1.5 lg:grid-cols-2 lg:gap-2">
                      <Link href={'/admin/rounds/' + round.id + '/participants'} className="flex min-h-11 items-center justify-center rounded-2xl bg-slate-100 px-2 py-2 text-center text-xs font-extrabold text-slate-700 transition active:scale-[0.99] md:text-sm">참가자</Link>
                      <Link href={'/admin/rounds/' + round.id + '/pairings'} className="flex min-h-11 items-center justify-center rounded-2xl bg-slate-100 px-2 py-2 text-center text-xs font-extrabold text-slate-700 transition active:scale-[0.99] md:text-sm">조 편성</Link>
                      <Link href={'/admin/rounds/' + round.id + '/scores'} className="flex min-h-11 items-center justify-center rounded-2xl bg-slate-900 px-2 py-2 text-center text-xs font-extrabold text-white transition active:scale-[0.99] md:text-sm">스코어</Link>
                      <Link href={'/admin/rounds/' + round.id + '/results'} className="flex min-h-11 items-center justify-center rounded-2xl bg-emerald-600 px-2 py-2 text-center text-xs font-extrabold text-white transition active:scale-[0.99] md:text-sm">결과</Link>
                    </div>
                    <details className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      <summary className="cursor-pointer font-semibold">더보기 · 상태 관리</summary>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <Link href={'/admin/rounds/' + round.id + '/edit'} className="rounded-xl bg-white px-3 py-2 text-center font-semibold text-slate-700">수정</Link>
                        <form action={duplicateRoundAction}><input type="hidden" name="roundId" value={round.id} /><button type="submit" className="w-full rounded-xl bg-white px-3 py-2 font-semibold text-slate-700">복제</button></form>
                        {round.status !== 'completed' && <form action={updateRoundStatusAction}><input type="hidden" name="roundId" value={round.id} /><input type="hidden" name="status" value="completed" /><ConfirmSubmitButton confirmMessage={(round.title ?? '이 라운드') + '를 완료 처리할까요?'} className="w-full rounded-xl bg-blue-50 px-3 py-2 font-semibold text-blue-700">완료</ConfirmSubmitButton></form>}
                        {round.status !== 'cancelled' && <form action={updateRoundStatusAction}><input type="hidden" name="roundId" value={round.id} /><input type="hidden" name="status" value="cancelled" /><ConfirmSubmitButton confirmMessage={(round.title ?? '이 라운드') + '를 취소 처리할까요?'} className="w-full rounded-xl bg-red-50 px-3 py-2 font-semibold text-red-700">취소</ConfirmSubmitButton></form>}
                        {round.status !== 'scheduled' && <form action={updateRoundStatusAction} className="col-span-2"><input type="hidden" name="roundId" value={round.id} /><input type="hidden" name="status" value="scheduled" /><ConfirmSubmitButton confirmMessage={(round.title ?? '이 라운드') + '를 예정 상태로 되돌릴까요?'} className="w-full rounded-xl bg-white px-3 py-2 font-semibold text-slate-700">예정으로</ConfirmSubmitButton></form>}
                      </div>
                    </details>
                    <details className="rounded-2xl border border-red-100 bg-red-50/70 px-3 py-2 text-sm text-red-700">
                      <summary className="cursor-pointer font-semibold">위험 작업</summary>
                      <div className="mt-3 space-y-3"><p className="text-xs leading-5 text-red-600">삭제하면 기본 라운드 목록에서 숨겨지며 삭제된 라운드 보기 화면에서 복구할 수 있습니다.</p><form action={adminSoftDeleteRoundAction}><input type="hidden" name="roundId" value={round.id} /><button type="submit" className="w-full rounded-xl border border-red-200 bg-white px-4 py-2 font-semibold text-red-700 shadow-sm transition hover:bg-red-50">삭제 확정</button></form></div>
                    </details>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-3xl bg-white px-5 py-12 text-center shadow-sm"><p className="text-sm font-semibold text-slate-700">표시할 라운드가 없습니다.</p><p className="mt-1 text-sm text-slate-500">다른 상태를 선택하거나 새 라운드를 생성하세요.</p></div>
        )}
      </section>

      <nav className="parkbuddy-sticky-cta">
        <div data-parkbuddy-sticky-cta="true" className="parkbuddy-sticky-cta__inner">

          <Link href="/admin/rounds/new" className="flex h-12 items-center justify-center rounded-2xl bg-emerald-600 text-sm font-bold text-white shadow-sm">라운드 생성</Link>
        </div>
      </nav>
    </main>
  );
}
