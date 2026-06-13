'use client';

import { useEffect, useMemo, useState } from 'react';

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function getSearchableMemberElements() {
  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>('label, article, li, tr'),
  );

  return candidates.filter((element) => {
    const hasCheckbox = Boolean(element.querySelector('input[type="checkbox"]'));
    const hasMemberInput = Boolean(
      element.querySelector(
        'input[name*="member" i], input[name*="participant" i]',
      ),
    );

    return hasCheckbox || hasMemberInput;
  });
}

export function MemberSearchFilter() {
  const [query, setQuery] = useState('');
  const normalizedQuery = useMemo(() => normalizeText(query), [query]);

  useEffect(() => {
    const memberElements = getSearchableMemberElements();

    memberElements.forEach((element) => {
      const text = normalizeText(element.textContent ?? '');
      const shouldShow = !normalizedQuery || text.includes(normalizedQuery);
      element.style.display = shouldShow ? '' : 'none';
    });

    return () => {
      memberElements.forEach((element) => {
        element.style.display = '';
      });
    };
  }, [normalizedQuery]);

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm">
      <label className="block">
        <span className="text-sm font-semibold text-slate-700">
          회원 검색
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="이름, 닉네임, 메모로 검색"
          className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </label>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        참가자 목록이 길 때 이름을 입력하면 현재 화면의 회원 항목만 빠르게 좁혀 볼 수 있습니다.
      </p>
    </section>
  );
}
