'use client';

import { useMemo, useState } from 'react';
import {
  getParkBuddyGameRuleDescription,
  normalizeParkBuddyPlayMode,
  normalizeParkBuddyScoringType,
  type ParkBuddyPlayMode,
  type ParkBuddyScoringType,
} from '@/lib/round-game-labels';
import {
  buildParkBuddySmartAssignments,
  getParkBuddyPairingBasisMessage,
  getParkBuddyPlayerSkillScore,
  type ParkBuddyPairingParticipant,
} from '@/lib/round-pairing-algorithm';

type PlayMode = ParkBuddyPlayMode;
type ScoringType = Exclude<ParkBuddyScoringType, 'match_play'>;

type Participant = ParkBuddyPairingParticipant;

type PairingFormProps = {
  roundId: string;
  participants: Participant[];
  defaultPlayMode?: PlayMode | string | null;
  defaultScoringType?: ScoringType | string | null;
  defaultAssignments?: Record<string, number>;
  action: (formData: FormData) => void | Promise<void>;
};

const PLAY_MODE_OPTIONS: Array<{ value: PlayMode; label: string }> = [
  { value: 'individual', label: '개인전' },
  { value: 'foursome', label: '포섬' },
  { value: 'fourball', label: '포볼' },
  { value: 'scramble', label: '스크램블' },
  { value: 'team_match', label: '청백전' },
];

const SCORING_OPTIONS_BY_PLAY_MODE: Record<
  PlayMode,
  Array<{ value: ScoringType; label: string }>
> = {
  individual: [
    { value: 'stroke', label: '스트로크' },
    { value: 'new_peoria', label: '신페리오' },
    { value: 'match', label: '매치' },
    { value: 'stableford', label: '스테이블포드' },
  ],
  foursome: [
    { value: 'stroke', label: '스트로크' },
    { value: 'match', label: '매치' },
  ],
  fourball: [
    { value: 'stroke', label: '스트로크' },
    { value: 'match', label: '매치' },
    { value: 'stableford', label: '스테이블포드' },
  ],
  scramble: [
    { value: 'stroke', label: '스트로크' },
    { value: 'match', label: '매치' },
  ],
  team_match: [
    { value: 'stroke', label: '스트로크' },
    { value: 'new_peoria', label: '신페리오' },
    { value: 'match', label: '매치' },
  ],
};

function normalizePlayMode(value?: string | null): PlayMode {
  return normalizeParkBuddyPlayMode(value);
}

function normalizeScoringType(
  value: string | null | undefined,
  playMode: PlayMode,
): ScoringType {
  const options = SCORING_OPTIONS_BY_PLAY_MODE[playMode];
  const normalizedValue = normalizeParkBuddyScoringType(value);
  const matched = options.find((option) => option.value === normalizedValue);

  return matched?.value ?? options[0]?.value ?? 'stroke';
}

function getRecommendedGroupSizes(totalParticipants: number) {
  if (totalParticipants < 3 || totalParticipants === 5) {
    return [];
  }

  const sizes: number[] = [];
  let remaining = totalParticipants;

  while (remaining > 0) {
    if (remaining === 6) {
      sizes.push(3, 3);
      remaining = 0;
    } else if (remaining === 7) {
      sizes.push(4, 3);
      remaining = 0;
    } else if (remaining === 3 || remaining === 4) {
      sizes.push(remaining);
      remaining = 0;
    } else {
      sizes.push(4);
      remaining -= 4;
    }
  }

  return sizes;
}

function getRecommendedGameSettings(totalParticipants: number): {
  playMode: PlayMode;
  scoringType: ScoringType;
  message: string;
} {
  if (totalParticipants >= 8 && totalParticipants % 2 === 0) {
    return {
      playMode: 'team_match',
      scoringType: 'match',
      message: '청백전 매치를 추천합니다. 팀 대항 방식으로 분위기를 살리기 좋습니다.',
    };
  }

  if (totalParticipants >= 6) {
    return {
      playMode: 'scramble',
      scoringType: 'stroke',
      message: '스크램블 스트로크를 추천합니다. 실력 차이가 있어도 함께 즐기기 좋습니다.',
    };
  }

  return {
    playMode: 'individual',
    scoringType: 'new_peoria',
    message: '개인전 신페리오를 추천합니다. 핸디캡 보정으로 재미를 살릴 수 있습니다.',
  };
}

function getRecommendation(totalParticipants: number) {
  if (totalParticipants < 3) {
    return '참가자가 최소 3명 이상이어야 조 편성이 가능합니다.';
  }

  if (totalParticipants === 5) {
    return '5명은 3명 이상 4명 이하 조로 나누기 어려워 참가자 추가 또는 제외가 필요합니다.';
  }

  return getRecommendedGameSettings(totalParticipants).message;
}

