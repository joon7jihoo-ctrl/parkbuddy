'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { voteEvent } from '@/server/actions/votes';

type VoteStatus = 'attend' | 'absent';

type ModalMode = VoteStatus | 'all' | null;

export type VoteListMember = {
  id: string;
  name: string;
  status: VoteStatus | null;
};

type VoteButtonsProps = {
  eventId: string;
  currentStatus: VoteStatus | null;
  currentMember: {
    id: string;
    name: string;
  };
  attendVoters: VoteListMember[];
  absentVoters: VoteListMember[];
  totalMembers: number;
};

type VoteTotalButtonProps = {
  voters: VoteListMember[];
  totalMembers: number;
};

const OPTIONS: Array<{ status: VoteStatus; label: string }> = [
  { status: 'attend', label: '참석' },
  { status: 'absent', label: '불참' },
];

function getStatusLabel(status: VoteStatus | null) {
  if (status === 'attend') return '참석';
  if (status === 'absent') return '불참';
  return '미선택';
}

function formatPercent(count: number, totalMembers: number) {
  if (totalMembers <= 0) return 0;
  return Math.round((count / totalMembers) * 100);
}

function mergeOptimisticVoters({
  attendVoters,
  absentVoters,
  currentMember,
  optimisticStatus,
}: {
  attendVoters: VoteListMember[];
  absentVoters: VoteListMember[];
  currentMember: { id: string; name: string };
  optimisticStatus: VoteStatus | null;
}) {
  const normalizedCurrentMember: VoteListMember = {
    id: currentMember.id,
    name: currentMember.name?.trim() || '이름 없음',
    status: optimisticStatus,
  };

  const attend = attendVoters.filter((voter) => voter.id !== currentMember.id);
  const absent = absentVoters.filter((voter) => voter.id !== currentMember.id);

  if (optimisticStatus === 'attend') attend.unshift(normalizedCurrentMember);
  if (optimisticStatus === 'absent') absent.unshift(normalizedCurrentMember);

  return { attend, absent };
}

function VoterListModal({
  mode,
  attendVoters,
  absentVoters,
  onClose,
}: {
  mode: ModalMode;
  attendVoters: VoteListMember[];
  absentVoters: VoteListMember[];
  onClose: () => void;
}) {
  if (!mode) return null;

  const allVoters = [...attendVoters, ...absentVoters];
  const title = mode === 'all' ? '전체 투표 명단' : `${getStatusLabel(mode)} 명단`;
  const voters = mode === 'attend' ? attendVoters : mode === 'absent' ? absentVoters : allVoters;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-3 py-6 backdrop-blur-sm" role="dialog" aria-modal="true">
      <button type="button" aria-label="닫기" className="absolute inset-0 cursor-default" onClick={onClose} />
      <section className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="border-b border-slate-100 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-950">{title}</h3>
              <p className="mt-0.5 text-xs font-bold text-slate-500">총 {voters.length}명</p>
            </div>
            <button type="button" onClick={onClose} className="min-h-11 rounded-2xl bg-slate-100 px-4 text-sm font-extrabold text-slate-700 active:scale-[0.99]">
              닫기
            </button>
          </div>
        </div>

        {voters.length ? (
          <ul className="max-h-[60vh] divide-y divide-slate-100 overflow-y-auto px-4 py-2">
            {voters.map((voter) => (
              <li key={`${voter.id}-${voter.status ?? 'none'}`} className="flex min-h-11 items-center justify-between gap-3 py-2">
                <span className="min-w-0 truncate text-sm font-extrabold text-slate-900">{voter.name}</span>
                {mode === 'all' ? (
                  <span
                    className={
                      'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black ' +
                      (voter.status === 'attend' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600')
                    }
                  >
                    {getStatusLabel(voter.status)}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-8 text-center text-sm font-bold text-slate-500">아직 선택한 회원이 없습니다.</div>
        )}
      </section>
    </div>
  );
}

export function VoteTotalButton({ voters, totalMembers }: VoteTotalButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const percent = formatPercent(voters.length, totalMembers);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-black text-slate-600 ring-1 ring-slate-200 active:scale-[0.98]"
      >
        투표 {voters.length}명 · {percent}%
      </button>
      <VoterListModal
        mode={isOpen ? 'all' : null}
        attendVoters={voters.filter((voter) => voter.status === 'attend')}
        absentVoters={voters.filter((voter) => voter.status === 'absent')}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export function VoteButtons({ eventId, currentStatus, currentMember, attendVoters, absentVoters, totalMembers }: VoteButtonsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useState<VoteStatus | null>(currentStatus);
  const [modalMode, setModalMode] = useState<ModalMode>(null);

  const visibleVoters = useMemo(
    () => mergeOptimisticVoters({ attendVoters, absentVoters, currentMember, optimisticStatus }),
    [absentVoters, attendVoters, currentMember, optimisticStatus]
  );

  const handleVote = (status: VoteStatus) => {
    setOptimisticStatus(status);
    setModalMode(status);
    startTransition(async () => {
      await voteEvent({ eventId, status });
      router.refresh();
    });
  };

  return (
    <>
      <div className="space-y-1.5" aria-label="내 참석 선택" role="radiogroup">
        {OPTIONS.map((option) => {
          const isSelected = optimisticStatus === option.status;
          const voters = option.status === 'attend' ? visibleVoters.attend : visibleVoters.absent;
          const count = voters.length;
          const percent = formatPercent(count, totalMembers);

          return (
            <button
              key={option.status}
              type="button"
              disabled={isPending}
              onClick={() => handleVote(option.status)}
              aria-checked={isSelected}
              role="radio"
              className={
                'relative flex min-h-12 w-full overflow-hidden rounded-2xl border bg-white text-left transition active:scale-[0.99] disabled:opacity-60 ' +
                (isSelected ? 'border-emerald-500 shadow-sm ring-2 ring-emerald-100' : 'border-slate-200 hover:bg-slate-50')
              }
            >
              <span className="absolute inset-y-0 left-0 bg-emerald-100/80 transition-all duration-200" style={{ width: `${Math.min(percent, 100)}%` }} aria-hidden="true" />
              <span className="relative z-10 flex min-h-12 w-full items-center gap-2 px-3 py-2">
                <span
                  className={
                    'flex size-5 shrink-0 items-center justify-center rounded-full border bg-white ' +
                    (isSelected ? 'border-emerald-600' : 'border-slate-300')
                  }
                  aria-hidden="true"
                >
                  <span className={isSelected ? 'size-2.5 rounded-full bg-emerald-600' : 'size-2.5 rounded-full bg-transparent'} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-950">{option.label}</span>
                    <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-black text-emerald-700 ring-1 ring-emerald-100">
                      {percent}%
                    </span>
                  </span>
                </span>
                <span className="shrink-0 text-sm font-black text-slate-800">{count}명</span>
              </span>
            </button>
          );
        })}
      </div>
      <VoterListModal
        mode={modalMode}
        attendVoters={visibleVoters.attend}
        absentVoters={visibleVoters.absent}
        onClose={() => setModalMode(null)}
      />
    </>
  );
}
