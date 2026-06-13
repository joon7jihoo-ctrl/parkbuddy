import { SubmitButton } from '@/components/SubmitButton';
import { TopBar } from '@/components/TopBar';
import { createEvent } from '@/server/actions/events';
import { requireAdmin } from '@/server/auth';

export default async function NewEventPage() {
  await requireAdmin();

  return (
    <main className="space-y-5">
      <TopBar title="일정 등록" />
      <form action={createEvent} className="space-y-4 rounded-3xl bg-white p-5 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700">제목<input name="title" required maxLength={80} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
        <label className="block text-sm font-semibold text-slate-700">유형<select name="event_type" defaultValue="regular" className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-emerald-500"><option value="regular">정기 라운딩</option><option value="tournament">대회</option><option value="casual">번개</option></select></label>
        <label className="block text-sm font-semibold text-slate-700">일시<input name="starts_at" type="datetime-local" required className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
        <label className="block text-sm font-semibold text-slate-700">코스명<input name="course_name" required maxLength={80} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
        <label className="block text-sm font-semibold text-slate-700">홀 수<select name="holes" defaultValue="18" className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-emerald-500"><option value="9">9홀</option><option value="18">18홀</option><option value="27">27홀</option><option value="36">36홀</option></select></label>
        <label className="block text-sm font-semibold text-slate-700">최대 인원<input name="max_participants" type="number" min="1" max="200" className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
        <label className="block text-sm font-semibold text-slate-700">메모<textarea name="memo" maxLength={1000} rows={5} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
        <SubmitButton label="일정 등록" />
      </form>
    </main>
  );
}
