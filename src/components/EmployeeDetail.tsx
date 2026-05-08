"use client";

import { X, Mail, Building2, Sparkles, Target, Brain } from "lucide-react";
import type { ClassificationResult, ClassLevel } from "@/lib/types";

interface EmployeeDetailProps {
  employee: ClassificationResult;
  onClose: () => void;
}

const LEVEL_STYLES: Record<ClassLevel, { badge: string; bg: string; text: string }> = {
  Beginner: {
    badge: "bg-red-100 text-red-700",
    bg: "bg-red-50",
    text: "text-red-700",
  },
  Intermediate: {
    badge: "bg-amber-100 text-amber-700",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  Advanced: {
    badge: "bg-emerald-100 text-emerald-700",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
};

export default function EmployeeDetail({
  employee,
  onClose,
}: EmployeeDetailProps) {
  const style = LEVEL_STYLES[employee.level];
  const confidencePct = Math.round(employee.confidence * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 p-6">
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
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Sparkles className="h-3.5 w-3.5" />
              Key Strength
            </div>
            <p className="text-sm text-slate-700">{employee.keyStrength}</p>
          </div>

          {/* Recommended Focus */}
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Target className="h-3.5 w-3.5" />
              Recommended Focus
            </div>
            <p className="text-sm text-slate-700">{employee.recommendedFocus}</p>
          </div>

          {/* AI Rationale */}
          <div className="rounded-2xl bg-indigo-50 p-4">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-indigo-500">
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
