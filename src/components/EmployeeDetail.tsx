"use client";

import { useEffect, useCallback } from "react";
import { X, Mail, Building2, Sparkles, Target, Brain } from "lucide-react";
import type { ClassificationResult, ClassLevel } from "@/lib/types";

interface EmployeeDetailProps {
  employee: ClassificationResult;
  onClose: () => void;
}

const LEVEL_STYLES: Record<ClassLevel, { badge: string; bg: string; text: string; avatar: string }> = {
  Beginner: {
    badge: "bg-violet-50 text-violet-700",
    bg: "bg-violet-50",
    text: "text-violet-700",
    avatar: "bg-violet-100 text-violet-700",
  },
  Intermediate: {
    badge: "bg-sky-50 text-sky-700",
    bg: "bg-sky-50",
    text: "text-sky-700",
    avatar: "bg-sky-100 text-sky-700",
  },
  Advanced: {
    badge: "bg-emerald-50 text-emerald-700",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    avatar: "bg-emerald-100 text-emerald-700",
  },
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
}

export default function EmployeeDetail({
  employee,
  onClose,
}: EmployeeDetailProps) {
  const style = LEVEL_STYLES[employee.level];
  const confidencePct = Math.round(employee.confidence * 100);
  const initials = getInitials(employee.name);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-xl animate-[modalIn_0.3s_ease-out]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 p-6">
          <div className="flex items-center gap-4">
            {/* Avatar with initials */}
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${style.avatar}`}
            >
              {initials}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {employee.name}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {employee.email}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  {employee.department}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 p-6">
          {/* Level + Confidence */}
          <div className="flex items-center gap-3">
            <span
              className={`rounded-xl px-3 py-1.5 text-sm font-semibold ${style.badge}`}
            >
              {employee.level}
            </span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${style.bg}`}
                  style={{ width: `${confidencePct}%` }}
                />
              </div>
              <span className="text-xs text-slate-500">
                {confidencePct}% confidence
              </span>
            </div>
          </div>

          {/* Key Strength */}
          <div className="rounded-2xl bg-slate-50 p-4 border-l-3 border-emerald-400">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <Sparkles className="h-3.5 w-3.5" />
              Key Strength
            </div>
            <p className="text-sm text-slate-700">{employee.keyStrength}</p>
          </div>

          {/* Recommended Focus */}
          <div className="rounded-2xl bg-slate-50 p-4 border-l-3 border-amber-400">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-amber-600">
              <Target className="h-3.5 w-3.5" />
              Recommended Focus
            </div>
            <p className="text-sm text-slate-700">{employee.recommendedFocus}</p>
          </div>

          {/* AI Rationale */}
          <div className="rounded-2xl bg-maroon-50/50 p-4 border-l-3 border-maroon-400">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-maroon-600">
              <Brain className="h-3.5 w-3.5" />
              AI Rationale
            </div>
            <p className="text-sm text-slate-700">{employee.rationale}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
