import { TopBar } from '@/components/TopBar';
import { EmptyState } from '@/components/EmptyState';
import { formatKoreanDateTime } from '@/lib/utils';
import { requireCurrentMember } from '@/server/auth';
import { VoteButtons } from './VoteButtons';

type VoteStatus = 'attend' | 'absent' | 'maybe';

type EventVote = {
  member_id: string;
  status: VoteStatus;
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

function getStatusLabel(status: VoteStatus | null) {
  if (status === 'attend') return '참석';
  if (status === 'maybe') return '미정';
  if (status === 'absent') return '불참';
  return '미선택';
}

export default async function SchedulePage() {
  const { supabase, member } = await requireCurrentMember();

  const { data, error } = await supabase
    .from('events')
    .select('id, title, event_type, starts_at, course_name, max_participants, memo, event_votes(member_id, status)')
    .eq('club_id', member.club_id)
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true });

  if (error) throw new Error(error.message);

  const events = (data ?? []) as EventRow[];

  return (
    <main className="mx-auto max-w-5xl space-y-4 px-4 py-5 pb-28">
      <TopBar
        title="일정"
        description="정기 라운딩과 대회 참석 여부를 확인하세요."
        action={member.role === 'admin' ? { href: '/admin/events/new', label: '일정 등록' } : undefined}
      />

      {events.length ? (
        <section className="space-y-3">
          {events.map((event) => {
            const votes = event.event_votes ?? [];
            const attendCount = votes.filter((vote) => vote.status === 'attend').length;
            const absentCount = votes.filter((vote) => vote.status === 'absent').length;
            const maybeCount = votes.filter((vote) => vote.status === 'maybe').length;
            const myStatus = votes.find((vote) => vote.member_id === member.id)?.status ?? null;

            return (
              <article key={event.id} className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        {event.event_type ?? '라운딩'}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        내 선택 {getStatusLabel(myStatus)}
                      </span>
                    </div>
                    <h2 className="mt-2 text-lg font-bold leading-tight text-slate-900">{event.title}</h2>
                  </div>
                  <div className="shrink-0 rounded-2xl bg-emerald-600 px-3 py-2 text-center text-white">
                    <p className="text-[11px] font-semibold opacity-90">참석</p>
                    <p className="text-lg font-extrabold leading-none">{attendCount}</p>
                  </div>
                </div>

                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-2xl bg-slate-50 px-3 py-2.5">
                    <dt className="text-xs font-medium text-slate-400">일시</dt>
                    <dd className="mt-1 font-semibold leading-5 text-slate-900">{formatKoreanDateTime(event.starts_at)}</dd>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-2.5">
                    <dt className="text-xs font-medium text-slate-400">장소</dt>
                    <dd className="mt-1 truncate font-semibold text-slate-900">{event.course_name ?? '-'}</dd>
                  </div>
                </dl>

                {event.memo ? <p className="mt-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">{event.memo}</p> : null}

                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-600">
                  <div className="rounded-2xl bg-emerald-50 px-2 py-2 text-emerald-700">참석 {attendCount}</div>
                  <div className="rounded-2xl bg-amber-50 px-2 py-2 text-amber-700">미정 {maybeCount}</div>
                  <div className="rounded-2xl bg-slate-100 px-2 py-2 text-slate-700">불참 {absentCount}</div>
                </div>

                <VoteButtons eventId={event.id} currentStatus={myStatus} />
              </article>
            );
          })}
        </section>
      ) : (
        <EmptyState title="예정된 일정이 없습니다" description="새 라운딩 일정이 등록되면 참석 투표를 할 수 있습니다." />
      )}
    </main>
  );
}
