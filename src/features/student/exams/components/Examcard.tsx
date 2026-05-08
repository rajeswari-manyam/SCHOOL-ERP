// components/ExamCard.tsx
import { CalendarDays, CalendarPlus, CheckCircle2 } from "lucide-react";
import type { Exam } from "../types/exams.types";

type CheckItem = { label: string; checked: boolean; disabled?: boolean };

const checks: CheckItem[] = [
  { label: "Download English Syllabus", checked: true },
  { label: "Review Previous Year Papers", checked: false },
  { label: "Collect Admit Card", checked: false, disabled: true },
];

export const ExamCard = ({ exam, daysLeft }: { exam: Exam; daysLeft: number }) => {
  return (
    <div className="w-full max-w-md mx-auto space-y-4 px-2 sm:px-0">
      {/* Purple Exam Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4f46e5] via-[#6366f1] to-[#818cf8] p-5 text-white shadow-lg border border-transparent hover:border-white/30 transition-all duration-300 hover:shadow-xl">
        {/* Decorative calendar icon background */}
        <div className="absolute top-4 right-4 opacity-10">
          <CalendarDays size={80} />
        </div>

        <span className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
          Next Priority
        </span>

        <h2 className="text-lg sm:text-xl font-bold tracking-tight">
          Unit Test 1 — {exam.subject}
        </h2>

        <div className="mb-6 mt-2 flex items-center gap-2 text-sm text-white/80">
          <CalendarDays size={16} />
          {exam.date}
        </div>

        <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/60">
          Countdown
        </p>

        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold">{daysLeft} days to go</span>

          <button className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 shadow-md transition hover:bg-gray-50 active:scale-95">
            <CalendarPlus size={15} />
            Add to Calendar
          </button>
        </div>
      </div>

      {/* White Checklist Card */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 hover:border-indigo-500 hover:shadow-md transition-all duration-300">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
          Preparation Checklist
        </p>

        <div className="space-y-3">
          {checks.map((c) => (
            <label
              key={c.label}
              className={`flex cursor-pointer items-center gap-3 text-sm transition ${
                c.checked
                  ? "text-gray-400 line-through"
                  : c.disabled
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700"
              }`}
            >
              <CheckCircle2
                size={20}
                className={`shrink-0 ${
                  c.checked
                    ? "text-indigo-500 fill-indigo-100"
                    : c.disabled
                    ? "text-gray-300"
                    : "text-gray-300"
                }`}
              />
              <span className="select-none">{c.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};