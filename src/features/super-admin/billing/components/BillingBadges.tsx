import React from 'react';
import type { PlanType, PaymentStatus } from '../types/billing.types';

// ─── Plan Badge ───────────────────────────────────────────────────────────────

const PLAN_STYLES: Record<PlanType, string> = {
  Pro:     'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  Growth:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Starter: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
};

interface PlanBadgeProps {
  plan: PlanType;
  size?: 'sm' | 'md';
}

export const PlanBadge: React.FC<PlanBadgeProps> = ({ plan, size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-[11px]';
  return (
    <span
      className={`inline-flex items-center rounded-full font-bold tracking-wider uppercase ${sizeClass} ${PLAN_STYLES[plan]}`}
    >
      {plan}
    </span>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; dot: string; container: string }
> = {
  Active:    { label: 'Active',    dot: 'bg-emerald-500', container: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  Overdue:   { label: 'Overdue',   dot: 'bg-red-500',     container: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  Pending:   { label: 'Pending',   dot: 'bg-orange-400',  container: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  Expiring:  { label: 'Expiring',  dot: 'bg-yellow-500',  container: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-600' },
  Suspended: { label: 'Suspended', dot: 'bg-slate-400',   container: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
};

interface StatusBadgeProps {
  status: PaymentStatus;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showDot = true }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cfg.container}`}
    >
      {showDot && (
        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} aria-hidden />
      )}
      {cfg.label}
    </span>
  );
};
