import type { ReactNode } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { RevenuePoint } from "../types/dashboard.types";

interface RevenueChartProps { data: RevenuePoint[]; currentMrr: number; }

const fmt = (v: number) => `₹${(v / 100000).toFixed(2)}L`;

const monthLabel = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-US", { month: "short" });
};

const monthLabelFromTooltip = (label: ReactNode) =>
  typeof label === "string" ? monthLabel(label) : label;

const RevenueChart = ({ data, currentMrr }: RevenueChartProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <h2 className="text-[13px] font-extrabold text-gray-900 mb-3">Revenue Growth (Lakhs)</h2>
      <div className="relative">
        {/* Current MRR label */}
        <div className="absolute top-0 right-0 px-2.5 py-1 rounded-xl bg-indigo-600 text-white text-[11px] font-bold z-10">
          {fmt(currentMrr)}
        </div>
        {data.length === 0 ? (
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
