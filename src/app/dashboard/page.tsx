"use client";

import { useState, useEffect, useCallback } from "react";
import type { DashboardData, ClassificationResult } from "@/lib/types";
import DashboardHeader from "@/components/DashboardHeader";
import Scorecards from "@/components/Scorecards";
import ReadinessChart from "@/components/ReadinessChart";
import EmployeeTable from "@/components/EmployeeTable";
import EmployeeDetail from "@/components/EmployeeDetail";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { Inbox, Play } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [classifying, setClassifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] =
    useState<ClassificationResult | null>(null);

  const fetchResults = useCallback(async () => {
    try {
      const res = await fetch("/api/results");
      if (res.ok) {
        const json: DashboardData = await res.json();
        setData(json);
      }
    } catch {
      // Silently fail — will show empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleClassify = async () => {
    setClassifying(true);
    setError(null);
    try {
      const res = await fetch("/api/classify", { method: "POST" });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Classification failed");
      }
      const json: DashboardData = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setClassifying(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  const hasData = data && data.results.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <DashboardHeader
        lastClassified={data?.lastClassified ?? null}
        isClassifying={classifying}
        onClassify={handleClassify}
      />

      {error && (
        <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {hasData ? (
        <div className="mt-6 space-y-6 animate-fade-in">
          <Scorecards
            total={data.totalEmployees}
            distribution={data.classDistribution}
          />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <ReadinessChart distribution={data.classDistribution} />
            </div>
            <div className="lg:col-span-2">
              <EmployeeTable
                results={data.results}
                onSelectEmployee={setSelectedEmployee}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="relative mt-20 flex flex-col items-center justify-center text-center">
          {/* Decorative radial gradient */}
          <div className="absolute -top-8 h-64 w-64 rounded-full bg-gradient-to-br from-maroon-100/40 to-slate-100/40 blur-3xl" />

          {/* Floating icon */}
          <div className="animate-float relative z-10 mb-2">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-maroon-50 to-slate-100 shadow-sm ring-1 ring-slate-200/60">
              <Inbox className="h-9 w-9 text-maroon-400" />
            </div>
          </div>

          <h2 className="relative z-10 mt-4 text-xl font-bold text-slate-900">
            No classification data yet
          </h2>
          <p className="relative z-10 mt-2 max-w-sm text-sm text-slate-500">
            Fetch survey &amp; assessment data, classify employees via AI, and
            view the results here.
          </p>

          <button
            onClick={handleClassify}
            disabled={classifying}
            className="relative z-10 mt-6 inline-flex items-center gap-2 rounded-2xl bg-maroon-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-maroon-200 transition hover:bg-maroon-700 active:scale-[0.98] disabled:opacity-60"
          >
            <Play className="h-4 w-4" />
            Run Classification
          </button>
        </div>
      )}

      {selectedEmployee && (
        <EmployeeDetail
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
}