function getSavedAssignmentCounts(
  participants: Participant[],
  assignments?: Record<string, number>,
) {
  return participants.reduce<Record<number, number>>((acc, participant) => {
    const groupIndex = assignments?.[participant.id];

    if (typeof groupIndex !== 'number' || !Number.isFinite(groupIndex) || groupIndex < 0) {
      return acc;
    }

    acc[groupIndex] = (acc[groupIndex] ?? 0) + 1;
    return acc;
  }, {});
}

function hasUsableSavedAssignments(
  participants: Participant[],
  groupSizes: number[],
  defaultAssignments?: Record<string, number>,
) {
  if (!defaultAssignments || Object.keys(defaultAssignments).length === 0) {
    return false;
  }

  if (!groupSizes.length) {
    return false;
  }

  const assignedCount = participants.filter((participant) =>
    typeof defaultAssignments[participant.id] === 'number' &&
    Number.isFinite(defaultAssignments[participant.id]),
  ).length;

  if (assignedCount !== participants.length) {
    return false;
  }

  const counts = getSavedAssignmentCounts(participants, defaultAssignments);

  return Object.entries(counts).every(([groupIndexText, count]) => {
    const groupIndex = Number(groupIndexText);
    const maxSize = groupSizes[groupIndex];
    return typeof maxSize === 'number' && count >= 3 && count <= maxSize;
  });
}

function buildInitialAssignments(
  participants: Participant[],
  groupSizes: number[],
  playMode: PlayMode,
  defaultAssignments?: Record<string, number>,
) {
  if (hasUsableSavedAssignments(participants, groupSizes, defaultAssignments)) {
    return participants.reduce<Record<string, number>>((acc, participant) => {
      acc[participant.id] = defaultAssignments?.[participant.id] ?? 0;
      return acc;
    }, {});
  }

  return buildParkBuddySmartAssignments(participants, groupSizes, playMode);
}

function formatAverage(value?: number | null) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '평균 -';
  }

  return `평균 ${Math.round(value)}`;
}

