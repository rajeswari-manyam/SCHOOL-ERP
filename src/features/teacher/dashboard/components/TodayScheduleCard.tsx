import { useState } from "react";
import { Check, RefreshCw, AlertCircle, Calendar } from "lucide-react";
import { useTeacherTodayTimetableV2 } from "../hooks/useTeacherDashboard";
import type { PeriodStatus } from "../types/teacher-dashboard.types";

const PAGE_SIZE = 3;

const statusStyles: Record<PeriodStatus, string> = {
  CURRENT:   "bg-indigo-600 text-white shadow-md shadow-indigo-200",
  COMPLETED: "bg-gray-50 text-gray-400",
  UPCOMING:  "bg-white border border-gray-100 text-gray-700",
};

const Skeleton = () => (
  <div className="flex flex-col gap-2 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
    ))}
  </div>
);

interface TodayScheduleCardProps {
  teacherId: string;
}

const TodayScheduleCard = ({ teacherId }: TodayScheduleCardProps) => {
  const { data: periods = [], isLoading, isError, refetch } = useTeacherTodayTimetableV2(teacherId);
  const errorMessage = isError ? "Failed to load today's schedule" : null;
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? periods : periods.slice(0, PAGE_SIZE);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-gray-900">Today's Schedule</h3>
        {errorMessage && (
          <button
            onClick={() => refetch()}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        )}
      </div>

      {isLoading ? (
        <Skeleton />
      ) : isError ? (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <AlertCircle size={28} className="text-red-400" />
          <p className="text-sm text-gray-500">{errorMessage}</p>
          <button
            onClick={() => refetch()}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold mt-1"
          >
            Try again
          </button>
        </div>
      ) : periods.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <Calendar size={28} className="text-gray-300" />
          <p className="text-sm text-gray-400">No classes scheduled today</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {visible.map((p) => (
              <div key={p.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${statusStyles[p.status]}`}>
                <div className="flex-shrink-0 min-w-[72px]">
                  <p className={`text-[10px] font-bold ${p.status === "CURRENT" ? "text-indigo-200" : "text-gray-400"}`}>{p.time}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold truncate ${p.status === "CURRENT" ? "text-white" : p.status === "COMPLETED" ? "text-gray-400" : "text-gray-800"}`}>{p.subject}</p>
                  <p className={`text-[10px] truncate ${p.status === "CURRENT" ? "text-indigo-200" : "text-gray-400"}`}>{p.class} · {p.room}</p>
                </div>
                {p.status === "CURRENT" && (
                  <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold text-white">NOW</span>
                )}
                {p.status === "COMPLETED" && (
                  <Check size={14} className="flex-shrink-0 text-gray-400" strokeWidth={2.5} />
                )}
              </div>
            ))}
          </div>

          {periods.length > PAGE_SIZE && (
            <div className="border-t border-gray-100 mt-2 pt-1.5 text-center">
              <button
                onClick={() => setShowAll((v) => !v)}
                className="text-[10px] text-indigo-500 hover:text-indigo-700 transition-colors"
              >
                {showAll ? "Show Less ▲" : `Show More (${periods.length - PAGE_SIZE} more) ▼`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TodayScheduleCard;