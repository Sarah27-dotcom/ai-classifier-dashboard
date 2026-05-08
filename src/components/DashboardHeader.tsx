"use client";

import { Play, RefreshCw, Clock } from "lucide-react";

interface DashboardHeaderProps {
  lastClassified: string | null;
  isClassifying: boolean;
  onClassify: () => void;
}

export default function DashboardHeader({
  lastClassified,
  isClassifying,
  onClassify,
}: DashboardHeaderProps) {
  const formattedDate = lastClassified
    ? new Date(lastClassified).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          AI Readiness Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Workshop AI Training — Employee Classification
        </p>
      </div>

      <div className="flex items-center gap-3">
        {formattedDate && (
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            Last: {formattedDate}
          </span>
        )}
        <button
          onClick={onClassify}
          disabled={isClassifying}
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isClassifying ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Classifying...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run Classification
            </>
          )}
        </button>
      </div>
    </div>
  );
}
