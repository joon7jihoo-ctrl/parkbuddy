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
  playDateLabel: string;
};

type ScoreDraft = {
  strokes: string;
  stablefordPoints: string;
  memo: string;
};

function getEmptyDraft(): ScoreDraft {
  return { strokes: '', stablefordPoints: '', memo: '' };
}

function hasScore(draft: ScoreDraft) {
  return draft.strokes.trim() !== '' || draft.stablefordPoints.trim() !== '';
}

function HiddenScoreInputs({ participant, draft }: { participant: ScoreParticipant; draft: ScoreDraft }) {
  return (
    <div className="hidden" aria-hidden="true">
      <input type="hidden" name="memberId" value={participant.memberId} />
      <input type="hidden" name={`strokes:${participant.memberId}`} value={draft.strokes} />
      <input type="hidden" name={`stablefordPoints:${participant.memberId}`} value={draft.stablefordPoints} />
      <input type="hidden" name={`memo:${participant.memberId}`} value={draft.memo} />
    </div>
  );
}

export function RoundScoreInputForm({ roundId, participants, playDateLabel }: RoundScoreInputFormProps) {
  const [showMissingOnly, setShowMissingOnly] = useState(false);
  const [activeEditingMemberId, setActiveEditingMemberId] = useState<string | null>(null);
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
    () => participants.filter((participant) => hasScore(drafts[participant.memberId] ?? getEmptyDraft())).length,
    [drafts, participants],
  );
  const visibleParticipants = useMemo(
    () =>
      showMissingOnly
        ? participants.filter((participant) => {
            const isMissing = !hasScore(drafts[participant.memberId] ?? getEmptyDraft());
            return isMissing || participant.memberId === activeEditingMemberId;
          })
        : participants,
    [activeEditingMemberId, drafts, participants, showMissingOnly],
  );

  const hiddenParticipants = useMemo(
    () =>
      showMissingOnly
        ? participants.filter((participant) =>
            participant.memberId !== activeEditingMemberId &&
            hasScore(drafts[participant.memberId] ?? getEmptyDraft()),
          )
        : [],
    [activeEditingMemberId, drafts, participants, showMissingOnly],
  );

  function updateDraft(memberId: string, field: keyof ScoreDraft, value: string) {
    setDrafts((current) => ({
      ...current,
      [memberId]: {
        ...(current[memberId] ?? getEmptyDraft()),
        [field]: value,
      },
    }));
  }

  return (
    <form action={saveRoundScoresAction} className="space-y-3 pb-24 sm:space-y-4 sm:pb-0">
      <input type="hidden" name="roundId" value={roundId} />

      <section data-round-detail-mobile-summary className="sticky top-2 z-20 rounded-3xl border border-white/80 bg-white/95 p-2 text-center shadow-sm backdrop-blur md:static md:border-0 md:bg-white md:p-3 md:backdrop-blur-none">
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 sm:grid-cols-4 sm:items-stretch">
          <div className="rounded-2xl bg-slate-50 px-2 py-2.5 sm:py-3">
            <p className="text-xs font-bold text-slate-500">일자</p>
            <p className="mt-1 truncate text-base font-black text-slate-900 sm:text-lg">{playDateLabel}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-2 py-2.5 sm:py-3">
            <p className="text-xs font-bold text-slate-500">참가</p>
            <p className="mt-1 text-base font-black text-slate-900 sm:text-lg">{participants.length}명</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-2 py-2.5 sm:py-3">
            <p className="text-xs font-bold text-emerald-700">입력</p>
            <p className="mt-1 text-base font-black text-emerald-900 sm:text-lg">{completedScoreCount}명</p>
          </div>
          <button
            type="button"
            onClick={() => setShowMissingOnly((current) => !current)}
            disabled={!participants.length}
            aria-pressed={showMissingOnly}
            className={[
              'col-span-3 min-h-11 rounded-2xl px-4 text-sm font-bold shadow-sm transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:col-span-1 sm:h-full sm:w-full sm:min-w-0',
              showMissingOnly
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
            ].join(' ')}
          >
            {showMissingOnly ? '전체 보기' : '미입력만 보기'}
          </button>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-3 shadow-sm sm:p-4">

        {hiddenParticipants.map((participant) => (
          <HiddenScoreInputs
            key={`hidden-${participant.memberId}`}
            participant={participant}
            draft={drafts[participant.memberId] ?? getEmptyDraft()}
          />
        ))}

        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {visibleParticipants.length ? (
            visibleParticipants.map((participant) => {
              const draft = drafts[participant.memberId] ?? getEmptyDraft();
              const hasAnyScore = hasScore(draft);

              return (
                <article key={participant.memberId} className={`${hasAnyScore ? 'border-emerald-100 bg-emerald-50/30' : 'border-amber-100 bg-amber-50/30'} grid grid-cols-[minmax(78px,0.9fr)_minmax(62px,0.62fr)_minmax(128px,1.38fr)] items-end gap-2 rounded-3xl border px-3 py-3 sm:grid-cols-[minmax(88px,0.9fr)_minmax(68px,0.62fr)_minmax(142px,1.42fr)] sm:gap-3 sm:px-5 sm:py-4`}>
                  <input type="hidden" name="memberId" value={participant.memberId} />
                  <input type="hidden" name={`memo:${participant.memberId}`} value={draft.memo} />

                  <div className="min-w-0 self-center">
                    <p className="truncate font-bold text-slate-900">{participant.name}</p>
                    <div className="mt-1 space-y-1 text-sm text-slate-500">
                      <p>핸디캡 {participant.handicap ?? 0}</p>
                      <span className={hasAnyScore ? 'inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700' : 'inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700'}>
                        {hasAnyScore ? '입력 완료' : '미입력'}
                      </span>
                    </div>
                  </div>

                  <label className="block min-w-0">
                    <span className="block whitespace-nowrap text-[11px] font-medium text-slate-500 sm:text-xs">총 타수</span>
                    <input
                      name={`strokes:${participant.memberId}`}
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={200}
                      value={draft.strokes}
                      onChange={(event) => updateDraft(participant.memberId, 'strokes', event.target.value)}
                      onFocus={() => setActiveEditingMemberId(participant.memberId)}
                      onBlur={() => setActiveEditingMemberId((current) => current === participant.memberId ? null : current)}
                      className="mt-1 h-12 w-full min-w-0 rounded-2xl border border-slate-200 px-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>

                  <label className="block min-w-0">
                    <span className="block whitespace-nowrap text-[10px] font-medium text-slate-500 sm:text-[11px]">스테이블포드 포인트</span>
                    <input
                      name={`stablefordPoints:${participant.memberId}`}
                      type="number"
                      inputMode="numeric"
                      min={-20}
                      max={100}
                      value={draft.stablefordPoints}
                      onChange={(event) => updateDraft(participant.memberId, 'stablefordPoints', event.target.value)}
                      onFocus={() => setActiveEditingMemberId(participant.memberId)}
                      onBlur={() => setActiveEditingMemberId((current) => current === participant.memberId ? null : current)}
                      className="mt-1 h-12 w-full min-w-0 rounded-2xl border border-slate-200 px-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>
                </article>
              );
            })
          ) : participants.length ? (
            <div className="rounded-3xl border border-slate-100 px-5 py-12 text-center md:col-span-2 2xl:col-span-3">
              <p className="text-sm font-semibold text-slate-700">모든 참가자의 스코어가 입력되었습니다.</p>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-100 px-5 py-12 text-center md:col-span-2 2xl:col-span-3">
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
