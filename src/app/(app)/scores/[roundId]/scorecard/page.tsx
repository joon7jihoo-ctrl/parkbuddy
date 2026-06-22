import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TopBar } from '@/components/TopBar';
import { formatKoreanDate } from '@/lib/utils';
import { requireCurrentMember } from '@/server/auth';
import { ScorecardTabs, type ScorecardCourseCode } from './ScorecardTabs';

type ScorecardPageProps = {
  params: Promise<{ roundId: string }>;
};

type RoundRow = {
  id: string;
  title: string | null;
  course_name: string | null;
  play_date: string | null;
  played_on: string | null;
  holes: number | null;
  club_id: string;
  deleted_at: string | null;
};

type GroupRow = {
  id: string;
  round_id: string;
  group_no: number;
};

type GroupMemberRow = {
  round_group_id: string;
  round_id: string;
  member_id: string;
  position: number | null;
  member: {
    id: string;
    name: string | null;
  } | null;
};

type HoleScoreRow = {
  round_group_id: string;
  member_id: string;
  course_code: ScorecardCourseCode;
  hole_no: number;
  distance_m: number | null;
  par: number | null;
  strokes: number | null;
};

function getRoundDate(round: RoundRow) {
  return round.play_date ?? round.played_on;
}

function getDateLabel(round: RoundRow) {
  const date = getRoundDate(round);
  return date ? formatKoreanDate(date) : '날짜 미정';
}

export default async function RoundScorecardPage({ params }: ScorecardPageProps) {
  const { roundId } = await params;
  const { supabase, member } = await requireCurrentMember();

  const { data: round, error: roundError } = await supabase
    .from('rounds')
    .select('id, title, course_name, play_date, played_on, holes, club_id, deleted_at')
    .eq('id', roundId)
    .eq('club_id', member.club_id)
    .is('deleted_at', null)
    .maybeSingle();

  if (roundError) throw new Error(roundError.message);
  if (!round) notFound();

  const typedRound = round as RoundRow;

  const { data: groupRows, error: groupError } = await supabase
    .from('round_groups')
    .select('id, round_id, group_no')
    .eq('round_id', typedRound.id)
    .order('group_no', { ascending: true });

  if (groupError && groupError.code !== '42P01') {
    throw new Error(groupError.message);
  }

  const { data: groupMemberRows, error: groupMemberError } = await supabase
    .from('round_group_members')
    .select('round_group_id, round_id, member_id, position, member:member_id(id, name)')
    .eq('round_id', typedRound.id)
    .order('position', { ascending: true });

  if (groupMemberError && groupMemberError.code !== '42P01') {
    throw new Error(groupMemberError.message);
  }

  const { data: holeScoreRows, error: holeScoreError } = await supabase
    .from('round_hole_scores')
    .select('round_group_id, member_id, course_code, hole_no, distance_m, par, strokes')
    .eq('round_id', typedRound.id);

  if (holeScoreError && holeScoreError.code !== '42P01') {
    throw new Error(holeScoreError.message);
  }

  const groups = ((groupRows ?? []) as GroupRow[]).map((group) => {
    const members = ((groupMemberRows ?? []) as unknown as GroupMemberRow[])
      .filter((row) => row.round_group_id === group.id)
      .sort((a, b) => Number(a.position ?? 999) - Number(b.position ?? 999))
      .map((row) => ({
        id: row.member_id,
        name: row.member?.name ?? '이름 없는 회원',
        position: row.position ?? 999,
      }));

    return {
      id: group.id,
      groupNo: group.group_no,
      members,
    };
  });

  const myGroup = groups.find((group) => group.members.some((groupMember) => groupMember.id === member.id)) ?? null;

  return (
    <main className="space-y-3 pb-8 md:space-y-5">
      <TopBar title="조별 스코어카드" />

      {groups.length ? (
        <ScorecardTabs
          round={{
            id: typedRound.id,
            title: typedRound.title ?? '확정 라운드',
            courseName: typedRound.course_name ?? '파크골프장 미정',
            dateLabel: getDateLabel(typedRound),
          }}
          groups={groups}
          myGroupId={myGroup?.id ?? null}
          holeScores={(holeScoreRows ?? []) as HoleScoreRow[]}
        />
      ) : (
        <section className="rounded-3xl bg-white p-6 text-center shadow-sm">
          <p className="text-base font-black text-slate-900">아직 조편성이 없습니다.</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
            확정 라운드 관리에서 조편성을 먼저 완료하면 조별 스코어카드를 확인할 수 있습니다.
          </p>
          <Link
            href="/scores"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-black text-white shadow-sm transition active:scale-[0.99]"
          >
            스코어 목록으로 이동
          </Link>
        </section>
      )}
    </main>
  );
}
