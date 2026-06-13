import { TopBar } from '@/components/TopBar';
import { EmptyState } from '@/components/EmptyState';
import { formatKoreanDateTime } from '@/lib/utils';
import { requireCurrentMember } from '@/server/auth';
import { VoteButtons } from './VoteButtons';

export default async function SchedulePage() {
  const { supabase, member } = await requireCurrentMember();

  const { data: events, error } = await supabase
    .from('events')
    .select('id, title, event_type, starts_at, course_name, max_participants, memo, event_votes(status)')
    .eq('club_id', member.club_id)
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true });

  if (error) throw new Error(error.message);

  return (
    <main className="space-y-5">
      <TopBar
        title="일정"
        description="정기 라운딩과 대회 참석 여부를 확인하세요."
        action={member.role === 'admin' ? { href: '/admin/events/new', label: '일정 등록' } : undefined}
      />

      {events?.length ? (
        <section className="space-y-3">
          {events.map((event) => {
            const votes = event.event_votes ?? [];
            const attendCount = votes.filter((vote) => vote.status === 'attend').length;
            const absentCount = votes.filter((vote) => vote.status === 'absent').length;
            const maybeCount = votes.filter((vote) => vote.status === 'maybe').length;

            return (
              <article key={event.id} className="rounded-3xl bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase text-emerald-600">{event.event_type}</p>
                    <h2 className="mt-1 text-lg font-bold text-slate-900">{event.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{formatKoreanDateTime(event.starts_at)}<br />{event.course_name}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-100 px-3 py-2 text-center">
                    <p className="text-xs text-slate-500">참석</p>
                    <p className="font-bold text-slate-900">{attendCount}명</p>
                  </div>
                </div>
                {event.memo ? <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">{event.memo}</p> : null}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
                  <span>참석 {attendCount}</span><span>미정 {maybeCount}</span><span>불참 {absentCount}</span>
                </div>
                <VoteButtons eventId={event.id} />
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
