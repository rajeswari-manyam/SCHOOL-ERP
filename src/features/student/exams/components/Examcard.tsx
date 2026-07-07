// components/ExamCard.tsx
import type { Exam } from "../types/exams.types";

export const ExamCard = ({ exam, daysLeft }: { exam: Exam; daysLeft: number }) => {
  return (
   <div className="w-full max-w-md mx-auto px-2 sm:px-0">
      {/* Purple Exam Card */}
<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4f46e5] via-[#6366f1] to-[#818cf8] p-5 text-white shadow-lg border border-transparent hover:border-white/30 transition-all duration-300 hover:shadow-xl">
        {/* Decorative calendar icon background */}
        <div className="absolute top-4 right-4 opacity-10">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z" />
          </svg>
        </div>

        <span className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
          Next Priority
        </span>

      <h2 className="text-lg sm:text-xl font-bold tracking-tight">
          Unit Test 1 — {exam.subject}
        </h2>

        <div className="mb-6 mt-2 flex items-center gap-2 text-sm text-white/80">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {exam.date}
        </div>

        <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/60">
          Countdown
        </p>

        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold">{daysLeft} days to go</span>

          <button className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 shadow-md transition hover:bg-gray-50 active:scale-95">
            Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
};