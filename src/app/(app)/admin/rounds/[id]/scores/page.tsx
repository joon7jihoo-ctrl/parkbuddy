import { notFound } from 'next/navigation';
import { LinkedEventContextCard } from '@/components/admin/linked-event-context-card';
import { requireAdmin } from '@/lib/auth/require-member';
import { getRoundLinkedEventContexts } from '@/lib/round-linked-event-context';
import { RoundScoreInputForm } from '@/components/admin/round-score-input-form';

type ScoresPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
};

type Participant = {
  member_id: string;
  member: {
    id: string;
    name: string;
    handicap: number | null;
  } | null;
};

type RoundScore = {
  member_id: string;
  strokes: number | null;
  stableford_points: number | null;
  memo: string | null;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case 'auth_required':
      return '로그인이 필요합니다.';
    case 'admin_required':
      return '운영진만 스코어를 입력할 수 있습니다.';
    case 'round_not_found':
      return '라운드를 찾을 수 없습니다.';
    case 'invalid_scores':
      return '스코어 입력값이 올바르지 않습니다.';
    case 'invalid_strokes':
      return '타수는 1 이상 200 이하로 입력해 주세요.';
    case 'invalid_points':
      return '스테이블포드 포인트 값이 올바르지 않습니다.';
    case 'member_not_in_round':
      return '라운드 참가자가 아닌 회원의 스코어는 저장할 수 없습니다.';
    case 'rpc_missing':
      return 'Supabase 스코어 저장 함수가 없습니다. 0014 SQL을 먼저 실행해 주세요.';
    case 'permission_denied':
      return '스코어 저장 권한이 없습니다.';
    default:
      return null;
  }
}

function formatDate(value?: string | null) {
  if (!value) return '-';
  return new Date(`${value}T00:00:00`).toLocaleDateString('ko-KR');
}

export default async function RoundScoresPage({ params, searchParams }: ScoresPageProps) {
  const routeParams = await params;
  const queryParams = await searchParams;
  const { supabase, member } = await requireAdmin();

  const { data: round, error: roundError } = await supabase
    .from('rounds')
    .select('id, title, course_name, play_date, status, club_id, event_id')
    .eq('id', routeParams.id)
    .eq('club_id', member.club_id)
    .maybeSingle();

  if (roundError) throw new Error(roundError.message);
  if (!round) notFound();

  const { data: participantRows, error: participantsError } = await supabase
    .from('round_participants')
    .select('member_id, member:member_id(id, name, handicap)')
    .eq('round_id', round.id)
    .order('created_at', { ascending: true });

  if (participantsError && participantsError.code !== '42P01') {
    throw new Error(participantsError.message);
  }

  const { data: scoreRows, error: scoresError } = await supabase
    .from('round_scores')
    .select('member_id, strokes, stableford_points, memo')
    .eq('round_id', round.id);

  if (scoresError && scoresError.code !== '42P01') {
    throw new Error(scoresError.message);
  }

  const participants = (participantRows ?? []) as unknown as Participant[];
  const scores = (scoreRows ?? []) as RoundScore[];
  const scoreByMemberId = new Map(scores.map((score) => [score.member_id, score]));
  const scoreFormParticipants = participants.map((participant) => {
    const score = scoreByMemberId.get(participant.member_id);
    return {
      memberId: participant.member_id,
      name: participant.member?.name ?? '이름 없는 회원',
      handicap: participant.member?.handicap ?? 0,
      strokes: score?.strokes ?? null,
      stablefordPoints: score?.stableford_points ?? null,
      memo: score?.memo ?? null,
    };
  });
  const linkedEventContexts = await getRoundLinkedEventContexts(
    supabase,
    member.club_id,
    [round.event_id],
  );
  const linkedEventContext = round.event_id ? linkedEventContexts.get(round.event_id) : null;
  const errorMessage = getErrorMessage(queryParams.error);

  return (
    <main className="mx-auto max-w-7xl space-y-4 px-3 py-4 sm:px-4 sm:py-5">
      {linkedEventContext && <LinkedEventContextCard context={linkedEventContext} />}

      <header>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">스코어 입력</h1>
        <p className="mt-1 text-sm text-slate-500">
          {round.title} · {round.course_name} · {formatDate(round.play_date)}
        </p>
      </header>

      {queryParams.saved && (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          스코어가 저장되었습니다.
        </section>
      )}

      {errorMessage && (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
          {errorMessage}
        </section>
      )}


      <RoundScoreInputForm
        roundId={round.id}
        participants={scoreFormParticipants}
        playDateLabel={formatDate(round.play_date)}
      />

    </main>
  );
}
