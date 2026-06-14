'use client';

import { useRef, useState, useTransition } from 'react';
import { matchesMemberSearch } from '@/lib/korean-search';

type MemberStatusFilter = 'active' | 'inactive';
type MemberViewFilter = 'all' | 'linked' | 'waiting' | 'needs-code';

type FilterCounts = {
  active: Record<MemberViewFilter, number>;
  inactive: Record<MemberViewFilter, number>;
};

type MemberFilterControlsProps = {
  counts: FilterCounts;
  initialStatus?: MemberStatusFilter;
};

const VIEW_ITEMS: MemberViewFilter[] = ['all', 'linked', 'waiting', 'needs-code'];
const VIEW_LABELS: Record<MemberViewFilter, string> = {
  all: '활성 전체',
  linked: '연결 완료',
  waiting: '연결 대기',
  'needs-code': '코드 필요',
};

function getViewLabel(status: MemberStatusFilter, view: MemberViewFilter) {
  if (view !== 'all') {
    return VIEW_LABELS[view];
  }

  return status === 'inactive' ? '비활성 전체' : '활성 전체';
}

function FilterCard({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'min-h-[4.25rem] rounded-2xl border px-2 py-2 text-center shadow-sm transition',
        active ? 'border-emerald-500 bg-emerald-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
      ].join(' ')}
    >
      <span className={['block text-[11px] font-bold leading-4', active ? 'text-emerald-50' : 'text-slate-500'].join(' ')}>
        {label}
      </span>
      <span className="mt-1 block text-xl font-black leading-6">{value}</span>
    </button>
  );
}

export function MemberFilterControls({ counts, initialStatus = 'active' }: MemberFilterControlsProps) {
  const [status, setStatus] = useState<MemberStatusFilter>(initialStatus);
  const [view, setView] = useState<MemberViewFilter>('all');
  const [hasQuery, setHasQuery] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const countRef = useRef<HTMLParagraphElement>(null);

  const activeCounts = counts[status];
  const helperText = isPending
    ? '검색 중...'
    : '이름 일부, 초성, 자소, 연락처 숫자 한 자리까지 바로 검색됩니다.';

  function updateCount(nextVisibleCount: number) {
    if (countRef.current) {
      countRef.current.textContent = '표시 ' + nextVisibleCount + '명';
    }
  }

  function applyFilter(nextStatus: MemberStatusFilter, nextView: MemberViewFilter, nextQuery: string) {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-member-card]'));
    const trimmedQuery = nextQuery.trim();

    for (const card of cards) {
      const cardStatus = card.dataset.memberStatus;
      const cardView = card.dataset.memberView;
      const name = card.dataset.memberName ?? '';
      const phone = card.dataset.memberPhone ?? '';
      const statusMatched = cardStatus === nextStatus;
      const viewMatched = nextView === 'all' || cardView === nextView;
      const searchMatched = matchesMemberSearch({ name, phone }, trimmedQuery);
      const visible = statusMatched && viewMatched && searchMatched;

      card.hidden = !visible;
    }
  }
  function clearInput() {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setHasQuery(false);
  }

  function handleViewClick(nextView: MemberViewFilter) {
    startTransition(() => {
      clearInput();
      setView(nextView);
      applyFilter(status, nextView, '');
    });
  }

  function handleStatusClick(nextStatus: MemberStatusFilter) {
    startTransition(() => {
      clearInput();
      setStatus(nextStatus);
      setView('all');
      applyFilter(nextStatus, 'all', '');
    });
  }

  function handleSearch(nextValue: string) {
    startTransition(() => {
      setHasQuery(nextValue.trim().length > 0);
      setView('all');
      applyFilter(status, 'all', nextValue);
    });
  }

  return (
    <>
      <section className="grid grid-cols-4 gap-2">
        {VIEW_ITEMS.map((item) => (
          <FilterCard
            key={item}
            label={getViewLabel(status, item)}
            value={activeCounts[item]}
            active={view === item && !hasQuery}
            onClick={() => handleViewClick(item)}
          />
        ))}
      </section>

      <section className="rounded-3xl bg-white p-3 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleStatusClick('active')}
            className={[
              'h-12 rounded-2xl text-sm font-bold transition',
              status === 'active' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700',
            ].join(' ')}
          >
            활성 회원
          </button>
          <button
            type="button"
            onClick={() => handleStatusClick('inactive')}
            className={[
              'h-12 rounded-2xl text-sm font-bold transition',
              status === 'inactive' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700',
            ].join(' ')}
          >
            비활성 회원
          </button>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-4 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">회원 검색</span>
          <div className="relative mt-2">
            <input
              ref={inputRef}
              type="search"
              onInput={(event) => handleSearch(event.currentTarget.value)}
              onCompositionUpdate={(event) => handleSearch(event.currentTarget.value)}
              onCompositionEnd={(event) => handleSearch(event.currentTarget.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 pr-10 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="예: 홍, ㅎ, ㅎㅗ, 010, 7"
              autoComplete="off"
              spellCheck={false}
            />
            {hasQuery ? (
              <button
                type="button"
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400"
                aria-label="검색어 지우기"
              >
                ×
              </button>
            ) : null}
          </div>
        </label>
        <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
          <p>{helperText}</p>
        </div>
      </section>
    </>
  );
}
