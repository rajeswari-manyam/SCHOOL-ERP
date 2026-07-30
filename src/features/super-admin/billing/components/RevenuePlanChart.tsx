import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { RevenueByPlanItem } from '../types/billing.types';

interface RevenuePlanChartProps {
  data?: RevenueByPlanItem[];
  isLoading: boolean;
}

const PALETTE = ['#4f46e5', '#6366f1', '#a5b4fc', '#c7d2fe', '#818cf8', '#312e81'];

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-sm dark:border-white/10 dark:bg-gray-900">
      <p className="text-[11px] text-gray-400">{payload[0].name}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-white">
        {payload[0].value.toFixed(1)}%
      </p>
    </div>
  );
};

export const RevenuePlanChart: React.FC<RevenuePlanChartProps> = ({ data, isLoading }) => {
  const totalRevenue = useMemo(() => (data ?? []).reduce((sum, b) => sum + b.totalRevenue, 0), [data]);

  const chartData = useMemo(() => (data ?? []).map((b, i) => ({
    name: b.planName,
    value: totalRevenue > 0 ? (b.totalRevenue / totalRevenue) * 100 : 0,
    color: PALETTE[i % PALETTE.length],
  })), [data, totalRevenue]);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
        Revenue by Plan
      </h3>

      {isLoading || !data ? (
        <div className="flex h-36 items-center justify-center">
          <div className="h-28 w-28 animate-pulse rounded-full bg-gray-100 dark:bg-white/5" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-36 items-center justify-center text-sm text-gray-400">
          No revenue recorded yet.
        </div>
      ) : (
        <>
          <div className="relative flex h-36 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={64}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-base font-bold text-gray-900 dark:text-white">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">
                This Month
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-2 flex flex-wrap justify-center gap-1.5">
            {data.map((b, i) => (
              <div
                key={b.planName}
                className="flex flex-col items-center gap-0.5 rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-1.5 dark:border-white/10 dark:bg-white/5"
              >
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 dark:text-gray-400">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: PALETTE[i % PALETTE.length] }}
                  />
                  {b.planName}
                </span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  {totalRevenue > 0 ? ((b.totalRevenue / totalRevenue) * 100).toFixed(0) : '0'}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
