import type { SheetRow, MergedEmployee } from "./types";

// ============================================================
// Merge Survey + Assessment by Email (case-insensitive)
// ============================================================

export function mergeEmployeeData(
  surveyRows: SheetRow[],
  assessmentRows: SheetRow[]
): MergedEmployee[] {
  const emailKey = (email: string) => email.toLowerCase().trim();

  // Index survey by email
  const surveyMap = new Map<string, SheetRow>();
  for (const row of surveyRows) {
    if (row.email) {
      surveyMap.set(emailKey(row.email), row);
    }
  }

  // Index assessment by email
  const assessmentMap = new Map<string, SheetRow>();
  for (const row of assessmentRows) {
    if (row.email) {
      assessmentMap.set(emailKey(row.email), row);
    }
  }

  // Collect all unique emails
  const allEmails = new Set([...surveyMap.keys(), ...assessmentMap.keys()]);

  const merged: MergedEmployee[] = [];

  for (const email of allEmails) {
    const survey = surveyMap.get(email);
    const assessment = assessmentMap.get(email);

    // Extract survey data (exclude identity fields)
    const surveyData: Record<string, string> = {};
    if (survey) {
      for (const [key, value] of Object.entries(survey)) {
        if (!["name", "email", "department", "Name", "Nama", "Email", "Department", "Departemen"].includes(key)) {
          surveyData[key] = value;
        }
      }
    }

    // Extract assessment data (exclude identity fields)
    const assessmentData: Record<string, string> = {};
    if (assessment) {
      for (const [key, value] of Object.entries(assessment)) {
        if (!["name", "email", "department", "Name", "Nama", "Email", "Department", "Departemen"].includes(key)) {
          assessmentData[key] = value;
        }
      }
    }

    // Prefer survey data for identity, fall back to assessment
    const source = survey || assessment!;

    merged.push({
      name: source.name,
      email: source.email,
      department: source.department,
      surveyData,
      assessmentData,
      hasSurvey: !!survey,
      hasAssessment: !!assessment,
    });
  }

  return merged;
}
