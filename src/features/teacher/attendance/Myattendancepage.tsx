import { useState } from "react";
import { format } from "date-fns";
import { Edit3, ClipboardCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import {
  useTodayAttendanceSummary,
  useTeacherAttendanceSummaryRange,
  useStaffAttendanceByStaffId,
} from "./hooks/useAttendance";
import MyHistoryTab from "./components/MyHistoryTab";
import CorrectionRequestModal from "./components/CorrectionRequestModal";
import MarkStudentAttendanceModal from "./components/MarkStudentAttendaceModal";
import type { StaffAttendanceRecord } from "@/services/attendance.api";

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_STYLE: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  present: { label: "Present",  bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  absent:  { label: "Absent",   bg: "bg-red-50 border-red-100",         text: "text-red-600",     dot: "bg-red-500"     },
  halfday: { label: "Half Day", bg: "bg-amber-50 border-amber-100",     text: "text-amber-700",   dot: "bg-amber-500"   },
  leave:   { label: "On Leave", bg: "bg-purple-50 border-purple-100",   text: "text-purple-700",  dot: "bg-purple-500"  },
  late:    { label: "Late",     bg: "bg-orange-50 border-orange-100",   text: "text-orange-700",  dot: "bg-orange-500"  },
};

// ── My Attendance tab ─────────────────────────────────────────────────────────
const MyStaffAttendanceTab = ({ staffId }: { staffId: string }) => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year,  setYear]  = useState(now.getFullYear());

  const { data: apiData, isLoading } = useStaffAttendanceByStaffId(staffId);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear();
    if (isCurrentMonth) return;
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };
  const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear();

  const monthLabel = format(new Date(year, month - 1, 1), "MMMM yyyy");
  const todayStr = now.toISOString().slice(0, 10);

  // Filter all records to the selected month/year
  const allRecords: StaffAttendanceRecord[] = apiData?.data ?? [];
  const records = allRecords
    .filter((r) => {
      const d = new Date(r.date);
      return d.getMonth() + 1 === month && d.getFullYear() === year;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  // Compute summary from filtered records
  const summary = {
    present: records.filter((r) => r.status === "present").length,
    absent:  records.filter((r) => r.status === "absent").length,
    leave:   records.filter((r) => r.status === "leave").length,
    halfday: records.filter((r) => r.status === "halfday").length,
  };

  const todayRecord = records.find((r) => r.date === todayStr);
  const todayStyle = todayRecord ? STATUS_STYLE[todayRecord.status] : null;

  return (
    <div className="flex flex-col gap-5">

      {/* Month navigator */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-3">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={16} className="text-gray-600" />
        </button>
        <div className="text-center">
          <p className="text-sm font-bold text-gray-800">{monthLabel}</p>
          {todayStyle && isCurrentMonth && (
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${todayStyle.bg} ${todayStyle.text}`}>
              Today: {todayStyle.label}
            </span>
          )}
        </div>
        <button
          onClick={nextMonth}
          disabled={isCurrentMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Summary stat cards */}
      {records.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Present",  value: summary.present, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
            { label: "Absent",   value: summary.absent,  color: "text-red-500",     bg: "bg-red-50 border-red-100"         },
            { label: "Leave",    value: summary.leave,   color: "text-purple-600",  bg: "bg-purple-50 border-purple-100"   },
            { label: "Half Day", value: summary.halfday, color: "text-amber-500",   bg: "bg-amber-50 border-amber-100"     },
          ].map((item) => (
            <div key={item.label} className={`rounded-xl border px-3 py-3 text-center ${item.bg}`}>
              <p className={`text-2xl font-extrabold ${item.color}`}>{item.value}</p>
              <p className="text-[11px] font-semibold text-gray-500 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Records list */}
      {isLoading ? (
        <div className="flex items-center justify-center h-36 text-sm text-gray-400 animate-pulse">
          Loading…
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-12 text-center">
          <p className="text-sm text-gray-400">No attendance records for this month.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Attendance Records</p>
          </div>
          <div className="divide-y divide-gray-50">
            {records.map((rec) => {
                const style = STATUS_STYLE[rec.status] ?? { label: rec.status, bg: "bg-gray-50 border-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
                const isToday = rec.date === todayStr;
                return (
                  <div
                    key={rec.id}
                    className={`flex items-center justify-between px-5 py-3 hover:bg-gray-50/60 transition-colors ${isToday ? "bg-indigo-50/40" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {format(new Date(rec.date), "EEE, d MMM yyyy")}
                          {isToday && <span className="ml-2 text-[10px] font-bold text-indigo-500">TODAY</span>}
                        </p>
                        {rec.remarks && (
                          <p className="text-[11px] text-gray-400 mt-0.5">{rec.remarks}</p>
                        )}
                      </div>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${style.bg} ${style.text}`}>
                      {style.label}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { key: "class", label: "Class Attendance" },
  { key: "mine",  label: "My Attendance"    },
];
type TabKey = "class" | "mine";

// ── Page ──────────────────────────────────────────────────────────────────────
const MyAttendancePage = () => {
  const activeTeacherId = useAuthStore((s) => s.user?.id ?? "");
  const todayStr = new Date().toISOString().slice(0, 10);
  const [historyFromDate, setHistoryFromDate] = useState(todayStr);
  const [historyToDate,   setHistoryToDate]   = useState(todayStr);
  const [activeTab, setActiveTab] = useState<TabKey>("class");
  const [markAttendanceOpen, setMarkAttendanceOpen] = useState(false);

  const { data: todayData, isLoading: todayLoading } = useTodayAttendanceSummary(activeTeacherId);
  const { data: rangeSummaryData, isLoading: rangeLoading } = useTeacherAttendanceSummaryRange(
    activeTeacherId, historyFromDate, historyToDate
  );

  const today = todayData ?? {
    isMarked: false, totalStudents: 0, classLabel: "—", date: todayStr, absentStudents: [],
  };

  type CorrectionPrefill = { date: string; studentId: string; studentName: string; rollNo: string; currentMark: "P" | "A" | "H" };
  const [correctionOpen,    setCorrectionOpen]    = useState(false);
  const [correctionPrefill, setCorrectionPrefill] = useState<CorrectionPrefill | undefined>(undefined);

  if (todayLoading) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-500">
        Loading attendance…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 min-h-full p-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Attendance</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {format(new Date(), "EEEE, d MMMM yyyy")}
            {today.classLabel && today.classLabel !== "—" && ` · Class ${today.classLabel}`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap self-start">
          <button
            onClick={() => setMarkAttendanceOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <ClipboardCheck size={14} />
            Mark Attendance
            {!today.isMarked && <span className="ml-1 w-2 h-2 rounded-full bg-red-400 animate-pulse" />}
          </button>
          <button
            onClick={() => { setCorrectionPrefill(undefined); setCorrectionOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Edit3 size={14} />
            Request Correction
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as TabKey)}
            className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === t.key
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Class Attendance tab (History only) ──────────────────────────── */}
      {activeTab === "class" && (
        <div className="flex flex-col gap-8">
          <MyHistoryTab
            teacherId={activeTeacherId}
            summaryData={rangeSummaryData ?? null}
            isLoading={rangeLoading}
            fromDate={historyFromDate}
            toDate={historyToDate}
            onFromDateChange={setHistoryFromDate}
            onToDateChange={setHistoryToDate}
          />
        </div>
      )}

      {/* ── My Attendance tab (teacher's own staff attendance) ────────────── */}
      {activeTab === "mine" && (
        <MyStaffAttendanceTab staffId={activeTeacherId} />
      )}

      <MarkStudentAttendanceModal
        open={markAttendanceOpen}
        onClose={() => setMarkAttendanceOpen(false)}
        defaultClassId={today.classId ?? ""}
        defaultSectionId={today.sectionId ?? ""}
      />
      <CorrectionRequestModal
        open={correctionOpen}
        onClose={() => { setCorrectionOpen(false); setCorrectionPrefill(undefined); }}
        prefill={correctionPrefill}
      />
    </div>
  );
};

export default MyAttendancePage;
