import { useState, useMemo, useEffect } from "react";
import { format, getDaysInMonth, startOfMonth } from "date-fns";
import { ClipboardCheck, ChevronLeft, ChevronRight, CalendarDays, List } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import {
  useTodayAttendanceSummary,
  useTeacherAttendanceSummaryRange,
  useStaffAttendanceByStaffId,
} from "./hooks/useAttendance";
import MyHistoryTab from "./components/MyHistoryTab";
import MarkStudentAttendanceModal from "./components/MarkStudentAttendaceModal";
import type { StaffAttendanceRecord } from "@/services/attendance.api";
import { getAllHolidays } from "@/services/holidays.api";
import { fetchAllWorkingDays } from "@/services/working-days.api";
import { useAcademicYears } from "@/components/common/hooks/useAcademicYears";
import { isDayInSelectedDays } from "@/features/school-admin/timetable/utils/Timetable.utils";

const WEEKDAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_STYLE: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  present: { label: "Present",  bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  absent:  { label: "Absent",   bg: "bg-red-50 border-red-100",         text: "text-red-600",     dot: "bg-red-500"     },
  halfday: { label: "Half Day", bg: "bg-amber-50 border-amber-100",     text: "text-amber-700",   dot: "bg-amber-500"   },
  leave:   { label: "On Leave", bg: "bg-purple-50 border-purple-100",   text: "text-purple-700",  dot: "bg-purple-500"  },
  late:    { label: "Late",     bg: "bg-orange-50 border-orange-100",   text: "text-orange-700",  dot: "bg-orange-500"  },
};

// ── Calendar grid ─────────────────────────────────────────────────────────────
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const STATUS_CAL: Record<string, { bg: string; text: string; ring: string }> = {
  present: { bg: "bg-emerald-500", text: "text-white",        ring: "ring-emerald-300" },
  absent:  { bg: "bg-red-500",     text: "text-white",        ring: "ring-red-300"     },
  leave:   { bg: "bg-purple-500",  text: "text-white",        ring: "ring-purple-300"  },
  halfday: { bg: "bg-amber-400",   text: "text-white",        ring: "ring-amber-300"   },
  late:    { bg: "bg-orange-400",  text: "text-white",        ring: "ring-orange-300"  },
};

