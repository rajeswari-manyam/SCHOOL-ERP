import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { RevenueByPlanResponse } from '../types/billing.types';

interface RevenuePlanChartProps {
  data?: RevenueByPlanResponse;
  isLoading: boolean;
}

const PLAN_COLORS: Record<string, string> = {
  Pro:     '#4f46e5',
  Growth:  '#6366f1',
  Starter: '#c7d2fe',
};

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-sm dark:border-white/10 dark:bg-gray-900">
      <p className="text-[11px] text-gray-400">{payload[0].name}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-white">
        {payload[0].value}%
      </p>
    </div>
  );
};

export const RevenuePlanChart: React.FC<RevenuePlanChartProps> = ({ data, isLoading }) => {
  const chartData = data?.breakdown?.map((b) => ({
    name: b.plan,
    value: b.percentage,
  })) ?? [];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-white/10 dark:bg-white/5">
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
        Revenue by Plan
      </h3>

      {isLoading || !data || !data.breakdown ? (
        <div className="flex h-52 items-center justify-center">
          <div className="h-40 w-40 animate-pulse rounded-full bg-gray-100 dark:bg-white/5" />
        </div>
      ) : (
        <>
          <div className="relative flex h-52 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={64}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={PLAN_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                ₹{data.totalMRR.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                This Month
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 flex justify-center gap-5">
            {data.breakdown.map((b) => (
              <div key={b.plan} className="flex flex-col items-center gap-1">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: PLAN_COLORS[b.plan] }}
                />
                <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                  {b.plan}
                </span>
                <span className="text-xs font-semibold text-gray-900 dark:text-white">
                  {b.percentage}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
