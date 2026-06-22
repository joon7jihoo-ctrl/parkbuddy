'use client';

import { useMemo, useState } from 'react';

export type ScorecardCourseCode = 'A' | 'B' | 'C' | 'D';

type ScorecardMember = {
  id: string;
  name: string;
  position: number;
};

type ScorecardGroup = {
  id: string;
  groupNo: number;
  members: ScorecardMember[];
};

type ScorecardHoleScore = {
  round_group_id: string;
  member_id: string;
  course_code: ScorecardCourseCode;
  hole_no: number;
  distance_m: number | null;
  par: number | null;
  strokes: number | null;
};

type ScorecardTabsProps = {
  round: {
    id: string;
    title: string;
    courseName: string;
    dateLabel: string;
  };
  groups: ScorecardGroup[];
  myGroupId: string | null;
  holeScores: ScorecardHoleScore[];
};

type ActiveTab = 'summary' | ScorecardCourseCode;

const COURSE_CODES: ScorecardCourseCode[] = ['A', 'B', 'C', 'D'];
const HOLE_NUMBERS = Array.from({ length: 9 }, (_, index) => index + 1);
const TABS: { id: ActiveTab; label: string }[] = [
  { id: 'summary', label: '집계표' },
  { id: 'A', label: 'A코스' },
  { id: 'B', label: 'B코스' },
  { id: 'C', label: 'C코스' },
  { id: 'D', label: 'D코스' },
];

function getDefaultMemberOrder(group: ScorecardGroup | undefined) {
  const memberIds = group?.members.slice(0, 4).map((member) => member.id) ?? [];
  return Array.from({ length: 4 }, (_, index) => memberIds[index] ?? '');
}

function getScoreKey(groupId: string, memberId: string, courseCode: ScorecardCourseCode, holeNo: number) {
  return `${groupId}:${memberId}:${courseCode}:${holeNo}`;
}

function getMemberTotal(
  scoresByKey: Map<string, ScorecardHoleScore>,
  groupId: string,
  memberId: string,
  courseCodes: ScorecardCourseCode[],
) {
  return courseCodes.reduce((sum, courseCode) => {
    const courseTotal = HOLE_NUMBERS.reduce((courseSum, holeNo) => {
      const score = scoresByKey.get(getScoreKey(groupId, memberId, courseCode, holeNo));
      return courseSum + Number(score?.strokes ?? 0);
    }, 0);

    return sum + courseTotal;
  }, 0);
}

function getCourseTotal(
  scoresByKey: Map<string, ScorecardHoleScore>,
  groupId: string,
  memberId: string,
  courseCode: ScorecardCourseCode,
) {
  return HOLE_NUMBERS.reduce((sum, holeNo) => {
    const score = scoresByKey.get(getScoreKey(groupId, memberId, courseCode, holeNo));
    return sum + Number(score?.strokes ?? 0);
  }, 0);
}

function ScoreValue({ value }: { value: number | null | undefined }) {
  return (
    <span className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-xl bg-slate-50 px-1 text-sm font-black text-slate-900 ring-1 ring-slate-100 sm:min-h-9 sm:min-w-9">
      {typeof value === 'number' ? value : '-'}
    </span>
  );
}

function formatTotal(value: number) {
  return value || '-';
}

