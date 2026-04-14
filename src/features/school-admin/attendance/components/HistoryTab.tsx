// attendance/components/HistoryTab.tsx
// Image 4 — History tab: trend chart, chronic absentees table

import { useState } from "react";
import { format, subDays } from "date-fns";
import {
  useAttendanceTrend, useChronicAbsentees,
  MOCK_TREND, MOCK_CHRONIC,
} from "../hooks/useAttendance";

const CLASSES_OPTIONS = ["All Classes", "6A", "6B", "7A", "7B", "8A", "8B", "9A", "9B", "10A", "10B"];

// ── Mini line chart using SVG ─────────────────────────────────────────────────
const TrendChart = ({ data = MOCK_TREND }) => {
  const W = 420; const H = 140;
  const PADDING = { top: 16, right: 8, bottom: 28, left: 32 };
  const chartW = W - PADDING.left - PADDING.right;
  const chartH = H - PADDING.top - PADDING.bottom;
  const minY = 50; const maxY = 100;

  const toX = (i: number) => PADDING.left + (i / (data.length - 1)) * chartW;
  const toY = (v: number) => PADDING.top + chartH - ((v - minY) / (maxY - minY)) * chartH;

  const makePath = (key: keyof (typeof data)[0]) =>
    data.map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(d[key] as number)}`).join(" ");

  const LINES: { key: keyof (typeof data)[0]; color: string; label: string }[] = [
    { key: "6A",  color: "#4f46e5", label: "6A" },
    { key: "7A",  color: "#10b981", label: "7A" },
    { key: "8A",  color: "#f59e0b", label: "8A" },
    { key: "avg", color: "#9ca3af", label: "AVG" },
  ];

  const yTicks = [100, 75, 50, 25, 0];

  return (
    <div>
      {/* Legend */}
      <div className="flex items-center gap-4 mb-3">
        {LINES.map((l) => (
          <span key={l.key as string} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <span className={`inline-block w-6 h-0.5 rounded-full ${l.key === "avg" ? "border-t border-dashed border-gray-400 bg-transparent" : ""}`}
              style={l.key !== "avg" ? { backgroundColor: l.color } : {}} />
            {l.label}
          </span>
        ))}
      </div>
      <div className="overflow-x-auto">
        <svg width={W} height={H} style={{ display: "block", maxWidth: "100%" }}>
          {/* Y gridlines + labels */}
          {yTicks.map((t) => (
            <g key={t}>
              <line x1={PADDING.left} y1={toY(t)} x2={W - PADDING.right} y2={toY(t)} stroke="#f3f4f6" strokeWidth="1" />
              <text x={PADDING.left - 4} y={toY(t) + 4} textAnchor="end" fontSize="9" fill="#9ca3af">{t}%</text>
            </g>
          ))}
          {/* X labels */}
          {data.map((d, i) => (
            <text key={d.date} x={toX(i)} y={H - 4} textAnchor="middle" fontSize="9" fill="#9ca3af">{d.date}</text>
          ))}
          {/* Lines */}
          {LINES.map((l) => (
            <path
              key={l.key as string}
              d={makePath(l.key)}
              fill="none"
              stroke={l.color}
              strokeWidth={l.key === "avg" ? 1.5 : 2}
              strokeDasharray={l.key === "avg" ? "4 3" : undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

// ── Absent days badge ─────────────────────────────────────────────────────────
const AbsentBadge = ({ days, severity }: { days: number; severity: "critical" | "warning" | "moderate" }) => {
  const cls = severity === "critical"
    ? "bg-red-100 text-red-600 border border-red-200"
    : severity === "warning"
    ? "bg-orange-100 text-orange-600 border border-orange-200"
    : "bg-amber-100 text-amber-600 border border-amber-200";
  return (
    <span className={`inline-flex text-xs font-bold px-2.5 py-1 rounded-lg ${cls}`}>{days} days</span>
  );
};

// ── HistoryTab ────────────────────────────────────────────────────────────────
const HistoryTab = () => {
  const defaultFrom = format(subDays(new Date(), 37), "yyyy-MM-dd");
  const defaultTo   = format(new Date(), "yyyy-MM-dd");

  const [from,         setFrom]         = useState("2025-03-01");
  const [to,           setTo]           = useState("2025-04-07");
  const [classFilter,  setClassFilter]  = useState("All Classes");
  const [applied,      setApplied]      = useState({ from: "2025-03-01", to: "2025-04-07", cls: "All Classes" });

  const { data: trendData }   = useAttendanceTrend(applied.from, applied.to, applied.cls);
  const { data: chronicData } = useChronicAbsentees(applied.from, applied.to, applied.cls);

  const trend   = trendData   ?? MOCK_TREND;
  const chronic = chronicData ?? MOCK_CHRONIC;

  const iCls = "border border-gray-200 rounded-xl px-3 h-10 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition";

  return (
    <div className="flex flex-col gap-6">
      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Date Range</label>
            <div className="flex items-center gap-2">
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={iCls} />
              <span className="text-xs text-gray-400 font-semibold">to</span>
              <input type="date" value={to}   onChange={(e) => setTo(e.target.value)}   className={iCls} />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Class</label>
            <div className="relative">
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className={`${iCls} pr-8 cursor-pointer appearance-none`}
              >
                {CLASSES_OPTIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
              <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <button
            onClick={() => setApplied({ from, to, cls: classFilter })}
            className="flex items-center gap-1.5 h-10 px-5 rounded-xl bg-white border border-indigo-300 text-sm font-bold text-indigo-700 hover:bg-indigo-50 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            Apply Filters
          </button>
        </div>
      </div>

      {/* Trend chart + side panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
          <h3 className="text-base font-extrabold text-gray-900 mb-4">Attendance Trend — Last 30 Days</h3>
          <TrendChart data={trend} />
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-4">
          {/* Monthly average */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Monthly Average</p>
            <p className="text-4xl font-extrabold text-indigo-700">92.4%</p>
            <p className="text-xs text-gray-400 mt-1">Across all classes</p>
            <div className="flex items-center gap-1.5 mt-3">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
              </svg>
              <span className="text-xs font-bold text-emerald-600">2.1% improvement from last month</span>
            </div>
          </div>

          {/* Action required */}
          <div className="bg-[#f0edff] rounded-2xl border border-indigo-100 px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#4f46e5" className="flex-shrink-0">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              <p className="text-sm font-extrabold text-indigo-900">Action Required</p>
            </div>
            <p className="text-xs text-indigo-700 leading-relaxed mb-3">
              <span className="font-bold">Class 10A</span> has fallen below the 85% attendance threshold for 3 consecutive days. A review meeting is suggested.
            </p>
            <button className="text-xs font-bold text-indigo-700 border border-indigo-300 rounded-xl px-3 py-2 hover:bg-indigo-50 transition-colors">
              Generate 10A Detailed Report
            </button>
          </div>
        </div>
      </div>

      {/* Chronic Absentees */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50">
          <h3 className="text-base font-extrabold text-gray-900">Chronic Absentees</h3>
          <p className="text-sm text-gray-400 mt-0.5">Students absent more than 5 days this month</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-50">
                {["Student","Class","Absent Days","Last Absent","Parent Contact","Actions"].map((h) => (
                  <th key={h} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-5 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {chronic.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {c.initials}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{c.class}</td>
                  <td className="px-5 py-4"><AbsentBadge days={c.absentDays} severity={c.severity} /></td>
                  <td className="px-5 py-4">
                    <span className={`text-sm font-semibold ${c.lastAbsent === "Today" ? "text-red-500" : "text-gray-600"}`}>
                      {c.lastAbsent}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 font-mono">{c.parentContact}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {/* Call */}
                      <button className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-colors" title="Call parent">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.59 3.47 2 2 0 0 1 3.56 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.99 5.99l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                      </button>
                      {/* WhatsApp */}
                      <button className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors" title="WhatsApp parent">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-50 text-center">
          <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">View All Absentees</button>
        </div>
      </div>
    </div>
  );
};

export default HistoryTab;
