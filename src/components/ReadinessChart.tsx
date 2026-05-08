"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ReadinessChartProps {
  distribution: {
    Beginner: number;
    Intermediate: number;
    Advanced: number;
  };
}

const COLORS = {
  Beginner: "#ef4444",
  Intermediate: "#f59e0b",
  Advanced: "#10b981",
};

const LABELS = {
  Beginner: "Beginner",
  Intermediate: "Intermediate",
  Advanced: "Advanced",
} as const;

type Level = keyof typeof COLORS;

export default function ReadinessChart({ distribution }: ReadinessChartProps) {
  const total = distribution.Beginner + distribution.Intermediate + distribution.Advanced;

  const data = (Object.keys(distribution) as Level[]).map((level) => ({
    name: LABELS[level],
    value: distribution[level],
    color: COLORS[level],
  }));

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="mb-4 text-sm font-semibold text-slate-700">
        AI Readiness Distribution
      </h2>

      {total === 0 ? (
        <p className="text-sm text-slate-400">No data yet</p>
      ) : (
        <>
          <ResponsiveContainer width={220} height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => {
                  const num = Number(value ?? 0);
                  const pct = total > 0 ? ((num / total) * 100).toFixed(1) : "0";
                  return [`${num} (${pct}%)`, String(name)];
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 flex gap-5">
            {(Object.keys(LABELS) as Level[]).map((level) => {
              const pct = total > 0 ? ((distribution[level] / total) * 100).toFixed(0) : "0";
              return (
                <div key={level} className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[level] }}
                  />
                  {LABELS[level]} ({pct}%)
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
