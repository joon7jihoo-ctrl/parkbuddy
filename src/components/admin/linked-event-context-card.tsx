import Link from 'next/link';
import type { LinkedEventContext } from '@/lib/round-linked-event-context';

function getEventTypeLabel(eventType: string | null) {
  if (eventType === 'tournament') return '대회';
  if (eventType === 'casual') return '번개';
  return '정기 라운딩';
}

function getEventTypeClassName(eventType: string | null) {
  if (eventType === 'tournament') return 'bg-violet-50 text-violet-700 ring-violet-100';
  if (eventType === 'casual') return 'bg-amber-50 text-amber-700 ring-amber-100';
  return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
}

function formatEventDateTime(value: string | null) {
  if (!value) return '라운딩 시간 미정';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '라운딩 시간 미정';

  const dateText = date.toLocaleDateString('ko-KR');
  const timeText = date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${dateText} ${timeText}`;
}

export function LinkedEventContextCard({ context }: { context: LinkedEventContext }) {
  return (
    <section className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-extrabold uppercase tracking-wide text-emerald-700">연결된 라운딩 공지</p>
        <span className={['rounded-full px-2.5 py-1 text-xs font-bold ring-1', getEventTypeClassName(context.eventType)].join(' ')}>
          {getEventTypeLabel(context.eventType)}
        </span>
      </div>

      <div className="mt-2 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <h2 className="truncate text-base font-black text-slate-950">{context.title}</h2>
          <p className="mt-1 text-sm font-medium text-slate-600">
            {formatEventDateTime(context.startsAt)} · {context.courseName || '장소 미정'}
          </p>
          <p className="mt-2 text-sm font-semibold text-emerald-800">
            참석 {context.attendCount}명 · 불참 {context.absentCount}명 · 응답 {context.totalVoteCount}명
          </p>
        </div>

        <Link
          href="/schedule"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-white px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm ring-1 ring-emerald-100 transition hover:bg-emerald-50"
        >
          공지 보기
        </Link>
      </div>
    </section>
  );
}

export function LinkedEventInlineBadge({ context }: { context: LinkedEventContext }) {
  return (
    <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
      <p className="font-bold">연결 공지 · {context.title}</p>
      <p className="mt-0.5 text-xs font-semibold text-emerald-700">
        {getEventTypeLabel(context.eventType)} · 참석 {context.attendCount}명 · 불참 {context.absentCount}명
      </p>
    </div>
  );
}
