import type { ExamResultSummary } from "../types/Exam.types";
import { getGradeColor } from "../utils/Exam.utils";

interface ResultsTableProps {
  result: ExamResultSummary;
  examOptions: { id: string; name: string }[];
  selectedId: string;
  onSelectExam: (id: string) => void;
}

export default function ResultsTable({ result, examOptions, selectedId, onSelectExam }: ResultsTableProps) {
  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-sm">
          <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Select Examination
          </label>
          <select
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            value={selectedId}
            onChange={(e) => onSelectExam(e.target.value)}
          >
            {examOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>

        <button className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
          Download Result PDF
        </button>
      </div>

      <div className="rounded-[1.75rem] bg-slate-50 p-6 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Overall Performance
        </p>
        <p className="mt-4 text-4xl font-semibold text-slate-950">
          {result.totalObtained} / {result.totalMax}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
            {result.percentage}%
          </span>
          <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
            {result.grade}
          </span>
          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
            {result.status}
          </span>
          <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
            Rank {result.rank}/{result.totalStudents}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.24em] text-slate-400">
            <tr>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Marks Obtained</th>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {result.subjects.map((s) => (
              <tr key={s.subject} className="hover:bg-slate-50">
                <td className="px-4 py-4 font-medium text-slate-900">{s.subject}</td>
                <td className="px-4 py-4 text-slate-500">{s.marksObtained} / {s.totalMarks}</td>
                <td className="px-4 py-4 font-semibold" style={{ color: getGradeColor(s.grade) }}>{s.grade}</td>
                <td className="px-4 py-4 text-emerald-600">✅</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 rounded-[1.75rem] border border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-slate-500">
          Results published on {result.publishedDate}. This is a computer-generated report.
        </span>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
            Raise a Dispute
          </button>
          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
            View Subject Analysis
          </button>
        </div>
      </div>
    </div>
  );
}