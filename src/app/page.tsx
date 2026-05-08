"use client";

import { useState, useEffect, useCallback } from "react";
import type { DashboardData, ClassificationResult } from "@/lib/types";
import DashboardHeader from "@/components/DashboardHeader";
import Scorecards from "@/components/Scorecards";
import ReadinessChart from "@/components/ReadinessChart";
import EmployeeTable from "@/components/EmployeeTable";
import EmployeeDetail from "@/components/EmployeeDetail";
import { Inbox } from "lucide-react";

export default function Home() {
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
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
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
        <div className="mt-6 space-y-6">
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
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100">
            <Inbox className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No classification data yet
          </h2>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Click &quot;Run Classification&quot; to fetch survey &amp; assessment
            data, classify employees via AI, and store the results.
          </p>
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
