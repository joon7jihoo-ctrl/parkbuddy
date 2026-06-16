'use client';

import { createClient } from '@/lib/supabase/client';

export function KakaoLoginButton() {
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
    <button
      type="button"
      onClick={loginWithKakao}
      className="h-12 w-full rounded-2xl bg-yellow-300 font-bold text-slate-950 shadow-sm active:scale-[0.99]"
    >
      카카오로 시작하기
    </button>
  );
}
