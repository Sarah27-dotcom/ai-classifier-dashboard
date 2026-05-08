// ============================================================
// Sheet Data (generic - columns are dynamic)
// ============================================================

export interface SheetRow {
  name: string;
  email: string;
  department: string;
  [key: string]: string;
}

// ============================================================
// Merged Employee (Survey + Assessment combined)
// ============================================================

export interface MergedEmployee {
  name: string;
  email: string;
  department: string;
  surveyData: Record<string, string>;
  assessmentData: Record<string, string>;
  hasSurvey: boolean;
  hasAssessment: boolean;
}

// ============================================================
// Classification Results
// ============================================================

export type ClassLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ClassificationResult {
  name: string;
  email: string;
  department: string;
  level: ClassLevel;
  keyStrength: string;
  recommendedFocus: string;
  rationale: string;
  confidence: number;
}

// ============================================================
// API Responses
// ============================================================

export interface DashboardData {
  results: ClassificationResult[];
  lastClassified: string | null;
  totalEmployees: number;
  classDistribution: {
    Beginner: number;
    Intermediate: number;
    Advanced: number;
  };
}

export interface OpenAIResponse {
  employees: {
    name: string;
    email: string;
    department: string;
    level: ClassLevel;
    keyStrength: string;
    recommendedFocus: string;
    rationale: string;
    confidence: number;
  }[];
}
