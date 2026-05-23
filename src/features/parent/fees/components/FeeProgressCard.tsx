import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Lock,
  Check,
 
} from "lucide-react";

import { tuitionMonths, examTerms } from "../data/fee.data";
import type { FeeProgressCardProps } from "../types/fee.types";

export function FeeProgressCard({
  tuitionMonths: tm = tuitionMonths,
  examTerms: et = examTerms,
}: FeeProgressCardProps) {
  return (
    <div className="flex flex-col gap-4">

      {/* SUMMARY BANNER */}
      <div className="rounded-2xl border border-[#E8EBF2] bg-white p-5 sm:p-8 hover:border-[#3525CD] hover:shadow-sm transition-all">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CalendarDays size={14} color="#3525CD" />
            <p className="text-[14px] font-semibold text-[#0B1C30]">
              Academic Year Overview
            </p>
          </div>

          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            55.9% COLLECTED
          </span>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Total Paid</p>
            <p className="text-[20px] font-bold">Rs.71,500</p>
          </div>

          <div>
            <p className="text-[10px] text-gray-400 uppercase">Pending</p>
            <p className="text-[20px] font-bold text-red-600">Rs.56,500</p>
          </div>

          <div>
            <p className="text-[10px] text-gray-400 uppercase">Annual Total</p>
            <p className="text-[20px] font-bold">Rs.1,28,000</p>
          </div>
        </div>

        <div className="h-2 w-full bg-[#F0F1F5] rounded-full">
          <div className="h-2 bg-[#3525CD] rounded-full w-[55.9%]" />
        </div>
      </div>

      {/* MAIN BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">

        {/* TUITION */}
        <div className="rounded-2xl border bg-white p-6">
          <div className="mb-4">
            <p className="text-[11px] font-bold text-[#00714D] uppercase">
              Tuition Fee
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {tm.map((m) => (
              <div
                key={m.label}
                className={`flex flex-col items-center py-2 rounded-xl text-[11px] font-bold
                ${m.paid ? "bg-emerald-100 text-emerald-700" :
                  m.pending ? "bg-amber-100 text-amber-700" :
                  "bg-gray-100 text-gray-400"}`}
              >
                {m.paid && <Check size={10} />}
                {m.pending && <Clock size={10} />}
                {m.upcoming && <Lock size={10} />}
                {m.label}
              </div>
            ))}
          </div>
        </div>

        {/* EXAM */}
        <div className="rounded-2xl border bg-white p-6">
          <p className="text-[11px] uppercase text-gray-400">Examination Fee</p>

          <div className="flex flex-col gap-3 mt-3">
            {et.map((t) => (
              <div
                key={t.label}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  {t.paid && <CheckCircle2 size={14} color="#16A34A" />}
                  {t.pending && <Clock size={14} color="#D97706" />}
                  {t.upcoming && <Lock size={14} color="#9CA3AF" />}
                  <span className="text-[13px] font-semibold">
                    {t.label}
                  </span>
                </div>

                <span className="text-[13px] font-semibold">
                  Rs.{t.amount.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* PAY BAR */}
      <div className="rounded-2xl bg-[#3525CD] px-5 py-4 flex justify-between items-center">
        <div>
          <p className="text-white font-bold">
            Outstanding Balance: Rs.56,500
          </p>
          <p className="text-white/70 text-[11px]">
            Pay current installments to avoid late fees
          </p>
        </div>

        <button className="bg-white text-[#3525CD] px-6 py-3 rounded-xl font-bold">
          Pay Now
        </button>
      </div>

    </div>
  );
}