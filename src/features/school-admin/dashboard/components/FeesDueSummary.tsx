import { motion } from 'framer-motion';
import type { FeeDefaulter } from '../types';

interface FeesDueSummaryProps {
  totalOutstanding: number;
  feeCollected?: number;
  paidPercent: number;
  defaulters: FeeDefaulter[];
  onViewAll?: () => void;
}

export function FeesDueSummary({ totalOutstanding, feeCollected = 0, paidPercent, defaulters, onViewAll }: FeesDueSummaryProps) {
  const hasData = totalOutstanding > 0 || defaulters.length > 0;
  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  // If we have real API data, compute paid/pending from fee_collection + total_pending_fees
  const totalFees     = feeCollected + totalOutstanding;
  const computedPaid  = totalFees > 0 ? Math.round((feeCollected / totalFees) * 100) : paidPercent;
  const resolvedPaid  = feeCollected > 0 ? computedPaid : paidPercent;
  const pendingPercent = 100 - resolvedPaid;

  if (!hasData) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl bg-white border border-gray-100 shadow-sm p-4 sm:p-5 min-h-[200px]">
        <h2 className="text-sm sm:text-base font-bold text-gray-900 self-start">Fee Dues Summary</h2>
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <div className="text-3xl">₹</div>
          <p className="text-sm font-semibold text-gray-500">No fee data available</p>
          <p className="text-xs text-gray-400">Fee dues will appear here once data is loaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 rounded-2xl bg-white border border-gray-100 shadow-sm p-4 sm:p-5">

      {/* ── Title ── */}
      <h2 className="text-sm sm:text-base font-bold text-gray-900">
        Fee Dues Summary
      </h2>

      {/* ── Outstanding card ── */}
      <div className="rounded-xl bg-indigo-600 p-4 sm:p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-1.5">
          Total Pending Fees
        </p>
        <p className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-4 tabular-nums">
          {fmt(totalOutstanding)}
        </p>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-semibold text-indigo-200">
            <span>COLLECTED ({resolvedPaid}%)</span>
            <span>PENDING ({pendingPercent}%)</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-indigo-800/60">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${resolvedPaid}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full rounded-full bg-emerald-400"
            />
          </div>
          <div className="flex justify-between text-[10px] text-indigo-300">
            <span>{fmt(feeCollected > 0 ? feeCollected : Math.round(totalOutstanding * resolvedPaid / 100))} collected</span>
            <span>{fmt(totalOutstanding)} pending</span>
          </div>
        </div>
      </div>

      {/* ── Top Defaulters ── */}
      <div className="flex flex-1 flex-col gap-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Top Defaulters
        </p>

        <div className="flex flex-col gap-3">
          {defaulters.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.25 }}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ background: '#e0e4f5', color: '#4f46e5' }}
                >
                  {d.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-gray-800">{d.name}</p>
                  <p className="truncate text-[10px] text-gray-500">{d.className}</p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-bold text-gray-800 tabular-nums">{fmt(d.amount)}</p>
                <p className={`text-[10px] font-bold ${d.overdueDays >= 10 ? 'text-red-500' : 'text-amber-500'}`}>
                  OVERDUE {d.overdueDays}D
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <button
        onClick={onViewAll}
        className="w-full rounded-xl border border-indigo-200 py-2.5 text-xs sm:text-sm font-bold text-indigo-600 hover:bg-indigo-50 active:scale-[0.98] transition-all"
      >
        View All Defaulters
      </button>
    </div>
  );
}
