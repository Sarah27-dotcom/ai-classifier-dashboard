"use client";

import { useEffect, useRef, useState } from "react";
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
  { key: "total" as const, label: "Total Peserta", icon: Users, color: "text-maroon-600", iconBg: "bg-gradient-to-br from-maroon-100 to-maroon-50", cardBg: "bg-gradient-to-br from-maroon-50/50 to-white", accentColor: "bg-maroon-400" },
  { key: "Beginner" as const, label: "Beginner", icon: CircleDot, color: "text-violet-600", iconBg: "bg-gradient-to-br from-violet-100 to-violet-50", cardBg: "bg-gradient-to-br from-violet-50/50 to-white", accentColor: "bg-violet-400" },
  { key: "Intermediate" as const, label: "Intermediate", icon: TrendingUp, color: "text-sky-600", iconBg: "bg-gradient-to-br from-sky-100 to-sky-50", cardBg: "bg-gradient-to-br from-sky-50/50 to-white", accentColor: "bg-sky-400" },
  { key: "Advanced" as const, label: "Advanced", icon: Zap, color: "text-emerald-600", iconBg: "bg-gradient-to-br from-emerald-100 to-emerald-50", cardBg: "bg-gradient-to-br from-emerald-50/50 to-white", accentColor: "bg-emerald-400" },
] as const;

function useCountUp(target: number, duration = 600) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return count;
}

export default function Scorecards({ total, distribution }: ScorecardsProps) {
  const values: Record<string, number> = {
    total,
    ...distribution,
  };

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, color, iconBg, cardBg, accentColor }) => {
        const pct = key !== "total" && total > 0
          ? Math.round((values[key] / total) * 100)
          : null;

        return (
          <ScorecardItem
            key={key}
            label={label}
            value={values[key]}
            pct={pct}
            icon={Icon}
            color={color}
            iconBg={iconBg}
            cardBg={cardBg}
            accentColor={accentColor}
            total={total}
          />
        );
      })}
    </div>
  );
}

function ScorecardItem({
  label,
  value,
  pct,
  icon: Icon,
  color,
  iconBg,
  cardBg,
  accentColor,
  total,
}: {
  label: string;
  value: number;
  pct: number | null;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  iconBg: string;
  cardBg: string;
  accentColor: string;
  total: number;
}) {
  const displayed = useCountUp(value);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl ${cardBg} p-5 shadow-sm ring-1 ring-slate-100 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
    >
      <div className="flex items-center gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900">
            {displayed}
            {pct !== null && (
              <span className="ml-1.5 text-sm font-medium text-slate-400">
                ({pct}%)
              </span>
            )}
          </p>
          <p className="text-xs text-slate-500">{label}</p>
        </div>
      </div>

      {/* Progress bar */}
      {pct !== null && (
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${accentColor} transition-all duration-700 ease-out`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}
