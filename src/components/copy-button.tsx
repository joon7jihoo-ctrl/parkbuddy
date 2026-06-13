'use client';

import { useState } from 'react';

type CopyButtonProps = {
  value?: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
};

export function CopyButton({
  value,
  label = '복사',
  copiedLabel = '복사됨',
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
      window.alert('복사에 실패했습니다. 연결 코드를 직접 선택해 복사해 주세요.');
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!value}
      className={
        className ??
        'rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300'
      }
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
