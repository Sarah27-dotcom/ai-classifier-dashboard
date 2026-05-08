"use client";

import { Users, CircleDot, TrendingUp, Zap } from "lucide-react";

interface ScorecardsProps {
  total: number;
  distribution: {
    Beginner: number;
    Intermediate: number;
    Advanced: number;
  };
}

const cards = [
  { key: "total" as const, label: "Total Peserta", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
  { key: "Beginner" as const, label: "Beginner", icon: CircleDot, color: "text-red-600", bg: "bg-red-50" },
  { key: "Intermediate" as const, label: "Intermediate", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
  { key: "Advanced" as const, label: "Advanced", icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50" },
] as const;

export default function Scorecards({ total, distribution }: ScorecardsProps) {
  const values: Record<string, number> = {
    total,
    ...distribution,
  };

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, color, bg }) => (
        <div
          key={key}
          className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
        >
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${bg}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{values[key]}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
