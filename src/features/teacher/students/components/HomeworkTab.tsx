import type { Student } from "../types/my-students.types";
import { Check, AlertCircle } from "lucide-react";

const HW_STATUS = {
  SUBMITTED: { label: "Submitted", classes: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  PENDING:   { label: "Pending",   classes: "bg-amber-50  text-amber-700  border border-amber-200"    },
  LATE:      { label: "Late",      classes: "bg-red-50    text-red-600    border border-red-200"       },
};

const HomeworkTab = ({ student }: { student: Student }) => {
  const submitted = student.homework.filter((h) => h.status === "SUBMITTED").length;
  const pending   = student.homework.filter((h) => h.status === "PENDING").length;

  return (
    <div className="flex flex-col gap-4">
      {/* Summary */}
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-2 p-3 bg-emerald-50 rounded-xl">
          <Check size={14} className="text-emerald-600" strokeWidth={2.5} />
          <div>
            <p className="text-sm font-extrabold text-emerald-700">{submitted}</p>
            <p className="text-[10px] text-emerald-500">Submitted</p>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-2 p-3 bg-amber-50 rounded-xl">
          <AlertCircle size={14} className="text-amber-500" strokeWidth={2.5} />
          <div>
            <p className="text-sm font-extrabold text-amber-600">{pending}</p>
            <p className="text-[10px] text-amber-500">Pending</p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {student.homework.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No homework records</p>
        ) : (
          student.homework.map((hw) => {
          
            const cfg = HW_STATUS[hw.status];
            return (
              <div key={hw.id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{hw.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{hw.subject} · Due {hw.dueDate}</p>
                  {hw.submittedDate && (
                    <p className="text-[10px] text-gray-300 mt-0.5">Submitted on {hw.submittedDate}</p>
                  )}
                </div>
                <span className={`flex-shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full ${cfg.classes}`}>
                  {cfg.label}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HomeworkTab;
