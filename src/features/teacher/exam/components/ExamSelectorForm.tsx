import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExamSelector, ExamType } from "../types/exam-marks.types";
import {
  EXAM_TYPE_LABELS,
  CLASS_OPTIONS,
  SUBJECT_OPTIONS,
  ACADEMIC_YEAR_OPTIONS,
} from "../types/exam-marks.types";

interface Props {
  selector: ExamSelector;
  onChange: (s: ExamSelector) => void;
  onLoad: () => void;
  studentsLoaded: boolean;
}

const selectCls =
  "h-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition cursor-pointer w-full";

const ExamSelectorForm = ({ selector, onChange, onLoad, studentsLoaded }: Props) => {
  const set = (patch: Partial<ExamSelector>) => onChange({ ...selector, ...patch });

  const allSelected =
    selector.examType && selector.className && selector.subject && selector.academicYear;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
        Exam Selector
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {/* Exam Type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-500">Exam Type</label>
          <select
            value={selector.examType}
            onChange={(e) => set({ examType: e.target.value as ExamType | "" })}
            className={selectCls}
          >
            <option value="">Select…</option>
            {(Object.keys(EXAM_TYPE_LABELS) as ExamType[]).map((k) => (
              <option key={k} value={k}>{EXAM_TYPE_LABELS[k]}</option>
            ))}
          </select>
        </div>

        {/* Class */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-500">Class</label>
          <select
            value={selector.className}
            onChange={(e) => set({ className: e.target.value })}
            className={selectCls}
          >
            <option value="">Select…</option>
            {CLASS_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-500">Subject</label>
          <select
            value={selector.subject}
            onChange={(e) => set({ subject: e.target.value })}
            className={selectCls}
          >
            <option value="">Select…</option>
            {SUBJECT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Academic Year */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-500">Academic Year</label>
          <select
            value={selector.academicYear}
            onChange={(e) => set({ academicYear: e.target.value })}
            className={selectCls}
          >
            <option value="">Select…</option>
            {ACADEMIC_YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <Button
        onClick={onLoad}
        disabled={!allSelected}
        variant={allSelected ? "default" : "outline"}
        size="md"
        className={`flex items-center gap-2 w-full md:w-auto ${!allSelected ? "text-gray-400" : ""}`}
      >
        <Users size={14} className="text-current" />
        {studentsLoaded ? "Reload Students" : "Load Students"}
      </Button>
    </div>
  );
};

export default ExamSelectorForm;
