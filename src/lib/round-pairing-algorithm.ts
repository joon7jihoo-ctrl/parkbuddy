import type { ParkBuddyPlayMode } from './round-game-labels';

export type ParkBuddyPairingParticipant = {
  id: string;
  name: string;
  handicap: number | null;
  averageStrokes?: number | null;
  roundsCount?: number | null;
  teamNo?: number | null;
};

type GroupState = {
  index: number;
  size: number;
  count: number;
  skillTotal: number;
  teamCounts: Record<string, number>;
};

function getSafeHandicap(value: number | null | undefined) {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

export function getParkBuddyPlayerSkillScore(participant: ParkBuddyPairingParticipant) {
  const averageStrokes = Number(participant.averageStrokes ?? NaN);
  const roundsCount = Number(participant.roundsCount ?? 0);
  const handicap = getSafeHandicap(participant.handicap);

  const averageBase = Number.isFinite(averageStrokes)
    ? Math.max(0, 120 - averageStrokes) * 10
    : Math.max(0, 80 - handicap) * 5;
  const participationBonus = Math.min(Math.max(roundsCount, 0), 30) * 4;

  return Math.round(averageBase + participationBonus);
}

function createGroups(groupSizes: number[]) {
  return groupSizes.map<GroupState>((size, index) => ({
    index,
    size,
    count: 0,
    skillTotal: 0,
    teamCounts: {},
  }));
}

function pickBalancedGroup(groups: GroupState[]) {
  return [...groups]
    .filter((group) => group.count < group.size)
    .sort((a, b) => {
      if (a.skillTotal !== b.skillTotal) {
        return a.skillTotal - b.skillTotal;
      }

      if (a.count !== b.count) {
        return a.count - b.count;
      }

      return a.index - b.index;
    })[0];
}

function pickTeamAwareGroup(groups: GroupState[], teamKey: string | null) {
  const candidates = groups.filter((group) => group.count < group.size);

  if (!candidates.length) {
    return null;
  }

  if (!teamKey) {
    return pickBalancedGroup(candidates);
  }

  return [...candidates].sort((a, b) => {
    const aTeamCount = a.teamCounts[teamKey] ?? 0;
    const bTeamCount = b.teamCounts[teamKey] ?? 0;

    if (aTeamCount !== bTeamCount) {
      return aTeamCount - bTeamCount;
    }

    if (a.skillTotal !== b.skillTotal) {
      return a.skillTotal - b.skillTotal;
    }

    if (a.count !== b.count) {
      return a.count - b.count;
    }

    return a.index - b.index;
  })[0];
}

function assignToGroup(
  assignments: Record<string, number>,
  group: GroupState | null | undefined,
  participant: ParkBuddyPairingParticipant,
) {
  if (!group) {
    return;
  }

  const skillScore = getParkBuddyPlayerSkillScore(participant);
  const teamKey = participant.teamNo ? String(participant.teamNo) : null;

  assignments[participant.id] = group.index;
  group.count += 1;
  group.skillTotal += skillScore;

  if (teamKey) {
    group.teamCounts[teamKey] = (group.teamCounts[teamKey] ?? 0) + 1;
  }
}

function hasUsefulTeamData(participants: ParkBuddyPairingParticipant[]) {
  const teamKeys = new Set(
    participants
      .map((participant) => participant.teamNo)
      .filter((teamNo): teamNo is number => typeof teamNo === 'number' && Number.isFinite(teamNo)),
  );

  return teamKeys.size >= 2;
}

export function buildParkBuddySmartAssignments(
  participants: ParkBuddyPairingParticipant[],
  groupSizes: number[],
  playMode: ParkBuddyPlayMode,
) {
  const groups = createGroups(groupSizes);
  const assignments: Record<string, number> = {};
  const sortedParticipants = [...participants].sort((a, b) => {
    const skillDifference = getParkBuddyPlayerSkillScore(b) - getParkBuddyPlayerSkillScore(a);

    if (skillDifference !== 0) {
      return skillDifference;
    }

    return a.name.localeCompare(b.name, 'ko-KR');
  });

  const shouldUseTeamBalance =
    (playMode === 'foursome' || playMode === 'fourball' || playMode === 'team_match') &&
    hasUsefulTeamData(participants);

  sortedParticipants.forEach((participant) => {
    const teamKey = participant.teamNo ? String(participant.teamNo) : null;
    const targetGroup = shouldUseTeamBalance
      ? pickTeamAwareGroup(groups, teamKey)
      : pickBalancedGroup(groups);

    assignToGroup(assignments, targetGroup, participant);
  });

  return assignments;
}

export function getParkBuddyPairingBasisMessage(
  participants: ParkBuddyPairingParticipant[],
  playMode: ParkBuddyPlayMode,
) {
  const hasTeamData = hasUsefulTeamData(participants);

  if (playMode === 'foursome' || playMode === 'fourball' || playMode === 'team_match') {
    if (hasTeamData) {
      return '팀 정보와 실력 점수를 함께 고려해 조마다 균형 있게 배치합니다.';
    }

    return '팀 정보가 부족해 평균타수와 참여횟수 기준으로 실력을 균등하게 배치합니다.';
  }

  return '평균타수와 참여횟수를 기준으로 조마다 실력이 균등하도록 배치합니다.';
}
