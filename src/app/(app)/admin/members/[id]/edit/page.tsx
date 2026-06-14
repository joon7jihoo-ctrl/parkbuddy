import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-member';
import { updateMemberAction } from '../../actions';

type EditMemberPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case 'invalid_name':
      return '회원 이름을 2자 이상 입력해 주세요.';
    case 'invalid_phone':
      return '연락처를 정확히 입력해 주세요.';
    case 'invalid_role':
      return '회원 역할이 올바르지 않습니다.';
    case 'invalid_handicap':
      return '핸디캡 값이 올바르지 않습니다.';
    case 'duplicate_phone':
      return '같은 연락처의 활성 회원이 이미 존재합니다.';
    case 'admin_required':
      return '운영진만 회원을 수정할 수 있습니다.';
    case 'member_not_found':
      return '회원을 찾을 수 없습니다.';
    case 'cannot_demote_self':
      return '자기 자신의 운영진 권한은 해제할 수 없습니다.';
    case 'last_admin_required':
      return '동호회에는 최소 1명의 운영진이 필요합니다.';
    case 'rpc_missing':
      return 'Supabase 회원 수정 함수가 없습니다. 0007 SQL을 먼저 실행해 주세요.';
    case 'permission_denied':
      return '회원 수정 함수 실행 권한이 없습니다.';
    case 'unknown':
      return '알 수 없는 오류가 발생했습니다.';
    default:
      return null;
  }
}

export default async function EditMemberPage({
  params,
  searchParams,
}: EditMemberPageProps) {
  const routeParams = await params;
  const queryParams = await searchParams;
  const { supabase, member: currentMember } = await requireAdmin();

  const { data: member, error } = await supabase
    .from('members')
    .select(
      `
      id,
      club_id,
      name,
      phone,
      handicap,
      role,
      status,
      user_id,
      joined_on
    `,
    )
    .eq('id', routeParams.id)
    .eq('club_id', currentMember.club_id)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!member) {
    notFound();
  }

  const errorMessage = getErrorMessage(queryParams.error);

  return (
    <main className="mx-auto max-w-3xl space-y-4 px-3 py-4 pb-32 sm:px-4 lg:px-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-emerald-600">운영진 관리</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">회원 수정</h1>
          <p className="mt-2 text-sm leading-5 text-slate-600">
            {member.name} 회원의 연락처, 핸디캡, 역할을 수정합니다.
          </p>
        </div>

        <Link
          href="/admin/members"
          className="shrink-0 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700"
        >
          목록
        </Link>
      </header>

      {errorMessage && (
        <section className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
          {errorMessage}
        </section>
      )}

      <form action={updateMemberAction} className="space-y-4">
        <input type="hidden" name="memberId" value={member.id} />

        <section className="rounded-3xl bg-white p-4 shadow-sm lg:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">이름</span>
              <input
                name="name"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                defaultValue={member.name}
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">연락처</span>
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                defaultValue={member.phone ?? ''}
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">핸디캡</span>
              <input
                name="handicap"
                type="number"
                inputMode="decimal"
                step="0.1"
                defaultValue={member.handicap ?? 0}
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">역할</span>
              <select
                name="role"
                defaultValue={member.role}
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="member">회원</option>
                <option value="admin">운영진</option>
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-4 text-xs leading-5 text-slate-500 shadow-sm lg:p-5">
          자기 자신의 운영진 권한 해제와 마지막 운영진 권한 해제는 보안상 차단됩니다.
        </section>

        <div className="sticky bottom-24 z-20 grid gap-2 rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur sm:grid-cols-2 lg:static lg:shadow-none">
          <Link
            href="/admin/members"
            className="flex h-12 items-center justify-center rounded-2xl bg-slate-100 px-4 font-bold text-slate-700"
          >
            취소
          </Link>

          <button
            type="submit"
            className="h-12 rounded-2xl bg-emerald-600 px-4 font-bold text-white active:scale-[0.99]"
          >
            수정 저장
          </button>
        </div>
      </form>
    </main>
  );
}
