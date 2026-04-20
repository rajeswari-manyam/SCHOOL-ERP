import type { MonthAttendance, YearAttendance } from "../types/Attendance.types";
import { formatPercentage } from "../utils/Attendance.utils";

interface StatCardsProps {
  currentMonth: MonthAttendance;
  yearSummary: YearAttendance;
}

const StatCards = ({ currentMonth, yearSummary }: StatCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border rounded-xl overflow-hidden bg-white">
      {/* This Month */}
      <div className="p-6 border-r border-indigo-100">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2">
          This Month
        </p>
        <div className="flex items-baseline gap-3">
          <p className="text-2xl font-bold text-gray-900">
            {currentMonth.daysPresent} / {currentMonth.totalSchoolDays} days
          </p>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            {formatPercentage(currentMonth.percentage)}
          </span>
        </div>
      </div>

      {/* This Year */}
      <div className="p-6 border-r border-indigo-100">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2">
          This Year
        </p>
        <div className="flex items-baseline gap-3">
          <p className="text-2xl font-bold text-gray-900">
            {yearSummary.daysPresent} / {yearSummary.totalSchoolDays} days
          </p>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            {formatPercentage(yearSummary.percentage)}
          </span>
        </div>
      </div>

      {/* Absent This Month */}
      <div className="p-6">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2">
          Absent This Month
        </p>
        <p className="text-2xl font-bold text-red-500">
          {currentMonth.daysAbsent} days
        </p>
      </div>
    </div>
  );
};

export default StatCards;