import { NextResponse } from "next/server";
import { fetchSheetData, writeResults } from "@/lib/google-sheets";
import { mergeEmployeeData } from "@/lib/data-merger";
import { classifyEmployees } from "@/lib/openai-classifier";
import type { DashboardData } from "@/lib/types";

export async function POST() {
  try {
    // 1. Fetch from Survey + Assessment tabs
    const [surveyRows, assessmentRows] = await Promise.all([
      fetchSheetData("Survey"),
      fetchSheetData("Assessment"),
    ]);

    if (surveyRows.length === 0 && assessmentRows.length === 0) {
      return NextResponse.json(
        { error: "No data found in Survey or Assessment tabs" },
        { status: 404 }
      );
    }

    // 2. Merge by identity
    const merged = mergeEmployeeData(surveyRows, assessmentRows);

    if (merged.length === 0) {
      return NextResponse.json(
        { error: "No employees found after merging" },
        { status: 404 }
      );
    }

    // 3. Classify via OpenAI
    const results = await classifyEmployees(merged);

    // 4. Write to Results tab
    await writeResults(results);

    // 5. Build response
    const data: DashboardData = {
      results,
      lastClassified: new Date().toISOString(),
      totalEmployees: results.length,
      classDistribution: {
        Beginner: results.filter((r) => r.level === "Beginner").length,
        Intermediate: results.filter((r) => r.level === "Intermediate").length,
        Advanced: results.filter((r) => r.level === "Advanced").length,
      },
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Classification error:", error);
    const message =
      error instanceof Error ? error.message : "Classification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