export function RoundPairingForm({
  roundId,
  participants,
  defaultPlayMode = null,
  defaultScoringType = null,
  defaultAssignments,
  action,
}: PairingFormProps) {
  const groupSizes = useMemo(
    () => getRecommendedGroupSizes(participants.length),
    [participants.length],
  );

  const hasSavedAssignments = hasUsableSavedAssignments(
    participants,
    groupSizes,
    defaultAssignments,
  );
  const recommendedSettings = getRecommendedGameSettings(participants.length);

  const initialPlayMode = hasSavedAssignments
    ? normalizePlayMode(defaultPlayMode)
    : recommendedSettings.playMode;
  const initialScoringType = hasSavedAssignments
    ? normalizeScoringType(defaultScoringType, initialPlayMode)
    : recommendedSettings.scoringType;

  const [playMode, setPlayMode] = useState<PlayMode>(initialPlayMode);
  const [scoringType, setScoringType] =
    useState<ScoringType>(initialScoringType);
  const [assignments, setAssignments] = useState<Record<string, number>>(() =>
    buildInitialAssignments(participants, groupSizes, initialPlayMode, defaultAssignments),
  );

  const scoringOptions =
    SCORING_OPTIONS_BY_PLAY_MODE[playMode] ?? SCORING_OPTIONS_BY_PLAY_MODE.individual;

  const groupIndexes = groupSizes.map((_, index) => index);
  const recommendation = getRecommendation(participants.length);
  const canSave = groupSizes.length > 0;
  const pairingBasisMessage = groupSizes.length <= 1
    ? '현재 참가 인원은 한 조 편성이 적절합니다.'
    : getParkBuddyPairingBasisMessage(participants, playMode);
  const gameRuleDescription = getParkBuddyGameRuleDescription(playMode, scoringType);

  function applySmartAssignments(nextPlayMode = playMode) {
    setAssignments(buildParkBuddySmartAssignments(participants, groupSizes, nextPlayMode));
  }

  function handleScoringTypeChange(nextValue: string) {
    setScoringType(normalizeScoringType(nextValue, playMode));
    applySmartAssignments(playMode);
  }

  function handlePlayModeChange(nextValue: string) {
    const nextPlayMode = normalizePlayMode(nextValue);
    const nextOptions =
      SCORING_OPTIONS_BY_PLAY_MODE[nextPlayMode] ?? SCORING_OPTIONS_BY_PLAY_MODE.individual;
    const firstOption = nextOptions[0];

    setPlayMode(nextPlayMode);

    if (!nextOptions.some((option) => option.value === scoringType) && firstOption) {
      setScoringType(firstOption.value);
    }

    applySmartAssignments(nextPlayMode);
  }

  const groupCounts = groupIndexes.map(
    (groupIndex) =>
      Object.values(assignments).filter((assignment) => assignment === groupIndex).length,
  );

  return (
    <form action={action} className="space-y-4 pb-24 sm:pb-0">
      <input type="hidden" name="roundId" value={roundId} />
      <input type="hidden" name="playMode" value={playMode} />
      <input type="hidden" name="scoringType" value={scoringType} />
      <input
        type="hidden"
        name="assignments"
        value={JSON.stringify(assignments)}
      />

      <section className="rounded-3xl bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-900">추천 조합</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              참가자 {participants.length}명 기준: {recommendation}
            </p>
          </div>
          {groupSizes.length > 0 && (
            <div className="shrink-0 rounded-2xl bg-emerald-50 px-3 py-2 text-right text-xs font-bold text-emerald-800">
              {groupSizes.length}개 조
            </div>
          )}
        </div>

        {groupSizes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-700">
            {groupSizes.map((size, index) => (
              <span key={`${index}-${size}`} className="rounded-full bg-slate-100 px-3 py-1">
                {index + 1}조 {size}명
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl bg-white p-4 shadow-sm sm:p-5">
        <h2 className="font-bold text-slate-900">경기 방식</h2>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2">
            <span className="shrink-0 text-sm font-bold text-slate-700">경기 형태</span>
            <select
              value={playMode}
              onChange={(event) => handlePlayModeChange(event.target.value)}
              className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {PLAY_MODE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2">
            <span className="shrink-0 text-sm font-bold text-slate-700">점수 계산</span>
            <select
              value={scoringType}
              onChange={(event) => handleScoringTypeChange(event.target.value)}
              className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {scoringOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-3 rounded-2xl bg-emerald-50 px-3 py-2 text-sm leading-6 text-emerald-900">
          {gameRuleDescription}
        </p>
      </section>

      <section className="rounded-3xl bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-900">조 편성</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {pairingBasisMessage} 필요하면 회원별 조를 직접 바꿀 수 있습니다.
            </p>
          </div>
          <button
            type="button"
            disabled={!groupIndexes.length}
            onClick={() => applySmartAssignments()}
            className="shrink-0 rounded-2xl bg-slate-900 px-3 py-2 text-xs font-bold text-white disabled:bg-slate-300"
          >
            자동 편성
          </button>
        </div>

        {groupIndexes.length ? (
          <>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-700">
              {groupIndexes.map((groupIndex) => (
                <span key={groupIndex} className="rounded-full bg-slate-100 px-3 py-1">
                  {groupIndex + 1}조 {groupCounts[groupIndex] ?? 0}명
                </span>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-6 xl:grid-cols-9">
              {participants.map((participant) => (
                <label
                  key={participant.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-2"
                >
                  <span className="block truncate text-xs font-black text-slate-900">
                    {participant.name}
                  </span>

                  <select
                    value={assignments[participant.id] ?? 0}
                    onChange={(event) => {
                      const nextGroupIndex = Number(event.target.value);
                      setAssignments((current) => ({
                        ...current,
                        [participant.id]: nextGroupIndex,
                      }));
                    }}
                    className="mt-1 h-8 w-full rounded-xl border border-slate-200 bg-white px-2 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    {groupIndexes.map((groupIndex) => (
                      <option key={groupIndex} value={groupIndex}>
                        {groupIndex + 1}조
                      </option>
                    ))}
                  </select>

                  <span className="mt-1 block truncate text-[11px] font-medium text-slate-500">
                    {formatAverage(participant.averageStrokes)} · {participant.roundsCount ?? 0}회
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-slate-400">
                    실력 {getParkBuddyPlayerSkillScore(participant)}
                  </span>
                </label>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
            현재 참가 인원으로는 조 편성이 어렵습니다. 참가자를 조정해 주세요.
          </div>
        )}
      </section>

      <div className="sticky bottom-24 z-20 mx-auto w-full max-w-2xl rounded-3xl border border-white/70 bg-white/95 p-2 shadow-xl backdrop-blur sm:static sm:max-w-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none">
        <button
          type="submit"
          disabled={!canSave}
          className="h-12 w-full rounded-2xl bg-emerald-600 px-4 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          조 편성 저장 · 참가 {participants.length}명
        </button>
      </div>
    </form>
  );
}
