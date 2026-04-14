import { useState } from "react";
import type { Student, FeeStatus } from "../types/my-students.types";

// ── Fee Status Badge + Tooltip ─────────────────────────────────────────────
const FEE_CONFIG: Record<FeeStatus, { label: string; classes: string; tipTitle: string; tipColor: string }> = {
  PAID:    { label: "Paid",    classes: "bg-emerald-50 text-emerald-700 border border-emerald-200", tipTitle: "Fully Paid",     tipColor: "text-emerald-600" },
  PENDING: { label: "Pending", classes: "bg-amber-50  text-amber-700  border border-amber-200",   tipTitle: "Payment Pending", tipColor: "text-amber-600"   },
  PARTIAL: { label: "Partial", classes: "bg-blue-50   text-blue-700   border border-blue-200",    tipTitle: "Partial Payment", tipColor: "text-blue-600"    },
  OVERDUE: { label: "Overdue", classes: "bg-red-50    text-red-700    border border-red-200",     tipTitle: "Overdue!",        tipColor: "text-red-600"     },
};

interface FeeTooltipProps { student: Student }
const FeeStatusBadge = ({ student }: FeeTooltipProps) => {
  const [show, setShow] = useState(false);
  const cfg = FEE_CONFIG[student.feeStatus];
  const balance = student.feeTotal - student.feePaid;
  const pct = student.feeTotal > 0 ? Math.round((student.feePaid / student.feeTotal) * 100) : 0;

  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-default ${cfg.classes}`}>
        {cfg.label}
      </span>

      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
          <div className="bg-white border border-gray-150 rounded-xl shadow-xl p-3 w-52 text-left">
            <p className={`text-xs font-extrabold mb-2 ${cfg.tipColor}`}>{cfg.tipTitle}</p>
            {/* Progress bar */}
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all ${
                  student.feeStatus === "OVERDUE" ? "bg-red-500" :
                  student.feeStatus === "PAID"    ? "bg-emerald-500" :
                  student.feeStatus === "PARTIAL" ? "bg-blue-500" : "bg-amber-400"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Total</span>
                <span className="font-semibold text-gray-700">₹{student.feeTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Paid</span>
                <span className="font-semibold text-emerald-600">₹{student.feePaid.toLocaleString("en-IN")}</span>
              </div>
              {balance > 0 && (
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">Balance</span>
                  <span className={`font-bold ${student.feeStatus === "OVERDUE" ? "text-red-500" : "text-amber-500"}`}>
                    ₹{balance.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Due Date</span>
                <span className="font-semibold text-gray-600">{student.feeDueDate}</span>
              </div>
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white" />
          </div>
        </div>
      )}
    </div>
  );
};

// ── Attendance cell ────────────────────────────────────────────────────────
const AttCell = ({ pct }: { pct: number }) => {
  const color = pct >= 90 ? "text-emerald-600" : pct >= 75 ? "text-amber-600" : "text-red-500";
  const bar   = pct >= 90 ? "bg-emerald-500" : pct >= 75 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-bold ${color}`}>{pct}%</span>
      {pct < 75 && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      )}
    </div>
  );
};

// ── Main Table ────────────────────────────────────────────────────────────
interface Props {
  students: Student[];
  onView: (s: Student) => void;
}

const StudentTable = ({ students, onView }: Props) => {
  if (students.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-sm font-semibold text-gray-500">No students match your filters</p>
        <p className="text-xs text-gray-300 mt-1">Try adjusting the search or filters above</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-[11px] font-bold uppercase tracking-widest text-gray-400 px-5 py-3.5 w-14">Roll</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-widest text-gray-400 px-5 py-3.5">Student</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-widest text-gray-400 px-5 py-3.5 hidden sm:table-cell">Class</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-widest text-gray-400 px-5 py-3.5">Attendance</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-widest text-gray-400 px-5 py-3.5 hidden md:table-cell">Fee Status</th>
              <th className="text-right text-[11px] font-bold uppercase tracking-widest text-gray-400 px-5 py-3.5">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr
                key={s.id}
                className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors ${!s.isActive ? "opacity-60" : ""}`}
              >
                <td className="px-5 py-3.5">
                  <span className="text-sm font-bold text-gray-400">#{s.rollNo}</span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                      style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                    >
                      {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                      {!s.isActive && (
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">Inactive</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 hidden sm:table-cell">
                  <span className="text-sm text-gray-600">{s.className}</span>
                </td>
                <td className="px-5 py-3.5">
                  <AttCell pct={s.attendancePct} />
                </td>
                <td className="px-5 py-3.5 hidden md:table-cell">
                  <FeeStatusBadge student={s} />
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => onView(s)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AVATAR_COLORS = [
  "#6c63ff","#f59e0b","#10b981","#3b82f6","#ef4444",
  "#8b5cf6","#ec4899","#14b8a6","#f97316","#6366f1",
];

export default StudentTable;
