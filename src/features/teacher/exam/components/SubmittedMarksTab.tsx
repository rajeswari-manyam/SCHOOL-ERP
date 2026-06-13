import type { SubmittedExam, ExamStatus } from "../types/exam-marks.types";

const STATUS_CONFIG: Record<ExamStatus, { label: string; classes: string }> = {
  DRAFT:     { label: "Draft",     classes: "bg-gray-100 text-gray-500 border border-gray-200" },
  SUBMITTED: { label: "Submitted", classes: "bg-amber-50 text-amber-700 border border-amber-200" },
  APPROVED:  { label: "Approved",  classes: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  PUBLISHED: { label: "Published", classes: "bg-indigo-50 text-indigo-700 border border-indigo-200" },
};

interface Props {
  exams: SubmittedExam[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

const SubmittedMarksTab = ({ exams, loading, error, onRetry }: Props) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
        <div className="inline-block w-8 h-8 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin mb-3" />
        <p className="text-sm font-semibold text-gray-500">Loading submitted marks…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
        <div className="text-3xl mb-3 text-red-400">⚠</div>
        <p className="text-sm font-semibold text-gray-500 mb-2">Failed to load submitted marks</p>
        {onRetry && (
          <button onClick={onRetry} className="text-xs font-semibold text-indigo-600 hover:underline">
            Try again
          </button>
        )}
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
        <div className="text-4xl mb-3">📤</div>
        <p className="text-sm font-semibold text-gray-500">No submitted exams yet</p>
        <p className="text-xs text-gray-400 mt-1">Select a class, exam and subject above then switch to this tab</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["Exam", "Class · Subject", "Submitted On", "Appeared", "Avg", "Pass %", "Status", ""].map((h) => (
                <th
                  key={h}
                  className={`text-left text-[11px] font-bold uppercase tracking-widest text-gray-400 px-5 py-3.5 ${
                    h === "" ? "text-right" : ""
                  } ${["Appeared", "Avg", "Pass %"].includes(h) ? "hidden sm:table-cell" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {exams.map((ex) => {
              const cfg = STATUS_CONFIG[ex.status];
              return (
                <tr key={ex.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-semibold text-gray-900">{ex.examLabel}</p>
                    <p className="text-[11px] text-gray-400">{ex.academicYear}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm text-gray-700">{ex.className}</p>
                    <p className="text-[11px] text-gray-400">{ex.subject}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-gray-600">{ex.submittedOn}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="text-sm text-gray-700">{ex.appeared}/{ex.totalStudents}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="text-sm font-semibold text-indigo-600">{ex.average}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className={`text-sm font-bold ${ex.passRate >= 75 ? "text-emerald-600" : "text-amber-600"}`}>
                      {ex.passRate}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${cfg.classes}`}>
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {ex.status === "SUBMITTED" && (
                        <button className="text-xs font-semibold text-amber-600 hover:text-amber-800 hover:underline transition-colors">
                          Approve
                        </button>
                      )}
                      <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmittedMarksTab;
