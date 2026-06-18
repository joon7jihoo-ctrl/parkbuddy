import Link from 'next/link';
import { TopBar } from '@/components/TopBar';
import { StatCard } from '@/components/StatCard';
import { ScoreTrendChart } from '@/components/ScoreTrendChart';
import { formatKoreanDate } from '@/lib/utils';
import {
  buildOfficialScoreStats,
  getOfficialScoreDate,
  getOfficialScoreTrend,
  normalizeOfficialScoreRecords,
  type RawRoundScoreRow,
} from '@/lib/score-records';
import { requireCurrentMember } from '@/server/auth';

export default async function ScoresPage() {
  const { supabase, member } = await requireCurrentMember();

  const { data: scoreRows } = await supabase
    .from('round_scores')
    .select(
      `
      round_id,
      member_id,
      strokes,
      stableford_points,
      memo,
      updated_at,
      round:round_id (
        id,
        title,
        course_name,
        play_date,
        played_on,
        holes,
        deleted_at,
        club_id
      )
    `,
    )
    .eq('member_id', member.id);

  const records = normalizeOfficialScoreRecords((scoreRows ?? []) as unknown as RawRoundScoreRow[], member.club_id);
  const stats = buildOfficialScoreStats(records);
  const trend = getOfficialScoreTrend(records);
  const recentRecords = records.slice(0, 10);

  return (
    <main className="space-y-5">
      <TopBar title="스코어" />

      <section className="grid grid-cols-3 gap-3">
        <StatCard label="라운딩" value={stats.rounds_count} />
        <StatCard label="평균" value={stats.avg_score ?? '-'} />
        <StatCard label="베스트" value={stats.best_score ?? '-'} accent />
      </section>

      <ScoreTrendChart data={trend} />

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900">최근 기록</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">운영자가 입력한 내 라운딩 스코어입니다.</p>
          </div>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          {recentRecords.length ? (
            recentRecords.map((record) => (
              <Link key={record.round_id} href={`/scores/${record.round_id}`} className="block py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{record.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatKoreanDate(getOfficialScoreDate(record))} · {record.course_name ?? '코스 미정'} · {record.holes ?? 18}홀
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-base font-extrabold text-emerald-700">{record.total_strokes ?? '-'}타</p>
                    {typeof record.stableford_points === 'number' ? (
                      <p className="mt-0.5 text-xs font-bold text-slate-500">{record.stableford_points}점</p>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="py-3 text-sm text-slate-500">아직 입력된 스코어가 없습니다.</p>
          )}
        </div>
      </section>
    </main>
  );
}
