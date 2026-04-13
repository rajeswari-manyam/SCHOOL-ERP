import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { BillingOverview } from '../types/billing.types';

interface KPICardsProps {
  data?: BillingOverview;
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

export const KPICards: React.FC<KPICardsProps> = ({ data, isLoading }) => {
  if (isLoading || !data || data.totalMRR == null) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {/* Total MRR */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-white/10 dark:bg-white/5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Total MRR
          </p>
          <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <TrendingUp size={10} />
            +{data.mrrGrowthPercent}%
          </span>
        </div>
        <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {fmt(data.totalMRR)}
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
          {data.overduePayments} Schools
        </p>
        <p className="mt-1 text-[11px] text-gray-400">Action required immediately</p>
      </div>
    </div>
  );
};
