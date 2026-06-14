'use client';

import { useMemo, useState } from 'react';
import { formatKoreanDate } from '@/lib/utils';
import { formatKoreanPhoneNumber, normalizeDigits } from '@/lib/korean-search';

type PublicMember = {
  id: string;
  name: string;
  phone: string | null;
  handicap: number | null;
  joined_on: string | null;
  role: 'admin' | 'member';
  roundsCount: number;
  averageScore: number | null;
  bestScore: number | null;
};

type PublicMembersListProps = {
  members: PublicMember[];
};

function StatPill({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
      <p className="text-[11px] font-medium text-slate-400">{label}</p>
      <p className={accent ? 'mt-1 text-lg font-bold text-emerald-600' : 'mt-1 text-lg font-bold text-slate-900'}>{value}</p>
    </div>
  );
}

function InfoCell({ label, value, href, compact = false }: { label: string; value: string; href?: string; compact?: boolean }) {
  return (
    <div className={compact ? 'rounded-xl bg-slate-50 px-2.5 py-2' : 'rounded-2xl bg-slate-50 px-3 py-3'}>
      <dt className="text-[10px] font-medium leading-none text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm font-semibold leading-tight text-slate-900">
        {href ? (
          <a href={href} className="whitespace-nowrap underline-offset-4 hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

export function PublicMembersList({ members }: PublicMembersListProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const selectedMember = useMemo(
    () => members.find((member) => member.id === selectedMemberId) ?? null,
    [members, selectedMemberId],
  );

  return (
    <>
      <section className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {members.map((member) => {
          const formattedPhone = formatKoreanPhoneNumber(member.phone);
          const phoneDigits = normalizeDigits(member.phone);

          return (
            <article key={member.id} className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="grid grid-cols-[minmax(76px,0.42fr)_minmax(0,1fr)] gap-2.5 sm:grid-cols-[minmax(86px,0.38fr)_minmax(0,1fr)]">
                <div className="min-w-0 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedMemberId(member.id)}
                    className="text-left text-lg font-bold leading-tight text-slate-950 underline-offset-4 hover:underline"
                  >
                    {member.name}
                  </button>
                  <div className="mt-1.5 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    {member.role === 'admin' ? '운영진' : '회원'}
                  </div>
                </div>

                <dl className="grid min-w-0 grid-cols-2 gap-1.5">
                  <InfoCell label="가입일" value={member.joined_on ? formatKoreanDate(member.joined_on) : '-'} compact />
                  <InfoCell label="핸디캡" value={String(member.handicap ?? 0)} compact />
                  <div className="col-span-2">
                    <InfoCell label="연락처" value={formattedPhone} href={phoneDigits ? `tel:${phoneDigits}` : undefined} compact />
                  </div>
                </dl>
              </div>
            </article>
          );
        })}
      </section>

      {selectedMember ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg rounded-[32px] bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-emerald-600">회원 상세</p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.02em] text-slate-950">{selectedMember.name}</h2>
                <div className="mt-2 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {selectedMember.role === 'admin' ? '운영진' : '회원'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMemberId(null)}
                className="inline-flex size-11 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-500 transition hover:bg-slate-200"
                aria-label="회원 상세 닫기"
              >
                ×
              </button>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-2.5">
              <InfoCell label="가입일" value={selectedMember.joined_on ? formatKoreanDate(selectedMember.joined_on) : '-'} />
              <InfoCell label="핸디캡" value={String(selectedMember.handicap ?? 0)} />
              <InfoCell label="역할" value={selectedMember.role === 'admin' ? '운영진' : '회원'} />
              <div className="col-span-2">
                <InfoCell
                  label="연락처"
                  value={formatKoreanPhoneNumber(selectedMember.phone)}
                  href={normalizeDigits(selectedMember.phone) ? `tel:${normalizeDigits(selectedMember.phone)}` : undefined}
                />
              </div>
            </dl>

            <div className="mt-5 grid grid-cols-3 gap-2.5">
              <StatPill label="라운딩" value={String(selectedMember.roundsCount)} />
              <StatPill label="평균" value={selectedMember.averageScore == null ? '-' : String(selectedMember.averageScore)} />
              <StatPill label="베스트" value={selectedMember.bestScore == null ? '-' : String(selectedMember.bestScore)} accent />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
