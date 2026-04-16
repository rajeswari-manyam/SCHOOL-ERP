import type { UpcomingExaminations } from "../types/Classtimetable.types";

interface ExaminationTableProps {
  examinations: UpcomingExaminations;
  onAddToCalendar?: () => void;
}

const SUBJECT_COLORS: Record<string, string> = {
  English:       "text-blue-600",
  Maths:         "text-green-600",
  Science:       "text-sky-600",
  "Social Studies": "text-yellow-600",
  Hindi:         "text-red-500",
};

const ExaminationTable = ({
  examinations,
  onAddToCalendar,
}: ExaminationTableProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <h2 className="text-sm font-bold text-gray-900">
        Upcoming Examinations — {examinations.title}
      </h2>
      <button
        onClick={onAddToCalendar}
        className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors uppercase tracking-wide"
      >
        📅 Add to Calendar
      </button>
    </div>

    {/* Table */}
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            {["Subject", "Date", "Day", "Time", "Venue"].map((h) => (
              <th
                key={h}
                className="py-3 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wide"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {examinations.exams.map((exam) => (
            <tr
              key={exam.id}
              className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
            >
              <td className="py-4 px-6">
                <span
                  className={`font-bold ${
                    SUBJECT_COLORS[exam.subject] ?? "text-indigo-600"
                  }`}
                >
                  {exam.subject}
                </span>
              </td>
              <td className="py-4 px-6 text-gray-700 font-medium">{exam.date}</td>
              <td className="py-4 px-6 text-gray-500">{exam.day}</td>
              <td className="py-4 px-6 text-gray-500 whitespace-nowrap">
                {exam.timeFrom} - {exam.timeTo}
              </td>
              <td className="py-4 px-6 text-gray-500">{exam.venue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ExaminationTable;