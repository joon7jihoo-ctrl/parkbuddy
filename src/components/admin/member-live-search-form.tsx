'use client';

import { useMemo, useState, useTransition } from 'react';

type MemberLiveSearchFormProps = {
  defaultValue?: string;
  status?: string;
};

export function MemberLiveSearchForm({ defaultValue = '' }: MemberLiveSearchFormProps) {
  const [value, setValue] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();

  const helperText = useMemo(() => {
    if (isPending) {
      return '검색 중...';
    }

    return '이름 일부, 초성, 자소, 연락처 숫자 한 자리까지 바로 검색됩니다.';
  }, [isPending]);

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <label className="block">
        <span className="text-sm font-medium text-slate-700">회원 검색</span>
        <input
          name="q"
          type="search"
          value={value}
          onInput={(event) => {
            const nextValue = event.currentTarget.value;
            startTransition(() => setValue(nextValue));
          }}
          onChange={(event) => {
            const nextValue = event.currentTarget.value;
            startTransition(() => setValue(nextValue));
          }}
          className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          placeholder="예: 홍, ㅎ, ㅎㅗ, 010, 7"
          autoComplete="off"
        />
      </label>
      <p className="mt-2 text-xs text-slate-500">{helperText}</p>
    </div>
  );
}
