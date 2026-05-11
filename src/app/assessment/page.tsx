"use client";

import { useState } from "react";
import { GraduationCap, Send, CheckCircle2, Loader2, User, ChevronDown } from "lucide-react";

// Maps form keys to Google Sheet header names
const HEADER_MAP: Record<string, string> = {
  Name: "Name",
  Email: "Email",
  Used_AI_Visual: "Have you ever used an AI tool to create or edit any kind of visual content?",
  AI_Content_Mind: 'When you hear "AI-generated content," what comes to mind?',
  AI_Video_Impressed: "Have you seen any AI-generated video or image content recently that impressed or surprised you?",
  Production_Time_Budget: "In your current workflow, which parts of a production do you think take the most time and budget?",
  Skip_Part: "If you could skip one part of a typical shoot and still get the same result, which part would it be?",
  Faster_Way: 'Have you ever thought "there must be a faster way to do this" during a production?',
  Text_To_Video_Use: "If a tool could generate a realistic video scene from a text description in minutes, where would it be most useful?",
  Trust_AI_Visual: "What would make you trust an AI-generated visual enough to use it in a client deliverable?",
  AI_Concerns: "What concerns, if any, do you have about using AI-generated content in your work?",
  Heard_Of_Tools: "Which of the following have you heard of?",
  Used_AI_Task: "Have you ever used any of the above, or a similar tool, to help with a work task?",
  Confidence_Learn: "On a scale of 1 to 5, how confident are you in your ability to learn and use a new AI tool?",
};

interface AssessmentField {
  key: string;
  label: string;
  type: "text" | "radio" | "checkbox" | "scale" | "select";
  options?: string[];
  hasOther?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}

const ASSESSMENT_FIELDS: AssessmentField[] = [
  {
    key: "Used_AI_Visual",
    label: "Have you ever used an AI tool to create or edit any kind of visual content (image, video, audio)?",
    type: "select",
    options: ["Never tried it", "I have tried it once or twice out of curiosity", "I use it occasionally for personal or work projects", "I use it regularly as part of my work"],
  },
  {
    key: "AI_Content_Mind",
    label: 'When you hear "AI-generated content," what comes to mind? Describe in your own words',
    type: "text",
    placeholder: "Describe in your own words...",
  },
  {
    key: "AI_Video_Impressed",
    label: "Have you seen any AI-generated video or image content recently that impressed or surprised you? Describe what it was",
    type: "text",
    placeholder: "Describe what you saw...",
  },
  {
    key: "Production_Time_Budget",
    label: "In your current workflow, which parts of a production do you think take the most time and budget? (e.g. casting, location, shooting, editing, revisions)",
    type: "text",
    placeholder: "e.g. casting, location, shooting, editing, revisions...",
  },
  {
    key: "Skip_Part",
    label: "If you could skip one part of a typical shoot and still get the same result, which part would it be and why?",
    type: "text",
    placeholder: "Which part and why...",
  },
  {
    key: "Faster_Way",
    label: 'Have you ever thought "there must be a faster way to do this" during a production? What was the situation?',
    type: "text",
    placeholder: "Describe the situation...",
  },
  {
    key: "Text_To_Video_Use",
    label: "If a tool could generate a realistic video scene from a text description in minutes, where do you think it would be most useful in your work?",
    type: "text",
    placeholder: "Where would it be most useful...",
  },
  {
    key: "Trust_AI_Visual",
    label: "What would make you trust an AI-generated visual enough to use it in a client deliverable?",
    type: "text",
    placeholder: "What would give you confidence...",
  },
  {
    key: "AI_Concerns",
    label: "What concerns, if any, do you have about using AI-generated content in your work?",
    type: "text",
    placeholder: "Any concerns...",
  },
  {
    key: "Heard_Of_Tools",
    label: "Which of the following have you heard of? (check all that apply)",
    type: "checkbox",
    options: [
      "Midjourney",
      "DALL-E / ChatGPT",
      "Runway",
      "Sora (by OpenAI)",
      "Stable Diffusion",
      "Adobe Firefly",
      "Pika",
      "ElevenLabs",
    ],
    hasOther: true,
  },
  {
    key: "Used_AI_Task",
    label: "Have you ever used any of the above, or a similar tool, to help with a work task? If yes, describe what you did and what the result was.",
    type: "text",
    placeholder: "Describe what you did and the result...",
  },
  {
    key: "Confidence_Learn",
    label: "On a scale of 1 to 5, how confident are you in your ability to learn and use a new AI tool if someone walked you through it?",
    type: "scale",
    min: 1,
    max: 5,
    minLabel: "Not confident",
    maxLabel: "Very confident",
  },
];

