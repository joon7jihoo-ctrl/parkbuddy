import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ScoreTrendChart } from '@/components/ScoreTrendChart';
import { createClient } from '@/lib/supabase/server';
import { formatKoreanPhoneNumber } from '@/lib/korean-search';
import { formatKoreanDate, formatKoreanDateTime } from '@/lib/utils';
import {
  buildOfficialScoreStats,
  getOfficialScoreTrend,
  normalizeOfficialScoreRecords,
  type RawRoundScoreRow,
} from '@/lib/score-records';

type Member = {
  id: string;
  name: string;
  phone: string | null;
  handicap: number | null;
  joined_on: string | null;
  role: 'admin' | 'member';
  club_id: string;
};

type VoteStatus = 'attend' | 'absent' | 'maybe';
type DisplayVoteStatus = 'attend' | 'absent';

type UpcomingEventVote = {
  member_id: string;
  status: VoteStatus;
};

type UpcomingEvent = {
  id: string;
  title: string;
  event_type: string | null;
  starts_at: string;
  course_name: string | null;
  max_participants: number | null;
  event_votes: UpcomingEventVote[] | null;
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


function normalizeVoteStatus(status: VoteStatus | null): DisplayVoteStatus | null {
  if (status === 'attend') return 'attend';
  if (status === 'absent') return 'absent';
  return null;
}

function getEventTypeLabel(eventType: string | null) {
  if (eventType === 'tournament') return '대회';
  if (eventType === 'casual') return '번개';
  return '정기 라운딩';
}

function getVoteStatusBadge(status: DisplayVoteStatus | null) {
  if (status === 'attend') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
  }

  if (status === 'absent') {
    return 'bg-slate-100 text-slate-600 ring-slate-200';
  }

  return 'bg-rose-50 text-rose-700 ring-rose-100';
}

function getVoteStatusLabel(status: DisplayVoteStatus | null) {
  if (status === 'attend') return '참석';
  if (status === 'absent') return '불참';
  return '미응답';
}

function UpcomingScheduleCard({ event, memberId }: { event: UpcomingEvent; memberId: string }) {
  const votes = event.event_votes ?? [];
  const myStatus = normalizeVoteStatus(votes.find((vote) => vote.member_id === memberId)?.status ?? null);
  const attendCount = votes.filter((vote) => vote.status === 'attend').length;
  const absentCount = votes.filter((vote) => vote.status === 'absent').length;
  const votedCount = attendCount + absentCount;
  const total = Math.max(event.max_participants ?? votedCount, votedCount, 1);
  const attendPercent = Math.round((attendCount / total) * 100);

  return (
    <Link href="/schedule" className="block rounded-3xl border border-slate-200 bg-white p-3 shadow-sm transition active:scale-[0.99] md:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-black text-emerald-600">{getEventTypeLabel(event.event_type)}</p>
          <h3 className="mt-1 truncate text-sm font-extrabold text-slate-950 md:text-base">{event.title}</h3>
          <p className="mt-1 truncate text-xs font-semibold text-slate-500">{formatKoreanDateTime(event.starts_at)}</p>
          <p className="truncate text-xs font-semibold text-slate-500">{event.course_name ?? '장소 미정'}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${getVoteStatusBadge(myStatus)}`}>
          {getVoteStatusLabel(myStatus)}
        </span>
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-black text-slate-500">
          <span>참석 {attendCount}명</span>
          <span>응답 {votedCount}명</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(attendPercent, 100)}%` }} aria-hidden="true" />
        </div>
      </div>
    </Link>
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
    .select('id, name, phone, handicap, joined_on, role, club_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!member) {
    redirect('/member-link');
  }

  const currentMember = member as Member;
  const [{ data: scoreRows }, { data: upcomingEvents }] = await Promise.all([
    supabase
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
      .eq('member_id', currentMember.id),
    supabase
      .from('events')
      .select('id, title, event_type, starts_at, course_name, max_participants, event_votes(member_id, status)')
      .eq('club_id', currentMember.club_id)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(3),
  ]);

  const rounds = normalizeOfficialScoreRecords((scoreRows ?? []) as unknown as RawRoundScoreRow[], currentMember.club_id);
  const scoreStats = buildOfficialScoreStats(rounds);
  const trendData = getOfficialScoreTrend(rounds);
  const upcoming = (upcomingEvents ?? []) as UpcomingEvent[];
  const formattedPhone = formatKoreanPhoneNumber(currentMember.phone);

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-6 pb-28">
      <header>
        <p className="text-sm font-semibold text-emerald-600">마이페이지</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">내 정보와 기록</h1>
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
        <SummaryCard label="라운딩" value={scoreStats.rounds_count} />
        <SummaryCard label="평균" value={scoreStats.avg_score ?? '-'} />
        <SummaryCard label="베스트" value={scoreStats.best_score ?? '-'} accent />
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-3 shadow-sm md:p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-extrabold text-slate-950 md:text-base">다가오는 라운딩 공지</h2>
          </div>
          <Link href="/schedule" className="shrink-0 rounded-full bg-white px-3 py-2 text-xs font-black text-emerald-700 ring-1 ring-emerald-100 active:scale-[0.98]">
            공지 보기
          </Link>
        </div>

        {upcoming.length ? (
          <div className="grid gap-2 md:grid-cols-3">
            {upcoming.map((event) => (
              <UpcomingScheduleCard key={event.id} event={event} memberId={currentMember.id} />
            ))}
          </div>
        ) : (
          <p className="rounded-3xl bg-white px-4 py-5 text-center text-sm font-semibold text-slate-500 shadow-sm ring-1 ring-slate-100">
            예정된 라운딩 공지가 없습니다.
          </p>
        )}
      </section>

      <ScoreTrendChart data={trendData} />

      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-950">최근 기록</h2>
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
                    {formatKoreanDate(round.play_date ?? round.updated_at ?? '')} · {round.course_name ?? '코스 미정'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">상세 스코어 보기</p>
                </div>
                <p className="shrink-0 rounded-2xl bg-emerald-50 px-3 py-1.5 text-sm font-extrabold text-emerald-700">
                  {round.total_strokes ?? '-'}타
                </p>
              </Link>
            ))
          ) : (
            <p className="py-5 text-center text-sm text-slate-500">스코어가 없습니다.</p>
          )}
        </div>
      </section>
    </main>
  );
}
