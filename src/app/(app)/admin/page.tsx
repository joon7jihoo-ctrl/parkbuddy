import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/require-member';

type AdminMember = {
  id: string;
  name: string;
  phone: string | null;
  handicap: number | null;
  role: 'admin' | 'member';
  status: string;
  user_id: string | null;
  joined_on: string | null;
  claim_code_hash: string | null;
  created_at: string;
};

type AdminActionLog = {
  id: string;
  action: string;
  created_at: string;
  actor: {
    name: string | null;
  } | null;
  target: {
    name: string | null;
  } | null;
};

function formatDateTime(value?: string) {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleString('ko-KR');
}

function getActionLabel(action: string) {
  switch (action) {
    case 'member.create':
      return '회원 등록';
    case 'member.update':
      return '회원 수정';
    case 'member.deactivate':
      return '회원 비활성화';
    case 'member.restore':
      return '회원 복구';
    case 'member.claim_code.reissue':
      return '연결 코드 재발급';
    case 'round.create':
      return '라운드 생성';
    case 'round.update':
      return '라운드 수정';
    case 'round.duplicate':
      return '라운드 복제';
    case 'round.participants.update':
      return '라운드 참가자 변경';
    case 'round.pairings.update':
      return '라운드 조 편성 변경';
    case 'round.scores.update':
      return '라운드 스코어 변경';
    case 'round.status.update':
      return '라운드 상태 변경';
    case 'round_soft_delete':
    case 'round.soft_delete':
    case 'round.delete':
      return '라운드 삭제 보관';
    case 'round_restore':
    case 'round.restore':
      return '라운드 복구';
    default:
      return action;
  }
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <article className="rounded-3xl bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </article>
  );
}

function DashboardLinkCard({
  href,
  eyebrow,
  title,
  description,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-3xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <p className="text-sm font-semibold text-emerald-600">{eyebrow}</p>
      <h2 className="mt-2 text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const { supabase, member: currentMember } = await requireAdmin();

  const { data: members, error: membersError } = await supabase
    .from('members')
    .select(
      `
      id,
      name,
      phone,
      handicap,
      role,
      status,
      user_id,
      joined_on,
      claim_code_hash,
      created_at
    `,
    )
    .eq('club_id', currentMember.club_id)
    .order('created_at', { ascending: false });

  if (membersError) {
    throw new Error(membersError.message);
  }

  const { data: logs, error: logsError } = await supabase
    .from('admin_action_logs')
    .select(
      `
      id,
      action,
      created_at,
      actor:actor_member_id(name),
      target:target_member_id(name)
    `,
    )
    .eq('club_id', currentMember.club_id)
    .order('created_at', { ascending: false })
    .limit(5);

  if (logsError && logsError.code !== '42P01') {
    throw new Error(logsError.message);
  }

  const allMembers = (members ?? []) as AdminMember[];
  const recentLogs = (logs ?? []) as unknown as AdminActionLog[];

  const activeMembers = allMembers.filter((member) => member.status !== 'inactive');
  const inactiveMembers = allMembers.filter((member) => member.status === 'inactive');
  const linkedMembers = activeMembers.filter((member) => Boolean(member.user_id));
  const waitingMembers = activeMembers.filter((member) => !member.user_id);
  const adminMembers = activeMembers.filter((member) => member.role === 'admin');
  const latestMembers = activeMembers.slice(0, 5);
  const linkedRate = activeMembers.length
    ? Math.round((linkedMembers.length / activeMembers.length) * 100)
    : 0;

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-600">운영진 대시보드</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">ParkBuddy 운영 현황</h1>
          <p className="mt-1 text-sm text-slate-500">
            회원 연결 상태, 운영진 수, 최근 작업을 한눈에 확인합니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/members"
            className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            회원 관리
          </Link>
          <Link
            href="/admin/rounds"
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            라운드 관리
          </Link>
          <Link
            href="/admin/logs"
            className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            작업 로그
          </Link>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="활성 회원"
          value={activeMembers.length}
          description="현재 운영 대상 회원 수입니다."
        />
        <StatCard
          label="계정 연결률"
          value={`${linkedRate}%`}
          description={`${linkedMembers.length}명 연결 완료, ${waitingMembers.length}명 연결 대기`}
        />
        <StatCard
          label="운영진"
          value={adminMembers.length}
          description="현재 active 상태의 운영진 수입니다."
        />
        <StatCard
          label="비활성 회원"
          value={inactiveMembers.length}
          description="복구 가능한 비활성 회원 수입니다."
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardLinkCard
          href="/admin/rounds"
          eyebrow="라운드"
          title="라운드 관리"
          description="라운드를 만들고 참가자, 조 편성, 스코어, 결과를 관리합니다."
        />
        <DashboardLinkCard
          href="/admin/rounds/calendar"
          eyebrow="라운드"
          title="월별 일정"
          description="월별 라운드 일정을 확인하고 운영 메뉴로 이동합니다."
        />
        <DashboardLinkCard
          href="/admin/rounds/status"
          eyebrow="라운드"
          title="상태별 보기"
          description="예정, 완료, 취소 상태별로 라운드를 나누어 확인합니다."
        />
        <DashboardLinkCard
          href="/admin/members/new"
          eyebrow="회원"
          title="회원 등록"
          description="신규 회원을 등록하고 카카오 연결 코드를 발급합니다."
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <article className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-900">최근 활성 회원</h2>
              <p className="mt-1 text-sm text-slate-500">최근 등록된 활성 회원입니다.</p>
            </div>
            <Link
              href="/admin/members"
              className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
            >
              전체 보기
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {latestMembers.length ? (
              latestMembers.map((member) => (
                <div key={member.id} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900">{member.name}</p>
                    <span
                      className={[
                        'rounded-full px-2 py-1 text-xs font-semibold',
                        member.user_id
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-blue-700',
                      ].join(' ')}
                    >
                      {member.user_id ? '연결 완료' : '연결 대기'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {member.phone ?? '-'} · {member.role === 'admin' ? '운영진' : '회원'}
                  </p>
                </div>
              ))
            ) : (
              <p className="py-4 text-sm text-slate-500">표시할 활성 회원이 없습니다.</p>
            )}
          </div>
        </article>

        <article className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-900">최근 관리자 작업</h2>
              <p className="mt-1 text-sm text-slate-500">최근 기록된 운영진 작업입니다.</p>
            </div>
            <Link
              href="/admin/logs"
              className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
            >
              전체 보기
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {recentLogs.length ? (
              recentLogs.map((log) => (
                <div key={log.id} className="py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-slate-900">{getActionLabel(log.action)}</p>
                    <p className="text-xs text-slate-400">{formatDateTime(log.created_at)}</p>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    처리자: {log.actor?.name ?? '-'} · 대상: {log.target?.name ?? '-'}
                  </p>
                </div>
              ))
            ) : (
              <p className="py-4 text-sm text-slate-500">아직 기록된 관리자 작업이 없습니다.</p>
            )}
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="font-bold text-amber-900">운영 체크 포인트</h2>
        <p className="mt-2 text-sm leading-6 text-amber-800">
          연결 대기 회원이 많다면 회원들에게 카카오 로그인 후 연결 코드를 입력하도록 안내하세요.
          비활성 회원은 실수 복구가 가능하지만, 복구 전에 연락처 중복 여부를 확인하는 것이 안전합니다.
        </p>
      </section>
    </main>
  );
}
