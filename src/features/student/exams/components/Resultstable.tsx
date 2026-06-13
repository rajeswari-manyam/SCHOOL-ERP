// components/ResultTable.tsx
import type { Result } from "../types/exams.types";
import { AlertCircle } from "lucide-react";

export const ResultTable = ({ results }: { results: Result[] }) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">

      {/* ===== DESKTOP TABLE ===== */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-indigo-50/70 border-b border-gray-100">
              <th className="px-2.5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 w-[35%]">
                Subject
              </th>
              <th className="px-2.5 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Marks Obtained
              </th>
              <th className="px-2.5 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Grade
              </th>
              <th className="px-2.5 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {results.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-2.5 py-3 text-sm font-medium text-gray-800">
                  {r.subject}
                </td>
                <td className="px-2.5 py-3 text-center text-sm text-gray-700">
                  {r.marks} / {r.total}
                </td>
                <td className="px-2.5 py-3 text-center text-sm font-semibold text-indigo-600">
                  {r.grade}
                </td>
                <td className="px-2.5 py-3 text-center">
                  {r.status === "pass" ? (
                    <svg className="h-4 w-4 text-green-500 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-red-500 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== MOBILE CARDS ===== */}
      <div className="md:hidden divide-y divide-gray-100">
        {results.map((r, i) => (
          <div key={i} className="px-2.5 py-3 flex items-center justify-between transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-800">{r.subject}</p>
              <p className="text-xs text-gray-500 mt-0.5">{r.marks} / {r.total}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-indigo-600">{r.grade}</span>
              {r.status === "pass" ? (
                <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ===== FOOTER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-gray-100 px-2.5 py-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          Results published on 05 Feb 2025. This is a computer-generated report.
        </div>
        <div className="flex items-center gap-4">
          <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
            Raise a Dispute
          </button>
          <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
            View Subject Analysis
          </button>
        </div>
      </div>

    </div>
  );
};