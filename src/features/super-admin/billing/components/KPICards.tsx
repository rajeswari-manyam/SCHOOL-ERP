import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { RevenueOverviewKPI, MRRGrowthPoint } from '../types/billing.types';

interface KPICardsProps {
  data?: RevenueOverviewKPI;
  mrrGrowth?: MRRGrowthPoint[];
  isLoading: boolean;
}

const fmt = (n: number | undefined | null) =>
  n == null ? '—' : '₹' + n.toLocaleString('en-IN');

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
      <div className="h-8 w-32 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
    </div>
  );
}

export const KPICards: React.FC<KPICardsProps> = ({ data, mrrGrowth, isLoading }) => {
  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  // Real month-over-month growth, derived from the actual MRR series — only
  // shown when there are at least two months to compare, never fabricated.
  let growthPercent: number | null = null;
  if (mrrGrowth && mrrGrowth.length >= 2) {
    const prev = mrrGrowth[mrrGrowth.length - 2].revenue;
    const latest = mrrGrowth[mrrGrowth.length - 1].revenue;
    if (prev > 0) growthPercent = ((latest - prev) / prev) * 100;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total MRR */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-white/10 dark:bg-white/5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Total MRR
          </p>
          {growthPercent != null && (
            <span className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
              growthPercent >= 0
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {growthPercent >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {growthPercent >= 0 ? '+' : ''}{growthPercent.toFixed(0)}%
            </span>
          )}
        </div>
        <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {fmt(data.totalMrr)}
        </p>
        <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
          <div className="h-full w-3/5 rounded-full bg-indigo-500" />
        </div>
      </div>

      {/* ARR */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-white/10 dark:bg-white/5">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          ARR
        </p>
        <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {fmt(data.arr)}
        </p>
        <p className="mt-1 text-[11px] text-gray-400">Projected annual run rate</p>
      </div>

      {/* Pending Renewals */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-white/10 dark:bg-white/5">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Pending Renewals
        </p>
        <p className="text-2xl font-bold tracking-tight text-orange-500">
          {data.pendingRenewals} Schools
        </p>
        <p className="mt-1 text-[11px] text-gray-400">Expiring within 30 days</p>
      </div>

      {/* Overdue */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-white/10 dark:bg-white/5">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Overdue Payments
        </p>
        <p className="text-2xl font-bold tracking-tight text-red-500">
          {data.overduePayments.count} Schools
        </p>
        <p className="mt-1 text-[11px] text-gray-400">
          {data.overduePayments.totalAmount > 0
            ? `${fmt(data.overduePayments.totalAmount)} outstanding`
            : 'Action required immediately'}
        </p>
      </div>
    </div>
  );
};
