import React from 'react';
import { SlidersHorizontal, Download } from 'lucide-react';
import { PlanBadge } from './BillingBadges';
import type { TopInstitution } from '../types/billing.types';

interface TopInstitutionsTableProps {
  data?: TopInstitution[];
  isLoading: boolean;
  onViewAll: () => void;
}

const RANK_STYLES: Record<number, string> = {
  1: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  2: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
};

function SkeletonRow() {
  return (
    <tr>
      <td className="py-3.5 pl-4"><div className="h-6 w-6 animate-pulse rounded-full bg-gray-100 dark:bg-white/10" /></td>
      <td className="py-3.5 pl-3"><div className="h-4 w-40 animate-pulse rounded bg-gray-100 dark:bg-white/10" /></td>
      <td className="py-3.5"><div className="h-5 w-16 animate-pulse rounded-full bg-gray-100 dark:bg-white/10" /></td>
      <td className="py-3.5"><div className="h-4 w-20 animate-pulse rounded bg-gray-100 dark:bg-white/10" /></td>
      <td className="py-3.5 pr-4"><div className="h-4 w-10 animate-pulse rounded bg-gray-100 dark:bg-white/10" /></td>
    </tr>
  );
}

export const TopInstitutionsTable: React.FC<TopInstitutionsTableProps> = ({
  data,
  isLoading,
  onViewAll,
}) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white dark:border-white/10 dark:bg-white/5">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Top Schools by Revenue
          </h3>
          <p className="mt-0.5 text-[11px] text-gray-400">
            Analysis of highest contributing institutions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10">
            <SlidersHorizontal size={15} />
          </button>
          <button className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10">
            <Download size={15} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-y border-gray-100 bg-gray-50/60 dark:border-white/10 dark:bg-white/5">
              {['Rank', 'School', 'Plan', 'Monthly Value', '% of MRR'].map((h) => (
                <th
                  key={h}
                  className="py-2.5 px-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              : data?.map((inst, i) => {
                  const rank = i + 1;
                  const rankStyle =
                    RANK_STYLES[rank] ??
                    'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400';
                  return (
                    <tr
                      key={inst.id}
                      className="group hover:bg-gray-50/80 dark:hover:bg-white/5"
                    >
                      <td className="py-3.5 pl-4">
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${rankStyle}`}
                        >
                          {rank}
                        </span>
                      </td>
                      <td className="py-3.5 pl-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-[11px] font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                            {inst.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {inst.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <PlanBadge plan={inst.plan} />
                      </td>
                      <td className="py-3.5 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                        ₹{inst.monthlyValue.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 pr-5 text-sm text-gray-500 dark:text-gray-400">
                        {inst.mrrPercent.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-5 py-3 text-center dark:border-white/10">
        <button
          onClick={onViewAll}
          className="text-[13px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          View All Institutions →
        </button>
      </div>
    </div>
  );
};
