"use client";

import Link from "next/link";
import { ClipboardList, GraduationCap, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50">
      {/* Decorative background gradients */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-maroon-100/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-maroon-100/20 blur-3xl" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-center border-b border-slate-200/60 bg-white/80 px-6 py-4 backdrop-blur-sm sm:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Workshop AI Training
          </span>
        </Link>
      </nav>

      {/* Content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10">

        <div className="mt-10 grid w-full max-w-4xl gap-10 sm:grid-cols-2">
          <Link
            href="/survey"
            className="group flex flex-col items-center gap-5 rounded-3xl border border-slate-200 bg-white p-14 shadow-sm transition hover:border-maroon-200 hover:shadow-md"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-maroon-50 text-maroon-600 transition group-hover:bg-maroon-100">
              <ClipboardList className="h-10 w-10" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Survey Form
            </span>
            <p className="text-center text-base leading-relaxed text-slate-400">
              Share your experience with AI tools and current skill levels.
            </p>
            <span className="flex items-center gap-1.5 text-base font-medium text-maroon-500 transition group-hover:text-maroon-600">
              Fill out survey
              <ArrowRight className="h-5 w-5" />
            </span>
          </Link>

          <Link
            href="/assessment"
            className="group flex flex-col items-center gap-5 rounded-3xl border border-slate-200 bg-white p-14 shadow-sm transition hover:border-maroon-200 hover:shadow-md"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-maroon-50 text-maroon-600 transition group-hover:bg-maroon-100">
              <GraduationCap className="h-10 w-10" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Assessment Form
            </span>
            <p className="text-center text-base leading-relaxed text-slate-400">
              Test your knowledge and readiness for AI adoption.
            </p>
            <span className="flex items-center gap-1.5 text-base font-medium text-maroon-500 transition group-hover:text-maroon-600">
              Take assessment
              <ArrowRight className="h-5 w-5" />
            </span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <p className="relative z-10 py-4 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Leverate
      </p>
    </div>
  );
}
