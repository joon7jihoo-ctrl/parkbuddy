import Link from 'next/link';

export function TopBar({ title, description, action }: { title: string; description?: string; action?: { href: string; label: string } }) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {description ? <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p> : null}
      </div>
      {action ? (
        <Link href={action.href} className="shrink-0 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm active:scale-[0.99]">
          {action.label}
        </Link>
      ) : null}
    </header>
  );
}
