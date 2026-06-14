import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ScoreTrendChart } from '@/components/ScoreTrendChart';
import { createClient } from '@/lib/supabase/server';
import { formatKoreanPhoneNumber } from '@/lib/korean-search';
import { formatKoreanDate } from '@/lib/utils';

type Member = {
  id: string;
  name: string;
  phone: string | null;
  handicap: number | null;
  joined_on: string | null;
  role: 'admin' | 'member';
};

type MemberScoreStats = {
  rounds_count: number | null;
  avg_score: number | null;
  best_score: number | null;
};

type RecentRoundTotal = {
  round_id: string;
  played_on: string;
  course_name: string | null;
  total_strokes: number | null;
};

type ScoreTrendPoint = {
  played_on: string;
  total_strokes: number | null;
};

function SummaryCard({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center shadow-sm">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className={accent ? 'mt-1 text-xl font-extrabold leading-none text-emerald-600' : 'mt-1 text-xl font-extrabold leading-none text-slate-950'}>
        {value}
      </p>
    </article>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-3 py-2.5 text-sm">
      <dt className="shrink-0 text-slate-500">{label}</dt>
      <dd className="min-w-0 text-right font-semibold text-slate-900">{children}</dd>
    </div>
  );
}

export default async function MyPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: member } = await supabase
    .from('members')
    .select('id, name, phone, handicap, joined_on, role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!member) {
    redirect('/member-link');
  }

  const currentMember = member as Member;
  const [{ data: stats }, { data: recentRounds }, { data: trend }] = await Promise.all([
    supabase
      .from('member_score_stats')
      .select('rounds_count, avg_score, best_score')
      .eq('member_id', currentMember.id)
      .maybeSingle(),
    supabase
      .from('member_round_totals')
      .select('round_id, played_on, course_name, total_strokes')
      .eq('member_id', currentMember.id)
      .order('played_on', { ascending: false })
      .limit(5),
    supabase
      .from('member_round_totals')
      .select('played_on, total_strokes')
      .eq('member_id', currentMember.id)
      .order('played_on', { ascending: true })
      .limit(20),
  ]);

  const scoreStats = stats as MemberScoreStats | null;
  const rounds = (recentRounds ?? []) as RecentRoundTotal[];
  const trendData = ((trend ?? []) as ScoreTrendPoint[])
    .filter((point): point is { played_on: string; total_strokes: number } => point.total_strokes !== null)
    .map((point) => ({ played_on: point.played_on, total_strokes: point.total_strokes }));
  const formattedPhone = formatKoreanPhoneNumber(currentMember.phone);

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-6 pb-28">
      <header>
        <p className="text-sm font-semibold text-emerald-600">마이페이지</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">내 정보와 기록</h1>
        <p className="mt-1 text-sm text-slate-500">내 기본 정보와 최근 라운딩 기록을 확인합니다.</p>
      </header>

      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-950">{currentMember.name}</h2>
            <p className="mt-1 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {currentMember.role === 'admin' ? '운영진' : '회원'}
            </p>
          </div>
          <Link
            href="/mypage/link"
            className="inline-flex min-h-10 items-center justify-center rounded-2xl bg-emerald-600 px-3 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            계정 연결
          </Link>
        </div>

        <dl className="mt-4 grid gap-2">
          <InfoRow label="연락처">{formattedPhone}</InfoRow>
          <InfoRow label="핸디캡">{currentMember.handicap ?? 0}</InfoRow>
          <InfoRow label="가입일">{currentMember.joined_on ? formatKoreanDate(currentMember.joined_on) : '-'}</InfoRow>
        </dl>
      </section>

      <section className="grid grid-cols-3 gap-2.5">
        <SummaryCard label="라운딩" value={scoreStats?.rounds_count ?? 0} />
        <SummaryCard label="평균" value={scoreStats?.avg_score ?? '-'} />
        <SummaryCard label="베스트" value={scoreStats?.best_score ?? '-'} accent />
      </section>

      <ScoreTrendChart data={trendData} />

      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-950">최근 기록</h2>
            <p className="mt-1 text-xs text-slate-500">최근 입력된 내 라운딩 스코어입니다.</p>
          </div>
          <Link href="/scores" className="shrink-0 text-sm font-bold text-emerald-700 underline-offset-4 hover:underline">
            전체 보기
          </Link>
        </div>

        <div className="mt-3 divide-y divide-slate-100">
          {rounds.length ? (
            rounds.map((round) => (
              <Link key={round.round_id} href={`/scores/${round.round_id}`} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {formatKoreanDate(round.played_on)} · {round.course_name ?? '코스 미정'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">상세 스코어 보기</p>
                </div>
                <p className="shrink-0 rounded-2xl bg-emerald-50 px-3 py-1.5 text-sm font-extrabold text-emerald-700">
                  {round.total_strokes ?? '-'}타
                </p>
              </Link>
            ))
          ) : (
            <p className="py-5 text-center text-sm text-slate-500">아직 입력된 스코어가 없습니다.</p>
          )}
        </div>
      </section>
    </main>
  );
}
