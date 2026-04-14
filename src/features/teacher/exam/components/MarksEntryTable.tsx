import { useRef } from "react";
import type { StudentMarkEntry, Grade } from "../types/exam-marks.types";
import { GRADE_CONFIG } from "../hooks/useExamMarks";

const AVATAR_COLORS = [
  "#6c63ff","#f59e0b","#10b981","#3b82f6","#ef4444",
  "#8b5cf6","#ec4899","#14b8a6","#f97316","#6366f1",
];

interface GradeBadgeProps { grade: Grade | null }
const GradeBadge = ({ grade }: GradeBadgeProps) => {
  if (!grade) return <span className="text-gray-300 text-xs">—</span>;
  const cfg = GRADE_CONFIG[grade];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${cfg.classes}`}>
      {grade}
    </span>
  );
};

interface Props {
  entries: StudentMarkEntry[];
  onUpdate: (studentId: string, field: keyof StudentMarkEntry, value: unknown) => void;
}

const MarksEntryTable = ({ entries, onUpdate }: Props) => {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
        <div className="text-4xl mb-3">📋</div>
        <p className="text-sm font-semibold text-gray-500">Select exam details and click Load Students</p>
        <p className="text-xs text-gray-300 mt-1">to begin entering marks</p>
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
              <th className="text-left text-[11px] font-bold uppercase tracking-widest text-gray-400 px-5 py-3.5 w-36">
                Marks <span className="text-gray-300 normal-case font-normal">/ 100</span>
              </th>
              <th className="text-left text-[11px] font-bold uppercase tracking-widest text-gray-400 px-5 py-3.5 w-24">Grade</th>
              <th className="text-left text-[11px] font-bold uppercase tracking-widest text-gray-400 px-5 py-3.5 hidden md:table-cell">Remarks</th>
              <th className="text-center text-[11px] font-bold uppercase tracking-widest text-gray-400 px-5 py-3.5 w-20">Absent</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr
                key={e.studentId}
                className={`border-b border-gray-50 last:border-0 transition-colors ${
                  e.isAbsent ? "bg-gray-50/80 opacity-60" : "hover:bg-gray-50/40"
                }`}
              >
                {/* Roll */}
                <td className="px-5 py-3">
                  <span className="text-sm font-bold text-gray-400">#{e.rollNo}</span>
                </td>

                {/* Student name + avatar */}
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                      style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                    >
                      {e.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{e.name}</p>
                  </div>
                </td>

                {/* Marks input */}
                <td className="px-5 py-3">
                  <div className="relative w-24">
                    <input
                      ref={(el) => { inputRefs.current[e.studentId] = el; }}
                      type="number"
                      min={0}
                      max={e.maxMarks}
                      disabled={e.isAbsent}
                      value={e.marks === "" ? "" : e.marks}
                      onChange={(ev) => {
                        const raw = ev.target.value;
                        if (raw === "") {
                          onUpdate(e.studentId, "marks", "");
                          return;
                        }
                        const val = Math.min(Math.max(0, Number(raw)), e.maxMarks);
                        onUpdate(e.studentId, "marks", val);
                      }}
                      placeholder="—"
                      className={`w-full h-9 rounded-xl border text-sm font-semibold text-center pr-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${
                        e.isAbsent
                          ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                          : e.marks !== "" && (e.marks as number) < 40
                          ? "border-red-200 bg-red-50 text-red-600"
                          : "border-gray-200 bg-white text-gray-800"
                      }`}
                    />
                  </div>
                </td>

                {/* Grade auto-calc badge */}
                <td className="px-5 py-3">
                  <GradeBadge grade={e.grade} />
                </td>

                {/* Remarks */}
                <td className="px-5 py-3 hidden md:table-cell">
                  <input
                    type="text"
                    disabled={e.isAbsent}
                    value={e.remarks}
                    onChange={(ev) => onUpdate(e.studentId, "remarks", ev.target.value)}
                    placeholder="Optional…"
                    maxLength={80}
                    className={`w-full h-9 rounded-xl border px-3 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${
                      e.isAbsent
                        ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                        : "border-gray-200 bg-white"
                    }`}
                  />
                </td>

                {/* Absent checkbox */}
                <td className="px-5 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={e.isAbsent}
                    onChange={(ev) => onUpdate(e.studentId, "isAbsent", ev.target.checked)}
                    className="w-4 h-4 rounded accent-red-500 cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarksEntryTable;
