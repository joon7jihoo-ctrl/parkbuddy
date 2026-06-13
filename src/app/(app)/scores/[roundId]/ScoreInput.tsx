'use client';

import { useMemo, useState } from 'react';
import { saveScore } from '@/server/actions/scores';
import { SubmitButton } from '@/components/SubmitButton';

type HoleScore = {
  hole_no: number;
  par: number;
  strokes: number;
};

export function ScoreInput({
  roundId,
  members,
  holes,
  defaultMemberId,
  canSelectMember,
}: {
  roundId: string;
  members: { id: string; name: string }[];
  holes: number;
  defaultMemberId: string;
  canSelectMember: boolean;
}) {
  const [scores, setScores] = useState<HoleScore[]>(
    Array.from({ length: holes }, (_, index) => ({ hole_no: index + 1, par: 3, strokes: 3 }))
  );

  const total = useMemo(() => scores.reduce((sum, score) => sum + score.strokes, 0), [scores]);

  const updateStrokes = (holeNo: number, strokes: number) => {
    const safeValue = Number.isFinite(strokes) ? Math.min(20, Math.max(1, strokes)) : 3;
    setScores((prev) => prev.map((score) => (score.hole_no === holeNo ? { ...score, strokes: safeValue } : score)));
  };

  return (
    <form action={saveScore} className="space-y-5">
      <input type="hidden" name="roundId" value={roundId} />
      <input type="hidden" name="scores" value={JSON.stringify(scores)} />

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700">
          대상 회원
          <select
            name="memberId"
            defaultValue={defaultMemberId}
            disabled={!canSelectMember}
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
          >
            {members.map((member) => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900">홀별 스코어</h2>
          <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-emerald-700">합계 <strong>{total}</strong></div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {scores.map((score) => (
            <label key={score.hole_no} className="rounded-2xl border border-slate-200 p-3">
              <span className="text-sm font-semibold text-slate-600">{score.hole_no}H</span>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={20}
                value={score.strokes}
                onChange={(event) => updateStrokes(score.hole_no, Number(event.target.value))}
                className="mt-2 h-12 w-full rounded-xl bg-slate-50 text-center text-lg font-bold outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </label>
          ))}
        </div>
      </section>
      <SubmitButton label="스코어 저장" />
    </form>
  );
}
