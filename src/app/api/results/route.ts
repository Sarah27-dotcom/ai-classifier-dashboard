import { NextResponse } from "next/server";
import { fetchResults } from "@/lib/google-sheets";
import type { DashboardData } from "@/lib/types";

export async function GET() {
  try {
    const { results, lastClassified } = await fetchResults();

    const data: DashboardData = {
      results,
      lastClassified,
      totalEmployees: results.length,
      classDistribution: {
        Beginner: results.filter((r) => r.level === "Beginner").length,
        Intermediate: results.filter((r) => r.level === "Intermediate").length,
        Advanced: results.filter((r) => r.level === "Advanced").length,
      },
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch results error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch results";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
