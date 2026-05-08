import { google } from "googleapis";
import type { sheets_v4 } from "googleapis";
import type { SheetRow, ClassificationResult } from "./types";

// ============================================================
// Auth & Client
// ============================================================

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID!;

function getAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

let sheetsInstance: sheets_v4.Sheets | null = null;

async function getSheetClient(): Promise<sheets_v4.Sheets> {
  if (!sheetsInstance) {
    const auth = getAuth();
    sheetsInstance = google.sheets({ version: "v4", auth });
  }
  return sheetsInstance;
}

// ============================================================
// Read from any tab → SheetRow[]
// ============================================================

export async function fetchSheetData(tabName: string): Promise<SheetRow[]> {
  const sheets = await getSheetClient();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${tabName}`,
  });

  const rows = response.data.values;
  if (!rows || rows.length < 2) return [];

  // First row = headers
  const headers = rows[0].map((h: string) => h.trim());

  return rows.slice(1).map((row: string[]) => {
    const record: Record<string, string> = {};
    headers.forEach((header, i) => {
      record[header] = (row[i] || "").trim();
    });

    return {
      name: record["Name"] || record["Nama"] || "",
      email: record["Email"] || "",
      department: record["Department"] || record["Departemen"] || "",
      ...record,
    } as SheetRow;
  });
}

// ============================================================
// Write classification results to "Results" tab
// ============================================================

const RESULTS_HEADERS = [
  "Name",
  "Email",
  "Department",
  "Level",
  "Key Strength",
  "Recommended Focus",
  "Rationale",
  "Confidence",
  "Classified At",
];

export async function writeResults(
  results: ClassificationResult[]
): Promise<void> {
  const sheets = await getSheetClient();
  const timestamp = new Date().toISOString();

  const headerRow = RESULTS_HEADERS;
  const dataRows = results.map((r) => [
    r.name,
    r.email,
    r.department,
    r.level,
    r.keyStrength,
    r.recommendedFocus,
    r.rationale,
    String(r.confidence),
    timestamp,
  ]);

  // Clear existing data then write new
  await sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: "Results",
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: "Results!A1",
    valueInputOption: "RAW",
    requestBody: {
      values: [headerRow, ...dataRows],
    },
  });
}

// ============================================================
// Read cached results from "Results" tab
// ============================================================

export async function fetchResults(): Promise<{
  results: ClassificationResult[];
  lastClassified: string | null;
}> {
  const sheets = await getSheetClient();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Results",
  });

  const rows = response.data.values;
  if (!rows || rows.length < 2) {
    return { results: [], lastClassified: null };
  }

  // Skip header row
  const results: ClassificationResult[] = rows.slice(1).map((row: string[]) => ({
    name: row[0] || "",
    email: row[1] || "",
    department: row[2] || "",
    level: (row[3] as ClassificationResult["level"]) || "Beginner",
    keyStrength: row[4] || "",
    recommendedFocus: row[5] || "",
    rationale: row[6] || "",
    confidence: parseFloat(row[7]) || 0,
  }));

  // Last classified timestamp is in the last column of the first data row
  const lastClassified = rows[1]?.[8] || null;

  return { results, lastClassified };
}
