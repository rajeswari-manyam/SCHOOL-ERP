import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot } from "recharts";
import type { RevenuePoint } from "../types/dashboard.types";

interface RevenueChartProps { data: RevenuePoint[]; currentMrr: number; }

const fmt = (v: number) => `₹${(v / 100000).toFixed(2)}L`;

const RevenueChart = ({ data, currentMrr }: RevenueChartProps) => {
  const latest = data[data.length - 1];
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 className="text-sm font-extrabold text-gray-900 mb-4">Revenue Growth (Lakhs)</h2>
      <div className="relative">
        {/* Current MRR label */}
        <div className="absolute top-0 right-0 px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs font-bold z-10">
          {fmt(currentMrr)}
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={data} margin={{ top: 20, right: 10, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              formatter={(v: number) => [fmt(v), "MRR"]}
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
      </div>
    </div>
  );
};

export default RevenueChart;
