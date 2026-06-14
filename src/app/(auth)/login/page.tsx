'use client';

import { ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const loginWithKakao = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'profile_nickname profile_image',
        queryParams: {
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      alert('로그인 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-50 px-5 py-10">
      <section className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <ShieldCheck aria-hidden />
        </div>
        <p className="mt-5 text-sm font-semibold text-emerald-600">ParkBuddy Secure</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">파크골프 동호회 관리</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          회원 정보, 일정, 스코어를 안전하게 관리합니다. 운영진이 등록한 회원만 내부 데이터에 접근할 수 있습니다.
        </p>
        <button
          type="button"
          onClick={loginWithKakao}
          className="mt-6 h-12 w-full rounded-2xl bg-yellow-300 font-bold text-slate-950 shadow-sm active:scale-[0.99]"
        >
          카카오로 시작하기
        </button>
        <p className="mt-4 text-xs leading-5 text-slate-500">
          로그인 후 회원 계정 연결이 필요할 수 있습니다. 계정이 연결되지 않으면 운영진에게 문의해 주세요.
        </p>
      </section>
    </main>
  );
}
