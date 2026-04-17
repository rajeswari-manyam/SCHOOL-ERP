import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from "lucide-react";
import type { MarketingRep } from "../types/marketing.types";
import { RepAvatar, AchievementBadge } from "./RepBadges";

interface TargetsTabProps { reps: MarketingRep[]; stats: { demosThisMonth: number; demosTarget: number; schoolsClosed: number; }; }

const ProgressBar = ({ value, max, color }: { value: number; max: number; color: string }) => (
  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
    <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
  </div>
);

const TargetsTab = ({ reps, stats }: TargetsTabProps) => {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const chartData = reps.map((r) => ({ name: r.name.split(" ")[0] + " " + r.name.split(" ")[1]?.[0], demos: r.mtdDemos, closings: r.mtdClosings }));
  const totalClosings = reps.reduce((s, r) => s + r.mtdClosings, 0);
  const conversionRate = stats.demosThisMonth > 0 ? ((totalClosings / stats.demosThisMonth) * 100).toFixed(0) : 0;

  const prevMonth = () => { if (month === 1) { setMonth(12); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 12) { setMonth(1); setYear(y => y + 1); } else setMonth(m => m + 1); };

  return (
    <div className="flex flex-col gap-6">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <ChevronLeft size={13} />
          </button>
          <span className="font-bold text-gray-900 text-sm min-w-[90px] text-center">
            {new Date(year, month - 1).toLocaleString("default", { month: "long" })} {year}
          </span>
          <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <ChevronRight size={13} />
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          <Calendar size={13} />
          Set Targets
        </button>
      </div>

      {/* Chart + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Bar chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Demos vs Closings</h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-indigo-500"/><span className="text-gray-500">Demos</span></span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500"/><span className="text-gray-500">Closings</span></span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
              <Bar dataKey="demos" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="closings" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-5">
          <h3 className="font-bold text-gray-900">Team Performance Summary</h3>

          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-end justify-between mb-1.5">
                <div><p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Total Demos</p>
                  <p className="text-2xl font-extrabold text-gray-900">{stats.demosThisMonth} <span className="text-sm font-normal text-gray-400">/ {stats.demosTarget} Target</span></p></div>
                <span className="text-sm font-bold text-indigo-600">{Math.round((stats.demosThisMonth / stats.demosTarget) * 100)}%</span>
              </div>
              <ProgressBar value={stats.demosThisMonth} max={stats.demosTarget} color="bg-indigo-500" />
            </div>

            <div>
              <div className="flex items-end justify-between mb-1.5">
                <div><p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Total Closings</p>
                  <p className="text-2xl font-extrabold text-gray-900">{totalClosings} <span className="text-sm font-normal text-gray-400">/ {stats.demosTarget / 2} Target</span></p></div>
                <span className="text-sm font-bold text-indigo-600">{Math.round((totalClosings / (stats.demosTarget / 2)) * 100)}%</span>
              </div>
              <ProgressBar value={totalClosings} max={stats.demosTarget / 2} color="bg-indigo-400" />
            </div>

            <div>
              <div className="flex items-end justify-between mb-1.5">
                <div><p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Conversion Rate</p>
                  <p className="text-2xl font-extrabold text-gray-900">{conversionRate}% <span className="text-sm font-normal text-gray-400">Avg</span></p></div>
                <span className="text-sm font-bold text-emerald-600">Optimal</span>
              </div>
              <ProgressBar value={Number(conversionRate)} max={100} color="bg-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Per rep table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="font-bold text-gray-900">Per Rep Performance</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Representative","Demos","Closings","Conv %","Target","Achievement %",""].map((h) => (
                <th key={h} className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reps.map((rep) => (
              <tr key={rep.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <RepAvatar initials={rep.initials} size="sm" />
                    <span className="text-sm font-semibold text-gray-900">{rep.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm font-medium text-gray-700">{rep.mtdDemos}</td>
                <td className="px-4 py-4 text-sm font-medium text-gray-700">{rep.mtdClosings}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{rep.conversionPct}%</td>
                <td className="px-4 py-4 text-sm text-gray-600">{rep.monthTarget}</td>
                <td className="px-4 py-4"><AchievementBadge pct={rep.achievementPct} /></td>
                <td className="px-4 py-4 text-right">
                  <ArrowRight size={14} className="text-gray-400" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TargetsTab;
