import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MoreHorizontal } from 'lucide-react';
import type { MRRGrowthPoint } from '../types/billing.types';

interface MRRChartProps {
  data?: MRRGrowthPoint[];
  isLoading: boolean;
}

const monthLabel = (isoMonth: string) => {
  const [year, month] = isoMonth.split('-').map(Number);
  if (!year || !month) return isoMonth;
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'short' });
};

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{ value: number; payload: MRRGrowthPoint }>;
}> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-sm dark:border-white/10 dark:bg-gray-900">
      <p className="text-[11px] text-gray-400">{monthLabel(point.month)}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-white">
        ₹{payload[0].value.toLocaleString('en-IN')}
      </p>
      <p className="text-[11px] text-gray-400">{point.paymentCount} payment{point.paymentCount === 1 ? '' : 's'}</p>
    </div>
  );
};

export const MRRChart: React.FC<MRRChartProps> = ({ data, isLoading }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <div className="mb-1 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">MRR Growth</h3>
          <p className="text-[11px] text-gray-400">Monthly recurring revenue trends over last 6 months</p>
        </div>
        <button className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {isLoading || !data ? (
        <div className="mt-3 h-36 animate-pulse rounded-xl bg-gray-100 dark:bg-white/5" />
      ) : data.length === 0 ? (
        <div className="mt-3 h-36 flex items-center justify-center text-sm text-gray-400">
          No revenue recorded yet.
        </div>
      ) : (
        <div className="mt-3 h-36">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis
                dataKey="month"
                tickFormatter={monthLabel}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                width={46}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#4f46e5"
                strokeWidth={2.5}
                fill="url(#mrrGrad)"
                dot={{ r: 4, fill: '#4f46e5', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#4f46e5', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
