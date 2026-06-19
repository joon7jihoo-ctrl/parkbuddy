'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({
  label = '저장',
  pendingLabel = '저장 중...',
}: {
  label?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <div className="parkbuddy-sticky-cta print:hidden" data-parkbuddy-sticky-cta="true">
      <div className="parkbuddy-sticky-cta__inner">
        <button
          type="submit"
          disabled={pending}
          className="min-h-12 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white shadow-sm shadow-emerald-900/10 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
        >
          {pending ? pendingLabel : label}
        </button>
      </div>
    </div>
  );
}
