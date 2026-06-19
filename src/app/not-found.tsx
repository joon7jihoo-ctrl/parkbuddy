import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-50 px-5">
      <section className="w-full max-w-2xl rounded-3xl bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">페이지를 찾을 수 없습니다</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">주소가 잘못되었거나 접근 권한이 없을 수 있습니다.</p>
        <Link href="/" className="mt-6 inline-flex rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white">홈으로 이동</Link>
      </section>
    </main>
  );
}