export default function AssessmentPage() {
  const [formData, setFormData] = useState<Record<string, string>>({ Name: "", Email: "", Department: "" });
  const [checkboxData, setCheckboxData] = useState<Record<string, string[]>>({});
  const [otherData, setOtherData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleTextChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckboxToggle = (key: string, option: string) => {
    setCheckboxData((prev) => {
      const current = prev[key] || [];
      const updated = current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option];
      return { ...prev, [key]: updated };
    });
  };

  const handleOtherChange = (key: string, value: string) => {
    setOtherData((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.Name.trim()) {
      setError("Please enter your name.");
      return false;
    }
    if (!formData.Email?.trim()) {
      setError("Please enter your email.");
      return false;
    }
    if (!formData.Department?.trim()) {
      setError("Please enter your department.");
      return false;
    }
    for (const field of ASSESSMENT_FIELDS) {
      if (field.type === "checkbox") {
        const selected = checkboxData[field.key] || [];
        if (selected.length === 0) {
          setError(`Please select at least one option for: ${field.label}`);
          return false;
        }
        if (selected.includes("Other") && !otherData[field.key]?.trim()) {
          setError(`Please specify your "Other" answer for: ${field.label}`);
          return false;
        }
      } else if (field.type === "scale") {
        if (!formData[field.key]) {
          setError(`Please select a rating for: ${field.label}`);
          return false;
        }
      } else if (field.type === "radio") {
        if (!formData[field.key]) {
          setError(`Please select an option for: ${field.label}`);
          return false;
        }
        if (formData[field.key] === "Other" && !otherData[field.key]?.trim()) {
          setError(`Please specify your "Other" answer for: ${field.label}`);
          return false;
        }
      } else {
        if (!formData[field.key]?.trim()) {
          setError(`Please answer: ${field.label}`);
          return false;
        }
      }
    }
    return true;
  };

  const buildSubmitData = (): Record<string, string> => {
    const data: Record<string, string> = {
      Timestamp: new Date().toLocaleString(),
      Name: formData.Name,
      Email: formData.Email || "",
      Department: formData.Department || "",
    };

    for (const field of ASSESSMENT_FIELDS) {
      const headerKey = HEADER_MAP[field.key];
      if (field.type === "checkbox") {
        const selected = checkboxData[field.key] || [];
        const values = selected.map((v) =>
          v === "Other" && otherData[field.key] ? `Other: ${otherData[field.key]}` : v
        );
        data[headerKey] = values.join(", ");
      } else if (field.type === "radio") {
        const val = formData[field.key];
        data[headerKey] = val === "Other" && otherData[field.key]
          ? `Other: ${otherData[field.key]}`
          : val || "";
      } else {
        data[headerKey] = formData[field.key] || "";
      }
    }

    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = buildSubmitData();
      const res = await fetch("/api/submit-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "Submission failed. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 animate-[bounceIn_0.5s_ease-out]">
              <CheckCircle2 className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Assessment Completed!</h1>
          <p className="mt-2 text-slate-600">
            Great job! Your assessment has been submitted. We will use this to personalize your workshop experience.
          </p>
          <button
            onClick={() => {
              setIsSuccess(false);
              setFormData({ Name: "", Email: "", Department: "" });
              setCheckboxData({});
              setOtherData({});
            }}
            className="mt-8 text-sm font-semibold text-maroon-600 hover:text-maroon-700"
          >
            Submit another response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="mx-auto max-w-xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          <div className="bg-maroon-600 p-8 text-white">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Skill Assessment</h1>
            <p className="mt-2 text-maroon-100/80">
              Technical skills evaluation for AI readiness.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Name & Email Fields */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm transition focus:border-maroon-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-maroon-500/20"
                      placeholder="Your full name"
                      value={formData.Name}
                      onChange={(e) => handleTextChange("Name", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm transition focus:border-maroon-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-maroon-500/20"
                      placeholder="Your email"
                      value={formData.Email || ""}
                      onChange={(e) => handleTextChange("Email", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Department</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm transition focus:border-maroon-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-maroon-500/20"
                      placeholder="Your department"
                      value={formData.Department || ""}
                      onChange={(e) => handleTextChange("Department", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Fields */}
              {ASSESSMENT_FIELDS.map((field) => (
                <div key={field.key}>
                  <label className="mb-3 block text-sm font-semibold text-slate-700">
                    {field.label}
                  </label>

                  {/* TEXT */}
                  {field.type === "text" && (
                    <input
                      type="text"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm transition focus:border-maroon-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-maroon-500/20"
                      placeholder={field.placeholder}
                      value={formData[field.key] || ""}
                      onChange={(e) => handleTextChange(field.key, e.target.value)}
                    />
                  )}

                  {/* SELECT / DROPDOWN */}
                  {field.type === "select" && (
                    <div className="relative">
                      <select
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 pr-10 text-sm transition focus:border-maroon-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-maroon-500/20 appearance-none"
                        value={formData[field.key] || ""}
                        onChange={(e) => handleTextChange(field.key, e.target.value)}
                      >
                        <option value="" disabled>Select an option</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  )}

                  {/* RADIO */}
                  {field.type === "radio" && (
                    <div className="space-y-2">
                      {field.options?.map((opt) => {
                        const isSelected = formData[field.key] === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleTextChange(field.key, opt)}
                            className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition ${isSelected
                              ? "border-maroon-500 bg-maroon-50 text-maroon-700"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                              }`}
                          >
                            <div
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${isSelected ? "border-maroon-600 bg-maroon-600" : "border-slate-300"
                                }`}
                            >
                              {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                            </div>
                            {opt}
                          </button>
                        );
                      })}
                      {field.hasOther && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleTextChange(field.key, "Other")}
                            className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition ${formData[field.key] === "Other"
                              ? "border-maroon-500 bg-maroon-50 text-maroon-700"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                              }`}
                          >
                            <div
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${formData[field.key] === "Other"
                                ? "border-maroon-600 bg-maroon-600"
                                : "border-slate-300"
                                }`}
                            >
                              {formData[field.key] === "Other" && (
                                <div className="h-2 w-2 rounded-full bg-white" />
                              )}
                            </div>
                            Other
                          </button>
                          {formData[field.key] === "Other" && (
                            <input
                              type="text"
                              placeholder="Please specify..."
                              className="ml-8 w-[calc(100%-2rem)] rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm transition focus:border-maroon-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-maroon-500/20"
                              value={otherData[field.key] || ""}
                              onChange={(e) => handleOtherChange(field.key, e.target.value)}
                            />
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* CHECKBOX */}
                  {field.type === "checkbox" && (
                    <div className="space-y-2">
                      {field.options?.map((opt) => {
                        const isChecked = (checkboxData[field.key] || []).includes(opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleCheckboxToggle(field.key, opt)}
                            className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition ${isChecked
                              ? "border-maroon-500 bg-maroon-50 text-maroon-700"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                              }`}
                          >
                            <div
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${isChecked ? "border-maroon-600 bg-maroon-600" : "border-slate-300"
                                }`}
                            >
                              {isChecked && (
                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            {opt}
                          </button>
                        );
                      })}
                      {field.hasOther && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleCheckboxToggle(field.key, "Other")}
                            className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition ${(checkboxData[field.key] || []).includes("Other")
                              ? "border-maroon-500 bg-maroon-50 text-maroon-700"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                              }`}
                          >
                            <div
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${(checkboxData[field.key] || []).includes("Other")
                                ? "border-maroon-600 bg-maroon-600"
                                : "border-slate-300"
                                }`}
                            >
                              {(checkboxData[field.key] || []).includes("Other") && (
                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            Other
                          </button>
                          {(checkboxData[field.key] || []).includes("Other") && (
                            <input
                              type="text"
                              placeholder="Please specify..."
                              className="ml-8 w-[calc(100%-2rem)] rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm transition focus:border-maroon-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-maroon-500/20"
                              value={otherData[field.key] || ""}
                              onChange={(e) => handleOtherChange(field.key, e.target.value)}
                            />
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* SCALE */}
                  {field.type === "scale" && (
                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                        <span>{field.minLabel}</span>
                        <span>{field.maxLabel}</span>
                      </div>
                      <div className="flex justify-center gap-3">
                        {Array.from(
                          { length: (field.max || 5) - (field.min || 1) + 1 },
                          (_, i) => {
                            const value = (field.min || 1) + i;
                            const isSelected = formData[field.key] === String(value);
                            return (
                              <button
                                key={value}
                                type="button"
                                onClick={() => handleTextChange(field.key, String(value))}
                                className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 text-sm font-bold transition ${isSelected
                                  ? "border-maroon-600 bg-maroon-600 text-white"
                                  : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100"
                                  }`}
                              >
                                {value}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-maroon-600 py-4 text-base font-bold text-white shadow-lg shadow-maroon-200 transition hover:bg-maroon-700 active:scale-[0.98] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Submit Assessment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        <p className="mt-8 text-center text-xs text-slate-400">
          Leverate — AI Readiness Program
        </p>
      </div>
    </div>
  );
}
