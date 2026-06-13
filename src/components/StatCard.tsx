export function StatCard({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={accent ? 'mt-1 text-xl font-bold text-emerald-600' : 'mt-1 text-xl font-bold text-slate-900'}>{value}</p>
    </div>
  );
}
