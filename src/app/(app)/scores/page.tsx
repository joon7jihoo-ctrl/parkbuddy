import Link from 'next/link';
import { TopBar } from '@/components/TopBar';
import { StatCard } from '@/components/StatCard';
import { ScoreTrendChart } from '@/components/ScoreTrendChart';
import { formatKoreanDate } from '@/lib/utils';
import { requireCurrentMember } from '@/server/auth';

export default async function ScoresPage() {
  const { supabase, member } = await requireCurrentMember();

  const [{ data: stats }, { data: trend }, { data: rounds }] = await Promise.all([
    supabase.from('member_score_stats').select('rounds_count, avg_score, best_score').eq('member_id', member.id).maybeSingle(),
    supabase.from('member_round_totals').select('played_on, total_strokes').eq('member_id', member.id).order('played_on', { ascending: true }).limit(20),
    supabase.from('rounds').select('id, title, played_on, course_name, holes').eq('club_id', member.club_id).order('played_on', { ascending: false }).limit(10),
  ]);

  return (
    <main className="space-y-5">
      <TopBar
        title="스코어"
        description={`${member.name}님의 라운딩 기록입니다.`}
        action={member.role === 'admin' ? { href: '/admin/rounds/new', label: '라운딩 등록' } : undefined}
      />
      <section className="grid grid-cols-3 gap-3">
        <StatCard label="라운딩" value={stats?.rounds_count ?? 0} />
        <StatCard label="평균" value={stats?.avg_score ?? '-'} />
        <StatCard label="베스트" value={stats?.best_score ?? '-'} accent />
      </section>
      <ScoreTrendChart data={trend ?? []} />

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900">최근 라운딩</h2>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          {rounds?.length ? (
            rounds.map((round) => (
              <Link key={round.id} href={`/scores/${round.id}`} className="block py-3">
                <p className="font-semibold text-slate-900">{round.title}</p>
                <p className="mt-1 text-sm text-slate-500">{formatKoreanDate(round.played_on)} · {round.course_name} · {round.holes}홀</p>
              </Link>
            ))
          ) : (
            <p className="py-3 text-sm text-slate-500">등록된 라운딩이 없습니다.</p>
          )}
        </div>
      </section>
    </main>
  );
}
