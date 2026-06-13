import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/require-member';

type AdminLogRow = {
  id: string;
  action: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string | null;
  actor_member_id: string | null;
  target_member_id: string | null;
};

type CountResult = {
  count: number | null;
};

function formatDateTime(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Seoul',
  }).format(new Date(value));
}

function getActionLabel(action?: string | null) {
  switch (action) {
    case 'member.create':
      return '회원 생성';
    case 'member.update':
      return '회원 정보 수정';
    case 'member.deactivate':
      return '회원 비활성화';
    case 'member.restore':
      return '회원 복구';
    case 'member.claim_code.reissue':
      return '회원 연결 코드 재발급';
    case 'round.create':
      return '라운드 생성';
    case 'round.update':
      return '라운드 수정';
    case 'round.duplicate':
      return '라운드 복제';
    case 'round.status.update':
      return '라운드 상태 변경';
    case 'round.participants.update':
      return '라운드 참가자 변경';
    case 'round.pairings.update':
      return '라운드 조 편성 변경';
    case 'round.scores.update':
      return '라운드 스코어 저장';
    default:
      return action ?? '알 수 없는 작업';
  }
}

function getStatusLabel(value?: unknown) {
  switch (value) {
    case 'scheduled':
      return '예정';
    case 'completed':
      return '완료';
    case 'cancelled':
      return '취소';
    default:
      return typeof value === 'string' ? value : undefined;
  }
}

function getGameTypeLabel(value?: unknown) {
  switch (value) {
    case 'individual':
      return '개인전';
    case 'foursome':
      return '포섬';
    case 'fourball':
      return '포볼';
    case 'scramble':
      return '스크램블';
    case 'team_match':
      return '청백전';
    default:
      return typeof value === 'string' ? value : undefined;
  }
}

function getScoringTypeLabel(value?: unknown) {
  switch (value) {
    case 'stroke':
      return '스트로크';
    case 'new_peoria':
      return '신페리오';
    case 'match':
    case 'match_play':
      return '매치 플레이';
    case 'stableford':
      return '스테이블포드';
    default:
      return typeof value === 'string' ? value : undefined;
  }
}

function getMetadataSummary(metadata?: Record<string, unknown> | null) {
  if (!metadata) {
    return '세부 정보 없음';
  }

  const summaryItems: string[] = [];

  const memberName = metadata.member_name ?? metadata.name;
  const roundTitle = metadata.round_title ?? metadata.title;
  const oldStatus = getStatusLabel(metadata.old_status);
  const newStatus = getStatusLabel(metadata.new_status);
  const gameType = getGameTypeLabel(metadata.game_type);
  const scoringType = getScoringTypeLabel(metadata.scoring_type);
  const participantCount = metadata.participant_count;
  const scoreCount = metadata.score_count;

  if (typeof memberName === 'string' && memberName) {
    summaryItems.push(`회원: ${memberName}`);
  }

  if (typeof roundTitle === 'string' && roundTitle) {
    summaryItems.push(`라운드: ${roundTitle}`);
  }

  if (oldStatus || newStatus) {
    summaryItems.push(`상태: ${oldStatus ?? '-'} → ${newStatus ?? '-'}`);
  }

  if (gameType) {
    summaryItems.push(`경기 형태: ${gameType}`);
  }

  if (scoringType) {
    summaryItems.push(`점수 계산: ${scoringType}`);
  }

  if (typeof participantCount === 'number') {
    summaryItems.push(`참가자 ${participantCount}명`);
  }

  if (typeof scoreCount === 'number') {
    summaryItems.push(`스코어 ${scoreCount}건`);
  }

  return summaryItems.length ? summaryItems.join(' · ') : '세부 정보 있음';
}

async function getExactCount(
  query: PromiseLike<{ count: number | null; error: { message: string } | null }>,
) {
  const result = await query;

  if (result.error) {
    return 0;
  }

  return result.count ?? 0;
}

export default async function AdminDashboardPage() {
  const { supabase, member } = await requireAdmin();

  const [memberCount, roundCount, logResult] = await Promise.all([
    getExactCount(
      supabase
        .from('members')
        .select('id', { count: 'exact', head: true })
        .eq('club_id', member.club_id),
    ),
    getExactCount(
      supabase
        .from('rounds')
        .select('id', { count: 'exact', head: true })
        .eq('club_id', member.club_id),
    ),
    supabase
      .from('admin_action_logs')
      .select('id, action, metadata, created_at, actor_member_id, target_member_id')
      .eq('club_id', member.club_id)
      .order('created_at', { ascending: false })
      .limit(8),
  ]);

  const recentLogs = ((logResult.data ?? []) as AdminLogRow[]).map((log) => ({
    ...log,
    actionLabel: getActionLabel(log.action),
    metadataSummary: getMetadataSummary(log.metadata),
  }));

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <header>
        <p className="text-sm font-semibold text-emerald-600">관리자</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          ParkBuddy 운영 대시보드
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          회원, 라운드, 작업 로그를 한 곳에서 관리합니다.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">전체 회원</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{memberCount}</p>
          <Link
            href="/admin/members"
            className="mt-4 inline-flex rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            회원 관리
          </Link>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">전체 라운드</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{roundCount}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/admin/rounds"
              className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              라운드 관리
            </Link>
            <Link
              href="/admin/rounds/calendar"
              className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              월별 일정
            </Link>
            <Link
              href="/admin/rounds/status"
              className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              상태별 보기
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/members/new"
          className="rounded-3xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="font-bold text-slate-900">회원 등록</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            새 회원을 등록하고 연결 코드를 발급합니다.
          </p>
        </Link>

        <Link
          href="/admin/rounds/new"
          className="rounded-3xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="font-bold text-slate-900">라운드 생성</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            새 라운드를 만들고 참가자를 선택합니다.
          </p>
        </Link>

        <Link
          href="/admin/logs"
          className="rounded-3xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="font-bold text-slate-900">작업 로그 전체 보기</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            운영자가 수행한 주요 작업을 확인합니다.
          </p>
        </Link>
      </section>

      <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-bold text-slate-900">최근 관리자 작업</h2>
            <p className="mt-1 text-sm text-slate-500">
              최근 작업을 한글 기준으로 표시합니다.
            </p>
          </div>
          <Link
            href="/admin/logs"
            className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            전체 보기
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {recentLogs.length ? (
            recentLogs.map((log) => (
              <article key={log.id} className="px-5 py-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-semibold text-slate-900">
                    {log.actionLabel}
                  </p>
                  <time className="text-sm text-slate-500">
                    {formatDateTime(log.created_at)}
                  </time>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {log.metadataSummary}
                </p>
              </article>
            ))
          ) : (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-slate-500">
                아직 표시할 관리자 작업 로그가 없습니다.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
