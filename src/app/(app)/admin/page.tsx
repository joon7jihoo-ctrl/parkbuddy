import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/require-member';

type AdminMember = {
  id: string;
  role: 'admin' | 'member';
  status: string;
  user_id: string | null;
};

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

function TopActionButton({
  href,
  label,
  variant = 'secondary',
}: {
  href: string;
  label: string;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <Link
      href={href}
      className={[
        'inline-flex min-h-11 items-center justify-center rounded-2xl px-4 py-2 text-sm font-bold shadow-sm transition',
        variant === 'primary'
          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
          : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50',
      ].join(' ')}
    >
      {label}
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const { supabase, member: currentMember } = await requireAdmin();

  const { data: members, error } = await supabase
    .from('members')
    .select('id, role, status, user_id')
    .eq('club_id', currentMember.club_id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const allMembers = (members ?? []) as AdminMember[];
  const activeMembers = allMembers.filter((member) => member.status !== 'inactive');
  const inactiveMembers = allMembers.filter((member) => member.status === 'inactive');
  const linkedMembers = activeMembers.filter((member) => Boolean(member.user_id));
  const waitingMembers = activeMembers.filter((member) => !member.user_id);
  const adminMembers = activeMembers.filter((member) => member.role === 'admin');
  const linkedRate = activeMembers.length ? Math.round((linkedMembers.length / activeMembers.length) * 100) : 0;

  return (
    <main className="mx-auto max-w-7xl space-y-5 px-4 py-6 pb-28">
      <header className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-emerald-600">운영진 대시보드</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">ParkBuddy 운영 현황</h1>
          <p className="mt-1 text-sm text-slate-500">핵심 운영 메뉴와 주요 현황을 빠르게 확인합니다.</p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
          <TopActionButton href="/admin/members" label="회원 관리" variant="primary" />
          <TopActionButton href="/admin/rounds" label="라운딩 관리" />
          <TopActionButton href="/admin/logs" label="작업 관리" />
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="활성 회원" value={activeMembers.length} description="현재 운영 대상 회원 수입니다." />
        <StatCard label="계정 연결률" value={linkedRate + '%'} description={linkedMembers.length + '명 연결 완료, ' + waitingMembers.length + '명 연결 대기'} />
        <StatCard label="운영진" value={adminMembers.length} description="현재 active 상태의 운영진 수입니다." />
        <StatCard label="비활성 회원" value={inactiveMembers.length} description="복구 가능한 비활성 회원 수입니다." />
      </section>
    </main>
  );
}
