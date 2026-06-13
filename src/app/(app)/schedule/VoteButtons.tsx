'use client';

import { useTransition } from 'react';
import { voteEvent } from '@/server/actions/votes';

export function VoteButtons({ eventId }: { eventId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleVote = (status: 'attend' | 'absent' | 'maybe') => {
    startTransition(async () => {
      await voteEvent({ eventId, status });
    });
  };

  return (
    <div className="mt-5 grid grid-cols-3 gap-2">
      <button disabled={isPending} onClick={() => handleVote('attend')} className="h-12 rounded-2xl bg-emerald-600 font-bold text-white disabled:opacity-50">참석</button>
      <button disabled={isPending} onClick={() => handleVote('maybe')} className="h-12 rounded-2xl bg-amber-100 font-bold text-amber-700 disabled:opacity-50">미정</button>
      <button disabled={isPending} onClick={() => handleVote('absent')} className="h-12 rounded-2xl bg-slate-100 font-bold text-slate-700 disabled:opacity-50">불참</button>
    </div>
  );
}
