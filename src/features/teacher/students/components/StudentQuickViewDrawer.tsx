import { useState } from "react";
import { Phone, Info, Check, AlertCircle, X } from "lucide-react";
import type { Student, AttendanceDay, StudentHomework } from "../types/my-students.types";

// ── Avatar colours (match table) ─────────────────────────────────────────
const AVATAR_COLORS = [
  "#6c63ff","#f59e0b","#10b981","#3b82f6","#ef4444",
  "#8b5cf6","#ec4899","#14b8a6","#f97316","#6366f1",
];

// ── Overview Tab ──────────────────────────────────────────────────────────
const OverviewTab = ({ student }: { student: Student }) => {
  const balance = student.feeTotal - student.feePaid;
  const pct = student.feeTotal > 0 ? Math.round((student.feePaid / student.feeTotal) * 100) : 0;
  const feeColor =
    student.feeStatus === "PAID"    ? "text-emerald-600 bg-emerald-50 border-emerald-200" :
    student.feeStatus === "OVERDUE" ? "text-red-600 bg-red-50 border-red-200" :
    student.feeStatus === "PARTIAL" ? "text-blue-600 bg-blue-50 border-blue-200" :
                                      "text-amber-600 bg-amber-50 border-amber-200";
  const barColor =
    student.feeStatus === "PAID"    ? "bg-emerald-500" :
    student.feeStatus === "OVERDUE" ? "bg-red-500"     :
    student.feeStatus === "PARTIAL" ? "bg-blue-500"    : "bg-amber-400";

  return (
    <div className="flex flex-col gap-5">
      {/* Parents */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Parent / Guardian</p>
        <div className="flex flex-col gap-2.5">
          {[
            { role: "Father", name: student.fatherName, phone: student.fatherPhone, icon: "👨" },
            { role: "Mother", name: student.motherName, phone: student.motherPhone, icon: "👩" },
          ].map(({ role, name, phone, icon }) => (
            <div key={role} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-lg flex-shrink-0">
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900">{name}</p>
                <p className="text-[11px] text-gray-400">{role}</p>
              </div>
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <Phone size={12} className="text-current" strokeWidth={2} />
                {phone}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Fee card */}
      <div className={`rounded-xl border p-4 ${feeColor}`}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-extrabold uppercase tracking-widest">Fee Status</p>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${feeColor}`}>
            {student.feeStatus}
          </span>
        </div>
        {/* Bar */}
        <div className="h-2 bg-white/60 rounded-full overflow-hidden mb-3">
          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[10px] opacity-60">Total</p>
            <p className="text-sm font-extrabold">₹{(student.feeTotal / 1000).toFixed(0)}k</p>
          </div>
          <div>
            <p className="text-[10px] opacity-60">Paid</p>
            <p className="text-sm font-extrabold">₹{(student.feePaid / 1000).toFixed(0)}k</p>
          </div>
          <div>
            <p className="text-[10px] opacity-60">Balance</p>
            <p className="text-sm font-extrabold">₹{(balance / 1000).toFixed(0)}k</p>
          </div>
        </div>
        <p className="text-[10px] opacity-60 mt-2">Due: {student.feeDueDate}</p>
      </div>
    </div>
  );
};

// ── Attendance Tab ────────────────────────────────────────────────────────
const DAY_LABELS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const MONTH_LABEL = "April 2025";

const AttendanceTab = ({ student }: { student: Student }) => {
  const days: AttendanceDay[] = student.attendanceDays;
  const present = days.filter((d) => d.status === "PRESENT").length;
  const absent  = days.filter((d) => d.status === "ABSENT").length;
  const total   = days.filter((d) => d.status === "PRESENT" || d.status === "ABSENT").length;

  // Build calendar grid (April 2025 starts on Tuesday — index 2)
  const startDow = new Date("2025-04-01").getDay();
  const cells: (AttendanceDay | null)[] = [
    ...Array(startDow).fill(null),
    ...days,
  ];

  const cellColor = (d: AttendanceDay) => {
    if (d.status === "PRESENT")  return "bg-emerald-100 text-emerald-700";
    if (d.status === "ABSENT")   return "bg-red-100 text-red-600";
    if (d.status === "HALF_DAY") return "bg-amber-100 text-amber-600";
    if (d.status === "HOLIDAY")  return "bg-indigo-50 text-indigo-300";
    return "bg-gray-50 text-gray-300"; // SUNDAY
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Present", value: present, color: "text-emerald-600 bg-emerald-50" },
          { label: "Absent",  value: absent,  color: "text-red-500 bg-red-50"        },
          { label: "This Month", value: `${student.attendancePct}%`,
            color: student.attendancePct < 75 ? "text-red-500 bg-red-50" : "text-indigo-600 bg-indigo-50" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl p-3 text-center ${color}`}>
            <p className="text-xl font-extrabold">{value}</p>
            <p className="text-[10px] font-semibold opacity-70 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Mini calendar */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">{MONTH_LABEL}</p>
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAY_LABELS.map((d) => (
            <div key={d} className="text-center text-[10px] font-bold text-gray-300 py-1">{d}</div>
          ))}
        </div>
        {/* Cells */}
        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((cell, i) => (
            <div key={i} className={`aspect-square flex items-center justify-center rounded-md text-[11px] font-semibold ${cell ? cellColor(cell) : ""}`}>
              {cell ? parseInt(cell.date.slice(-2)) : ""}
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-3">
          {[
            { label: "Present",  color: "bg-emerald-100" },
            { label: "Absent",   color: "bg-red-100"     },
            { label: "Holiday",  color: "bg-indigo-50"   },
          ].map(({ label, color }) => (
            <span key={label} className="flex items-center gap-1 text-[10px] text-gray-400">
              <span className={`w-3 h-3 rounded-sm ${color}`} /> {label}
            </span>
          ))}
        </div>
      </div>

      {/* Read-only note */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
        <Info size={14} className="text-amber-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
        <p className="text-[11px] text-amber-700">Attendance is read-only here. To mark or edit attendance, go to the <strong>Attendance</strong> section.</p>
      </div>
    </div>
  );
};

// ── Homework Tab ──────────────────────────────────────────────────────────
const HW_STATUS: Record<StudentHomework["status"], { label: string; classes: string }> = {
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

// ── Main Drawer ───────────────────────────────────────────────────────────
type DrawerTab = "overview" | "attendance" | "homework";

interface Props {
  student: Student | null;
  open: boolean;
  onClose: () => void;
  studentIndex?: number;
}

const StudentQuickViewDrawer = ({ student, open, onClose, studentIndex = 0 }: Props) => {
  const [activeTab, setActiveTab] = useState<DrawerTab>("overview");

  if (!student) return null;

  const avatarColor = AVATAR_COLORS[studentIndex % AVATAR_COLORS.length];
  const initials = student.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  const tabs: { id: DrawerTab; label: string }[] = [
    { id: "overview",   label: "Overview"   },
    { id: "attendance", label: "Attendance" },
    { id: "homework",   label: "Homework"   },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ width: 380 }}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0"
                style={{ background: avatarColor }}
              >
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-gray-900">{student.name}</h3>
                  {student.isActive ? (
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full">Active</span>
                  ) : (
                    <span className="text-[10px] font-bold bg-gray-100 text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full">Inactive</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Roll #{student.rollNo} · {student.className}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <X size={16} className="text-current" strokeWidth={2.5} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-0.5 bg-gray-100 rounded-xl p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === t.id
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {activeTab === "overview"   && <OverviewTab   student={student} />}
          {activeTab === "attendance" && <AttendanceTab student={student} />}
          {activeTab === "homework"   && <HomeworkTab   student={student} />}
        </div>
      </div>
    </>
  );
};

export default StudentQuickViewDrawer;
