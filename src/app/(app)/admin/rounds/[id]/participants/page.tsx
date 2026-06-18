import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LinkedEventContextCard } from '@/components/admin/linked-event-context-card';
import { requireAdmin } from '@/lib/auth/require-member';
import { getRoundLinkedEventContexts } from '@/lib/round-linked-event-context';
import { updateRoundParticipantsAction } from './actions';
import { ParticipantSelectionEnhancer } from '@/components/admin/participant-selection-enhancer';


type RoundParticipantsPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
    updated?: string;
  }>;
};

type Round = {
  id: string;
  title: string | null;
  course_name: string | null;
  play_date: string | null;
  start_time: string | null;
  status: string;
  event_id: string | null;
};

type Member = {
  id: string;
  name: string;
  phone: string | null;
  handicap: number | null;
  role: 'admin' | 'member';
};

type RoundParticipant = {
  member_id: string;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case 'auth_required':
      return '로그인이 필요합니다.';
    case 'admin_required':
      return '운영진만 참가자를 관리할 수 있습니다.';
    case 'round_not_found':
      return '라운드를 찾을 수 없습니다.';
    case 'invalid_participant':
      return '선택할 수 없는 회원이 포함되어 있습니다.';
    case 'rpc_missing':
      return 'Supabase 참가자 관리 함수가 없습니다. 0012 SQL을 먼저 실행해 주세요.';
    case 'permission_denied':
      return '참가자 관리 권한이 없습니다.';
    case 'unknown':
      return '알 수 없는 오류가 발생했습니다.';
    default:
      return null;
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

export default async function RoundParticipantsPage({
  params,
  searchParams,
}: RoundParticipantsPageProps) {
  const routeParams = await params;
  const queryParams = await searchParams;
  const { supabase, member: currentMember } = await requireAdmin();

  const { data: round, error: roundError } = await supabase
    .from('rounds')
    .select(
      `
      id,
      title,
      course_name,
      play_date,
      start_time,
      status,
      event_id
    `,
    )
    .eq('id', routeParams.id)
    .eq('club_id', currentMember.club_id)
    .maybeSingle();

  if (roundError) {
    throw new Error(roundError.message);
  }

  if (!round) {
    notFound();
  }

  const { data: members, error: membersError } = await supabase
    .from('members')
    .select(
      `
      id,
      name,
      phone,
      handicap,
      role
    `,
    )
    .eq('club_id', currentMember.club_id)
    .eq('status', 'active')
    .order('name', { ascending: true });

  if (membersError) {
    throw new Error(membersError.message);
  }

  const { data: participants, error: participantsError } = await supabase
    .from('round_participants')
    .select('member_id')
    .eq('round_id', routeParams.id)
    .eq('status', 'confirmed');

  if (participantsError && participantsError.code !== '42P01') {
    throw new Error(participantsError.message);
  }

  const activeMembers = (members ?? []) as Member[];
  const selectedMemberIds = new Set(
    ((participants ?? []) as RoundParticipant[]).map(
      (participant) => participant.member_id,
    ),
  );
  const selectedCount = selectedMemberIds.size;
  const currentRound = round as Round;
  const linkedEventContexts = await getRoundLinkedEventContexts(
    supabase,
    currentMember.club_id,
    [currentRound.event_id],
  );
  const linkedEventContext = currentRound.event_id ? linkedEventContexts.get(currentRound.event_id) : null;
  const errorMessage = getErrorMessage(queryParams.error);

  return (
    <main className="mx-auto max-w-7xl space-y-3 px-3 py-3 sm:space-y-4 sm:px-4 sm:py-5">
      {linkedEventContext && <LinkedEventContextCard context={linkedEventContext} />}

      <header className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div>
          <p className="text-xs font-semibold text-emerald-600 sm:text-sm">
            라운드 참가자
          </p>
          <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-2xl">
            {currentRound.title ?? '라운드'}
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            {currentRound.course_name ?? '-'} · {formatDate(currentRound.play_date)} ·{' '}
            {formatTime(currentRound.start_time)}
          </p>
        </div>

        <Link
          href="/admin/rounds"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          목록
        </Link>
      </header>


      {/* 모바일/태블릿에서 라운드 맥락을 짧게 확인할 수 있는 압축 요약입니다. */}
      <section data-round-detail-mobile-summary className="grid grid-cols-3 gap-2 rounded-3xl bg-white p-2.5 text-center shadow-sm sm:hidden">
        <div className="rounded-2xl bg-slate-50 px-2 py-2">
          <p className="text-[11px] font-medium text-slate-500">일자</p>
          <p className="mt-1 truncate text-xs font-bold text-slate-900">{formatDate(currentRound.play_date)}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-2 py-2">
          <p className="text-[11px] font-medium text-slate-500">시간</p>
          <p className="mt-1 truncate text-xs font-bold text-slate-900">{formatTime(currentRound.start_time)}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 px-2 py-2">
          <p className="text-[11px] font-medium text-emerald-700">선택</p>
          <p className="mt-1 text-xs font-bold text-emerald-900">{selectedCount}명</p>
        </div>
      </section>

      {queryParams.updated && (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          참가자 목록이 저장되었습니다.
        </section>
      )}

      {errorMessage && (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
          {errorMessage}
        </section>
      )}

      <form action={updateRoundParticipantsAction} className="space-y-3 pb-24 sm:space-y-4 sm:pb-0">
        <input type="hidden" name="roundId" value={currentRound.id} />

        <ParticipantSelectionEnhancer />

        <section className="rounded-3xl bg-white p-3 shadow-sm sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <h2 className="font-bold text-slate-900">활성 회원</h2>
              <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">
                선택 <span data-selected-count-output>{selectedCount}</span>명
              </p>
            </div>

          </div>

          <div className="mt-3 grid gap-2 sm:mt-4 sm:grid-cols-2 xl:grid-cols-3">
            {activeMembers.length ? (
              activeMembers.map((member) => (
                <label
                  key={member.id}
                  data-member-row
                  className="flex min-h-[68px] cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 transition hover:border-emerald-200 hover:bg-emerald-50/50 sm:min-h-20 sm:py-3"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900 sm:text-base">
                        {member.name}
                      </p>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 sm:py-1 sm:text-xs">
                        {member.role === 'admin' ? '운영진' : '회원'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                      {member.phone ?? '-'} · H {member.handicap ?? 0}
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="memberIds"
                    value={member.id}
                    defaultChecked={selectedMemberIds.has(member.id)}
                    className="h-7 w-7 shrink-0 rounded border-slate-300 text-emerald-600"
                  />
                </label>
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm font-semibold text-slate-700">
                  선택할 수 있는 활성 회원이 없습니다.
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  먼저 회원을 등록하거나 비활성 회원을 복구해 주세요.
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="sticky bottom-24 z-20 mx-auto w-full max-w-2xl rounded-3xl border border-white/70 bg-white/95 p-2 shadow-xl backdrop-blur sm:static sm:max-w-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none">
          <button
            type="submit"
            className="h-12 w-full rounded-2xl bg-emerald-600 px-5 text-sm font-bold text-white"
          >
            참가자 저장 · 선택 <span data-selected-count-label>{selectedCount}명</span>
          </button>
        </div>
      </form>
    </main>
  );
}
