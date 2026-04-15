import type { ExamScheduleEntry } from "../types/timetable.types";

interface ExamScheduleTableProps {
  exams: ExamScheduleEntry[];
  isLoading: boolean;
  notifyParents: boolean;
  onToggleNotify: (val: boolean) => void;
  onAddExam: () => void;
  onEditExam: (exam: ExamScheduleEntry) => void;
  onDeleteExam: (id: string) => void;
  onResendNotification: () => void;
  isResending: boolean;
  lastNotifiedText?: string;
}

const ExamScheduleTable = ({
  exams, isLoading, notifyParents, onToggleNotify, onAddExam,
  onEditExam, onDeleteExam, onResendNotification, isResending, lastNotifiedText,
}: ExamScheduleTableProps) => {
  const COL = "text-[11px] font-semibold uppercase tracking-widest text-gray-500 px-4 py-3 text-left";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Exam Timetable</h2>
          <p className="text-sm text-gray-400 mt-0.5">Final Assessment Schedule</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Notify Parents toggle */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Notify Parents</span>
            <button
              type="button"
              onClick={() => onToggleNotify(!notifyParents)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifyParents ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${notifyParents ? "translate-x-6" : "translate-x-1"}`} />
            </button>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={notifyParents ? "#25d366" : "#9ca3af"} strokeWidth="2" strokeLinecap="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </div>
          <button
            onClick={onAddExam}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="6.5" y1="1" x2="6.5" y2="12" /><line x1="1" y1="6.5" x2="12" y2="6.5" />
            </svg>
            Add Exam
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px]">
          <thead>
            <tr className="border-b border-gray-50">
              <th className={COL}>Subject</th>
              <th className={COL}>Class</th>
              <th className={COL}>Date</th>
              <th className={COL}>Day</th>
              <th className={COL}>Time</th>
              <th className={COL}>Venue</th>
              <th className={COL}>Notify</th>
              <th className={COL}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading
              ? [...Array(4)].map((_, i) => (
                <tr key={i}>
                  {[...Array(8)].map((_, j) => (
                    <td key={j} className="px-4 py-4">
                      <div className="animate-pulse h-3 rounded bg-gray-100 w-20" />
                    </td>
                  ))}
                </tr>
              ))
              : exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">{exam.subject}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{exam.className}</td>
                  <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">{exam.date}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{exam.day}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {exam.startTime} – {exam.endTime}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{exam.venue}</td>
                  <td className="px-4 py-4">
                    {exam.notified ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500">
                        <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                          <polyline points="2 6 5 9 10 3" />
                        </svg>
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200">
                        <svg width="12" height="12" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
                          <line x1="4" y1="4" x2="8" y2="8" /><line x1="8" y1="4" x2="4" y2="8" />
                        </svg>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEditExam(exam)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Edit exam"
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M11 2a1.414 1.414 0 012 2L4.5 12.5l-3 1 1-3L11 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDeleteExam(exam.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete exam"
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <polyline points="3 6 5 6 13 6" /><path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {lastNotifiedText && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-amber-50/50">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-xs font-semibold text-amber-700">{lastNotifiedText}</p>
          </div>
          <button
            onClick={onResendNotification}
            disabled={isResending}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wide disabled:opacity-60 flex items-center gap-1.5"
          >
            {isResending ? (
              <>
                <svg className="animate-spin" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" />
                </svg>
                Sending…
              </>
            ) : "Resend Notification"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ExamScheduleTable;