import { motion } from "framer-motion";
import type { FeeDefaulter } from "../types";

interface FeesDueSummaryProps {
  totalOutstanding: number;
  feeCollected?: number;
  paidPercent: number;
  defaulters?: FeeDefaulter[];
  onViewAll?: () => void;
}

export function FeesDueSummary({
  totalOutstanding,
  feeCollected = 0,
  paidPercent,
  defaulters = [],
  onViewAll,
}: FeesDueSummaryProps) {
  const hasData = totalOutstanding > 0 || defaulters.length > 0;
  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;


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
    <div className="flex h-full w-full flex-col gap-3 rounded-2xl bg-white border border-gray-100 shadow-sm p-3 sm:p-4">

      {/* ── Title ── */}
      <h2 className="text-xs text-gray-800">
        Fee Dues Summary
      </h2>

      {/* ── Outstanding card ── */}
      <div className="rounded-xl bg-indigo-600 p-3 sm:p-4">
        <p className="text-[9px] uppercase tracking-widest text-indigo-200 mb-1">
          Total Pending Fees
        </p>
        <p className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-white mb-3 tabular-nums">
          {fmt(totalOutstanding)}
        </p>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] text-indigo-200">
            <span>COLLECTED ({resolvedPaid}%)</span>
            <span>PENDING ({pendingPercent}%)</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-indigo-800/60">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${resolvedPaid}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full rounded-full bg-emerald-400"
            />
          </div>
          <div className="flex justify-between text-[9px] text-indigo-300">
            <span>{fmt(feeCollected > 0 ? feeCollected : Math.round(totalOutstanding * resolvedPaid / 100))} collected</span>
            <span>{fmt(totalOutstanding)} pending</span>
          </div>
        </div>

        {/* View Pending button */}
        <button
          onClick={onViewAll}
          className="mt-3 w-full rounded-lg bg-white/15 hover:bg-white/25 text-white text-[10px] font-medium py-1.5 transition-colors border border-white/20"
        >
          View Pending Students →
        </button>
      </div>
    </div>
  );
}
