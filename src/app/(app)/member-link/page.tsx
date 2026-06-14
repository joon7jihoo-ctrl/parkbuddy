import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function encodeErrorMessage(message: string) {
  return encodeURIComponent(message.slice(0, 120));
}

function getClaimErrorCode(message?: string) {
  if (!message) {
    return 'unknown';
  }

  if (message.includes('AUTH_REQUIRED')) {
    return 'auth_required';
  }

  if (message.includes('ALREADY_CLAIMED')) {
    return 'already_claimed';
  }

  if (message.includes('INVALID_NAME')) {
    return 'invalid_name';
  }

  if (message.includes('INVALID_PHONE')) {
    return 'invalid_phone';
  }

  if (message.includes('INVALID_CLAIM_CODE')) {
    return 'invalid_code';
  }

  if (message.includes('CLAIM_FAILED')) {
    return 'claim_failed';
  }

  if (message.includes('Could not find the function')) {
    return 'rpc_missing';
  }

  if (message.includes('permission denied')) {
    return 'permission_denied';
  }

  return 'unknown';
}

async function claimMemberAccount(formData: FormData) {
  'use server';

  const supabase = await createClient();

  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const claimCode = String(formData.get('claimCode') ?? '').trim();

  if (name.length < 2) {
    redirect('/member-link?error=invalid_name');
  }

  if (phone.replace(/\D/g, '').length < 8) {
    redirect('/member-link?error=invalid_phone');
  }

  if (claimCode.length < 6) {
    redirect('/member-link?error=invalid_code');
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data, error } = await supabase.rpc('claim_member_account', {
    p_name: name,
    p_phone: phone,
    p_claim_code: claimCode,
  });

  if (error) {
    const errorCode = getClaimErrorCode(error.message);

    console.error('member claim failed', {
      errorCode,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    redirect(
      `/member-link?error=${errorCode}&debug=${encodeErrorMessage(
        error.message,
      )}`,
    );
  }

  if (!data) {
    redirect('/member-link?error=claim_failed&debug=no_data_returned');
  }

  redirect('/');
}

function getErrorMessage(error?: string) {
  switch (error) {
    case 'invalid_name':
      return '이름을 2자 이상 입력해 주세요.';
    case 'invalid_phone':
      return '연락처를 정확히 입력해 주세요.';
    case 'invalid_code':
      return '연결 코드를 6자리 이상 입력해 주세요.';
    case 'auth_required':
      return '로그인 세션을 확인할 수 없습니다. 다시 로그인해 주세요.';
    case 'already_claimed':
      return '현재 로그인 계정은 이미 다른 회원 정보와 연결되어 있습니다.';
    case 'claim_failed':
      return '일치하는 회원 정보를 찾지 못했습니다. 이름, 연락처, 연결 코드, 코드 만료 여부를 확인해 주세요.';
    case 'rpc_missing':
      return 'Supabase에 회원 연결 함수가 아직 생성되지 않았습니다. 최신 SQL 마이그레이션을 먼저 실행해 주세요.';
    case 'permission_denied':
      return '회원 연결 함수 실행 권한이 없습니다. Supabase RPC 권한 설정을 확인해 주세요.';
    case 'unknown':
      return '회원 연결 중 알 수 없는 오류가 발생했습니다. 아래 개발용 오류 메시지를 확인해 주세요.';
    default:
      return null;
  }
}

export default async function MemberLinkPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; debug?: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: member } = await supabase
    .from('members')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (member) {
    redirect('/');
  }

  const params = await searchParams;
  const errorMessage = getErrorMessage(params.error);
  const debugMessage = params.debug
    ? decodeURIComponent(params.debug)
    : undefined;

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-120px)] max-w-2xl items-center px-4 py-8">
      <section className="w-full rounded-3xl bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-emerald-600">ParkBuddy</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            회원 정보 연결
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            운영진이 등록한 회원 정보와 현재 카카오 로그인 계정을 연결합니다.
            이름, 연락처, 연결 코드를 입력해 주세요.
          </p>
        </div>

        {errorMessage && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {errorMessage}

            {debugMessage && (
              <p className="mt-2 break-all rounded-xl bg-white/70 px-3 py-2 text-xs text-red-600">
                개발용 오류: {debugMessage}
              </p>
            )}
          </div>
        )}

        <form action={claimMemberAccount} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">이름</span>
            <input
              name="name"
              type="text"
              autoComplete="name"
              required
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="예: 운영자"
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
              placeholder="예: 01012345678"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              연결 코드
            </span>
            <input
              name="claimCode"
              type="password"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="운영진에게 받은 코드"
            />
          </label>

          <button
            type="submit"
            className="h-12 w-full rounded-2xl bg-emerald-600 px-4 font-bold text-white active:scale-[0.99]"
          >
            회원 정보 연결하기
          </button>
        </form>

        <p className="mt-5 text-xs leading-5 text-slate-500">
          연결 코드는 1회만 사용할 수 있습니다. 코드를 모르면 동호회 운영진에게
          문의해 주세요.
        </p>
      </section>
    </main>
  );
}