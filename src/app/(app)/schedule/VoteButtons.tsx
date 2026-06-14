'use client';

import { useTransition } from 'react';
import { voteEvent } from '@/server/actions/votes';

type VoteStatus = 'attend' | 'absent' | 'maybe';

type VoteButtonsProps = {
  eventId: string;
  currentStatus: VoteStatus | null;
};

const OPTIONS: Array<{ status: VoteStatus; label: string; selectedClassName: string; idleClassName: string }> = [
  {
    status: 'attend',
    label: '참석',
    selectedClassName: 'border-emerald-600 bg-emerald-600 text-white shadow-sm',
    idleClassName: 'border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
  },
  {
    status: 'maybe',
    label: '미정',
    selectedClassName: 'border-amber-500 bg-amber-500 text-white shadow-sm',
    idleClassName: 'border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-100',
  },
  {
    status: 'absent',
    label: '불참',
    selectedClassName: 'border-slate-500 bg-slate-600 text-white shadow-sm',
    idleClassName: 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100',
  },
];

export function VoteButtons({ eventId, currentStatus }: VoteButtonsProps) {
  const [isPending, startTransition] = useTransition();

  const handleVote = (status: VoteStatus) => {
    startTransition(async () => {
      await voteEvent({ eventId, status });
    });
  };

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-semibold text-slate-500">내 참석 선택</p>
      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map((option) => {
          const isSelected = currentStatus === option.status;

          return (
            <button
              key={option.status}
              type="button"
              disabled={isPending}
              onClick={() => handleVote(option.status)}
              className={
                'min-h-11 rounded-2xl border px-2 text-sm font-bold transition disabled:opacity-50 ' +
                (isSelected ? option.selectedClassName : option.idleClassName)
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
