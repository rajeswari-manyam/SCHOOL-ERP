import { Download } from "lucide-react";
import type { UpcomingExam } from "../types/timetable.types";
import { formatExamDate } from "../hooks/useTimetable";
interface Props {
  exams: UpcomingExam[];
}

const UpcomingExamsTable = ({ exams }: Props) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

    {/* Card header */}
    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
      <div>
        <h3 className="text-sm font-extrabold text-gray-900">Upcoming Examinations</h3>
        <p className="text-xs text-gray-400 mt-0.5">Scheduled exams for your classes</p>
      </div>
      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-[11px] font-bold border border-rose-100">
        {exams.length} upcoming
      </span>
    </div>

    {exams.length === 0 ? (
      <div className="py-12 text-center">
        <p className="text-sm text-gray-400">No upcoming examinations 🎉</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: 680 }}>
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Exam", "Subject", "Class", "Date", "Time", "Venue", "Hall Ticket"].map(h => (
                <th key={h}
                  className="px-5 py-3 text-left text-[11px] font-extrabold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {exams.map((exam, i) => (
              <tr key={exam.id}
                className={`border-b border-gray-50 transition-colors hover:bg-gray-50/60 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
                <td className="px-5 py-3.5">
                  <p className="text-sm font-semibold text-gray-800">{exam.exam}</p>
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    {exam.subject}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-sm font-medium text-gray-700">{exam.class}</p>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-sm font-semibold text-gray-800">{formatExamDate(exam.date)}</p>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-sm text-gray-600">{exam.time}</p>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-sm text-gray-600">{exam.venue}</p>
                </td>
                <td className="px-5 py-3.5">
                  {exam.hallTicketUrl ? (
                    <a href={exam.hallTicketUrl} download
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition-colors shadow-sm">
                     <Download size={12} className="text-current" strokeWidth={2.5} />
                      Download
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Not available</span>
                  )}
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
