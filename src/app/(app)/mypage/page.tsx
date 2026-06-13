import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

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

  return (
    <main className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">마이페이지</h1>
        <p className="mt-1 text-sm text-slate-500">내 정보를 확인하세요.</p>
      </header>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-emerald-50 text-2xl font-bold text-emerald-700">
            {member.name.slice(0, 1)}
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">{member.name}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {member.role === 'admin' ? '운영진' : '회원'}
            </p>
          </div>
        </div>

        <dl className="mt-6 space-y-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">연락처</dt>
            <dd className="font-medium text-slate-900">
              {member.phone || '-'}
            </dd>
          </div>

          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">핸디캡</dt>
            <dd className="font-medium text-slate-900">{member.handicap}</dd>
          </div>

          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">가입일</dt>
            <dd className="font-medium text-slate-900">
              {member.joined_on || '-'}
            </dd>
          </div>
        </dl>
      </section>
    </main>
  );
}