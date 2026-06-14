import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-member';
import { DeletedRoundOperationBlocked } from '@/components/admin/deleted-round-operation-blocked';
import { RoundPairingForm } from '@/components/admin/round-pairing-form';
import { saveRoundPairingsAction } from './actions';

type PairingsPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    saved?: string;
    error?: string;
  }>;
};

type Round = {
  id: string;
  club_id: string;
  deleted_at: string | null;
  title: string | null;
  course_name: string | null;
  play_date: string | null;
  game_type: string | null;
  scoring_type: string | null;
};

type Participant = {
  id: string;
  name: string;
  handicap: number;
};

type RoundGroupMember = {
  member_id: string;
  round_groups: {
    group_no: number | null;
  } | null;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case 'auth_required':
      return '로그인이 필요합니다.';
    case 'admin_required':
      return '운영진만 조 편성을 저장할 수 있습니다.';
    case 'round_not_found':
      return '라운드를 찾을 수 없습니다.';
    case 'invalid_game_combination':
      return '선택한 경기 형태와 점수 계산 방식 조합이 올바르지 않습니다.';
    case 'not_enough_participants':
      return '조 편성을 위해 최소 3명 이상의 참가자가 필요합니다.';
    case 'invalid_group_size':
      return '각 조는 최소 3명, 최대 4명으로 편성해야 합니다.';
    case 'invalid_participant':
      return '라운드 참가자가 아니거나 활성 회원이 아닌 사용자가 포함되어 있습니다.';
    case 'duplicate_participant':
      return '같은 참가자가 중복으로 포함되어 있습니다.';
    case 'rpc_missing':
      return 'Supabase 조 편성 함수가 없습니다. 0013 SQL을 먼저 실행해 주세요.';
    case 'permission_denied':
      return '조 편성 저장 권한이 없습니다.';
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

export default async function PairingsPage({
  params,
  searchParams,
}: PairingsPageProps) {
  const routeParams = await params;
  const queryParams = await searchParams;
  const { supabase, member } = await requireAdmin();

  const { data: round, error: roundError } = await supabase
    .from('rounds')
    .select(
      `
      id,
      club_id,
      title,
      course_name,
      play_date,
      game_type,
      scoring_type,
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

  const typedRound = round as Round;

  const { data: participantRows, error: participantsError } = await supabase
    .from('round_participants')
    .select('member_id')
    .eq('round_id', typedRound.id);

  if (participantsError) {
    throw new Error(participantsError.message);
  }

  const memberIds = (participantRows ?? []).map((row) => String(row.member_id));

  const { data: members, error: membersError } = memberIds.length
    ? await supabase
        .from('members')
        .select('id, name, handicap')
        .eq('club_id', member.club_id)
        .eq('status', 'active')
        .in('id', memberIds)
        .order('handicap', { ascending: true })
        .order('name', { ascending: true })
    : { data: [], error: null };

  if (membersError) {
    throw new Error(membersError.message);
  }

  const { data: existingRows, error: existingError } = await supabase
    .from('round_group_members')
    .select(
      `
      member_id,
      round_groups:round_group_id(group_no)
    `,
    )
    .eq('round_id', typedRound.id);

  if (existingError && existingError.code !== '42P01') {
    throw new Error(existingError.message);
  }

  const existingAssignments = ((existingRows ?? []) as unknown as RoundGroupMember[])
    .filter((row) => row.round_groups?.group_no)
    .reduce<Record<string, number>>((acc, row) => {
      acc[row.member_id] = Number(row.round_groups?.group_no ?? 1);
      return acc;
    }, {});

  const participants = (members ?? []).map((row) => ({
    id: String(row.id),
    name: String(row.name),
    handicap: Number(row.handicap ?? 0),
  })) satisfies Participant[];

  const errorMessage = getErrorMessage(queryParams.error);

  return (
    <main className="mx-auto max-w-7xl space-y-4 px-3 py-4 sm:px-4 sm:py-5">
      <header className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            조 편성
          </p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {typedRound.title ?? '라운드'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {typedRound.course_name ?? '-'} · {formatDate(typedRound.play_date)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:justify-end">
          <Link
            href={`/admin/rounds/${typedRound.id}/participants`}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-100 px-4 py-2 text-center text-sm font-semibold text-slate-700"
          >
            참가자 선택
          </Link>
          <Link
            href="/admin/rounds"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white"
          >
            라운드 목록
          </Link>
        </div>
      </header>


      <section data-round-detail-mobile-summary className="grid grid-cols-3 gap-2 rounded-3xl bg-white p-3 text-center shadow-sm sm:hidden">
        <div className="rounded-2xl bg-slate-50 px-2 py-2">
          <p className="text-[11px] font-medium text-slate-500">일자</p>
          <p className="mt-1 truncate text-xs font-bold text-slate-900">{formatDate(typedRound.play_date)}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-2 py-2">
          <p className="text-[11px] font-medium text-slate-500">경기</p>
          <p className="mt-1 truncate text-xs font-bold text-slate-900">{typedRound.game_type ?? '-'}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 px-2 py-2">
          <p className="text-[11px] font-medium text-emerald-700">참가</p>
          <p className="mt-1 text-xs font-bold text-emerald-900">{participants.length}명</p>
        </div>
      </section>

      {queryParams.saved && (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          조 편성이 저장되었습니다.
        </section>
      )}

      {errorMessage && (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
          {errorMessage}
        </section>
      )}

      {participants.length ? (
        <RoundPairingForm
          roundId={typedRound.id}
          participants={participants}
          defaultPlayMode={typedRound.game_type as never}
          defaultScoringType={typedRound.scoring_type as never}
          defaultAssignments={existingAssignments}
          action={saveRoundPairingsAction}
        />
      ) : (
        <section className="rounded-3xl bg-white p-5 text-center shadow-sm sm:p-8">
          <p className="font-semibold text-slate-900">
            아직 참가자가 없습니다.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            조 편성 전에 참가자를 먼저 선택해 주세요.
          </p>
          <Link
            href={`/admin/rounds/${typedRound.id}/participants`}
            className="mt-5 inline-flex rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            참가자 선택하기
          </Link>
        </section>
      )}
    </main>
  );
}
