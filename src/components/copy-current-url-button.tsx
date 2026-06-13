'use client';

import { useState } from 'react';

type CopyCurrentUrlButtonProps = {
  label?: string;
  copiedLabel?: string;
};

export function CopyCurrentUrlButton({
  label = '링크 복사',
  copiedLabel = '복사 완료',
}: CopyCurrentUrlButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (typeof window === 'undefined') {
      return;
    }

    const currentUrl = window.location.href;

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(currentUrl);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = currentUrl;
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
      className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
