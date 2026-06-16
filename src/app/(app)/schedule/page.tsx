import { TopBar } from '@/components/TopBar';
import { EmptyState } from '@/components/EmptyState';
import { formatKoreanDateTime } from '@/lib/utils';
import { requireCurrentMember } from '@/server/auth';
import { VoteButtons, VoteTotalButton, type VoteListMember } from './VoteButtons';

type VoteStatus = 'attend' | 'absent' | 'maybe';
type DisplayVoteStatus = 'attend' | 'absent';

type EventVote = {
  member_id: string;
  status: VoteStatus;
  member?: {
    name: string | null;
  } | Array<{
    name: string | null;
  }> | null;
};

type EventRow = {
  id: string;
  title: string;
  event_type: string | null;
  starts_at: string;
  course_name: string | null;
  max_participants: number | null;
  memo: string | null;
  event_votes: EventVote[] | null;
};

type ScheduleSummary = {
  total: number;
  myAttend: number;
  myPending: number;
};

function normalizeVoteStatus(status: VoteStatus | null): DisplayVoteStatus | null {
  if (status === 'attend') return 'attend';
  if (status === 'absent') return 'absent';
  return null;
}

function getEventTypeBadge(eventType: string | null) {
  if (eventType === 'tournament') {
    return { label: '대회', className: 'bg-violet-50 text-violet-700 ring-violet-100' };
  }

  if (eventType === 'casual') {
    return { label: '번개', className: 'bg-amber-50 text-amber-700 ring-amber-100' };
  }

  return { label: '정기 라운딩', className: 'bg-emerald-50 text-emerald-700 ring-emerald-100' };
}

function getVoteMemberName(vote: EventVote) {
  const memberRecord = Array.isArray(vote.member) ? vote.member[0] : vote.member;
  return memberRecord?.name?.trim() || '이름 없음';
}

function toVoteListMember(vote: EventVote): VoteListMember {
  return {
    id: vote.member_id,
    name: getVoteMemberName(vote),
    status: normalizeVoteStatus(vote.status),
  };
}

function ScheduleSummaryBar({ summary }: { summary: ScheduleSummary }) {
  return (
    <section className="sticky top-0 z-20 -mx-4 border-y border-slate-200 bg-slate-50/95 px-4 py-2 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        <div className="rounded-2xl bg-white px-3 py-2 text-center shadow-sm ring-1 ring-slate-100 md:rounded-3xl md:py-3">
          <p className="text-[11px] font-bold text-slate-400 md:text-xs">예정</p>
          <p className="mt-0.5 text-lg font-extrabold leading-none text-slate-950 md:text-xl">{summary.total}건</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-center shadow-sm ring-1 ring-emerald-100 md:rounded-3xl md:py-3">
          <p className="text-[11px] font-bold text-emerald-600 md:text-xs">내 참석</p>
          <p className="mt-0.5 text-lg font-extrabold leading-none text-emerald-800 md:text-xl">{summary.myAttend}건</p>
        </div>
        <div className="rounded-2xl bg-rose-50 px-3 py-2 text-center shadow-sm ring-1 ring-rose-100 md:rounded-3xl md:py-3">
          <p className="text-[11px] font-bold text-rose-600 md:text-xs">미선택</p>
          <p className="mt-0.5 text-lg font-extrabold leading-none text-rose-800 md:text-xl">{summary.myPending}건</p>
        </div>
      </div>
    </section>
  );
}

export default async function SchedulePage() {
  const { supabase, member } = await requireCurrentMember();

  const [{ data, error }, { count: activeMemberCount, error: countError }] = await Promise.all([
    supabase
      .from('events')
      .select('id, title, event_type, starts_at, course_name, max_participants, memo, event_votes(member_id, status, member:members(name))')
      .eq('club_id', member.club_id)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true }),
    supabase
      .from('members')
      .select('id', { count: 'exact', head: true })
      .eq('club_id', member.club_id)
      .eq('status', 'active'),
  ]);

  if (error) throw new Error(error.message);
  if (countError) throw new Error(countError.message);

  const events = (data ?? []) as EventRow[];
  const totalMembers = Math.max(activeMemberCount ?? 0, 1);
  const scheduleSummary = events.reduce<ScheduleSummary>(
    (summary, event) => {
      const myStatus = normalizeVoteStatus(event.event_votes?.find((vote) => vote.member_id === member.id)?.status ?? null);

      return {
        total: summary.total + 1,
        myAttend: summary.myAttend + (myStatus === 'attend' ? 1 : 0),
        myPending: summary.myPending + (myStatus ? 0 : 1),
      };
    },
    { total: 0, myAttend: 0, myPending: 0 }
  );

  return (
    <main className="mx-auto max-w-5xl space-y-3 px-4 py-4 pb-28 md:space-y-4 md:py-6">
      <TopBar
        title="일정"
        description="다가오는 라운딩 참석 여부를 빠르게 선택하세요."
        action={member.role === 'admin' ? { href: '/admin/events/new', label: '일정 등록' } : undefined}
      />

      {events.length ? (
        <>
          <ScheduleSummaryBar summary={scheduleSummary} />

          <section className="grid gap-3 lg:grid-cols-2">
            {events.map((event) => {
              const votes = event.event_votes ?? [];
              const attendVoters = votes.filter((vote) => vote.status === 'attend').map(toVoteListMember);
              const absentVoters = votes.filter((vote) => vote.status === 'absent').map(toVoteListMember);
              const allVoters = [...attendVoters, ...absentVoters];
              const myStatus = normalizeVoteStatus(votes.find((vote) => vote.member_id === member.id)?.status ?? null);
              const typeBadge = getEventTypeBadge(event.event_type);

              return (
                <article key={event.id} className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm md:p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-base font-extrabold leading-tight text-slate-950 md:text-lg">{event.title}</h2>
                      <p className="mt-1 text-xs font-semibold leading-5 text-slate-500 md:text-sm">
                        {formatKoreanDateTime(event.starts_at)}
                      </p>
                      <p className="truncate text-xs font-semibold leading-5 text-slate-500 md:text-sm">{event.course_name ?? '-'}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${typeBadge.className}`}>
                        {typeBadge.label}
                      </span>
                      <VoteTotalButton voters={allVoters} totalMembers={totalMembers} />
                    </div>
                  </div>

                  <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-2">
                    <VoteButtons
                      eventId={event.id}
                      currentStatus={myStatus}
                      currentMember={{ id: member.id, name: member.name }}
                      attendVoters={attendVoters}
                      absentVoters={absentVoters}
                      totalMembers={totalMembers}
                    />
                  </div>

                  {event.memo ? (
                    <details className="mt-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                      <summary className="cursor-pointer text-xs font-bold text-slate-500">메모 보기</summary>
                      <p className="mt-1 leading-6">{event.memo}</p>
                    </details>
                  ) : null}
                </article>
              );
            })}
          </section>
        </>
      ) : (
        <EmptyState title="예정된 일정이 없습니다" description="새 라운딩 일정이 등록되면 참석 투표를 할 수 있습니다." />
      )}
    </main>
  );
}
