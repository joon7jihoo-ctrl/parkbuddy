import { createClient } from '@/lib/supabase/server';
import { PublicMembersList } from '@/components/public-members-list';

type Member = {
  id: string;
  name: string;
  phone: string | null;
  handicap: number | null;
  joined_on: string | null;
  role: 'admin' | 'member';
};

type MemberScoreStat = {
  member_id: string;
  rounds_count: number | null;
  avg_score: number | null;
  best_score: number | null;
};

export default async function MembersPage() {
  const supabase = await createClient();
  const { data: members, error } = await supabase
    .from('members')
    .select('id, name, phone, handicap, joined_on, role')
    .eq('status', 'active')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const list = (members ?? []) as Member[];
  const memberIds = list.map((member) => member.id);

  const { data: stats } = memberIds.length
    ? await supabase
        .from('member_score_stats')
        .select('member_id, rounds_count, avg_score, best_score')
        .in('member_id', memberIds)
    : { data: [] };

  const statsMap = new Map(
    ((stats ?? []) as MemberScoreStat[]).map((stat) => [stat.member_id, stat]),
  );

  const adminCount = list.filter((member) => member.role === 'admin').length;
  const memberCount = list.length - adminCount;

  const publicMembers = list.map((member) => {
    const stat = statsMap.get(member.id);

    return {
      ...member,
      roundsCount: stat?.rounds_count ?? 0,
      averageScore: stat?.avg_score ?? null,
      bestScore: stat?.best_score ?? null,
    };
  });

  return (
    <main className="mx-auto max-w-7xl space-y-4 px-4 py-5 pb-28">
      <header>
        <p className="text-sm font-semibold text-emerald-600">회원 목록</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">함께하는 회원</h1>
        <p className="mt-1 text-sm text-slate-500">동호회 회원 연락처와 기본 정보를 확인합니다.</p>
      </header>

      <section className="grid grid-cols-3 gap-2 sm:gap-2.5">
        <article className="rounded-[28px] border border-slate-200 bg-emerald-600 px-2.5 py-2.5 text-center text-white shadow-sm">
          <p className="text-xs font-semibold">전체</p>
          <p className="mt-1 text-xl font-extrabold leading-none">{list.length}</p>
        </article>
        <article className="rounded-[28px] border border-slate-200 bg-white px-2.5 py-2.5 text-center text-slate-900 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">운영진</p>
          <p className="mt-1 text-xl font-extrabold leading-none">{adminCount}</p>
        </article>
        <article className="rounded-[28px] border border-slate-200 bg-white px-2.5 py-2.5 text-center text-slate-900 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">회원</p>
          <p className="mt-1 text-xl font-extrabold leading-none">{memberCount}</p>
        </article>
      </section>

      <PublicMembersList members={publicMembers} />
    </main>
  );
}
