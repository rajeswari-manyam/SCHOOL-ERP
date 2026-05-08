import React from "react";
import { motion, easeOut } from "framer-motion";
import { useAttendance } from "../hooks/useAttendance";
import { useAttendanceStore } from "../hooks/useAttendance";
import { AttendanceStats } from "../components/AttendanceStats";
import { AttendanceCalendar } from "../components/Attendancecalendar";
import { AbsentList } from "../components/AbsentList";
import { AttendancePolicy } from "../components/AttendancePolicy";
import { format } from "date-fns";

const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: easeOut } 
  },
};
export default function AttendancePage(): React.ReactElement {
  const { data, loading } = useAttendance();
  const { currentMonth, currentYear, prevMonth, nextMonth } = useAttendanceStore();

  // Compute a display date using date-fns
  const navDate = new Date(currentYear, currentMonth, 1);
  const displayLabel = format(navDate, "MMMM yyyy");

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

  if (!data) return <p className="p-6 text-gray-400">No data available.</p>;

  return (
    <div className="min-h-screen bg-indigo-50 font-sans">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-4 py-6 sm:py-7 pb-12">

        {/* HEADER */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
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
              className="w-8 h-8 border border-gray-200 bg-white rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
            >
              ‹
            </button>
            <span className="min-w-[130px] text-center text-sm sm:text-base">
              {displayLabel}
            </span>
            <button
              onClick={nextMonth}
              className="w-8 h-8 border border-gray-200 bg-white rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
            >
              ›
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          {/* STATS */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            <AttendanceStats title="This Month" data={data.month} />
            <AttendanceStats title="This Year" data={data.year} />
            <AttendanceStats title="Absent This Month" data={data.month} variant="absent" />
          </motion.div>

          {/* CALENDAR + ABSENT */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4"
          >
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
          </motion.div>

          {/* POLICY */}
          <motion.div variants={itemVariants}>
            <AttendancePolicy
              percentage={data.month.percentage}
              minRequired={75}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
