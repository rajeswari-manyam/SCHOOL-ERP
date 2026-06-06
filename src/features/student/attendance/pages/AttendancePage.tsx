import React, { useState } from "react";
import { useAttendance } from "../hooks/useAttendance";
import { AttendanceStats } from "../components/AttendanceStats";
import { AttendanceCalendar } from "../components/Attendancecalendar";
import { AbsentList } from "../components/AbsentList";
import { AttendancePolicy } from "../components/AttendancePolicy";
import { useAuthStore } from "@/store/authStore"; // ✅ ADD THIS

const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function AttendancePage(): React.ReactElement {
  const { user } = useAuthStore(); // ✅ GET USER
  const studentId = user?.id;      // ✅ DYNAMIC ID

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear] = useState<number>(today.getFullYear());

  // ✅ SAFETY CHECK (prevents 500 error)
  if (!studentId) {
    return <p className="p-6 text-gray-400">Student not found. Please login again.</p>;
  }

const { data, loading, error, refetch } = useAttendance({
  studentId: studentId,
  month: currentMonth,  // ✅ 0-indexed; hook adds +1 for the API
  year: currentYear,
});
  const prevMonth = () => setCurrentMonth((m) => (m === 0 ? 11 : m - 1));
  const nextMonth = () => setCurrentMonth((m) => (m === 11 ? 0 : m + 1));

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-700 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">
            Loading attendance data…
          </p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center px-4">
          <p className="text-sm text-red-500 font-medium">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 text-sm font-semibold bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return <p className="p-6 text-gray-400">No data available.</p>;

  return (
    <div className="min-h-screen bg-indigo-50 font-sans">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-4 py-6 sm:py-7 pb-12">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
          <div>
            <h1 className="text-lg sm:text-[22px] font-bold tracking-tight text-gray-900">
              My Attendance — {data.studentName}
            </h1>
            <p className="text-xs sm:text-[13px] text-gray-400 mt-1">
              {data.className} • Academic Year {data.academicYear}
            </p>
          </div>

          {/* MONTH NAV */}
          <div className="flex items-center justify-start sm:justify-end gap-2 text-sm font-semibold text-gray-700">
            <button
              onClick={prevMonth}
              className="w-8 h-8 border border-gray-200 bg-white rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100"
            >
              ‹
            </button>
            <span className="min-w-[110px] text-center text-sm sm:text-base">
              {MONTH_LABELS[currentMonth]} {currentYear}
            </span>
            <button
              onClick={nextMonth}
              className="w-8 h-8 border border-gray-200 bg-white rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100"
            >
              ›
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <AttendanceStats title="This Month" data={data.month} />
          <AttendanceStats title="This Year" data={data.year} />
          <AttendanceStats title="Absent This Month" data={data.month} variant="absent" />
        </div>

        {/* CALENDAR + ABSENT LIST */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 mb-5">
          <div className="bg-white rounded-2xl px-4 sm:px-6 py-4 sm:py-5 shadow-sm border border-gray-100">
            <p className="text-sm font-semibold text-gray-900 mb-4">
              Monthly Attendance — {MONTH_LABELS[currentMonth]} {currentYear}
            </p>
            <AttendanceCalendar
              days={data.days}
              month={currentMonth}
              year={currentYear}
            />
          </div>

          <AbsentList
            days={data.days}
            monthLabel={`${MONTH_LABELS[currentMonth]} ${currentYear}`}
          />
        </div>

        {/* POLICY */}
        <AttendancePolicy percentage={data.month.percentage} minRequired={75} />

      </div>
    </div>
  );
}