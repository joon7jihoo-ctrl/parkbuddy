'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

function getKakaoCallbackUrl() {
  if (typeof window === 'undefined') {
    return null;
  }

  const callbackUrl = new URL('/auth/callback', window.location.origin);

  if (callbackUrl.protocol !== 'http:' && callbackUrl.protocol !== 'https:') {
    return null;
  }

  return callbackUrl.toString();
}

export function KakaoLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const loginWithKakao = async () => {
    if (isLoading) {
      return;
    }

    const redirectTo = getKakaoCallbackUrl();

    if (!redirectTo) {
      alert('로그인 주소를 확인하지 못했습니다. 브라우저를 새로고침한 뒤 다시 시도해 주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo,
          scopes: 'profile_nickname profile_image',
          queryParams: {
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        throw error;
      }

      // Supabase normally performs the redirect automatically, but assigning the
      // returned URL explicitly keeps the OAuth flow stable across browsers.
      if (data.url) {
        window.location.assign(data.url);
      }
    } catch {
      setIsLoading(false);
      alert('로그인 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <button
      type="button"
      onClick={loginWithKakao}
      disabled={isLoading}
      className="h-12 w-full rounded-2xl bg-yellow-300 font-bold text-slate-950 shadow-sm transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isLoading ? '카카오로 이동 중...' : '카카오로 시작하기'}
    </button>
  );
}
