"use client";

import { Play, RefreshCw, Clock, LogOut, ClipboardList, GraduationCap, Brain, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
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
  const [isFormsOpen, setIsFormsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsFormsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <div className="flex items-center gap-3">
        {/* Brand mark */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-maroon-600 text-white">
          <Brain className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            AI Readiness Dashboard
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Workshop AI Training — Employee Classification
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Forms dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsFormsOpen(!isFormsOpen)}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
          >
            Forms
            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isFormsOpen ? "rotate-180" : ""}`} />
          </button>
          {isFormsOpen && (
            <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg animate-[fadeIn_0.15s_ease-out]">
              <Link
                href="/survey"
                target="_blank"
                onClick={() => setIsFormsOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm text-slate-600 transition hover:bg-maroon-50 hover:text-maroon-700"
              >
                <ClipboardList className="h-4 w-4" />
                Survey Form
              </Link>
              <Link
                href="/assessment"
                target="_blank"
                onClick={() => setIsFormsOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm text-slate-600 transition hover:bg-maroon-50 hover:text-maroon-700"
              >
                <GraduationCap className="h-4 w-4" />
                Assessment Form
              </Link>
            </div>
          )}
        </div>

        {formattedDate && (
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            Last: {formattedDate}
          </span>
        )}
        <button
          onClick={onClassify}
          disabled={isClassifying}
          className="inline-flex items-center gap-2 rounded-2xl bg-maroon-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-maroon-700 disabled:opacity-60 disabled:cursor-not-allowed"
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
