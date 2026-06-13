'use client';

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type ScorePoint = {
  played_on: string;
  total_strokes: number;
};

export function ScoreTrendChart({ data }: { data: ScorePoint[] }) {
  if (data.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-5 text-sm text-slate-500 shadow-sm">
        아직 그래프로 표시할 스코어 기록이 없습니다.
      </div>
    );
  }

  return (
    <div className="h-72 w-full rounded-3xl bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-bold text-slate-900">최근 스코어 추이</h2>
      <ResponsiveContainer width="100%" height="84%">
        <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -18 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="played_on" tickFormatter={(value: string) => value.slice(5)} fontSize={12} />
          <YAxis fontSize={12} allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="total_strokes" strokeWidth={3} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
