import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/require-member';
import { createMemberAction } from '../actions';

type NewMemberPageProps = {
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
      return '운영진만 회원을 등록할 수 있습니다.';
    case 'rpc_missing':
      return 'Supabase 관리자 회원 등록 함수가 없습니다. 0006 SQL을 먼저 실행해 주세요.';
    case 'permission_denied':
      return '회원 등록 함수 실행 권한이 없습니다.';
    case 'unknown':
      return '알 수 없는 오류가 발생했습니다.';
    default:
      return null;
  }
}

export default async function NewMemberPage({
  searchParams,
}: NewMemberPageProps) {
  await requireAdmin();

  const params = await searchParams;
  const errorMessage = getErrorMessage(params.error);

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl items-center px-4 py-6">
      <section className="w-full rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              운영진 관리
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              회원 등록
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              등록 완료 후 회원 연결 코드가 1회 표시됩니다. 해당 코드를
              회원에게 전달하면 카카오 로그인 후 계정을 연결할 수 있습니다.
            </p>
          </div>

          <Link
            href="/admin/members"
            className="shrink-0 rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
          >
            목록
          </Link>
        </div>

        {errorMessage && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {errorMessage}
          </div>
        )}

        <form action={createMemberAction} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">이름</span>
            <input
              name="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="예: 홍길동"
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
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="예: 01022223333"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">핸디캡</span>
            <input
              name="handicap"
              type="number"
              inputMode="decimal"
              step="0.1"
              defaultValue="0"
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">역할</span>
            <select
              name="role"
              defaultValue="member"
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="member">회원</option>
              <option value="admin">운영진</option>
            </select>
          </label>

          <button
            type="submit"
            className="h-12 w-full rounded-2xl bg-emerald-600 px-4 font-bold text-white active:scale-[0.99]"
          >
            회원 등록하고 연결 코드 발급
          </button>
        </form>

        <p className="mt-5 text-xs leading-5 text-slate-500">
          보안상 연결 코드는 평문 저장하지 않고 해시로 저장합니다. 등록 후
          표시되는 코드는 회원에게 전달한 뒤 다시 확인할 수 없으며, 필요하면
          회원 관리 화면에서 재발급하세요.
        </p>
      </section>
    </main>
  );
}
