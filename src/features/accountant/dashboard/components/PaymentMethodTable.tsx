import type { PaymentModeSummary } from "../types/dashboard.types";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import typography from "../../../../styles/typography";
// Color config
const modeColors: Record<string, { stroke: string; dot: string }> = {
  UPI: { stroke: "#6366f1", dot: "bg-indigo-500" },
  Cash: { stroke: "#22c55e", dot: "bg-green-500" },
  Cheque: { stroke: "#f59e0b", dot: "bg-amber-400" },
};

export const PaymentModeTable = ({ data }: { data: PaymentModeSummary[] }) => {
  // Total calculation
  const total = data.reduce((sum, d) => sum + d.amount, 0);

  // Convert data for chart
  const chartData = data.map((item) => ({
    name: item.mode,
    value: item.amount,
  }));

  return (
<div className="flex items-center gap-4 w-full overflow-hidden border border-transparent hover:border-[#3525CD] transition-colors rounded-xl p-2">
      
      {/* Donut Chart */}
      <div className="relative w-[140px] h-[140px] flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={65}
              paddingAngle={3}
            >
              {chartData.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={
                    modeColors[entry.name]?.stroke || "#94a3b8"
                  }
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
     <span className={`${typography.body.xs} text-slate-400`}>
  TOTAL
</span>
          <span className="text-sm font-bold text-slate-900">
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col justify-center gap-3 flex-1 min-w-0">
        {data.map((item) => {
          const pct = total ? ((item.amount / total) * 100).toFixed(1) : "0";
          const colors = modeColors[item.mode] ?? { dot: "bg-slate-400" };

          return (
            <div key={item.mode} className="flex items-center gap-2 min-w-0">
              
              {/* Dot */}
              <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />

              {/* Label */}
              <p className="text-xs text-slate-600 flex-1 truncate">
                {item.mode}
                <span className="text-slate-400 ml-1">({pct}%)</span>
              </p>

              {/* Amount */}
              <span className="text-xs font-bold text-slate-900 tabular-nums">
                ₹{item.amount.toLocaleString("en-IN")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};