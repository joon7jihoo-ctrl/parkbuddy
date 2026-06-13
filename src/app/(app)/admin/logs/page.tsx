import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/require-member';

type AdminLogRow = {
  id?: string;
  action?: string | null;
  target_type?: string | null;
  target_id?: string | null;
  metadata?: Record<string, unknown> | null;
  details?: Record<string, unknown> | null;
  created_at?: string | null;
  actor_member_id?: string | null;
  admin_member_id?: string | null;
};

function formatDateTime(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getActionLabel(action?: string | null) {
  switch (action) {
    case 'member.create':
      return '회원 등록';
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
      return '라운드 정보 수정';
    case 'round.status.update':
      return '라운드 상태 변경';
    case 'round.duplicate':
      return '라운드 복제';
    case 'round.participants.update':
      return '라운드 참가자 변경';
    case 'round.pairings.update':
      return '라운드 조 편성 저장';
    case 'round.scores.update':
      return '라운드 스코어 저장';
    default:
      return action ?? '알 수 없는 작업';
  }
}

function getTargetLabel(targetType?: string | null) {
  switch (targetType) {
    case 'member':
      return '회원';
    case 'round':
      return '라운드';
    case 'round_participant':
      return '라운드 참가자';
    case 'round_pairing':
      return '라운드 조 편성';
    case 'round_score':
      return '라운드 스코어';
    default:
      return targetType ?? '대상 없음';
  }
}

function getValueLabel(key: string, value: unknown) {
  if (value === null || value === undefined || value === '') {
    return '없음';
  }

  if (typeof value === 'boolean') {
    return value ? '예' : '아니오';
  }

  if (key === 'status' || key === 'new_status' || key === 'old_status') {
    switch (value) {
      case 'scheduled':
        return '예정';
      case 'completed':
        return '완료';
      case 'cancelled':
        return '취소';
      default:
        return String(value);
    }
  }

  if (key === 'game_type' || key === 'play_mode') {
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
        return String(value);
    }
  }

  if (key === 'scoring_type') {
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
        return String(value);
    }
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

function getKeyLabel(key: string) {
  switch (key) {
    case 'member_id':
      return '회원 ID';
    case 'round_id':
      return '라운드 ID';
    case 'source_round_id':
      return '원본 라운드 ID';
    case 'new_round_id':
      return '새 라운드 ID';
    case 'name':
      return '이름';
    case 'title':
      return '라운드명';
    case 'course_name':
      return '코스명';
    case 'play_date':
      return '라운드 날짜';
    case 'memo':
      return '메모';
    case 'status':
      return '상태';
    case 'old_status':
      return '이전 상태';
    case 'new_status':
      return '변경 상태';
    case 'game_type':
    case 'play_mode':
      return '경기 형태';
    case 'scoring_type':
      return '점수 계산 방식';
    case 'participant_count':
      return '참가자 수';
    case 'score_count':
      return '스코어 수';
    default:
      return key;
  }
}

function getMetadata(log: AdminLogRow) {
  return log.metadata ?? log.details ?? {};
}

function formatMetadata(log: AdminLogRow) {
  const metadata = getMetadata(log);
  const entries = Object.entries(metadata).filter(
    ([, value]) => value !== undefined && value !== null && value !== '',
  );

  if (!entries.length) {
    return ['세부 내용 없음'];
  }

  return entries.map(([key, value]) => `${getKeyLabel(key)}: ${getValueLabel(key, value)}`);
}

export default async function AdminLogsPage() {
  const { supabase, member } = await requireAdmin();

  const { data: logs, error } = await supabase
    .from('admin_action_logs')
    .select('*')
    .eq('club_id', member.club_id)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    throw new Error(error.message);
  }

  const typedLogs = (logs ?? []) as AdminLogRow[];

  return (
    <main className="mx-auto max-w-5xl space-y-5 px-4 py-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            관리자 작업 로그
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            작업 이력
          </h1>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            최근 관리자 작업 100건을 한글 설명으로 확인합니다.
          </p>
        </div>

        <Link
          href="/admin"
          className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          관리자 홈
        </Link>
      </header>

      <section className="rounded-3xl bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-900">최근 작업</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {typedLogs.length ? (
            typedLogs.map((log, index) => (
              <article key={log.id ?? index} className="space-y-3 px-5 py-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold text-slate-900">
                      {getActionLabel(log.action)}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {getTargetLabel(log.target_type)}
                      {log.target_id ? ` · ${log.target_id}` : ''}
                    </p>
                  </div>

                  <time className="text-sm text-slate-500">
                    {formatDateTime(log.created_at)}
                  </time>
                </div>

                <ul className="space-y-1 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  {formatMetadata(log).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </article>
            ))
          ) : (
            <div className="px-5 py-12 text-center">
              <p className="text-sm font-semibold text-slate-700">
                아직 기록된 관리자 작업이 없습니다.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                회원 관리나 라운드 관리 작업을 진행하면 이곳에 기록됩니다.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
