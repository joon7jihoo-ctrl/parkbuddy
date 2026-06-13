'use client';

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white print:hidden"
    >
      인쇄 / PDF 저장
    </button>
  );
}
