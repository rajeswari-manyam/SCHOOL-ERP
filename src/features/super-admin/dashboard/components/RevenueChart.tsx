import type { ReactNode } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { RevenuePoint } from "../types/dashboard.types";

interface RevenueChartProps { data: RevenuePoint[]; currentMrr: number; isLoading?: boolean; }

const fmt = (v: number) => `₹${(v / 100000).toFixed(2)}L`;

const monthLabel = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-US", { month: "short" });
};

const monthLabelFromTooltip = (label: ReactNode) =>
  typeof label === "string" ? monthLabel(label) : label;

const RevenueChart = ({ data, currentMrr, isLoading = false }: RevenueChartProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <h2 className="text-[13px] font-extrabold text-gray-900 mb-3">Revenue Growth (Lakhs)</h2>
      <div className="relative">
        {/* Current MRR label */}
        <div className="absolute top-0 right-0 px-2.5 py-1 rounded-xl bg-indigo-600 text-white text-[11px] font-bold z-10">
          {isLoading ? (
            <div className="h-3 w-10 rounded bg-white/40 animate-pulse" />
          ) : (
            fmt(currentMrr)
          )}
        </div>
        {isLoading ? (
          // Chart-shaped skeleton — a wavy area-chart silhouette, not just a
          // gray box, so it reads as "a chart is coming" rather than empty
          // space. Distinct from the "No revenue recorded yet." empty state
          // below, which must only ever show once loading has genuinely
          // finished with zero data — never while data is still in flight.
          <div className="h-[150px] flex items-end gap-1.5 px-1 animate-pulse" aria-label="Loading chart" aria-busy="true">
            {[40, 65, 50, 80, 60, 95, 75, 110, 90, 130, 115, 150].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-gray-100" style={{ height: `${h}px` }} />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="h-[150px] flex items-center justify-center text-sm text-gray-400">
            No revenue recorded yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={data} margin={{ top: 20, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tickFormatter={monthLabel} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                labelFormatter={monthLabelFromTooltip}
                formatter={(v) => {
                  if (typeof v === "number") {
                    return [fmt(v), "Revenue"];
                  }
                  return ["", "Revenue"];
                }}
                contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
              />
              <Area
                type="monotone" dataKey="value"
                stroke="#6366f1" strokeWidth={2.5}
                fill="url(#revenueGrad)" dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
