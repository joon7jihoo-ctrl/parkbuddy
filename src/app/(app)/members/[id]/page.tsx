import { notFound } from 'next/navigation';
import { TopBar } from '@/components/TopBar';
import { formatKoreanDate } from '@/lib/utils';
import { requireCurrentMember } from '@/server/auth';

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, member: me } = await requireCurrentMember();

  const { data: member } = await supabase
    .from('members')
    .select('id, name, phone, handicap, joined_on, role')
    .eq('club_id', me.club_id)
    .eq('id', id)
    .eq('status', 'active')
    .maybeSingle();

  if (!member) notFound();

  const { data: stats } = await supabase
    .from('member_score_stats')
    .select('rounds_count, avg_score, best_score')
    .eq('member_id', member.id)
    .maybeSingle();

  return (
    <main className="space-y-5">
      <TopBar title="회원 상세" />
      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">{member.name}</h1>
        <p className="mt-1 text-sm text-slate-500">{member.role === 'admin' ? '운영진' : '회원'}</p>
        <dl className="mt-6 space-y-4 text-sm">
          <div className="flex justify-between"><dt className="text-slate-500">연락처</dt><dd className="font-medium text-slate-900">{member.phone ?? '-'}</dd></div>
          <div className="flex justify-between"><dt className="text-slate-500">핸디캡</dt><dd className="font-medium text-slate-900">{member.handicap}</dd></div>
          <div className="flex justify-between"><dt className="text-slate-500">가입일</dt><dd className="font-medium text-slate-900">{formatKoreanDate(member.joined_on)}</dd></div>
        </dl>
      </section>
      <section className="grid grid-cols-3 gap-3">
        <div className="rounded-3xl bg-white p-4 text-center shadow-sm"><p className="text-xs text-slate-500">라운딩</p><p className="mt-1 text-xl font-bold">{stats?.rounds_count ?? 0}</p></div>
        <div className="rounded-3xl bg-white p-4 text-center shadow-sm"><p className="text-xs text-slate-500">평균</p><p className="mt-1 text-xl font-bold">{stats?.avg_score ?? '-'}</p></div>
        <div className="rounded-3xl bg-white p-4 text-center shadow-sm"><p className="text-xs text-slate-500">베스트</p><p className="mt-1 text-xl font-bold text-emerald-600">{stats?.best_score ?? '-'}</p></div>
      </section>
    </main>
  );
}
