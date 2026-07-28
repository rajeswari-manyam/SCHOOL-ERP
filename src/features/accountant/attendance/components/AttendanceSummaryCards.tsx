import type { AttendanceSummary } from "../types/attendance.types";

interface Props {
  summary: AttendanceSummary;
}

const Stat = ({ label, value, color }: { label: string; value: number | string; color: string }) => (
  <div className="flex flex-col items-center gap-1 rounded-xl border border-gray-100 bg-white px-3 py-3 shadow-sm">
    <span className={`text-lg font-bold ${color}`}>{value}</span>
    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">{label}</span>
  </div>
);

export default function AttendanceSummaryCards({ summary }: Props) {
  const attendanceRate = summary.workingDays > 0
    ? ((summary.present / summary.workingDays) * 100).toFixed(1)
    : "0";

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      <Stat label="Working Days" value={summary.workingDays} color="text-gray-800" />
      <Stat label="Present" value={summary.present} color="text-emerald-600" />
      <Stat label="Absent" value={summary.absent} color="text-red-500" />
      <Stat label="Half Day" value={summary.halfday} color="text-orange-500" />
      <Stat label="Leave" value={summary.leave} color="text-blue-500" />
      <Stat label="Attendance" value={`${attendanceRate}%`} color="text-indigo-600" />
    </div>
  );
}
