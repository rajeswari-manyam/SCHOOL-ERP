import type { DashboardStatCards } from "../types/Student dashboard.types";

interface StatCardsProps {
  stats: DashboardStatCards;
}

const StatCards = ({ stats }: StatCardsProps) => {
  const {
    todayStatus,
    checkedInAt,
    attendanceMonth,
    homeworkDueCount,
    submissionPortalActive,
    nextExamDaysLeft,
    nextExamName,
  } = stats;

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Today's Status */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Today's Status
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`text-2xl font-extrabold ${
              todayStatus === "PRESENT"
                ? "text-green-500"
                : todayStatus === "ABSENT"
                ? "text-red-500"
                : "text-gray-400"
            }`}
          >
            {todayStatus === "PRESENT"
              ? "Present"
              : todayStatus === "ABSENT"
              ? "Absent"
              : "Holiday"}
          </span>
          {todayStatus === "PRESENT" && (
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          )}
        </div>
        {checkedInAt && (
          <span className="text-xs text-gray-400">Checked in at {checkedInAt}</span>
        )}
      </div>

      {/* Attendance Month */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Attendance Month
        </span>
        <span className="text-2xl font-extrabold text-gray-900">
          {attendanceMonth.percentage}%
        </span>
        <span className="text-xs text-green-500 font-semibold">
          {attendanceMonth.changeFromLastMonth >= 0 ? "+" : ""}
          {attendanceMonth.changeFromLastMonth}% from last month
        </span>
      </div>

      {/* Homework Due */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Homework Due
        </span>
        <span className="text-2xl font-extrabold text-gray-900">
          {homeworkDueCount} this week
        </span>
        <span className="text-xs text-gray-400">
          {submissionPortalActive ? "Submission portal active" : "Submission portal inactive"}
        </span>
      </div>

      {/* Next Exam */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Next Exam
        </span>
        <span className="text-2xl font-extrabold text-gray-900">
          {nextExamDaysLeft} days
        </span>
        <span className="text-xs text-gray-400">{nextExamName}</span>
      </div>
    </div>
  );
};

export default StatCards;