"use client";

import { useState } from "react";
import { ClipboardCheck, Send, CheckCircle2, Loader2, User, ChevronDown } from "lucide-react";

// Maps form keys to Google Sheet header names
const HEADER_MAP: Record<string, string> = {
  Name: "Name",
  Email: "Email",
  Primary_Role: "What is your primary role within your organization/practice?",
  AI_Relationship: "How would you describe your current relationship with AI tools?",
  AI_Familiarity: "How familiar are you with current AI tools and technologies applicable to your creative work?",
  Tools_Used: "Which of these tools have you played around with? (Check all that apply)",
  Creative_Process: "In which part of your creative process does AI feel the most helpful?",
  Biggest_Challenge: "What's the biggest challenge you face when using AI?",
  Prompt_Language: "Which language do you feel most comfortable using when writing prompts?",
  Efficient_Action: "Based on your experience which action is more efficient?",
  Knowledge_Share: 'If we had a casual "Knowledge Share" session, what would you be most interested in?',
};

interface SurveyField {
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

const SURVEY_FIELDS: SurveyField[] = [
  {
    key: "Primary_Role",
    label: "What is your primary role within your organization/practice?",
    type: "text",
    placeholder: "e.g. Graphic Designer, Copywriter, Art Director...",
  },
  {
    key: "AI_Relationship",
    label: "How would you describe your current relationship with AI tools?",
    type: "select",
    options: ["Just curious", "Occasional helper", "Daily sidekick", "Not for me (yet)"],
    hasOther: true,
  },
  {
    key: "AI_Familiarity",
    label: "How familiar are you with current AI tools and technologies applicable to your creative work?",
    type: "scale",
    min: 1,
    max: 5,
    minLabel: "Not familiar at all",
    maxLabel: "Very familiar",
  },
  {
    key: "Tools_Used",
    label: "Which of these tools have you played around with? (Check all that apply)",
    type: "checkbox",
    options: [
      "Text-based (ChatGPT, Claude, Gemini)",
      "Image Gen (Midjourney, DALL-E, Adobe Firefly)",
      "Design/Video (Canva Magic Studio, Runway, Pika)",
      "Audio/Music (Suno, Udio, ElevenLabs)",
      "Workflow/Admin (Notion AI, Otter.ai)",
    ],
    hasOther: true,
  },
  {
    key: "Creative_Process",
    label: "In which part of your creative process does AI feel the most helpful?",
    type: "checkbox",
    options: [
      "Workflow/Admin (Notion AI, Otter.ai)",
      "Visual Exploration (moodboards, sketching ideas)",
      "Production (cleaning up files, resizing, basic editing)",
      "Refining & Polishing (fixing copy, adjusting colors)",
      "Research",
    ],
    hasOther: true,
  },
  {
    key: "Biggest_Challenge",
    label: "What's the biggest challenge you face when using AI?",
    type: "radio",
    options: [
      'Getting the "prompt" right (the output isn\'t what I want)',
      'Quality & Authenticity (it looks/sounds too "robotic")',
      "Ethical or Copyright concerns",
      "Finding the right time/space to use it in a busy schedule",
    ],
    hasOther: true,
  },
  {
    key: "Prompt_Language",
    label: "Which language do you feel most comfortable using when writing prompts?",
    type: "select",
    options: ["Indonesian", "English"],
    hasOther: true,
  },
  {
    key: "Efficient_Action",
    label: "Based on your experience which action is more efficient?",
    type: "select",
    options: ["Revising image with Gemini or AI tools", "Revising image with Photoshop"],
  },
  {
    key: "Knowledge_Share",
    label: 'If we had a casual "Knowledge Share" session, what would you be most interested in?',
    type: "checkbox",
    options: [
      "Mastering Prompt Engineering (how to talk to the AI)",
      "Legal & Ethical side of things",
      "AI for specific outputs (Video, 3D, or Branding)",
      "I'd rather see how other teams are using it",
    ],
    hasOther: true,
  },
];

export default function SurveyPage() {
  const [formData, setFormData] = useState<Record<string, string>>({ Name: "", Email: "" });
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
    for (const field of SURVEY_FIELDS) {
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
    };

    for (const field of SURVEY_FIELDS) {
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
      const res = await fetch("/api/submit-survey", {
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
          <h1 className="text-2xl font-bold text-slate-900">Survey Submitted!</h1>
          <p className="mt-2 text-slate-600">
            Thank you for your participation. Your data has been recorded for the AI Readiness workshop.
          </p>
          <button
            onClick={() => {
              setIsSuccess(false);
              setFormData({ Name: "", Email: "" });
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
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Employee AI Survey</h1>
            <p className="mt-2 text-maroon-100/80">
              Help us understand your current AI usage and expectations.
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
              </div>

              {/* Dynamic Fields */}
              {SURVEY_FIELDS.map((field) => (
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
                    Submit Survey
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
