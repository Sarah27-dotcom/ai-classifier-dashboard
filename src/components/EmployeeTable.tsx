"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import type { ClassificationResult, ClassLevel } from "@/lib/types";

interface EmployeeTableProps {
  results: ClassificationResult[];
  onSelectEmployee: (employee: ClassificationResult) => void;
}

const LEVEL_BADGE: Record<ClassLevel, string> = {
  Beginner: "bg-red-100 text-red-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-emerald-100 text-emerald-700",
};

export default function EmployeeTable({
  results,
  onSelectEmployee,
}: EmployeeTableProps) {
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<ClassLevel | "All">("All");

  const filtered = results.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = filterLevel === "All" || emp.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
      {/* Filters */}
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 sm:w-72"
          />
        </div>
        <div className="flex gap-1.5">
          {(["All", "Beginner", "Intermediate", "Advanced"] as const).map(
            (level) => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                  filterLevel === level
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {level === "All" ? "All" : level}
              </button>
            )
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-medium text-slate-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Level</th>
              <th className="hidden px-4 py-3 lg:table-cell">Key Strength</th>
              <th className="hidden px-4 py-3 md:table-cell">Focus</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  No employees found
                </td>
              </tr>
            ) : (
              filtered.map((emp) => (
                <tr
                  key={emp.email}
                  onClick={() => onSelectEmployee(emp)}
                  className="cursor-pointer border-b border-slate-50 transition hover:bg-slate-50"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-900">{emp.name}</p>
                      <p className="text-xs text-slate-400">{emp.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{emp.department}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-lg px-2.5 py-1 text-xs font-semibold ${LEVEL_BADGE[emp.level]}`}
                    >
                      {emp.level}
                    </span>
                  </td>
                  <td className="hidden max-w-[200px] truncate px-4 py-3 text-slate-600 lg:table-cell">
                    {emp.keyStrength}
                  </td>
                  <td className="hidden max-w-[200px] truncate px-4 py-3 text-slate-600 md:table-cell">
                    {emp.recommendedFocus}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-400">
        Showing {filtered.length} of {results.length} employees
      </div>
    </div>
  );
}
