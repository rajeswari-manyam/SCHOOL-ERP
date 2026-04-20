import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { severityBadgeClass } from "./utils/attendance.utils";

type AttendanceSeverity = "critical" | "high" | "medium";

const CLASS_FILTER_OPTIONS = ["All Classes", "Class 6A", "Class 7A", "Class 8A", "Class 9B", "Class 10A"];

const HISTORY_TREND_DATA = [
  { date: "05 Mar", "6A": 78, "7A": 82, "8A": 74, avg: 79 },
  { date: "10 Mar", "6A": 80, "7A": 84, "8A": 76, avg: 80 },
  { date: "15 Mar", "6A": 77, "7A": 83, "8A": 78, avg: 79 },
  { date: "20 Mar", "6A": 81, "7A": 80, "8A": 79, avg: 80 },
  { date: "25 Mar", "6A": 86, "7A": 82, "8A": 77, avg: 82 },
  { date: "30 Mar", "6A": 88, "7A": 84, "8A": 79, avg: 83 },
  { date: "05 Apr", "6A": 92, "7A": 88, "8A": 85, avg: 88 },
];

const CHRONIC_ABSENTEES: Array<{
  initials: string;
  name: string;
  class: string;
  daysAbsent: number;
  severity: AttendanceSeverity;
  color: string;
  lastAbsent: string;
  phone: string;
}> = [
  { initials: "RT", name: "Ravi Teja", class: "10A", daysAbsent: 8, severity: "critical", color: "#7c3aed", lastAbsent: "Today", phone: "+91 98765 43210" },
  { initials: "PS", name: "Priya S", class: "9B", daysAbsent: 6, severity: "high", color: "#0ea5e9", lastAbsent: "5 Apr", phone: "+91 87654 32109" },
  { initials: "KR", name: "Kiran R", class: "8A", daysAbsent: 6, severity: "high", color: "#22c55e", lastAbsent: "4 Apr", phone: "+91 76543 21098" },
  { initials: "SN", name: "Suresh N", class: "7B", daysAbsent: 5, severity: "medium", color: "#f97316", lastAbsent: "3 Apr", phone: "+91 65432 10987" },
  { initials: "AD", name: "Anitha D", class: "6A", daysAbsent: 5, severity: "medium", color: "#f43f5e", lastAbsent: "2 Apr", phone: "+91 54321 09876" },
  { initials: "VR", name: "Venkat R", class: "10B", daysAbsent: 5, severity: "medium", color: "#14b8a6", lastAbsent: "1 Apr", phone: "+91 43210 98765" },
];

export default function AttendanceHistory() {
  const [dateFrom,     setDateFrom]     = useState("01 Mar 2025");
  const [dateTo,       setDateTo]       = useState("07 Apr 2025");
  const [classFilter,  setClassFilter]  = useState("All Classes");

  const applyFilters = () => {
    // static view only; filters currently update UI state but use mocked chart and table data
    setDateFrom(dateFrom);
    setDateTo(dateTo);
    setClassFilter(classFilter);
  };

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-end gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Date Range</p>
          <div className="flex items-center gap-2">
            <input
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-slate-50"
            />
            <span className="text-xs text-slate-400 font-medium">to</span>
            <input
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-slate-50"
            />
          </div>
        </div>
        <div className="min-w-[160px]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Class</p>
          <div className="relative">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 pr-8"
            >
              {CLASS_FILTER_OPTIONS.map((c) => <option key={c}>{c}</option>)}
            </select>
            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <button
          onClick={applyFilters}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition whitespace-nowrap active:scale-95"
        >
          Apply Filters
        </button>
      </div>

      {/* Chart + Stats */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800">Attendance Trend — Last 30 Days</h2>
              <div className="flex items-center gap-3">
                {[
                  { label: "6A", color: "#6366f1" },
                  { label: "7A", color: "#10b981" },
                  { label: "8A", color: "#f59e0b" },
                  { label: "AVG", color: "#94a3b8", dashed: true },
                ].map(({ label, color, dashed }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div
                      className={`w-4 h-0.5 ${dashed ? "border-t-2 border-dashed border-slate-400" : ""}`}
                      style={!dashed ? { background: color } : {}}
                    />
                    <span className="text-[11px] font-semibold text-slate-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={HISTORY_TREND_DATA} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                <YAxis domain={[50, 100]} ticks={[50, 75, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} formatter={(val) => [`${val ?? 0}%`]} />
                <ReferenceLine y={85} stroke="#e2e8f0" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="6A"  stroke="#6366f1" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="7A"  stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="8A"  stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="avg" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Right Stats */}
          <div className="w-44 flex flex-col gap-3 shrink-0">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 relative overflow-hidden">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Monthly Average</p>
              <p className="text-3xl font-black text-indigo-600">92.4%</p>
              <p className="text-xs text-slate-500 mt-0.5">Across all classes</p>
              <div className="flex items-center gap-1 mt-2">
                <p className="text-[11px] font-semibold text-slate-600">↗ 2.1% improvement</p>
              </div>
            </div>
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wide mb-2">⚡ Action Required</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                <span className="font-bold">Class 10A</span> below 85% threshold for 3 consecutive days.
              </p>
              <button className="mt-3 w-full text-[11px] font-bold text-indigo-600 border border-indigo-200 bg-white hover:bg-indigo-50 rounded-lg py-1.5 transition-colors">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chronic Absentees */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">Chronic Absentees</h2>
            <p className="text-xs text-slate-400 mt-0.5">Students absent more than 5 days this month</p>
          </div>
        </div>

        <div className="grid grid-cols-[2fr_1fr_1.2fr_1.2fr_2fr_1fr] gap-2 px-5 py-2 bg-slate-50 border-y border-slate-100">
          {["Student", "Class", "Absent Days", "Last Absent", "Parent Contact", "Actions"].map((h) => (
            <p key={h} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</p>
          ))}
        </div>

        <div className="divide-y divide-slate-50">
          {CHRONIC_ABSENTEES.map((s) => (
              <div key={s.name} className="grid grid-cols-[2fr_1fr_1.2fr_1.2fr_2fr_1fr] gap-2 items-center px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ background: s.color }}
                  >
                    {s.initials}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{s.name}</span>
                </div>
                <span className="text-sm font-medium text-slate-500">{s.class}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg w-fit ${severityBadgeClass(s.severity)}`}>
                  {s.daysAbsent} days
                </span>
                <span className={`text-sm font-medium ${s.lastAbsent === "Today" ? "text-red-500 font-semibold" : "text-slate-500"}`}>
                  {s.lastAbsent}
                </span>
                <span className="text-xs text-slate-500 font-mono">{s.phone}</span>
                <div className="flex items-center gap-2">
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-500 hover:text-indigo-600 transition-colors" title="Call parent">
                    📞
                  </button>
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-500 hover:text-emerald-600 transition-colors" title="WhatsApp parent">
                    💬
                  </button>
                </div>
              </div>
            ))}
          </div>
        <div className="px-5 py-4 text-center border-t border-slate-100">
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            View All Absentees
          </button>
        </div>
      </div>
    </div>
  );
}