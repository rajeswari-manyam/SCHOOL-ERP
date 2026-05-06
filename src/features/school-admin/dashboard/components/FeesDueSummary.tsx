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
    <div className="bg-[#f5f6f8] rounded-3xl p-5 sm:p-6 md:p-7 shadow-sm flex h-full min-h-[520px] min-w-[320px] flex-col gap-6">

      {/* ─── Title ───────────────────────── */}
      <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">
        Fee Dues Summary
      </h2>

      {/* ─── Total Outstanding Card ─────── */}
      <div className="bg-[#dfe3f2] rounded-2xl p-5 sm:p-6">
        <p className="text-xs sm:text-sm font-bold tracking-widest text-indigo-400 uppercase mb-2">
          Total Outstanding
        </p>

        <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-indigo-900 tracking-tight mb-4">
          {fmt(totalOutstanding)}
        </p>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm font-semibold text-gray-500">
            <span>PAID ({paidPercent}%)</span>
            <span>PENDING ({pendingPercent}%)</span>
          </div>

          <div className="h-3 rounded-full bg-gray-300 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${paidPercent}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-indigo-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* ─── Top Defaulters ─────────────── */}
      <div>
        <p className="text-xs sm:text-sm font-bold tracking-widest text-gray-400 uppercase mb-4">
          Top Defaulters
        </p>

        <div className="space-y-4">
          {defaulters.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center justify-between"
            >
              {/* Left */}
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: "#d6dcef",
                    color: "#4f46e5",
                  }}
                >
                  {d.initials}
                </div>

                {/* Name */}
                <div>
                  <p className="text-sm sm:text-base font-semibold text-gray-800">
                    {d.name}
                  </p>
                  <p className="text-xs text-gray-500">{d.className}</p>
                </div>
              </div>

              {/* Right */}
              <div className="text-right">
                <p className="text-sm sm:text-base font-bold text-gray-800">
                  {fmt(d.amount)}
                </p>

                <p
                  className={`text-xs font-bold ${
                    d.overdueDays >= 10
                      ? "text-red-500"
                      : "text-amber-500"
                  }`}
                >
                  OVERDUE {d.overdueDays}D
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── CTA Button ─────────────────── */}
      <button
        className="
          mt-2
          w-full
          py-3
          rounded-2xl
          border border-indigo-200
          text-indigo-600
          font-bold
          text-sm sm:text-base
          hover:bg-indigo-50
          transition
        "
      >
        View All Defaulters
      </button>
    </div>
  );
}