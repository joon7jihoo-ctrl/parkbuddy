import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-member';
import { saveRoundScoresAction } from './actions';

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
    .select('id, title, course_name, play_date, status, club_id')
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
  const errorMessage = getErrorMessage(queryParams.error);

  return (
    <main className="mx-auto max-w-5xl space-y-5 px-4 py-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-600">스코어 관리</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">스코어 입력</h1>
          <p className="mt-1 text-sm text-slate-500">
            {round.title} · {round.course_name} · {formatDate(round.play_date)}
          </p>
        </div>

        <div className="flex gap-2">
          <Link href={`/admin/rounds/${round.id}/pairings`} className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            조 편성
          </Link>
          <Link href="/admin/rounds" className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            라운드 목록
          </Link>
        </div>
      </header>

      {queryParams.saved && (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-semibold text-emerald-700">
          스코어가 저장되었습니다.
        </section>
      )}

      {errorMessage && (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-700">
          {errorMessage}
        </section>
      )}

      <form action={saveRoundScoresAction} className="space-y-5">
        <input type="hidden" name="roundId" value={round.id} />

        <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-900">참가자 스코어 {participants.length}명</h2>
            <p className="mt-1 text-sm text-slate-500">
              우선 총 타수와 스테이블포드 포인트를 저장합니다. 신페리오/매치플레이 자동 계산은 다음 단계에서 확장합니다.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {participants.length ? (
              participants.map((participant) => {
                const memberInfo = participant.member;
                const score = scoreByMemberId.get(participant.member_id);

                return (
                  <article key={participant.member_id} className="grid gap-4 px-5 py-4 lg:grid-cols-[1fr_160px_180px_1fr]">
                    <input type="hidden" name="memberId" value={participant.member_id} />

                    <div>
                      <p className="font-bold text-slate-900">{memberInfo?.name ?? '이름 없는 회원'}</p>
                      <p className="mt-1 text-sm text-slate-500">핸디캡 {memberInfo?.handicap ?? 0}</p>
                    </div>

                    <label className="block">
                      <span className="text-xs font-medium text-slate-500">총 타수</span>
                      <input
                        name={`strokes:${participant.member_id}`}
                        type="number"
                        min={1}
                        max={200}
                        defaultValue={score?.strokes ?? ''}
                        className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-medium text-slate-500">스테이블포드 포인트</span>
                      <input
                        name={`stablefordPoints:${participant.member_id}`}
                        type="number"
                        min={-20}
                        max={100}
                        defaultValue={score?.stableford_points ?? ''}
                        className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-medium text-slate-500">메모</span>
                      <input
                        name={`memo:${participant.member_id}`}
                        type="text"
                        defaultValue={score?.memo ?? ''}
                        className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                    </label>
                  </article>
                );
              })
            ) : (
              <div className="px-5 py-12 text-center">
                <p className="text-sm font-semibold text-slate-700">아직 참가자가 없습니다.</p>
                <p className="mt-1 text-sm text-slate-500">참가자를 먼저 선택한 뒤 스코어를 입력하세요.</p>
              </div>
            )}
          </div>
        </section>

        <button
          type="submit"
          disabled={!participants.length}
          className="h-12 w-full rounded-2xl bg-emerald-600 px-4 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          스코어 저장
        </button>
      </form>
    </main>
  );
}
