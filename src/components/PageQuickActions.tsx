'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type QuickAction = {
  href: string;
  label: string;
  tone?: 'primary' | 'neutral';
};

function getRoundId(pathname: string) {
  const match = pathname.match(/^\/admin\/rounds\/([^/]+)/);
  return match?.[1];
}

function isFormLikePath(pathname: string) {
  return (
    pathname.endsWith('/new') ||
    pathname.endsWith('/edit') ||
    /^\/admin\/members\/[^/]+\/edit$/.test(pathname) ||
    /^\/admin\/rounds\/[^/]+\/(participants|pairings|scores)$/.test(pathname) ||
    /^\/scores\/[^/]+$/.test(pathname) ||
    pathname === '/member-link' ||
    pathname === '/mypage/link'
  );
}

function getActions(pathname: string): QuickAction[] {
  if (isFormLikePath(pathname)) {
    return [];
  }

  if (pathname === '/') {
    return [
      { href: '/schedule', label: '라운딩 공지', tone: 'primary' },
      { href: '/board', label: '게시판', tone: 'neutral' },
    ];
  }

  if (pathname === '/schedule') {
    return [
      { href: '/scores', label: '스코어', tone: 'primary' },
      { href: '/board', label: '게시판', tone: 'neutral' },
    ];
  }

  if (pathname === '/members') {
    return [
      { href: '/schedule', label: '라운딩 공지', tone: 'primary' },
      { href: '/scores', label: '스코어', tone: 'neutral' },
    ];
  }

  if (pathname === '/scores') {
    return [
      { href: '/mypage', label: '마이페이지', tone: 'primary' },
      { href: '/schedule', label: '라운딩 공지', tone: 'neutral' },
    ];
  }

  if (pathname === '/mypage') {
    return [
      { href: '/scores', label: '스코어', tone: 'primary' },
      { href: '/schedule', label: '라운딩 공지', tone: 'neutral' },
    ];
  }

  if (pathname === '/board') {
    return [
      { href: '/board/new', label: '글쓰기', tone: 'primary' },
      { href: '/schedule', label: '라운딩 공지', tone: 'neutral' },
    ];
  }

  if (/^\/board\/[^/]+$/.test(pathname)) {
    return [
      { href: '/board', label: '게시판', tone: 'primary' },
      { href: '/board/new', label: '글쓰기', tone: 'neutral' },
    ];
  }

  if (pathname === '/admin' || pathname === '/admin/logs') {
    return [
      { href: '/admin/rounds', label: '확정 라운드', tone: 'primary' },
      { href: '/admin/members', label: '회원 관리', tone: 'neutral' },
    ];
  }

  if (pathname === '/admin/members') {
    return [
      { href: '/admin/members/new', label: '회원 등록', tone: 'primary' },
      { href: '/admin/rounds', label: '확정 라운드', tone: 'neutral' },
    ];
  }

  if (pathname === '/admin/rounds') {
    return [
      { href: '/admin/rounds/new', label: '라운드 생성', tone: 'primary' },
      { href: '/admin/rounds/calendar', label: '달력', tone: 'neutral' },
    ];
  }

  if (pathname === '/admin/rounds/calendar') {
    return [
      { href: '/admin/rounds', label: '확정 라운드', tone: 'primary' },
      { href: '/admin/rounds/new', label: '라운드 생성', tone: 'neutral' },
    ];
  }

  if (pathname === '/admin/rounds/status' || pathname === '/admin/rounds/deleted') {
    return [
      { href: '/admin/rounds', label: '확정 라운드', tone: 'primary' },
      { href: '/admin/rounds/calendar', label: '달력', tone: 'neutral' },
    ];
  }

  const roundId = getRoundId(pathname);

  if (roundId && pathname.endsWith('/results')) {
    return [
      { href: `/admin/rounds/${roundId}/scores`, label: '스코어', tone: 'primary' },
      { href: `/admin/rounds/${roundId}/results/print`, label: '인쇄', tone: 'neutral' },
    ];
  }

  if (roundId && pathname.endsWith('/results/print')) {
    return [{ href: `/admin/rounds/${roundId}/results`, label: '결과', tone: 'primary' }];
  }

  if (roundId) {
    return [
      { href: '/admin/rounds', label: '확정 라운드', tone: 'primary' },
      { href: `/admin/rounds/${roundId}/results`, label: '결과', tone: 'neutral' },
    ];
  }

  return [];
}

export function PageQuickActions() {
  const pathname = usePathname();
  const actions = getActions(pathname);

  if (!actions.length) {
    return null;
  }

  return (
    <div className="parkbuddy-sticky-cta parkbuddy-sticky-cta--quick print:hidden" data-parkbuddy-quick-actions="true">
      <div className="parkbuddy-sticky-cta__inner">
        {actions.map((action) => (
          <Link
            key={`${action.href}-${action.label}`}
            href={action.href}
            className={cn(
              'rounded-2xl px-4 py-3 text-center text-sm font-extrabold shadow-sm transition active:scale-[0.99]',
              action.tone === 'primary'
                ? 'bg-emerald-600 text-white shadow-emerald-900/10'
                : 'bg-slate-100 text-slate-700'
            )}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
