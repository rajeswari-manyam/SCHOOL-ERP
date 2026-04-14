import type { ExamSummary } from "../types/exam-marks.types";

interface Props {
  open: boolean;
  selectorLabel: string;
  summary: ExamSummary;
  confirmChecked: boolean;
  onConfirmChange: (v: boolean) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const SubmitMarksModal = ({
  open, selectorLabel, summary, confirmChecked, onConfirmChange, onSubmit, onClose,
}: Props) => {
  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      {/* Modal — 480px wide */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[480px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-extrabold text-gray-900">Submit Marks for Review</h2>
            {selectorLabel && (
              <p className="text-xs text-gray-400 mt-0.5">{selectorLabel}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Summary */}
        <div className="px-6 py-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Submission Summary</p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: "Total Students", value: summary.total,     color: "text-gray-800" },
              { label: "Appeared",       value: summary.appeared,  color: "text-emerald-600" },
              { label: "Absent",         value: summary.absent,    color: "text-red-500" },
              { label: "Average Marks",  value: summary.appeared ? summary.average : "—", color: "text-indigo-600" },
              { label: "Pass Rate",      value: summary.appeared ? `${summary.passRate}%` : "—", color: "text-emerald-600" },
              { label: "Failed",         value: summary.appeared ? summary.failCount : "—", color: "text-red-500" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">{label}</span>
                <span className={`text-sm font-extrabold ${color}`}>{value}</span>
              </div>
            ))}
          </div>

          {/* Warning if any student has empty marks and is not absent */}
          {summary.total > summary.appeared + summary.absent && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" className="mt-0.5 flex-shrink-0">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <p className="text-xs text-amber-700 font-medium">
                Some students have empty marks and are not marked absent. Please review before submitting.
              </p>
            </div>
          )}

          {/* Confirmation checkbox */}
          <label className="flex items-start gap-3 cursor-pointer select-none bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 mb-5">
            <input
              type="checkbox"
              checked={confirmChecked}
              onChange={(e) => onConfirmChange(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded accent-indigo-600 cursor-pointer"
            />
            <span className="text-xs text-indigo-800 font-medium leading-relaxed">
              I confirm that the marks entered are correct and ready for review by the academic coordinator.
              Once submitted, marks cannot be edited without approval.
            </span>
          </label>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-10 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={!confirmChecked}
              className={`flex-1 h-10 rounded-xl text-sm font-semibold transition-colors ${
                confirmChecked
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Submit Marks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitMarksModal;
