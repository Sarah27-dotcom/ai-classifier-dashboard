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
  Beginner: "#8b5cf6",
  Intermediate: "#0ea5e9",
  Advanced: "#10b981",
};

const COLOR_BG = {
  Beginner: "bg-violet-400",
  Intermediate: "bg-sky-400",
  Advanced: "bg-emerald-400",
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
      <h2 className="mb-1 text-sm font-semibold text-slate-700">
        AI Readiness Distribution
      </h2>
      <p className="mb-4 text-xs text-slate-400">
        Distribution of {total} employees
      </p>

      {total === 0 ? (
        <p className="text-sm text-slate-400">No data yet</p>
      ) : (
        <>
          <div className="relative">
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
                  animationBegin={0}
                  animationDuration={800}
                  animationEasing="ease-out"
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

            {/* Center label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-900">{total}</span>
              <span className="text-[10px] font-medium text-slate-400">employees</span>
            </div>
          </div>

          {/* Enhanced legend with percentage bars */}
          <div className="mt-4 w-full space-y-2">
            {(Object.keys(LABELS) as Level[]).map((level) => {
              const pct = total > 0 ? ((distribution[level] / total) * 100).toFixed(0) : "0";
              return (
                <div key={level} className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: COLORS[level] }}
                  />
                  <span className="w-20 text-xs font-medium text-slate-600">{LABELS[level]}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${COLOR_BG[level]} transition-all duration-700 ease-out`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-9 text-right text-xs font-medium text-slate-500">{pct}%</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
