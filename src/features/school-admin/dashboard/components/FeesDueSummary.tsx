import { motion } from "framer-motion";
import type { FeeDefaulter } from "../types";

interface FeesDueSummaryProps {
  totalOutstanding: number;
  paidPercent: number;
  defaulters: FeeDefaulter[];
}

export function FeesDueSummary({
  totalOutstanding,
  paidPercent,
  defaulters,
}: FeesDueSummaryProps) {
  const pendingPercent = 100 - paidPercent;
  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="flex h-full w-full flex-col gap-4 rounded-3xl bg-[#f5f6f8] p-4 shadow-sm sm:gap-5 sm:p-5 md:gap-6 md:p-7">

      {/* ─── Title ─────────────────────────────── */}
      <h2 className="text-base font-extrabold text-gray-900 sm:text-lg md:text-xl lg:text-2xl">
        Fee Dues Summary
      </h2>

      {/* ─── Total Outstanding Card ─────────────── */}
      <div className="rounded-2xl bg-[#dfe3f2] p-4 sm:p-5 sm:p-6">

        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-400 sm:mb-2 sm:text-xs">
          Total Outstanding
        </p>

        {/* Amount — scales fluidly */}
        <p className="mb-3 text-2xl font-extrabold tracking-tight text-indigo-900 sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
          {fmt(totalOutstanding)}
        </p>

        {/* Progress bar */}
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex justify-between text-[10px] font-semibold text-gray-500 sm:text-xs">
            <span>PAID ({paidPercent}%)</span>
            <span>PENDING ({pendingPercent}%)</span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-gray-300 sm:h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${paidPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-indigo-500"
            />
          </div>

          {/* Paid / pending amounts below bar */}
          <div className="flex justify-between text-[10px] text-gray-400 sm:text-xs">
            <span>{fmt(Math.round(totalOutstanding * paidPercent / 100))} collected</span>
            <span>{fmt(Math.round(totalOutstanding * pendingPercent / 100))} pending</span>
          </div>
        </div>
      </div>

      {/* ─── Top Defaulters ─────────────────────── */}
      <div className="flex flex-1 flex-col">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 sm:mb-4 sm:text-xs">
          Top Defaulters
        </p>

        <div className="flex flex-col gap-3 sm:gap-4">
          {defaulters.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className="flex items-center justify-between gap-2"
            >
              {/* Left: avatar + name */}
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">

                {/* Avatar */}
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:h-10 sm:w-10 sm:text-sm"
                  style={{ background: "#d6dcef", color: "#4f46e5" }}
                >
                  {d.initials}
                </div>

                {/* Name + class */}
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-gray-800 sm:text-sm md:text-base">
                    {d.name}
                  </p>
                  <p className="truncate text-[10px] text-gray-500 sm:text-xs">
                    {d.className}
                  </p>
                </div>
              </div>

              {/* Right: amount + overdue */}
              <div className="shrink-0 text-right">
                <p className="text-xs font-bold text-gray-800 sm:text-sm md:text-base">
                  {fmt(d.amount)}
                </p>
                <p
                  className={`text-[10px] font-bold sm:text-xs ${
                    d.overdueDays >= 10 ? "text-red-500" : "text-amber-500"
                  }`}
                >
                  OVERDUE {d.overdueDays}D
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── CTA ─────────────────────────────────── */}
      <button className="mt-auto w-full rounded-2xl border border-indigo-200 py-2.5 text-sm font-bold text-indigo-600 transition hover:bg-indigo-50 active:scale-[0.98] sm:py-3 sm:text-base">
        View All Defaulters
      </button>
    </div>
  );
}