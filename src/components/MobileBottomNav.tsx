'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Gauge, Home, MessageSquareText, Trophy, UserRound, UsersRound } from 'lucide-react';
import { cn } from '@/lib/utils';

type MobileBottomNavProps = {
  isAdmin?: boolean;
};

export function MobileBottomNav({ isAdmin = false }: MobileBottomNavProps) {
  const pathname = usePathname();
  const navItems = [
    { href: '/', label: '홈', icon: Home },
    ...(isAdmin ? [{ href: '/admin', label: '대시보드', icon: Gauge }] : []),
    { href: isAdmin ? '/admin/members' : '/members', label: '회원', icon: UsersRound },
    { href: '/schedule', label: '일정', icon: CalendarDays },
    { href: '/scores', label: '스코어', icon: Trophy },
    { href: '/board', label: '게시판', icon: MessageSquareText },
    { href: '/mypage', label: '내정보', icon: UserRound },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur safe-bottom print:hidden">
      <div
        className="mx-auto grid max-w-3xl"
        style={{ gridTemplateColumns: 'repeat(' + navItems.length + ', minmax(0, 1fr))' }}
      >
        {navItems.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex h-16 flex-col items-center justify-center gap-1 text-[10px] sm:text-[11px]',
                active ? 'font-semibold text-emerald-600' : 'text-slate-500',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={20} aria-hidden />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
