import type { ReportCard } from "../types/exams.types";

export const SummaryCards = ({ report }: { report: ReportCard }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

      {/* ================= CARD 1 ================= */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-indigo-500 active:scale-[0.98]">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
          Overall Percentage
        </p>

        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl font-bold text-indigo-600">
            {report.percentage}%
          </h2>

          <span className="flex items-center text-xs font-medium text-green-600">
            <svg className="mr-0.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            +2.1%
          </span>
        </div>
      </div>

      {/* ================= CARD 2 ================= */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-indigo-500 active:scale-[0.98]">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
          Current Rank
        </p>

        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl font-bold text-gray-900">
            {String(report.rank).padStart(2, "0")}
          </h2>
          <span className="text-sm text-gray-500">out of 42</span>
        </div>
      </div>

      {/* ================= CARD 3 ================= */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-indigo-500 active:scale-[0.98]">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
          Attendance
        </p>

        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl font-bold text-gray-900">
            {report.attendance}%
          </h2>

          <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
            Excellent
          </span>
        </div>
      </div>

    </div>
  );
};