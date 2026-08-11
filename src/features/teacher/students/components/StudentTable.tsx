import { Fragment, useState } from "react";
import { AlertTriangle, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import type { Student } from "../types/my-students.types";
import StudentExpandedDetails from "./StudentExpandedDetails";

const PAGE_SIZE = 5;

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
}

const StudentTable = ({ students }: Props) => {
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
            <tr className="bg-[#EFF4FF] border-b border-gray-200">
              <th className="text-left text-xs text-gray-500 px-3 py-1.5 w-14">Roll</th>
              <th className="text-left text-xs text-gray-500 px-3 py-1.5">Student</th>
              <th className="text-left text-xs text-gray-500 px-3 py-1.5 hidden sm:table-cell">Class</th>
              <th className="text-left text-xs text-gray-500 px-3 py-1.5">Attendance</th>
              <th className="w-8 px-3 py-1.5" />
            </tr>
          </thead>
          <tbody>
            {pageRows.map((s, i) => {
              const isExpanded = expandedId === s.id;
              return (
              <Fragment key={s.id}>
                <tr
                  onClick={() => setExpandedId(isExpanded ? null : s.id)}
                  className={`border-b border-gray-100 last:border-0 hover:bg-[#EFF4FF] transition-colors cursor-pointer ${!s.isActive ? "opacity-60" : ""} ${isExpanded ? "bg-[#EFF4FF]" : ""}`}
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
                  <td className="px-3 py-1.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : s.id); }}
                      className="p-1 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="border-b border-gray-100 last:border-0 bg-gray-50/60">
                    <td colSpan={5} className="px-5">
                      <StudentExpandedDetails studentId={s.id} classId={s.classId} sectionId={s.sectionId} />
                    </td>
                  </tr>
                )}
              </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-t border-gray-100 bg-gray-50/40">
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
