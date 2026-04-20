import { useAttendanceDashboard, useMonthNavigation } from "./hooks/Useattendance";
import StatCards from "./components/Statcards";
import AttendanceCalendar from "./components/Attendancecalendar";
import AbsentDaysPanel from "./components/Absentdayspanel";
import AttendancePolicyBar from "./components/Attendancepolicybar";

const AttendanceDashboard = () => {
  const { data, isLoading } = useAttendanceDashboard();
  const nav = useMonthNavigation("April", 2025);

  if (isLoading || !data) {
    return (
      <div className="p-6 text-sm text-gray-400 animate-pulse">
        Loading attendance…
      </div>
    );
  }

  const { student, currentMonth, yearSummary, policy, absentDays, motivationalMessage } = data;

  return (
    <div className="p-6 space-y-5 max-w-5xl mx-auto">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Attendance — {student.name}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {student.className} | Academic Year {student.academicYear}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <button
            onClick={nav.prev}
            className="w-7 h-7 rounded-full flex items-center justify-center border hover:bg-gray-50"
          >
            ‹
          </button>
          <span>{nav.label}</span>
          <button
            onClick={nav.next}
            className="w-7 h-7 rounded-full flex items-center justify-center border hover:bg-gray-50"
          >
            ›
          </button>
        </div>
      </div>

      {/* ─── Stat cards ─────────────────────────────────────────── */}
      <StatCards currentMonth={currentMonth} yearSummary={yearSummary} />

      {/* ─── Calendar + Absent days ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <AttendanceCalendar
            data={currentMonth}
            onPrev={nav.prev}
            onNext={nav.next}
            label={nav.label}
          />
        </div>
        <div className="bg-gray-50 rounded-xl border p-5">
          <AbsentDaysPanel
            absentDays={absentDays}
            month={currentMonth.month}
            year={currentMonth.year}
            motivationalMessage={motivationalMessage}
          />
        </div>
      </div>

      {/* ─── Policy bar ─────────────────────────────────────────── */}
      <AttendancePolicyBar
        policy={policy}
        currentPercentage={currentMonth.percentage}
      />
    </div>
  );
};

export default AttendanceDashboard;