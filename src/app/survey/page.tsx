"use client";

import { useState } from "react";
import { ClipboardCheck, Send, CheckCircle2, Loader2, User, Mail, Building2 } from "lucide-react";

const SURVEY_FIELDS = [
  { key: "AI_Usage_Frequency", label: "How often do you use AI tools (e.g. ChatGPT, Midjourney)?", type: "select", options: ["Daily", "Weekly", "Monthly", "Rarely", "Never"] },
  { key: "Primary_AI_Tool", label: "What is your primary AI tool for work?", type: "text", placeholder: "e.g. ChatGPT, Claude, etc." },
  { key: "Prompt_Engineering_Level", label: "Rate your prompt engineering skills (1-5)", type: "number", min: 1, max: 5 },
  { key: "AI_Impact_Expectation", label: "How much do you expect AI to impact your workflow?", type: "select", options: ["Significant Impact", "Moderate Impact", "Minor Impact", "No Impact"] },
];

export default function SurveyPage() {
  const [formData, setFormData] = useState<Record<string, string>>({
    Name: "",
    Email: "",
    Department: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/submit-survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "Submission failed. Please check your data.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Survey Submitted!</h1>
          <p className="mt-2 text-slate-600">
            Thank you for your participation. Your data has been recorded for the AI Readiness workshop.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="mt-8 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
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
          <div className="bg-indigo-600 p-8 text-white">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Employee AI Survey</h1>
            <p className="mt-2 text-indigo-100/80">
              Help us understand your current AI usage and expectations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Identity Section */}
              <div className="grid gap-6 sm:grid-cols-1">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                      placeholder="John Doe"
                      value={formData.Name}
                      onChange={(e) => handleChange("Name", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                      placeholder="john@company.com"
                      value={formData.Email}
                      onChange={(e) => handleChange("Email", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Department</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                      placeholder="Creative / Marketing / Tech"
                      value={formData.Department}
                      onChange={(e) => handleChange("Department", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100 my-8" />

              {/* Dynamic Fields Section */}
              {SURVEY_FIELDS.map((field) => (
                <div key={field.key}>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 appearance-none"
                      value={formData[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                    >
                      <option value="" disabled>Select an option</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      required
                      min={field.min}
                      max={field.max}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                      placeholder={field.placeholder}
                      value={formData[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-base font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-70"
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
