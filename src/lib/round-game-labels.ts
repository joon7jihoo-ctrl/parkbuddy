export type ParkBuddyPlayMode =
  | 'individual'
  | 'foursome'
  | 'fourball'
  | 'scramble'
  | 'team_match';

export type ParkBuddyScoringType =
  | 'stroke'
  | 'new_peoria'
  | 'match'
  | 'match_play'
  | 'stableford';

export function normalizeParkBuddyPlayMode(value?: string | null): ParkBuddyPlayMode {
  if (
    value === 'individual' ||
    value === 'foursome' ||
    value === 'fourball' ||
    value === 'scramble' ||
    value === 'team_match'
  ) {
    return value;
  }

  if (value === 'team') {
    return 'team_match';
  }

  return 'individual';
}

export function normalizeParkBuddyScoringType(value?: string | null): ParkBuddyScoringType {
  if (value === 'match_play') {
    return 'match';
  }

  if (
    value === 'stroke' ||
    value === 'new_peoria' ||
    value === 'match' ||
    value === 'stableford'
  ) {
    return value;
  }

  return 'stroke';
}

export function getParkBuddyPlayModeLabel(value?: string | null) {
  switch (normalizeParkBuddyPlayMode(value)) {
    case 'individual':
      return '개인전';
    case 'foursome':
      return '포섬';
    case 'fourball':
      return '포볼';
    case 'scramble':
      return '스크램블';
    case 'team_match':
      return '청백전';
    default:
      return '개인전';
  }
}

export function getParkBuddyScoringTypeLabel(value?: string | null) {
  switch (normalizeParkBuddyScoringType(value)) {
    case 'stroke':
      return '스트로크';
    case 'new_peoria':
      return '신페리오';
    case 'match':
    case 'match_play':
      return '매치';
    case 'stableford':
      return '스테이블포드';
    default:
      return '스트로크';
  }
}

export function getParkBuddyGameMethodLabel(
  playMode?: string | null,
  scoringType?: string | null,
) {
  return `${getParkBuddyPlayModeLabel(playMode)} ${getParkBuddyScoringTypeLabel(scoringType)}`;
}

export function getParkBuddyGameRuleDescription(
  playMode?: string | null,
  scoringType?: string | null,
) {
  const normalizedPlayMode = normalizeParkBuddyPlayMode(playMode);
  const normalizedScoringType = normalizeParkBuddyScoringType(scoringType);

  if (normalizedPlayMode === 'foursome') {
    if (normalizedScoringType === 'match') {
      return '두 명이 한 팀으로 하나의 공을 번갈아 치며, 홀별 승패를 비교합니다.';
    }

    return '두 명이 한 팀으로 하나의 공을 번갈아 치며, 팀 전체 타수를 계산합니다.';
  }

  if (normalizedPlayMode === 'fourball') {
    if (normalizedScoringType === 'stableford') {
      return '두 명이 각자 플레이하고 더 좋은 기록을 기준으로 점수를 계산합니다.';
    }

    if (normalizedScoringType === 'match') {
      return '두 명이 각자 플레이하고 팀의 좋은 기록으로 홀별 승패를 비교합니다.';
    }

    return '두 명이 각자 플레이하고 팀에서 더 좋은 기록을 반영합니다.';
  }

  if (normalizedPlayMode === 'scramble') {
    if (normalizedScoringType === 'match') {
      return '조별로 좋은 위치를 골라 이어 치며, 홀별 승패를 비교합니다.';
    }

    return '조별로 좋은 위치를 골라 이어 치며, 조 전체 타수를 계산합니다.';
  }

  if (normalizedPlayMode === 'team_match') {
    if (normalizedScoringType === 'new_peoria') {
      return '청팀과 백팀으로 나누고, 신페리오 보정 결과를 팀 단위로 비교합니다.';
    }

    if (normalizedScoringType === 'match') {
      return '청팀과 백팀으로 나누고, 각 조의 홀별 승패를 팀 점수로 합산합니다.';
    }

    return '청팀과 백팀으로 나누고, 팀별 전체 결과를 비교합니다.';
  }

  if (normalizedScoringType === 'new_peoria') {
    return '각자 플레이하며, 숨겨진 홀 기준으로 핸디캡을 보정해 순위를 계산합니다.';
  }

  if (normalizedScoringType === 'match') {
    return '각자 플레이하며, 홀마다 승패를 비교해 결과를 계산합니다.';
  }

  if (normalizedScoringType === 'stableford') {
    return '각자 플레이하며, 홀별 점수를 합산해 순위를 계산합니다.';
  }

  return '각자 플레이하며, 전체 타수를 기준으로 순위를 계산합니다.';
}
