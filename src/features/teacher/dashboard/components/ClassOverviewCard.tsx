import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { ClassOverview } from "../types/teacher-dashboard.types";

const ClassOverviewCard = ({ overview }: { overview: ClassOverview }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-extrabold text-gray-900">Class Overview</h3>
      <span className="text-sm font-bold text-indigo-600">{overview.monthlyAvgPct}% avg</span>
    </div>

    {/* Mini attendance trend chart */}
    <div className="mb-4">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Attendance Trend</p>
      <ResponsiveContainer width="100%" height={80}>
        <BarChart data={overview.trend} barCategoryGap="20%">
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(v: number, name: string) => [v, name === "present" ? "Present" : "Absent"]}
            contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 11 }}
          />
          <Bar dataKey="present" fill="#6366f1" radius={[3, 3, 0, 0]} />
          <Bar dataKey="absent"  fill="#fca5a5" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-1">
        <span className="flex items-center gap-1 text-[10px] text-gray-400"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-500"/> Present</span>
        <span className="flex items-center gap-1 text-[10px] text-gray-400"><span className="w-2.5 h-2.5 rounded-sm bg-red-300"/> Absent</span>
      </div>
    </div>

    {/* Recent days list */}
    <div className="mb-4">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Recent Days</p>
      <div className="flex flex-col gap-1.5">
        {overview.trend.slice(-5).reverse().map((d) => {
          const pct = d.total > 0 ? Math.round((d.present / d.total) * 100) : 0;
          const color = pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-400" : "bg-red-400";
          return (
            <div key={d.date} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-8">{d.date}</span>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
              </div>
              <span className="text-[11px] font-semibold text-gray-400 w-8 text-right">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>

    {/* Chronic absentees */}
    {overview.chronicAbsentees.length > 0 && (
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-red-400 mb-2 flex items-center gap-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Chronic Absentees
        </p>
        <div className="flex flex-col gap-2">
          {overview.chronicAbsentees.map((s) => (
            <div key={s.id} className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-red-200 text-red-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                {s.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{s.name}</p>
                <p className="text-[10px] text-gray-400">Roll {s.rollNo}</p>
              </div>
              <span className="text-xs font-bold text-red-500">{s.attendancePct}%</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default ClassOverviewCard;
