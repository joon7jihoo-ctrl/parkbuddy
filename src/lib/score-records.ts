export type ScoreRoundInfo = {
  id: string;
  title: string | null;
  course_name: string | null;
  play_date: string | null;
  played_on: string | null;
  holes: number | null;
  deleted_at: string | null;
  club_id: string | null;
};

export type RawRoundScoreRow = {
  round_id: string;
  member_id: string;
  strokes: number | null;
  stableford_points: number | null;
  memo: string | null;
  updated_at: string | null;
  round: ScoreRoundInfo | ScoreRoundInfo[] | null;
};

export type OfficialScoreRecord = {
  round_id: string;
  member_id: string;
  title: string;
  course_name: string | null;
  play_date: string | null;
  holes: number | null;
  total_strokes: number | null;
  stableford_points: number | null;
  memo: string | null;
  updated_at: string | null;
};

export type OfficialScoreStats = {
  rounds_count: number;
  avg_score: number | null;
  best_score: number | null;
};

function firstRound(round: ScoreRoundInfo | ScoreRoundInfo[] | null): ScoreRoundInfo | null {
  if (Array.isArray(round)) {
    return round[0] ?? null;
  }

  return round;
}

export function getOfficialScoreDate(record: Pick<OfficialScoreRecord, 'play_date' | 'updated_at'>) {
  return record.play_date ?? record.updated_at ?? '';
}

function compareRecordDateDesc(left: OfficialScoreRecord, right: OfficialScoreRecord) {
  const leftTime = Date.parse(getOfficialScoreDate(left));
  const rightTime = Date.parse(getOfficialScoreDate(right));

  if (Number.isNaN(leftTime) && Number.isNaN(rightTime)) return 0;
  if (Number.isNaN(leftTime)) return 1;
  if (Number.isNaN(rightTime)) return -1;

  return rightTime - leftTime;
}

function compareRecordDateAsc(left: OfficialScoreRecord, right: OfficialScoreRecord) {
  return compareRecordDateDesc(right, left);
}

export function normalizeOfficialScoreRecords(rows: RawRoundScoreRow[] | null | undefined, clubId?: string) {
  return (rows ?? [])
    .map((row): OfficialScoreRecord | null => {
      const round = firstRound(row.round);

      if (!round || round.deleted_at) {
        return null;
      }

      if (clubId && round.club_id !== clubId) {
        return null;
      }

      if (typeof row.strokes !== 'number' && typeof row.stableford_points !== 'number') {
        return null;
      }

      return {
        round_id: row.round_id,
        member_id: row.member_id,
        title: round.title ?? '라운딩',
        course_name: round.course_name,
        play_date: round.play_date ?? round.played_on,
        holes: round.holes,
        total_strokes: row.strokes,
        stableford_points: row.stableford_points,
        memo: row.memo,
        updated_at: row.updated_at,
      };
    })
    .filter((record): record is OfficialScoreRecord => record !== null)
    .sort(compareRecordDateDesc);
}

export function getOfficialScoredRecords(records: OfficialScoreRecord[]) {
  return records.filter((record) => typeof record.total_strokes === 'number');
}

export function buildOfficialScoreStats(records: OfficialScoreRecord[]): OfficialScoreStats {
  const scoredRecords = getOfficialScoredRecords(records);

  if (!scoredRecords.length) {
    return {
      rounds_count: 0,
      avg_score: null,
      best_score: null,
    };
  }

  const totalScore = scoredRecords.reduce((sum, record) => sum + (record.total_strokes ?? 0), 0);
  const bestScore = Math.min(...scoredRecords.map((record) => record.total_strokes ?? Number.POSITIVE_INFINITY));

  return {
    rounds_count: scoredRecords.length,
    avg_score: Math.round((totalScore / scoredRecords.length) * 10) / 10,
    best_score: Number.isFinite(bestScore) ? bestScore : null,
  };
}

export function buildOfficialScoreStatsByMember(records: OfficialScoreRecord[]) {
  const grouped = new Map<string, OfficialScoreRecord[]>();

  for (const record of records) {
    const current = grouped.get(record.member_id) ?? [];
    current.push(record);
    grouped.set(record.member_id, current);
  }

  return new Map(Array.from(grouped.entries()).map(([memberId, memberRecords]) => [memberId, buildOfficialScoreStats(memberRecords)]));
}

export function getOfficialScoreTrend(records: OfficialScoreRecord[], limit = 20) {
  return getOfficialScoredRecords(records)
    .slice()
    .sort(compareRecordDateAsc)
    .slice(-limit)
    .map((record) => ({
      played_on: getOfficialScoreDate(record),
      total_strokes: record.total_strokes ?? 0,
    }));
}
