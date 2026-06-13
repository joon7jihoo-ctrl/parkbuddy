export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
      <p className="font-semibold text-slate-800">{title}</p>
      {description ? <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p> : null}
    </div>
  );
}
