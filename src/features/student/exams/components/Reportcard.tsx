import type { ReportCard as ReportCardType } from "../types/Exam.types";
import { getMidtermColor } from "../utils/Exam.utils";
import { Button } from "@/components/ui/button";

interface ReportCardProps { data: ReportCardType; }

export default function ReportCard({ data }: ReportCardProps) {
  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-[1.75rem] bg-slate-50 p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Overall Percentage
          </p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">
            {data.overallPercentage}%
          </p>
          <span className="mt-2 block text-sm text-slate-500">
            ↗+{data.percentageChange}%
          </span>
        </div>
        <div className="rounded-[1.75rem] bg-slate-50 p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Current Rank
          </p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">
            {String(data.currentRank).padStart(2, "0")}
          </p>
          <span className="mt-2 block text-sm text-slate-500">
            out of {data.totalStudents}
          </span>
        </div>
        <div className="rounded-[1.75rem] bg-slate-50 p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Attendance
          </p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">
            {data.attendance}%
          </p>
          <span className="mt-2 block text-sm text-slate-500">
            {data.attendanceLabel}
          </span>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-semibold text-slate-900">Annual Consolidated Marks</span>
          <span className="rounded-full bg-indigo-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">
            {data.status}
          </span>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-white text-slate-500 text-xs uppercase tracking-[0.24em]">
              <tr>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">UT 1 (50)</th>
                <th className="px-4 py-3 text-left">UT 2 (50)</th>
                <th className="px-4 py-3 text-left">Midterm (100)</th>
                <th className="px-4 py-3 text-left">UT 3 (50)</th>
                <th className="px-4 py-3 text-left">Final (100)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {data.subjects.map((row) => (
                <tr key={row.subject} className="hover:bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-900">{row.subject}</td>
                  <td className="px-4 py-4 text-slate-600">{row.ut1 ?? "–"}</td>
                  <td className="px-4 py-4 text-slate-600">{row.ut2 ?? "–"}</td>
                  <td className="px-4 py-4 font-semibold" style={{ color: row.midterm ? getMidtermColor(row.midterm) : undefined }}>
                    {row.midterm ?? "–"}
                  </td>
                  <td className="px-4 py-4 text-slate-600">{row.ut3 ?? "–"}</td>
                  <td className="px-4 py-4 text-slate-600">{row.final ?? "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-slate-500">Last updated on {data.lastUpdated}</span>
          <Button className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
            Download Report Card PDF
          </Button>
        </div>
      </div>
    </div>
  );
}