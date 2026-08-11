// teacher/attendance/components/MyHistoryTab.tsx
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Calendar, ChevronDown, ChevronUp, Users, UserCheck, UserX, Pencil } from "lucide-react";
import EditAttendanceModal, { type EditAttendanceTarget } from "./EditAttendanceModal";

// ── Types matching the API response ──────────────────────────────────────────

interface RawStudent {
  student_id: string;
  student_name: string;
  roll_number: string;
  marked_time: string;
  status?: string;
}

interface RawSection {
  class_id: string;
  class_name: string;
  section_id: string;
  section_name: string;
  teacher_id: string;
  teacher_name: string;
  total_strength: number;
  marked_time: string;
  students: RawStudent[];
  absent_students: RawStudent[];
  summary: {
    total_strength: number;
    present_count: number;
    absent_count: number;
    halfday_count: number;
  };
}

interface RawDay {
  attendance_date: string;
  total_sections: number;
  sections: RawSection[];
}

export interface AttendanceSummaryResponse {
  status: boolean;
  teacher_id: string;
  from_date: string;
  to_date: string;
  total_days: number;
  data: RawDay[];
}

interface MyHistoryTabProps {
  teacherId: string;
  summaryData?: AttendanceSummaryResponse | null;
  isLoading?: boolean;
  fromDate: string;
  toDate: string;
  onFromDateChange: (d: string) => void;
  onToDateChange: (d: string) => void;
}

// ── Status pill styles ────────────────────────────────────────────────────────

const STATUS_PILL: Record<string, string> = {
  present:  "bg-emerald-50 text-emerald-700 border border-emerald-200",
  absent:   "bg-red-50 text-red-600 border border-red-200",
  halfday:  "bg-amber-50 text-amber-700 border border-amber-200",
  late:     "bg-orange-50 text-orange-700 border border-orange-200",
};

// ── Section card — expandable ─────────────────────────────────────────────────

const SectionCard = ({
  section, date, onEditRecord,
}: {
  section: RawSection; date: string; onEditRecord: (target: EditAttendanceTarget) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const { summary, students, class_name, section_name, marked_time } = section;

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      {/* Section header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex flex-wrap items-center justify-between gap-x-2 gap-y-1 px-3 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-bold text-gray-800 shrink-0">
            {class_name}-{section_name}
          </span>
          <span className="text-[10px] text-gray-400 truncate">{date} · {marked_time}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Mini stats */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <UserCheck size={11} />
              {summary.present_count}P
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-red-500">
              <UserX size={11} />
              {summary.absent_count}A
            </span>
            <span className="hidden sm:flex items-center gap-1 text-[11px] text-gray-400">
              <Users size={11} />
              {summary.total_strength} total
            </span>
          </div>
          {expanded ? (
            <ChevronUp size={12} className="text-gray-400 shrink-0" />
          ) : (
            <ChevronDown size={12} className="text-gray-400 shrink-0" />
          )}
        </div>
      </button>

      {/* Student list */}
      {expanded && (
        <div className="divide-y divide-gray-50">
          {students.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400 text-center">No student data.</p>
          ) : (
            students.map((s) => {
              const statusKey = s.status === "absent" ? "absent" : s.status === "late" ? "late" : "present";
              const currentStatus: EditAttendanceTarget["currentStatus"] =
                statusKey === "absent" ? "absent" : statusKey === "late" ? "late" : "present";
              return (
                <div
                  key={s.student_id}
                  className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50/60 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[11px] font-bold text-gray-500">
                      {s.roll_number}
                    </span>
                    <span className="text-sm text-gray-800 font-medium">{s.student_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                        STATUS_PILL[statusKey] ?? "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {s.status ?? "present"}
                    </span>
                    <button
                      onClick={() => onEditRecord({
                        studentId: s.student_id,
                        studentName: s.student_name,
                        rollNo: s.roll_number,
                        date,
                        currentStatus,
                      })}
                      title="Correct this attendance record"
                      className="p-1 rounded-lg text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Pencil size={12} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

const MyHistoryTab = ({
  summaryData,
  isLoading,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}: MyHistoryTabProps) => {
  const today = new Date().toISOString().slice(0, 10);
  const [editTarget, setEditTarget] = useState<EditAttendanceTarget | null>(null);

  const days: RawDay[] = useMemo(
    () => (Array.isArray(summaryData?.data) ? summaryData!.data : []),
    [summaryData]
  );

  // Aggregate totals across all days
  const totals = useMemo(() => {
    let present = 0, absent = 0, total = 0;
    days.forEach((d) =>
      d.sections.forEach((s) => {
        present += s.summary.present_count;
        absent  += s.summary.absent_count;
        total   += s.summary.total_strength;
      })
    );
    return { present, absent, total };
  }, [days]);

  return (
    <div className="flex flex-col gap-6">

      {/* ── Summary stats row ──────────────────────────────────────────────── */}
      {!isLoading && days.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Present", count: totals.present, cls: "bg-emerald-50 border-emerald-100 text-emerald-700" },
            { label: "Absent",  count: totals.absent,  cls: "bg-red-50 border-red-100 text-red-600" },
            { label: "Total",   count: totals.total,   cls: "bg-indigo-50 border-indigo-100 text-indigo-700" },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl border px-3 py-2 text-center ${s.cls}`}>
              <p className="text-lg font-extrabold">{s.count}</p>
              <p className="text-[10px] font-semibold opacity-80 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Date range picker ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3">
        <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
          <Calendar size={12} className="text-indigo-500" />
          Select Date Range
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
              From
            </label>
            <input
              type="date"
              value={fromDate}
              max={toDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-gray-200 text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors bg-gray-50"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
              To
            </label>
            <input
              type="date"
              value={toDate}
              min={fromDate}
              max={today}
              onChange={(e) => onToDateChange(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-gray-200 text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* ── Content area ───────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex items-center justify-center h-36 text-sm text-gray-400 animate-pulse">
          Loading attendance…
        </div>
      ) : days.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-12 text-center">
          <p className="text-sm text-gray-400">No attendance records found for selected date range.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {days.map((day) => (
            <div key={day.attendance_date} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Day header */}
              <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                <p className="text-xs font-bold text-gray-800">
                  {format(new Date(day.attendance_date), "EEEE, d MMMM yyyy")}
                </p>
                <span className="text-[10px] text-gray-400 font-semibold">
                  {day.total_sections} section{day.total_sections !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Sections */}
              <div className="px-4 py-3 flex flex-col gap-2">
                {day.sections.map((sec) => (
                  <SectionCard
                    key={`${sec.class_id}-${sec.section_id}`}
                    section={sec}
                    date={day.attendance_date}
                    onEditRecord={setEditTarget}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <EditAttendanceModal
        key={editTarget ? `${editTarget.studentId}-${editTarget.date}` : "none"}
        target={editTarget}
        onClose={() => setEditTarget(null)}
      />
    </div>
  );
};

export default MyHistoryTab;