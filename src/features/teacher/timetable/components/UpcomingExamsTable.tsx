import { BookOpen } from "lucide-react";
import type { UpcomingExam } from "../types/timetable.types";
import { formatExamDate } from "../hooks/useTimetable";

interface Props {
  exams: UpcomingExam[];
}

const UpcomingExamsTable = ({ exams }: Props) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

    {/* Header */}
    <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div>
        <h3 className="text-[14px] font-semibold text-gray-900">Upcoming Examinations</h3>
        <p className="text-[12px] text-gray-400 mt-0.5">Scheduled exams for your classes</p>
      </div>
      <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-500 text-[11px] font-semibold border border-rose-100">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
        {exams.length} upcoming
      </span>
    </div>

    {exams.length === 0 ? (
      <div className="py-14 flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
          <BookOpen size={20} className="text-gray-300" strokeWidth={1.5} />
        </div>
        <p className="text-[13px] text-gray-400">No upcoming examinations</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: 680 }}>
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              {["Exam", "Subject", "Class", "Date", "Time", "Venue"].map((h) => (
                <th
                  key={h}
                  className={[
                    "px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap",
                    ["Time", "Venue"].includes(h) ? "hidden sm:table-cell" : "",
                  ].join(" ")}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr
                key={exam.id}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-5 py-3.5">
                  <p className="text-[13px] font-medium text-gray-800">{exam.exam}</p>
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    {exam.subject}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-[13px] text-gray-600">{exam.class}</p>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-[13px] font-medium text-gray-800">{formatExamDate(exam.date)}</p>
                </td>
                <td className="px-5 py-3.5 hidden sm:table-cell">
                  <p className="text-[13px] text-gray-500">{exam.time}</p>
                </td>
                <td className="px-5 py-3.5 hidden sm:table-cell">
                  <p className="text-[13px] text-gray-500">{exam.venue}</p>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default UpcomingExamsTable;