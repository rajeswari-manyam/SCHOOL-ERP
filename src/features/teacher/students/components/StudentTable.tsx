import { useState } from "react";
import { AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import type { Student, FeeStatus } from "../types/my-students.types";

const PAGE_SIZE = 5;

// ── Fee Status Badge ─────────────────────────────────────────────────────────
const FEE_CONFIG: Record<FeeStatus, { label: string; classes: string; tipTitle: string; tipColor: string }> = {
  PAID:    { label: "Paid",    classes: "bg-emerald-50 text-emerald-700 border border-emerald-200", tipTitle: "Fully Paid",     tipColor: "text-emerald-600" },
  PENDING: { label: "Pending", classes: "bg-amber-50  text-amber-700  border border-amber-200",    tipTitle: "Payment Pending", tipColor: "text-amber-600"   },
  PARTIAL: { label: "Partial", classes: "bg-blue-50   text-blue-700   border border-blue-200",     tipTitle: "Partial Payment", tipColor: "text-blue-600"    },
  OVERDUE: { label: "Overdue", classes: "bg-red-50    text-red-700    border border-red-200",      tipTitle: "Overdue!",        tipColor: "text-red-600"     },
};

const FeeStatusBadge = ({ student }: { student: Student }) => {
  const [show, setShow] = useState(false);
  const cfg = FEE_CONFIG[student.feeStatus];
  const balance = student.feeTotal - student.feePaid;
  const pct = student.feeTotal > 0 ? Math.round((student.feePaid / student.feeTotal) * 100) : 0;

  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium cursor-default ${cfg.classes}`}>
        {cfg.label}
      </span>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
          <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-52 text-left">
            <p className={`text-xs font-semibold mb-2 ${cfg.tipColor}`}>{cfg.tipTitle}</p>
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
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Total</span>
                <span className="font-medium text-gray-700">₹{student.feeTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Paid</span>
                <span className="font-medium text-emerald-600">₹{student.feePaid.toLocaleString("en-IN")}</span>
              </div>
              {balance > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Balance</span>
                  <span className={`font-medium ${student.feeStatus === "OVERDUE" ? "text-red-500" : "text-amber-500"}`}>
                    ₹{balance.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Due Date</span>
                <span className="font-medium text-gray-600">{student.feeDueDate}</span>
              </div>
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white" />
          </div>
        </div>
      )}
    </div>
  );
};

// ── Attendance cell ──────────────────────────────────────────────────────────
const AttCell = ({ pct }: { pct: number }) => {
  const color = pct >= 90 ? "text-emerald-600" : pct >= 75 ? "text-amber-600" : "text-red-500";
  const bar   = pct >= 90 ? "bg-emerald-500" : pct >= 75 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden shrink-0">
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-medium ${color}`}>{pct}%</span>
      {pct < 75 && <AlertTriangle size={12} className="text-red-500 shrink-0" strokeWidth={2} />}
    </div>
  );
};

// ── Main Table ───────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "#6c63ff","#f59e0b","#10b981","#3b82f6","#ef4444",
  "#8b5cf6","#ec4899","#14b8a6","#f97316","#6366f1",
];

interface Props {
  students: Student[];
  onView: (s: Student) => void;
}

const StudentTable = ({ students, onView }: Props) => {
  const [page, setPage] = useState(1);

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-16 text-center">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-sm font-medium text-gray-500">No students match your filters</p>
        <p className="text-xs text-gray-400 mt-1">Try adjusting the search or filters above</p>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(students.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageRows = students.slice(start, start + PAGE_SIZE);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left text-xs text-gray-500 px-3 py-1.5 w-14">Roll</th>
              <th className="text-left text-xs text-gray-500 px-3 py-1.5">Student</th>
              <th className="text-left text-xs text-gray-500 px-3 py-1.5 hidden sm:table-cell">Class</th>
              <th className="text-left text-xs text-gray-500 px-3 py-1.5">Attendance</th>
              <th className="text-left text-xs text-gray-500 px-3 py-1.5 hidden md:table-cell">Fee Status</th>
              <th className="text-right text-xs text-gray-500 px-3 py-1.5">Action</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((s, i) => (
              <tr
                key={s.id}
                className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${!s.isActive ? "opacity-60" : ""}`}
              >
                <td className="px-3 py-1.5">
                  <span className="text-xs text-gray-500">#{s.rollNo}</span>
                </td>
                <td className="px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0 text-white"
                      style={{ background: AVATAR_COLORS[(start + i) % AVATAR_COLORS.length] }}
                    >
                      {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900">{s.name}</p>
                      {!s.isActive && (
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">Inactive</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-1.5 hidden sm:table-cell">
                  <span className="text-xs text-gray-600">{s.className}{s.section ? ` - ${s.section}` : ""}</span>
                </td>
                <td className="px-3 py-1.5">
                  <AttCell pct={s.attendancePct} />
                </td>
                <td className="px-3 py-1.5 hidden md:table-cell">
                  <FeeStatusBadge student={s} />
                </td>
                <td className="px-3 py-1.5 text-right">
                  <button
                    onClick={() => onView(s)}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-gray-50/40">
        <p className="text-xs text-gray-400">
          Showing <span className="font-semibold text-gray-700">{start + 1}–{Math.min(start + PAGE_SIZE, students.length)}</span> of{" "}
          <span className="font-semibold text-gray-700">{students.length}</span> students
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage((p) => p - 1)} disabled={page === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </button>
          <button
            onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentTable;
