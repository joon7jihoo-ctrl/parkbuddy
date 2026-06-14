'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
  const pathname = usePathname();
  const active = pathname === '/';

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-3 print:hidden safe-bottom">
      <Link
        href="/"
        className={cn(
          'inline-flex min-h-14 min-w-28 flex-col items-center justify-center gap-1 rounded-full border border-slate-200 bg-white/95 px-6 text-[11px] font-semibold shadow-lg shadow-slate-900/10 backdrop-blur transition active:scale-[0.98]',
          active ? 'text-emerald-600' : 'text-slate-600'
        )}
        aria-current={active ? 'page' : undefined}
      >
        <Home size={21} aria-hidden />
        <span>홈</span>
      </Link>
    </nav>
  );
}
