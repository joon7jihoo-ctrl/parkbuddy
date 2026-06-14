import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatKoreanPhoneNumber, normalizeDigits } from '@/lib/korean-search';

type Member = {
  id: string;
  name: string;
  phone: string | null;
  handicap: number | null;
  joined_on: string | null;
  role: 'admin' | 'member';
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

  return (
    <main className="mx-auto max-w-7xl space-y-5 px-4 py-6 pb-28">
      <header>
        <p className="text-sm font-semibold text-emerald-600">회원 목록</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">함께하는 회원</h1>
        <p className="mt-1 text-sm text-slate-500">총 {list.length}명의 활성 회원입니다.</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((member) => {
          const formattedPhone = formatKoreanPhoneNumber(member.phone);
          const phoneDigits = normalizeDigits(member.phone);

          return (
            <article key={member.id} className="rounded-3xl bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={'/members/' + member.id} className="text-lg font-bold text-slate-900 underline-offset-4 hover:underline">
                    {member.name}
                  </Link>
                  <p className="mt-1 text-sm text-slate-500">{member.role === 'admin' ? '운영진' : '회원'}</p>
                </div>
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 font-bold text-emerald-700">
                  {member.name.slice(0, 1)}
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-600">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <dt className="text-xs text-slate-400">연락처</dt>
                  <dd className="mt-1 font-semibold text-slate-800">
                    {phoneDigits ? <a href={'tel:' + phoneDigits} className="underline-offset-4 hover:underline">{formattedPhone}</a> : '-'}
                  </dd>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <dt className="text-xs text-slate-400">핸디캡</dt>
                  <dd className="mt-1 font-semibold text-slate-800">{member.handicap ?? 0}</dd>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <dt className="text-xs text-slate-400">가입일</dt>
                  <dd className="mt-1 font-semibold text-slate-800">{member.joined_on || '-'}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </section>
    </main>
  );
}
