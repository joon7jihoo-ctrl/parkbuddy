"use client";

import { useMemo, useState } from 'react';
import { saveRoundScoresAction } from '@/app/(app)/admin/rounds/[id]/scores/actions';

type ScoreParticipant = {
  memberId: string;
  name: string;
  handicap: number | null;
  strokes: number | null;
  stablefordPoints: number | null;
  memo: string | null;
};

type RoundScoreInputFormProps = {
  roundId: string;
  participants: ScoreParticipant[];
};

type ScoreDraft = {
  strokes: string;
  stablefordPoints: string;
  memo: string;
};

function hasScore(draft: ScoreDraft) {
  return draft.strokes.trim() !== '' || draft.stablefordPoints.trim() !== '';
}

export function RoundScoreInputForm({ roundId, participants }: RoundScoreInputFormProps) {
  const [drafts, setDrafts] = useState<Record<string, ScoreDraft>>(() =>
    participants.reduce<Record<string, ScoreDraft>>((acc, participant) => {
      acc[participant.memberId] = {
        strokes: participant.strokes == null ? '' : String(participant.strokes),
        stablefordPoints:
          participant.stablefordPoints == null ? '' : String(participant.stablefordPoints),
        memo: participant.memo ?? '',
      };
      return acc;
    }, {}),
  );

  const completedScoreCount = useMemo(
    () => participants.filter((participant) => hasScore(drafts[participant.memberId] ?? { strokes: '', stablefordPoints: '', memo: '' })).length,
    [drafts, participants],
  );
  const missingScoreCount = Math.max(participants.length - completedScoreCount, 0);
  const completionRate = participants.length
    ? Math.round((completedScoreCount / participants.length) * 100)
    : 0;

  function updateDraft(memberId: string, field: keyof ScoreDraft, value: string) {
    setDrafts((current) => ({
      ...current,
      [memberId]: {
        ...(current[memberId] ?? { strokes: '', stablefordPoints: '', memo: '' }),
        [field]: value,
      },
    }));
  }

  return (
    <form action={saveRoundScoresAction} className="space-y-4 pb-24 sm:pb-0">
      <input type="hidden" name="roundId" value={roundId} />

      <section data-score-result-input-ux className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-4">
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">입력 진행률</p>
              <p className="mt-1 text-lg font-black text-slate-900">
                {completedScoreCount}/{participants.length}명 완료
              </p>
            </div>
            <div className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-black text-white">
              {completionRate}%
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-emerald-500 transition-all duration-200" style={{ width: `${completionRate}%` }} />
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            입력 중에도 완료율이 바로 반영됩니다. 모바일에서는 미입력 카드를 먼저 채우면 스크롤을 줄일 수 있습니다.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center sm:min-w-48">
          <div className="rounded-2xl bg-emerald-50 px-3 py-2">
            <p className="text-[11px] font-medium text-emerald-700">완료</p>
            <p className="mt-1 text-lg font-black text-emerald-900">{completedScoreCount}명</p>
          </div>
          <div className="rounded-2xl bg-amber-50 px-3 py-2">
            <p className="text-[11px] font-medium text-amber-700">미입력</p>
            <p className="mt-1 text-lg font-black text-amber-900">{missingScoreCount}명</p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3 sm:px-5 sm:py-4">
          <h2 className="font-bold text-slate-900">참가자 스코어 {participants.length}명</h2>
          <p className="mt-1 text-sm text-slate-500">
            우선 총 타수와 스테이블포드 포인트를 저장합니다. 입력하면 완료율과 저장 버튼 문구가 즉시 바뀝니다.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {participants.length ? (
            participants.map((participant) => {
              const draft = drafts[participant.memberId] ?? { strokes: '', stablefordPoints: '', memo: '' };
              const hasAnyScore = hasScore(draft);

              return (
                <article key={participant.memberId} className={`${hasAnyScore ? 'border-emerald-100 bg-emerald-50/30' : 'border-amber-100 bg-amber-50/30'} grid grid-cols-2 gap-3 rounded-3xl border px-4 py-3 sm:px-5 sm:py-4 md:grid-cols-[minmax(140px,1fr)_130px_160px_minmax(160px,1fr)] md:items-end`}>
                  <input type="hidden" name="memberId" value={participant.memberId} />

                  <div className="col-span-2 md:col-span-1">
                    <p className="font-bold text-slate-900">{participant.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <span>핸디캡 {participant.handicap ?? 0}</span>
                      <span className={hasAnyScore ? 'rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700' : 'rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700'}>
                        {hasAnyScore ? '입력 완료' : '미입력'}
                      </span>
                    </div>
                  </div>

                  <label className="block">
                    <span className="text-xs font-medium text-slate-500">총 타수</span>
                    <input
                      name={`strokes:${participant.memberId}`}
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={200}
                      value={draft.strokes}
                      onChange={(event) => updateDraft(participant.memberId, 'strokes', event.target.value)}
                      className="mt-1 h-12 w-full rounded-2xl border border-slate-200 px-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-medium text-slate-500">스테이블포드 포인트</span>
                    <input
                      name={`stablefordPoints:${participant.memberId}`}
                      type="number"
                      inputMode="numeric"
                      min={-20}
                      max={100}
                      value={draft.stablefordPoints}
                      onChange={(event) => updateDraft(participant.memberId, 'stablefordPoints', event.target.value)}
                      className="mt-1 h-12 w-full rounded-2xl border border-slate-200 px-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-medium text-slate-500">메모</span>
                    <input
                      name={`memo:${participant.memberId}`}
                      type="text"
                      value={draft.memo}
                      onChange={(event) => updateDraft(participant.memberId, 'memo', event.target.value)}
                      className="mt-1 h-12 w-full rounded-2xl border border-slate-200 px-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>
                </article>
              );
            })
          ) : (
            <div className="px-5 py-12 text-center">
              <p className="text-sm font-semibold text-slate-700">아직 참가자가 없습니다.</p>
              <p className="mt-1 text-sm text-slate-500">참가자를 먼저 선택한 뒤 스코어를 입력하세요.</p>
            </div>
          )}
        </div>
      </section>

      <div className="sticky bottom-24 z-20 mx-auto w-full max-w-2xl rounded-3xl border border-white/70 bg-white/95 p-2 shadow-xl backdrop-blur sm:static sm:max-w-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none">
        <button
          type="submit"
          disabled={!participants.length}
          className="h-12 w-full rounded-2xl bg-emerald-600 px-4 font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          스코어 저장 · 완료 {completedScoreCount}/{participants.length}
        </button>
      </div>
    </form>
  );
}
