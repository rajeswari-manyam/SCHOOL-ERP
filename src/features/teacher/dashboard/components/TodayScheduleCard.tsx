import type { Period, PeriodStatus } from "../types/teacher-dashboard.types";

const statusStyles: Record<PeriodStatus, string> = {
  CURRENT:   "bg-indigo-600 text-white shadow-md shadow-indigo-200",
  COMPLETED: "bg-gray-50 text-gray-400",
  UPCOMING:  "bg-white border border-gray-100 text-gray-700",
};

const TodayScheduleCard = ({ periods }: { periods: Period[] }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <h3 className="text-sm font-extrabold text-gray-900 mb-4">Today's Schedule</h3>
    <div className="flex flex-col gap-2">
      {periods.map((p) => (
        <div key={p.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${statusStyles[p.status]}`}>
          <div className="flex-shrink-0 min-w-[80px]">
            <p className={`text-xs font-bold ${p.status === "CURRENT" ? "text-indigo-200" : "text-gray-400"}`}>{p.time}</p>
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-bold truncate ${p.status === "CURRENT" ? "text-white" : p.status === "COMPLETED" ? "text-gray-400" : "text-gray-800"}`}>{p.subject}</p>
            <p className={`text-xs truncate ${p.status === "CURRENT" ? "text-indigo-200" : "text-gray-400"}`}>{p.class} · {p.room}</p>
          </div>
          {p.status === "CURRENT" && (
            <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold text-white">NOW</span>
          )}
          {p.status === "COMPLETED" && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default TodayScheduleCard;
