'use client';

/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef, useState } from 'react';

type SyncOptions = {
  query?: string;
  showSelectedOnly?: boolean;
};

function normalizeText(value: string) {
  return value.replace(/\s+/g, ' ').trim().toLowerCase();
}

function getMemberCheckboxes(root: HTMLElement | null) {
  if (!root) {
    return [];
  }

  const form = root.closest('form') ?? document;
  const inputs = Array.from(
    form.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'),
  );

  return inputs.filter((input) => !root.contains(input));
}

function getMemberRow(input: HTMLInputElement) {
  return (
    input.closest<HTMLElement>('[data-member-row]') ??
    input.closest<HTMLElement>('label') ??
    input.closest<HTMLElement>('article') ??
    input.closest<HTMLElement>('li') ??
    input.parentElement?.parentElement ??
    input.parentElement
  );
}

function updateSelectedCountText(selectedCount: number) {
  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>('p, span, div'),
  );

  for (const element of candidates) {
    const text = element.textContent ?? '';

    if (!text.includes('현재') || !text.includes('명 선택')) {
      continue;
    }

    if (element.querySelector('input, button, a, select, textarea')) {
      continue;
    }

    element.textContent = text.replace(
      /현재\s*\d+\s*명\s*선택됨/g,
      `현재 ${selectedCount}명 선택됨`,
    );
  }
}

export function ParticipantSelectionEnhancer() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState('');
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCount, setSelectedCount] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [allVisibleSelected, setAllVisibleSelected] = useState(false);

  function sync(options: SyncOptions = {}) {
    const root = rootRef.current;
    const nextQuery = options.query ?? query;
    const nextShowSelectedOnly = options.showSelectedOnly ?? showSelectedOnly;
    const normalizedQuery = normalizeText(nextQuery);
    const checkboxes = getMemberCheckboxes(root);

    let nextSelectedCount = 0;
    let nextVisibleCount = 0;
    let visibleSelectedCount = 0;

    for (const checkbox of checkboxes) {
      const row = getMemberRow(checkbox);

      if (!row) {
        continue;
      }

      const rowText = normalizeText(row.textContent ?? '');
      const matchesQuery = !normalizedQuery || rowText.includes(normalizedQuery);
      const isSelected = checkbox.checked;
      const isVisible = matchesQuery && (!nextShowSelectedOnly || isSelected);

      if (isSelected) {
        nextSelectedCount += 1;
      }

      if (isVisible) {
        nextVisibleCount += 1;

        if (isSelected) {
          visibleSelectedCount += 1;
        }
      }

      row.hidden = !isVisible;
      row.style.display = isVisible ? '' : 'none';
    }

    setTotalCount(checkboxes.length);
    setSelectedCount(nextSelectedCount);
    setVisibleCount(nextVisibleCount);
    setAllVisibleSelected(
      nextVisibleCount > 0 && visibleSelectedCount === nextVisibleCount,
    );
    updateSelectedCountText(nextSelectedCount);
  }

  useEffect(() => {
    const root = rootRef.current;
    const form = root?.closest('form') ?? document;

    function handleChange(event: Event) {
      const target = event.target;

      if (
        target instanceof HTMLInputElement &&
        target.type === 'checkbox' &&
        !root?.contains(target)
      ) {
        window.requestAnimationFrame(() => sync());
      }
    }

    form.addEventListener('change', handleChange);
    const timer = window.setTimeout(() => sync(), 0);

    return () => {
      window.clearTimeout(timer);
      form.removeEventListener('change', handleChange);
    };
  }, []);

  function handleSearchChange(nextQuery: string) {
    setQuery(nextQuery);
    window.requestAnimationFrame(() => sync({ query: nextQuery }));
  }

  function handleSelectedOnlyToggle() {
    const nextValue = !showSelectedOnly;
    setShowSelectedOnly(nextValue);
    window.requestAnimationFrame(() => sync({ showSelectedOnly: nextValue }));
  }

  function handleSelectToggle() {
    const root = rootRef.current;
    const checkboxes = getMemberCheckboxes(root);
    const shouldSelect = !allVisibleSelected;

    for (const checkbox of checkboxes) {
      const row = getMemberRow(checkbox);
      const isVisible = row ? !row.hidden && row.style.display !== 'none' : true;

      if (!isVisible || checkbox.disabled) {
        continue;
      }

      checkbox.checked = shouldSelect;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    }

    window.requestAnimationFrame(() => sync());
  }

  return (
    <section
      ref={rootRef}
      data-participant-selection-enhancer="true"
      className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">회원 검색</h2>
          <p className="mt-1 text-sm text-slate-500">
            이름, 연락처, 역할 기준으로 참가자를 빠르게 찾을 수 있습니다.
          </p>
        </div>

        <input
          type="search"
          value={query}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="이름으로 회원을 검색하세요"
          className="h-14 w-full rounded-2xl border border-emerald-400 px-4 text-base text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSelectedOnlyToggle}
            className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700"
          >
            {showSelectedOnly ? '전체 회원 보기' : '선택된 회원만 보기'}
          </button>

          <button
            type="button"
            onClick={handleSelectToggle}
            className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white"
          >
            {allVisibleSelected ? '전체 선택 해제' : '전체 선택'}
          </button>
        </div>

        <p className="text-sm text-slate-500">
          전체 {totalCount}명 · 표시 {visibleCount}명 · 선택 {selectedCount}명
        </p>
      </div>
    </section>
  );
}
