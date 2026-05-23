import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <Modal
      open={open}
      onClose={onClose}
      title="Submit Marks for Review"
      description={selectorLabel}
      size="sm"
      footer={null}
    >
      <div>
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
            <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-xs text-amber-700 font-medium">
              Some students have empty marks and are not marked absent. Please review before submitting.
            </p>
          </div>
        )}

        {/* Confirmation checkbox */}
        <label className="flex items-start gap-3 cursor-pointer select-none bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 mb-5">
          <Input
            type="checkbox"
            checked={confirmChecked}
            onChange={(e) => onConfirmChange(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded accent-indigo-600 cursor-pointer"
            inputSize="sm"
          />
          <span className="text-xs text-indigo-800 font-medium leading-relaxed">
            I confirm that the marks entered are correct and ready for review by the academic coordinator.
            Once submitted, marks cannot be edited without approval.
          </span>
        </label>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            size="md"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={!confirmChecked}
            size="md"
            className="flex-1"
          >
            Submit Marks
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SubmitMarksModal;
