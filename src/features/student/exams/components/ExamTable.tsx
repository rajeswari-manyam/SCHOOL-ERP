// components/ExamTable.tsx
import React from "react";
import {
  BookOpen,
  LayoutGrid,
  FlaskConical,
  Globe,
  Languages,
  Download,
  CalendarPlus,
  Info,
} from "lucide-react";
import type { Exam } from "../types/exams.types";

const venueStyle: Record<string, string> = {
  "Hall A": "bg-indigo-50 text-indigo-600",
  "Hall B": "bg-blue-50 text-blue-600",
  "Lab 1":  "bg-orange-50 text-orange-600",
};

const subjectIcons: Record<string, { bg: string; icon: React.ReactNode }> = {
  English: {
    bg: "bg-indigo-50",
    icon: <BookOpen className="h-4 w-4 text-indigo-500" />,
  },
  Mathematics: {
    bg: "bg-purple-50",
    icon: <LayoutGrid className="h-4 w-4 text-purple-500" />,
  },
  Science: {
    bg: "bg-blue-50",
    icon: <FlaskConical className="h-4 w-4 text-blue-500" />,
  },
  "Social Studies": {
    bg: "bg-cyan-50",
    icon: <Globe className="h-4 w-4 text-cyan-500" />,
  },
  Hindi: {
    bg: "bg-pink-50",
    icon: <Languages className="h-4 w-4 text-pink-500" />,
  },
};

const fallbackSubject = {
  bg: "bg-gray-50",
  icon: <BookOpen className="h-4 w-4 text-gray-500" />,
};

export const ExamTable = ({ exams }: { exams: Exam[] }) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h3 className="text-base font-semibold text-gray-900">Exam Timetable</h3>
        <button className="flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 transition hover:bg-indigo-100">
          <Download className="h-3.5 w-3.5" />
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {exams.map((e) => {
              const cfg = subjectIcons[e.subject] ?? fallbackSubject;
              return (
                <tr key={e.id} className="group transition hover:bg-indigo-50/40 hover:shadow-sm">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${cfg.bg}`}>
                        {cfg.icon}
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
            const cfg = subjectIcons[e.subject] ?? fallbackSubject;
            return (
              <div key={e.id} className="flex items-center justify-between px-4 py-4 rounded-xl transition border border-transparent hover:border-indigo-500 hover:bg-indigo-50/30 active:scale-[0.99]">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${cfg.bg} shrink-0`}>
                    {cfg.icon}
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-gray-900">{e.subject}</p>
                    <p className="text-xs text-gray-500">{e.date} · {e.startTime} – {e.endTime}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] sm:text-xs font-medium whitespace-nowrap ${venueStyle[e.venue] ?? "bg-gray-100 text-gray-600"}`}>
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
          <CalendarPlus className="h-5 w-5" />
          Add all to Google Calendar
        </button>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Info className="h-4 w-4 text-gray-400" />
          Exam rules and regulations apply. Please reach the hall 30 mins early.
        </div>
      </div>
    </div>
  );
};