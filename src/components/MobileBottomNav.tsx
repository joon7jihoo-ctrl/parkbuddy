'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Home, MessageSquareText, Trophy, UserRound, UsersRound } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: '홈', icon: Home },
  { href: '/members', label: '회원', icon: UsersRound },
  { href: '/schedule', label: '일정', icon: CalendarDays },
  { href: '/scores', label: '스코어', icon: Trophy },
  { href: '/board', label: '게시판', icon: MessageSquareText },
  { href: '/mypage', label: '내정보', icon: UserRound },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      data-bottom-nav
      aria-label="앱 하단 주요 메뉴"
      className="fixed inset-x-0 bottom-0 z-50 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-4 print:hidden"
    >
      <div className="mx-auto grid max-w-3xl grid-cols-6 overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-lg shadow-slate-900/10 backdrop-blur supports-[backdrop-filter]:bg-white/85 md:max-w-2xl">
        {navItems.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-[10px] transition sm:min-h-16 sm:gap-1 sm:text-[11px] md:min-h-[64px] md:px-3',
                active
                  ? 'bg-emerald-50 font-semibold text-emerald-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="size-5 md:size-[22px]" aria-hidden />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