const MonthCalendar = ({
  year, month, records, todayStr, offDays,
}: {
  year: number; month: number; records: StaffAttendanceRecord[]; todayStr: string;
  offDays?: Map<string, string>;
}) => {
  const recordMap = useMemo(() => {
    const m: Record<string, StaffAttendanceRecord> = {};
    records.forEach((r) => { m[r.date] = r; });
    return m;
  }, [records]);

  const firstDay = startOfMonth(new Date(year, month - 1, 1));
  const startOffset = (firstDay.getDay() + 6) % 7; // Mon=0 … Sun=6
  const daysInMonth = getDaysInMonth(new Date(year, month - 1, 1));

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/60">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="py-2 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells — compact fixed size */}
      <div className="grid grid-cols-7 gap-px bg-gray-100 border-t border-gray-100">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} className="bg-white h-14" />;

          const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const rec = recordMap[dateStr];
          const cal = rec ? STATUS_CAL[rec.status] : null;
          const offDayLabel = !rec ? offDays?.get(dateStr) : undefined;
          const isToday = dateStr === todayStr;
          const isFuture = dateStr > todayStr;

          return (
            <div
              key={idx}
              className="bg-white h-14 flex flex-col items-center justify-center relative group"
              title={offDayLabel}
            >
              {/* Colored circle for the day */}
              <div
                className={`
                  w-9 h-9 rounded-full flex flex-col items-center justify-center transition-transform group-hover:scale-110
                  ${cal ? `${cal.bg} shadow-sm` : offDayLabel ? "bg-gray-200" : ""}
                  ${isToday && !cal ? "ring-2 ring-[#5B5CEB] ring-offset-1" : ""}
                  ${isToday && cal ? `ring-2 ${cal.ring} ring-offset-1` : ""}
                `}
              >
                <span className={`text-[12px] font-bold leading-none ${cal ? "text-white" : offDayLabel ? "text-gray-500" : isFuture ? "text-gray-300" : "text-gray-500"}`}>
                  {day}
                </span>
                {isToday && (
                  <span className={`text-[7px] font-semibold leading-none mt-0.5 ${cal ? "text-white/80" : "text-[#5B5CEB]"}`}>
                    today
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 flex flex-wrap gap-x-4 gap-y-1">
        {[
          { label: "Present",  cls: "bg-emerald-500" },
          { label: "Absent",   cls: "bg-red-500"     },
          { label: "Leave",    cls: "bg-purple-500"  },
          { label: "Half Day", cls: "bg-amber-400"   },
          { label: "Holiday",  cls: "bg-gray-300"    },
        ].map((l) => (
          <span key={l.label} className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
            <span className={`w-2 h-2 rounded-full ${l.cls}`} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
};

// ── My Attendance tab ─────────────────────────────────────────────────────────
const MyStaffAttendanceTab = ({ staffId }: { staffId: string }) => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year,  setYear]  = useState(now.getFullYear());
  const [view,  setView]  = useState<"calendar" | "list">("calendar");

  const { data: apiData, isLoading } = useStaffAttendanceByStaffId(staffId);
  const { activeYear } = useAcademicYears();

  // Holidays + school working-days config — fetched once, filtered per visible month below
  const [rawHolidays, setRawHolidays] = useState<any[]>([]);
  const [workingDays, setWorkingDays] = useState<Awaited<ReturnType<typeof fetchAllWorkingDays>>>([]);

  useEffect(() => {
    getAllHolidays()
      .then((res: any) => {
        const list = Array.isArray(res?.data) ? res.data
          : Array.isArray(res?.holidays) ? res.holidays
          : Array.isArray(res?.data?.holidays) ? res.data.holidays
          : [];
        setRawHolidays(list);
      })
      .catch(() => {});
    fetchAllWorkingDays().then(setWorkingDays).catch(() => {});
  }, []);

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
  const records = useMemo(() => allRecords
    .filter((r) => {
      const d = new Date(r.date);
      return d.getMonth() + 1 === month && d.getFullYear() === year;
    })
    .sort((a, b) => b.date.localeCompare(a.date)),
    [allRecords, month, year]
  );

  // Holidays + non-working weekdays for the visible month — shown as "Holiday" on the calendar
  const offDays = useMemo(() => {
    const map = new Map<string, string>();
    const pad = (n: number) => String(n).padStart(2, "0");
    const monthStr = pad(month);
    const yearStr = String(year);

    rawHolidays.forEach((h: any) => {
      const dateStr = h.date;
      if (dateStr && dateStr.startsWith(`${yearStr}-${monthStr}`)) {
        map.set(dateStr, h.holidayname ?? h.name ?? "Holiday");
      }
    });

    const activeWD = workingDays.find((wd) => wd.academicYearId === activeYear?.id) ?? workingDays[0];
    const selectedDays = activeWD?.selected_days ?? [];

    if (selectedDays.length > 0) {
      const daysInMonth = getDaysInMonth(new Date(year, month - 1, 1));
      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${yearStr}-${monthStr}-${pad(d)}`;
        if (map.has(dateStr)) continue;
        const weekday = WEEKDAY_NAMES[new Date(year, month - 1, d).getDay()];
        if (!isDayInSelectedDays(selectedDays, weekday)) map.set(dateStr, "Non-working day");
      }
    }

    return map;
  }, [rawHolidays, workingDays, activeYear, month, year]);

  // Compute summary from filtered records
  const summary = useMemo(() => ({
    present: records.filter((r) => r.status === "present").length,
    absent:  records.filter((r) => r.status === "absent").length,
    leave:   records.filter((r) => r.status === "leave").length,
    halfday: records.filter((r) => r.status === "halfday").length,
  }), [records]);

  const todayRecord = records.find((r) => r.date === todayStr);
  const todayStyle = todayRecord ? STATUS_STYLE[todayRecord.status] : null;

  return (
    <div className="flex flex-col gap-4">

      {/* Month navigator + view toggle */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-2.5">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={16} className="text-gray-600" />
        </button>

        <div className="text-center">
          <p className="text-sm font-bold text-gray-800">{monthLabel}</p>
          {isCurrentMonth && (
            todayStyle ? (
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${todayStyle.bg} ${todayStyle.text}`}>
                Today: {todayStyle.label}
              </span>
            ) : (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                Today: Not Marked
              </span>
            )
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* View toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setView("calendar")}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                view === "calendar" ? "bg-white text-[#5B5CEB] shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <CalendarDays size={12} />
              <span className="hidden sm:inline">Cal</span>
            </button>
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                view === "list" ? "bg-white text-[#5B5CEB] shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <List size={12} />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <button
            onClick={nextMonth}
            disabled={isCurrentMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Summary stat cards */}
      {records.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { label: "Present",  value: summary.present, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
            { label: "Absent",   value: summary.absent,  color: "text-red-500",     bg: "bg-red-50 border-red-100"         },
            { label: "Leave",    value: summary.leave,   color: "text-purple-600",  bg: "bg-purple-50 border-purple-100"   },
            { label: "Half Day", value: summary.halfday, color: "text-amber-500",   bg: "bg-amber-50 border-amber-100"     },
          ].map((item) => (
            <div key={item.label} className={`rounded-xl border px-3 py-2.5 text-center ${item.bg}`}>
              <p className={`text-xl font-extrabold ${item.color}`}>{item.value}</p>
              <p className="text-[10px] font-semibold text-gray-500 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Calendar / List view */}
      {isLoading ? (
        <div className="flex items-center justify-center h-36 text-sm text-gray-400 animate-pulse">Loading…</div>
      ) : view === "calendar" ? (
        <MonthCalendar year={year} month={month} records={records} todayStr={todayStr} offDays={offDays} />
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
            {/* Show "Not Marked" for today if no record exists */}
            {isCurrentMonth && !todayRecord && (
              <div className="flex items-center justify-between px-5 py-3 bg-gray-50/60">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {format(now, "EEE, d MMM yyyy")}
                      <span className="ml-2 text-[10px] font-bold text-indigo-500">TODAY</span>
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Attendance not marked yet</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-gray-100 text-gray-500 border-gray-200">
                  Not Marked
                </span>
              </div>
            )}
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
                      {rec.remarks && <p className="text-[11px] text-gray-400 mt-0.5">{rec.remarks}</p>}
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
  { key: "class",    label: "Class Attendance" },
  { key: "mine",     label: "My Attendance"    },
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

  if (todayLoading) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-500">
        Loading attendance…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 min-h-full px-3 sm:px-6 pt-2 pb-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <h1 className="text-sm font-semibold text-gray-900">My Attendance</h1>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {format(new Date(), "EEEE, d MMMM yyyy")}
            {today.classLabel && today.classLabel !== "—" && ` · Class ${today.classLabel}`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap self-start">
          <button
            onClick={() => setMarkAttendanceOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition-colors"
          >
            <ClipboardCheck size={13} />
            Mark Attendance
            {!today.isMarked && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as TabKey)}
            className={`px-3 py-2 text-xs font-medium transition-all border-b-2 -mb-px ${
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
    </div>
  );
};

export default MyAttendancePage;
