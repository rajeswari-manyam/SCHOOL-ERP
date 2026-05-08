// components/ResultTable.tsx
import type { Result } from "../types/exams.types";

export const ResultTable = ({ results }: { results: Result[] }) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-indigo-50/60">
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                Subject
              </th>
              <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                Marks Obtained
              </th>
              <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                Grade
              </th>
              <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {results.map((r, i) => (
              <tr key={i} className="transition hover:bg-gray-50/50">
                <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">
                  {r.subject}
                </td>

                <td className="px-5 py-3.5 text-center text-sm text-gray-700">
                  {r.marks} / {r.total}
                </td>

                <td className="px-5 py-3.5 text-center text-sm font-semibold text-indigo-600">
                  {r.grade}
                </td>

                <td className="px-5 py-3.5 text-center">
                  {r.status === "pass" ? (
                    <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                      <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden divide-y divide-gray-100 bg-white">
        {results.map((r, i) => (
          <div
            key={i}
            className="px-4 py-4 flex flex-col gap-3 transition-all duration-200 active:scale-[0.98] hover:bg-gray-50 hover:shadow-sm hover:-translate-y-[1px]"
          >
            {/* Top Row */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {r.subject}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Marks: {r.marks} / {r.total}
                </p>
              </div>

              {/* Status Badge */}
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  r.status === "pass"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {r.status === "pass" ? "Passed" : "Failed"}
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-indigo-600">
                Grade: {r.grade}
              </span>

              {r.status === "pass" ? (
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ================= FOOTER ================= */}
      <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Results published on 05 Feb 2025. This is a computer-generated report.
        </div>

        <div className="flex items-center gap-4">
          <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
            Raise a Dispute
          </button>
          <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
            View Subject Analysis
          </button>
        </div>
      </div>
    </div>
  );
};