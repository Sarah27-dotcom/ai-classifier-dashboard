"use client";

import { Play, RefreshCw, Clock, LogOut, ClipboardList, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

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
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const formattedDate = lastClassified
    ? new Date(lastClassified).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          AI Readiness Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Workshop AI Training — Employee Classification
        </p>
        
        {/* Quick Links for Admin */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/survey"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
          >
            <ClipboardList className="h-3.5 w-3.5" />
            Survey Form
          </Link>
          <Link
            href="/assessment"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
          >
            <GraduationCap className="h-3.5 w-3.5" />
            Assessment Form
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {formattedDate && (
          <span className="flex items-center gap-1.5 text-xs text-slate-400 mr-2">
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
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-red-600 disabled:opacity-50"
          title="Logout"
        >
          {isLoggingOut ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
