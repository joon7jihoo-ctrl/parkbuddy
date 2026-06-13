'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({ label = '저장', pendingLabel = '저장 중...' }: { label?: string; pendingLabel?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="h-13 min-h-12 w-full rounded-2xl bg-emerald-600 px-4 py-3 font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
