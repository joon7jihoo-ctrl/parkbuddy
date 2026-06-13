import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function MembersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: me } = user
    ? await supabase
        .from('members')
        .select('id, role')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle()
    : { data: null };

  const { data: members, error } = await supabase
    .from('members')
    .select(
      `
      id,
      name,
      phone,
      handicap,
      joined_on,
      avatar_path,
      role,
      user_id,
      claim_code_hash,
      claim_code_expires_at
    `,
    )
    .eq('status', 'active')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const isAdmin = me?.role === 'admin';

  return (
    <main className="space-y-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">회원</h1>
          <p className="mt-1 text-sm text-slate-500">
            총 {members?.length ?? 0}명
          </p>
        </div>

        {isAdmin && (
          <div className="flex gap-2">
            <Link
              href="/admin/members"
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              관리
            </Link>
            <Link
              href="/admin/members/new"
              className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              등록
            </Link>
          </div>
        )}
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {members?.map((member) => {
          const isLinked = Boolean(member.user_id);
          const hasClaimCode = Boolean(member.claim_code_hash);

          return (
            <article
              key={member.id}
              className="rounded-3xl bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 font-bold text-emerald-700">
                  {member.name.slice(0, 1)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate font-bold text-slate-900">
                      {member.name}
                    </h2>

                    {member.role === 'admin' && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                        운영진
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    핸디캡 {member.handicap}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={[
                    'rounded-full px-2 py-1 text-xs font-semibold',
                    isLinked
                      ? 'bg-emerald-100 text-emerald-700'
                      : hasClaimCode
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-red-100 text-red-700',
                  ].join(' ')}
                >
                  {isLinked
                    ? '계정 연결 완료'
                    : hasClaimCode
                      ? '연결 대기'
                      : '코드 필요'}
                </span>

                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                  가입일 {member.joined_on || '-'}
                </span>
              </div>

              {isAdmin && member.claim_code_expires_at && !isLinked && (
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  연결 코드 만료일:{' '}
                  {new Date(member.claim_code_expires_at).toLocaleString(
                    'ko-KR',
                  )}
                </p>
              )}

              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <a
                  href={member.phone ? `tel:${member.phone}` : undefined}
                  className="rounded-2xl bg-slate-100 px-3 py-2 text-center font-medium text-slate-700"
                >
                  전화
                </a>
                <Link
                  href={isAdmin ? '/admin/members' : '/mypage'}
                  className="rounded-2xl bg-slate-900 px-3 py-2 text-center font-medium text-white"
                >
                  {isAdmin ? '관리' : '상세'}
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}