import { redirect } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { KakaoLoginButton } from '@/components/auth/kakao-login-button';
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

  if (message.includes('Anonymous sign-ins are disabled')) {
    return 'anonymous_disabled';
  }

  if (message.includes('Could not find the function')) {
    return 'rpc_missing';
  }

  if (message.includes('permission denied')) {
    return 'permission_denied';
  }

  return 'unknown';
}

function getErrorMessage(error?: string) {
  switch (error) {
    case 'invalid_name':
      return '이름을 2자 이상 입력해 주세요.';
    case 'invalid_phone':
      return '연락처를 정확히 입력해 주세요.';
    case 'invalid_code':
      return '초대 코드를 6자리 이상 입력해 주세요.';
    case 'auth_required':
      return '로그인 세션을 만들지 못했습니다. 다시 시도해 주세요.';
    case 'anonymous_disabled':
      return 'Supabase Anonymous sign-in이 아직 켜져 있지 않습니다. 운영자가 Auth 설정을 먼저 확인해야 합니다.';
    case 'already_claimed':
      return '현재 브라우저 세션은 이미 다른 회원과 연결되어 있습니다. 로그아웃 후 다시 시도해 주세요.';
    case 'claim_failed':
      return '일치하는 회원 정보를 찾지 못했습니다. 이름, 연락처, 초대 코드, 코드 만료 여부를 확인해 주세요.';
    case 'rpc_missing':
      return 'Supabase에 회원 연결 함수가 아직 생성되지 않았습니다. 최신 SQL 마이그레이션을 먼저 실행해 주세요.';
    case 'permission_denied':
      return '회원 연결 함수 실행 권한이 없습니다. Supabase RPC 권한 설정을 확인해 주세요.';
    case 'unknown':
      return '초대 코드 로그인 중 알 수 없는 오류가 발생했습니다. 아래 개발용 오류 메시지를 확인해 주세요.';
    default:
      return null;
  }
}

async function startWithInviteCode(formData: FormData) {
  'use server';

  const supabase = await createClient();

  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const claimCode = String(formData.get('claimCode') ?? '').trim();

  if (name.length < 2) {
    redirect('/login?invite=1&error=invalid_name');
  }

  if (phone.replace(/\D/g, '').length < 8) {
    redirect('/login?invite=1&error=invalid_phone');
  }

  if (claimCode.length < 6) {
    redirect('/login?invite=1&error=invalid_code');
  }

  const {
    data: { user: existingUser },
  } = await supabase.auth.getUser();

  if (!existingUser) {
    const { error: signInError } = await supabase.auth.signInAnonymously();

    if (signInError) {
      const errorCode = getClaimErrorCode(signInError.message);

      console.error('anonymous invite sign-in failed', {
        errorCode,
        message: signInError.message,
        status: signInError.status,
      });

      redirect(
        `/login?invite=1&error=${errorCode}&debug=${encodeErrorMessage(
          signInError.message,
        )}`,
      );
    }
  }

  const { data, error } = await supabase.rpc('claim_member_account', {
    p_name: name,
    p_phone: phone,
    p_claim_code: claimCode,
  });

  if (error) {
    const errorCode = getClaimErrorCode(error.message);

    console.error('invite code member claim failed', {
      errorCode,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    redirect(
      `/login?invite=1&error=${errorCode}&debug=${encodeErrorMessage(
        error.message,
      )}`,
    );
  }

  if (!data) {
    redirect('/login?invite=1&error=claim_failed&debug=no_data_returned');
  }

  redirect('/');
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string; error?: string; debug?: string }>;
}) {
  const params = await searchParams;
  const showInviteForm = params.invite === '1' || Boolean(params.error);
  const errorMessage = getErrorMessage(params.error);
  const debugMessage = params.debug
    ? decodeURIComponent(params.debug)
    : undefined;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-50 px-5 py-8">
      <section className="w-full max-w-2xl rounded-3xl bg-white p-5 shadow-sm sm:p-6">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <ShieldCheck aria-hidden />
        </div>
        <p className="mt-5 text-sm font-semibold text-emerald-600">ParkBuddy Secure</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">파크골프 동호회 관리</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          회원 정보, 일정, 스코어를 안전하게 관리합니다. 운영진이 등록한 회원만 내부 데이터에 접근할 수 있습니다.
        </p>

        {errorMessage ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {errorMessage}

            {debugMessage ? (
              <p className="mt-2 break-all rounded-xl bg-white/70 px-3 py-2 text-xs text-red-600">
                개발용 오류: {debugMessage}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 space-y-3">
          <KakaoLoginButton />

          <a
            href={showInviteForm ? '/login' : '/login?invite=1'}
            className="flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-800 active:scale-[0.99]"
          >
            {showInviteForm ? '초대 코드 닫기' : '초대 코드로 시작하기'}
          </a>
        </div>

        {showInviteForm ? (
          <section className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50/60 p-4">
            <div>
              <p className="text-sm font-bold text-emerald-700">카카오 로그인이 안 될 때</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">초대 코드로 첫 접속</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                운영진에게 받은 이름, 연락처, 초대 코드를 입력하면 이 기기에서 ParkBuddy를 시작할 수 있습니다.
              </p>
            </div>

            <form action={startWithInviteCode} className="mt-4 space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">이름</span>
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="예: 01012345678"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">초대 코드</span>
                <input
                  name="claimCode"
                  type="password"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="운영진에게 받은 코드"
                />
              </label>

              <button
                type="submit"
                className="h-12 w-full rounded-2xl bg-emerald-600 px-4 font-bold text-white active:scale-[0.99]"
              >
                ParkBuddy 시작하기
              </button>
            </form>
          </section>
        ) : null}

        <p className="mt-4 text-xs leading-5 text-slate-500">
          카카오 로그인이 모바일 데이터망에서 실패하면 초대 코드로 시작해 주세요. 초대 코드는 동호회 운영진이 회원 관리 화면에서 발급할 수 있습니다.
        </p>
      </section>
    </main>
  );
}
