'use client';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-50 px-5">
      <section className="w-full max-w-2xl rounded-3xl bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">오류가 발생했습니다</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">{error.message || '잠시 후 다시 시도해 주세요.'}</p>
        <button onClick={() => reset()} className="mt-6 rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white">다시 시도</button>
      </section>
    </main>
  );
}
