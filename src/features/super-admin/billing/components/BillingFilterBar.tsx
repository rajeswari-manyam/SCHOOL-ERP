import React from 'react';
import { Search, X } from 'lucide-react';
import type { InstitutionFilters, PlanType, PaymentStatus } from '../types/billing.types';

import { Button } from '@/components/ui/button';
interface BillingFilterBarProps {
  filters: InstitutionFilters;
  onChange: (next: InstitutionFilters) => void;
}

const PLANS: PlanType[] = ['Pro', 'Growth', 'Starter'];
const STATUSES: PaymentStatus[] = ['Active', 'Overdue', 'Pending', 'Expiring', 'Suspended'];

export const BillingFilterBar: React.FC<BillingFilterBarProps> = ({ filters, onChange }) => {
  const hasFilters = Boolean(filters.search || filters.plan || filters.status);

  const set = <K extends keyof InstitutionFilters>(key: K, val: InstitutionFilters[K]) =>
    onChange({ ...filters, [key]: val, page: 1 });

  const clear = () =>
    onChange({ sortBy: filters.sortBy, sortOrder: filters.sortOrder, page: 1, pageSize: filters.pageSize });

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative min-w-[200px] flex-1">
        <Search
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search institution or city…"
          value={filters.search ?? ''}
          onChange={(e) => set('search', e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-8 pr-3 text-sm placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/40"
        />
      </div>

      {/* Plan filter */}
      <select
        value={filters.plan ?? ''}
        onChange={(e) => set('plan', (e.target.value as PlanType) || '')}
        className="rounded-xl border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
      >
        <option value="">All plans</option>
        {PLANS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {/* Status filter */}
      
      <select
        value={filters.status ?? ''}
        onChange={(e) => set('status', (e.target.value as PaymentStatus) || '')}
        className="rounded-xl border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
      >
        <option value="">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={`${filters.sortBy ?? 'mrr'}-${filters.sortOrder ?? 'desc'}`}
        onChange={(e) => {
          const [sortBy, sortOrder] = e.target.value.split('-') as [
            InstitutionFilters['sortBy'],
            InstitutionFilters['sortOrder']
          ];
          onChange({ ...filters, sortBy, sortOrder, page: 1 });
        }}
        className="rounded-xl border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
      >
        <option value="mrr-desc">MRR: High → Low</option>
        <option value="mrr-asc">MRR: Low → High</option>
        <option value="name-asc">Name A → Z</option>
        <option value="subscriptionEnd-asc">Renewal: Soonest</option>
        <option value="createdAt-desc">Newest first</option>
      </select>

      {/* Clear */}
      {hasFilters && (
        <Button
          onClick={clear}
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10"
        >
          <X size={13} />
          Clear
        </Button>
      )}
    </div>
  );
};
