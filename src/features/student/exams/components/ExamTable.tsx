// components/ExamTable.tsx
import React from "react"; // Add this import
import type { Exam } from "../types/exams.types";

const venueStyle: Record<string, string> = {
  "Hall A": "bg-indigo-50 text-indigo-600",
  "Hall B": "bg-blue-50 text-blue-600",
  "Lab 1":  "bg-orange-50 text-orange-600",
};

// Fix: Use React.ReactNode instead of JSX.Element
const subjectIcons: Record<string, { bg: string; icon: React.ReactNode }> = {
  English: {
    bg: "bg-indigo-50",
    icon: (
      <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  Mathematics: {
    bg: "bg-purple-50",
    icon: (
      <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  Science: {
    bg: "bg-blue-50",
    icon: (
      <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  "Social Studies": {
    bg: "bg-cyan-50",
    icon: (
      <svg className="h-4 w-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  Hindi: {
    bg: "bg-pink-50",
    icon: (
      <svg className="h-4 w-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
  },
};

export const ExamTable = ({ exams }: { exams: Exam[] }) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h3 className="text-base font-semibold text-gray-900">Exam Timetable</h3>
        <button className="flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 transition hover:bg-indigo-100">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export PDF
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-50/80 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-5 py-3 text-left">Subject</th>
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-left">Time</th>
              <th className="px-5 py-3 text-left">Venue</th>
              <th className="px-5 py-3 text-left">Syllabus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {exams.map((e) => {
              const subjectConfig = subjectIcons[e.subject] ?? {
                bg: "bg-gray-50",
                icon: (
                  <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
              };

              return (
               <tr
  key={e.id}
  className="group transition hover:bg-indigo-50/40 hover:shadow-sm"
>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${subjectConfig.bg}`}>
                        {subjectConfig.icon}
                      </div>
                      <span className="font-semibold text-gray-900">{e.subject}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{e.date}</td>
                  <td className="px-5 py-4 text-gray-600">{e.startTime} – {e.endTime}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${venueStyle[e.venue] ?? "bg-gray-100 text-gray-600"}`}>
                      {e.venue}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 max-w-[220px]">
                    <span className="line-clamp-2" title={e.syllabus || undefined}>
                      {e.syllabus || "—"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
    <div className="md:hidden px-2">
       <div className="space-y-2">
          {exams.map((e) => {
            const subjectConfig = subjectIcons[e.subject] ?? {
              bg: "bg-gray-50",
              icon: (
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              ),
            };

            return (
            <div
  key={e.id}
  className="flex items-center justify-between px-4 py-4 rounded-xl transition border border-transparent hover:border-indigo-200 hover:bg-indigo-50/30 active:scale-[0.99]"
>
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${subjectConfig.bg} shrink-0`}>
                    {subjectConfig.icon}
                  </div>
                  <div>
                   <p className="text-sm sm:text-base font-semibold text-gray-900">{e.subject}</p>
                    <p className="text-xs text-gray-500">{e.date} · {e.startTime} – {e.endTime}</p>
                    {e.syllabus && (
                      <p className="text-xs text-gray-400 mt-0.5">Syllabus: {e.syllabus}</p>
                    )}
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] sm:text-xs font-medium whitespace-nowrap  ${venueStyle[e.venue] ?? "bg-gray-100 text-gray-600"}`}>
                  {e.venue}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <button className="flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v6m-3-3h6" />
          </svg>
          Add all to Google Calendar
        </button>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Exam rules and regulations apply. Please reach the hall 30 mins early.
        </div>
      </div>
    </div>
  );
};