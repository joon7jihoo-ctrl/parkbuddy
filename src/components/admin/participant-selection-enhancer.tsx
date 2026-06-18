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
  const countOutputs = Array.from(
    document.querySelectorAll<HTMLElement>('[data-selected-count-output]'),
  );

  for (const element of countOutputs) {
    element.textContent = String(selectedCount);
  }

  const labelOutputs = Array.from(
    document.querySelectorAll<HTMLElement>('[data-selected-count-label]'),
  );

  for (const element of labelOutputs) {
    element.textContent = `${selectedCount}명`;
  }

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
      className="sticky top-2 z-20 mb-3 rounded-3xl border border-slate-200/80 bg-white/95 p-3 shadow-sm backdrop-blur sm:static sm:mb-4 sm:p-4"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">회원 검색</h2>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-right">
            <p className="text-[11px] font-semibold text-emerald-700">선택</p>
            <p className="text-sm font-black text-emerald-900">{selectedCount}명</p>
          </div>
        </div>

        <input
          type="search"
          value={query}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="이름으로 회원 검색"
          className="h-12 w-full rounded-2xl border border-emerald-300 px-4 text-base text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleSelectedOnlyToggle}
            className="min-h-11 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 sm:text-sm"
          >
            {showSelectedOnly ? '전체 보기' : '선택만 보기'}
          </button>

          <button
            type="button"
            onClick={handleSelectToggle}
            className="min-h-11 rounded-2xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white sm:text-sm"
          >
            {allVisibleSelected ? '표시 해제' : '표시 전체 선택'}
          </button>
        </div>

        <p className="text-xs text-slate-500 sm:text-sm">
          전체 {totalCount}명 · 표시 {visibleCount}명 · 선택 {selectedCount}명
        </p>
      </div>
    </section>
  );
}
