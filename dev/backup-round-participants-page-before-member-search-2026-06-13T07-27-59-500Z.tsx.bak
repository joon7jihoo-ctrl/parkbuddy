import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-member';
import { updateRoundParticipantsAction } from './actions';

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
      status
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
  const errorMessage = getErrorMessage(queryParams.error);
  const currentRound = round as Round;

  return (
    <main className="mx-auto max-w-4xl space-y-5 px-4 py-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            라운드 참가자
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            {currentRound.title ?? '라운드'} 참가자 선택
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {currentRound.course_name ?? '-'} · {formatDate(currentRound.play_date)} ·{' '}
            {formatTime(currentRound.start_time)}
          </p>
        </div>

        <Link
          href="/admin/rounds"
          className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          라운드 목록
        </Link>
      </header>

      {queryParams.updated && (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-semibold text-emerald-700">
          참가자 목록이 저장되었습니다.
        </section>
      )}

      {errorMessage && (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-700">
          {errorMessage}
        </section>
      )}

      <form action={updateRoundParticipantsAction} className="space-y-5">
        <input type="hidden" name="roundId" value={currentRound.id} />

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-slate-900">활성 회원</h2>
              <p className="mt-1 text-sm text-slate-500">
                참가할 회원을 선택하세요. 현재 {selectedCount}명 선택됨.
              </p>
            </div>

            <button
              type="submit"
              className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white"
            >
              참가자 저장
            </button>
          </div>

          <div className="mt-5 divide-y divide-slate-100">
            {activeMembers.length ? (
              activeMembers.map((member) => (
                <label
                  key={member.id}
                  className="flex cursor-pointer items-center justify-between gap-4 py-4"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900">
                        {member.name}
                      </p>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                        {member.role === 'admin' ? '운영진' : '회원'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      연락처 {member.phone ?? '-'} · 핸디캡 {member.handicap ?? 0}
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="memberIds"
                    value={member.id}
                    defaultChecked={selectedMemberIds.has(member.id)}
                    className="h-5 w-5 rounded border-slate-300 text-emerald-600"
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
      </form>
    </main>
  );
}