export function ScorecardTabs({ round, groups, myGroupId, holeScores }: ScorecardTabsProps) {
  const initialGroupId = myGroupId ?? groups[0]?.id ?? '';
  const [selectedGroupId, setSelectedGroupId] = useState(initialGroupId);
  const [activeTab, setActiveTab] = useState<ActiveTab>('summary');
  const [memberOrderByGroupId, setMemberOrderByGroupId] = useState<Record<string, string[]>>(() => {
    return groups.reduce<Record<string, string[]>>((acc, group) => {
      acc[group.id] = getDefaultMemberOrder(group);
      return acc;
    }, {});
  });

  const scoresByKey = useMemo(() => {
    return holeScores.reduce<Map<string, ScorecardHoleScore>>((acc, score) => {
      acc.set(getScoreKey(score.round_group_id, score.member_id, score.course_code, score.hole_no), score);
      return acc;
    }, new Map());
  }, [holeScores]);

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? groups[0] ?? null;
  const myGroup = myGroupId ? groups.find((group) => group.id === myGroupId) : null;

  if (!selectedGroup) {
    return (
      <section className="pb-dense-card p-5 text-center">
        <p className="text-base font-black text-slate-900">아직 조편성이 없습니다.</p>
        <p className="mt-1 text-sm font-semibold text-slate-500">조편성 후 스코어카드를 확인할 수 있습니다.</p>
      </section>
    );
  }

  const selectedMemberIds = memberOrderByGroupId[selectedGroup.id] ?? getDefaultMemberOrder(selectedGroup);
  const selectedMembers = selectedMemberIds.map((memberId) => selectedGroup.members.find((member) => member.id === memberId) ?? null);

  const updateSelectedGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
    setMemberOrderByGroupId((prev) => {
      if (prev[groupId]) return prev;
      const group = groups.find((candidate) => candidate.id === groupId);
      return { ...prev, [groupId]: getDefaultMemberOrder(group) };
    });
  };

  const updateMemberSlot = (slotIndex: number, memberId: string) => {
    setMemberOrderByGroupId((prev) => {
      const current = prev[selectedGroup.id] ?? getDefaultMemberOrder(selectedGroup);
      const next = current.map((value, index) => (index === slotIndex ? memberId : value));
      return { ...prev, [selectedGroup.id]: next };
    });
  };

  return (
    <section className="space-y-3 md:space-y-4">
      <div className="sticky top-[5.25rem] z-30 -mx-0.5 rounded-[24px] border border-slate-200 bg-white/95 p-2.5 shadow-sm backdrop-blur md:static md:mx-0 md:bg-white md:p-3 md:backdrop-blur-0">
        <div className="grid grid-cols-[0.95fr_1fr_0.82fr_1.08fr] items-stretch gap-1.5">
          <div className="min-w-0 rounded-2xl bg-slate-50 px-2 py-1.5 ring-1 ring-slate-100">
            <p className="text-[10px] font-black leading-none text-slate-400 sm:text-xs">날짜</p>
            <p className="mt-1 truncate text-[13px] font-black leading-tight text-slate-800 sm:text-sm">{round.dateLabel}</p>
          </div>
          <div className="min-w-0 rounded-2xl bg-slate-50 px-2 py-1.5 ring-1 ring-slate-100">
            <p className="text-[10px] font-black leading-none text-slate-400 sm:text-xs">장소</p>
            <p className="mt-1 truncate text-[13px] font-black leading-tight text-slate-800 sm:text-sm">{round.courseName}</p>
          </div>
          <div className="min-w-0 rounded-2xl bg-emerald-50 px-2 py-1.5 ring-1 ring-emerald-100">
            <p className="text-[10px] font-black leading-none text-emerald-500 sm:text-xs">내 조</p>
            <p className="mt-1 truncate text-[13px] font-black leading-tight text-emerald-700 sm:text-sm">
              {myGroup ? `${myGroup.groupNo}조` : '미배정'}
            </p>
          </div>
          <label className="min-w-0 rounded-2xl bg-white px-2 py-1.5 ring-1 ring-slate-200">
            <span className="block text-[10px] font-black leading-none text-slate-400 sm:text-xs">확인할 조</span>
            <select
              value={selectedGroup.id}
              onChange={(event) => updateSelectedGroup(event.target.value)}
              className="mt-1 h-7 w-full rounded-xl border-0 bg-slate-50 px-1 text-[13px] font-black leading-tight text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500 sm:h-8 sm:text-sm"
            >
              {groups.map((group) => (
                <option key={group.id} value={group.id}>{group.groupNo}조</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="sticky top-[9.65rem] z-20 -mx-0.5 rounded-[22px] border border-slate-200 bg-slate-50/95 p-1.5 shadow-sm backdrop-blur md:static md:mx-0 md:bg-slate-50 md:backdrop-blur-0">
        <div className="grid grid-cols-5 gap-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={[
                'min-h-10 rounded-2xl px-1 text-[13px] font-black transition active:scale-[0.99] sm:text-sm',
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 ring-1 ring-slate-100',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'summary' ? (
        <div className="pb-dense-card p-2.5 sm:p-3">
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full table-fixed border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="w-[16%] border-b border-slate-200 px-1 py-2 text-center font-black">구분</th>
                  {selectedMembers.map((member, index) => (
                    <th key={`${member?.id ?? 'empty'}-${index}`} className="w-[21%] border-b border-slate-200 px-0.5 py-1.5">
                      <select
                        aria-label={`${index + 1}번 회원 선택`}
                        value={selectedMemberIds[index] ?? ''}
                        onChange={(event) => updateMemberSlot(index, event.target.value)}
                        className="h-9 w-full rounded-xl border border-slate-200 bg-white px-1 text-center text-xs font-black text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500 sm:text-sm"
                      >
                        <option value="">{index + 1}번</option>
                        {selectedGroup.members.map((candidate) => (
                          <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
                        ))}
                      </select>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COURSE_CODES.map((courseCode) => (
                  <tr key={courseCode}>
                    <td className="border-b border-slate-100 px-1 py-2.5 text-center text-sm font-black text-slate-800">{courseCode}</td>
                    {selectedMembers.map((member, index) => (
                      <td key={`${courseCode}-${member?.id ?? index}`} className="border-b border-slate-100 px-1 py-2.5 text-center text-sm font-black text-slate-900">
                        {member ? formatTotal(getCourseTotal(scoresByKey, selectedGroup.id, member.id, courseCode)) : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-emerald-50">
                  <td className="px-1 py-2.5 text-center text-sm font-black text-emerald-700">계</td>
                  {selectedMembers.map((member, index) => (
                    <td key={`total-${member?.id ?? index}`} className="px-1 py-2.5 text-center text-base font-black text-emerald-700">
                      {member ? formatTotal(getMemberTotal(scoresByKey, selectedGroup.id, member.id, COURSE_CODES)) : '-'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="pb-dense-card p-2.5 sm:p-3">
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full table-fixed border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="w-[9%] border-b border-slate-200 px-0.5 py-2 text-center font-black">홀</th>
                  <th className="w-[13%] border-b border-slate-200 px-0.5 py-2 text-center font-black">M</th>
                  <th className="w-[8%] border-b border-slate-200 px-0.5 py-2 text-center font-black">파</th>
                  {selectedMembers.map((member, index) => (
                    <th key={`${member?.id ?? 'empty'}-${index}`} className="w-[17.5%] border-b border-slate-200 px-0.5 py-2 text-center font-black leading-tight">
                      <span className="block truncate">{member?.name ?? `${index + 1}번`}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HOLE_NUMBERS.map((holeNo) => {
                  const sampleScore = selectedMembers
                    .flatMap((member) => {
                      if (!member) return [];
                      const score = scoresByKey.get(getScoreKey(selectedGroup.id, member.id, activeTab, holeNo));
                      return score ? [score] : [];
                    })
                    .at(0);

                  return (
                    <tr key={holeNo}>
                      <td className="border-b border-slate-100 px-0.5 py-1.5 text-center text-sm font-black text-slate-800">{holeNo}</td>
                      <td className="border-b border-slate-100 px-0.5 py-1.5 text-center font-bold text-slate-600">{sampleScore?.distance_m ?? '-'}</td>
                      <td className="border-b border-slate-100 px-0.5 py-1.5 text-center font-bold text-slate-600">{sampleScore?.par ?? 3}</td>
                      {selectedMembers.map((member, memberIndex) => {
                        const score = member ? scoresByKey.get(getScoreKey(selectedGroup.id, member.id, activeTab, holeNo)) : null;
                        return (
                          <td key={`${holeNo}-${member?.id ?? memberIndex}`} className="border-b border-slate-100 px-0.5 py-1.5 text-center">
                            <ScoreValue value={score?.strokes} />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                <tr className="bg-slate-50">
                  <td className="px-0.5 py-2.5 text-center text-sm font-black text-slate-800" colSpan={3}>소계</td>
                  {selectedMembers.map((member, index) => (
                    <td key={`subtotal-${member?.id ?? index}`} className="px-0.5 py-2.5 text-center text-base font-black text-slate-950">
                      {member ? formatTotal(getCourseTotal(scoresByKey, selectedGroup.id, member.id, activeTab)) : '-'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
