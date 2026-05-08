import { NextResponse } from "next/server";
import { appendSheetData } from "@/lib/google-sheets";
import { z } from "zod";

const assessmentSchema = z.object({
  Name: z.string().min(2, "Name is required"),
  Email: z.string().email("Invalid email address"),
  Department: z.string().min(2, "Department is required"),
}).passthrough(); // Allow extra dynamic fields

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const validatedData = assessmentSchema.parse(body);

    // Append to Google Sheets
    await appendSheetData("Assessment", validatedData as Record<string, string>);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Assessment submission error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to submit assessment" },
      { status: 500 }
    );
  }
}
