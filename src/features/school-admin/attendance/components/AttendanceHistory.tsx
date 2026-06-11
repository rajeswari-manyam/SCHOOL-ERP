import { useState } from "react";
import { Phone, MessageSquare, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { useChronicAbsentees } from "../hooks/useAttendance";

// ─── Avatar helpers ───────────────────────────────────────────────────────────
const COLORS = [
  "#6366F1", "#EF4444", "#F59E0B", "#10B981",
  "#8B5CF6", "#EC4899", "#06B6D4", "#14B8A6",
];
const avatarBg = (name: string) => COLORS[name.charCodeAt(0) % COLORS.length];
const initials = (name: string) =>
  name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

// ─── Absent days badge color ──────────────────────────────────────────────────
const badgeStyle = (days: number) => {
  if (days >= 8) return "bg-red-100 text-red-700";
  if (days >= 6) return "bg-orange-100 text-orange-700";
  return "bg-amber-100 text-amber-700";
};

// ─── Types from the API ───────────────────────────────────────────────────────
interface ChronicStudent {
  id: string;
  student_name: string;
  class_name?: string;
  section_name?: string;
  absent_days: number;
  last_absent_date?: string;
  parent_phone?: string;
  parent_name?: string;
  // fallback fields your backend might use
  name?: string;
  className?: string;
  absentDays?: number;
  lastAbsent?: string;
  parentPhone?: string;
}

const PAGE_SIZE = 8;

// ─── Main Component ───────────────────────────────────────────────────────────
const AttendanceHistory = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useChronicAbsentees();

  // Normalise field names — handles different possible backend shapes
  const raw: ChronicStudent[] = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? (data as ChronicStudent[])
    : [];

  const students = raw.map((s) => ({
    id:        s.id,
    name:      s.student_name ?? s.name ?? "Unknown",
    className: s.class_name ?? s.className ?? "—",
    section:   s.section_name ?? "",
    absentDays:s.absent_days  ?? s.absentDays ?? 0,
    lastAbsent:s.last_absent_date
      ? new Date(s.last_absent_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
      : s.lastAbsent ?? "—",
    parentPhone: s.parent_phone ?? s.parentPhone ?? "—",
  }));

  const totalPages = Math.max(1, Math.ceil(students.length / PAGE_SIZE));
  const paginated  = students.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5">

      {/* ── Chronic Absentees card ─────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Chronic Absentees</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Students absent more than 5 days this month
            </p>
          </div>
          {!isLoading && students.length > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
              <AlertTriangle className="w-3 h-3" />
              {students.length} student{students.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-36" />
                  <div className="h-2.5 bg-gray-100 rounded animate-pulse w-20" />
                </div>
                <div className="w-16 h-6 bg-gray-100 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="p-8 text-center">
            <p className="text-sm text-red-500 font-medium">Failed to load absentee data.</p>
            <p className="text-xs text-gray-400 mt-1">{(error as Error).message}</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && students.length === 0 && (
          <div className="p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-sm font-semibold text-gray-700">No chronic absentees</p>
            <p className="text-xs text-gray-400 mt-1">All students have good attendance this month.</p>
          </div>
        )}

        {/* Table */}
        {!isLoading && !error && paginated.length > 0 && (
          <>
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_6rem_7rem_8rem_10rem_6rem] gap-3 px-5 py-2.5 bg-gray-50/60 border-b border-gray-100">
              {["Student", "Class", "Absent Days", "Last Absent", "Parent Contact", "Actions"].map((h) => (
                <span key={h} className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                  {h}
                </span>
              ))}
            </div>

            <div className="divide-y divide-gray-50">
              {paginated.map((student) => (
                <div
                  key={student.id}
                  className="grid grid-cols-[1fr_6rem_7rem_8rem_10rem_6rem] gap-3 px-5 py-3.5 items-center hover:bg-gray-50/50 transition-colors"
                >
                  {/* Name + avatar */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ring-2 ring-white"
                      style={{ backgroundColor: avatarBg(student.name) }}
                    >
                      {initials(student.name)}
                    </div>
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {student.name}
                    </span>
                  </div>

                  {/* Class */}
                  <span className="text-sm text-gray-600">
                    {student.className}{student.section}
                  </span>

                  {/* Absent days badge */}
                  <div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${badgeStyle(student.absentDays)}`}>
                      {student.absentDays} days
                    </span>
                  </div>

                  {/* Last absent */}
                  <span className="text-sm text-gray-600">{student.lastAbsent}</span>

                  {/* Parent contact */}
                  <span className="text-sm text-gray-600 font-mono text-xs">{student.parentPhone}</span>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      title="Call parent"
                      className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                    <button
                      title="WhatsApp parent"
                      className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, students.length)} of {students.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                      p === page
                        ? "bg-indigo-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AttendanceHistory;