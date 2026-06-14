'use client';

import { useState } from 'react';

type ShareResultSummaryButtonProps = {
  summary: string;
  label?: string;
  copiedLabel?: string;
};

export function ShareResultSummaryButton({
  summary,
  label = '결과 요약 복사',
  copiedLabel = '요약 복사 완료',
}: ShareResultSummaryButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (typeof window === 'undefined') {
      return;
    }

    const text = `${summary}

결과 링크: ${window.location.href}`;

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', 'true');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-violet-600 px-4 py-2 text-center text-sm font-semibold text-white"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
