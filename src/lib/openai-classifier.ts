import OpenAI from "openai";
import { z } from "zod";
import type { MergedEmployee, ClassificationResult } from "./types";

// ============================================================
// System Prompt
// ============================================================

const SYSTEM_PROMPT = `You are an AI skill classifier for a corporate creative team workshop.
Your task is to classify each employee into one of three AI readiness levels based on their survey responses and assessment results.

## Classification Criteria

### Beginner
- Has never used AI tools professionally
- Not familiar with prompt engineering concepts
- Very limited AI knowledge
- Rarely or never interacts with AI tools in daily work

### Intermediate
- Has used AI tools (ChatGPT, Midjourney, etc.) for work tasks
- Understands basic prompt engineering
- Uses AI sporadically but not consistently
- Has some awareness of AI capabilities but limited hands-on experience

### Advanced
- Uses AI tools routinely and has integrated them into daily workflow
- Proficient in prompt engineering and advanced techniques
- Can optimize and combine multiple AI tools effectively
- Actively explores new AI tools and stays updated on developments

## Output Requirements
You MUST respond with valid JSON matching this exact structure:
{
  "employees": [
    {
      "name": "string - employee name",
      "email": "string - employee email",
      "department": "string - department name",
      "level": "Beginner|Intermediate|Advanced",
      "keyStrength": "string - one concise sentence about their strongest AI-related trait",
      "recommendedFocus": "string - one concise sentence about what they should focus on in the workshop",
      "rationale": "string - 2-3 sentences explaining why they were classified at this level",
      "confidence": 0.0-1.0
    }
  ]
}

## Guidelines
- Be consistent and objective in your classification
- confidence should reflect how clearly the data maps to the level (1.0 = very clear, 0.5 = borderline)
- keyStrength and recommendedFocus should be specific and actionable
- Classify every employee provided, do not skip anyone
- If an employee only has survey data (no assessment), classify based on available data with lower confidence
- If an employee only has assessment data (no survey), classify based on available data with lower confidence`;

// ============================================================
// Zod Schema for Response Validation
// ============================================================

const EmployeeResultSchema = z.object({
  name: z.string(),
  email: z.string(),
  department: z.string(),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  keyStrength: z.string(),
  recommendedFocus: z.string(),
  rationale: z.string(),
  confidence: z.number().min(0).max(1),
});

const OpenAIResponseSchema = z.object({
  employees: z.array(EmployeeResultSchema),
});

// ============================================================
// Helpers
// ============================================================

const BATCH_SIZE = 50;

function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

function buildUserPrompt(batch: MergedEmployee[]): string {
  const employees = batch.map((emp, i) => {
    let entry = `### Employee ${i + 1}\n`;
    entry += `- Name: ${emp.name}\n`;
    entry += `- Email: ${emp.email}\n`;
    entry += `- Department: ${emp.department}\n`;

    if (emp.hasSurvey && Object.keys(emp.surveyData).length > 0) {
      entry += `- Survey Responses:\n`;
      for (const [key, value] of Object.entries(emp.surveyData)) {
        entry += `  - ${key}: ${value}\n`;
      }
    } else {
      entry += `- Survey Responses: (no survey data)\n`;
    }

    if (emp.hasAssessment && Object.keys(emp.assessmentData).length > 0) {
      entry += `- Assessment Results:\n`;
      for (const [key, value] of Object.entries(emp.assessmentData)) {
        entry += `  - ${key}: ${value}\n`;
      }
    } else {
      entry += `- Assessment Results: (no assessment data)\n`;
    }

    return entry;
  });

  return `Please classify the following ${batch.length} employee(s) into AI readiness levels:\n\n${employees.join("\n")}`;
}

// ============================================================
// Main Classification Function
// ============================================================

export async function classifyEmployees(
  employees: MergedEmployee[]
): Promise<ClassificationResult[]> {
  const client = new OpenAI();
  const batches = chunk(employees, BATCH_SIZE);
  const allResults: ClassificationResult[] = [];

  for (const batch of batches) {
    const userPrompt = buildUserPrompt(batch);

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response content from OpenAI");
    }

    const parsed = OpenAIResponseSchema.parse(JSON.parse(content));
    allResults.push(...parsed.employees);
  }

  return allResults;
}
