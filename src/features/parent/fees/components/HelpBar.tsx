import { Info, FileText } from "lucide-react";
import typography from "@/styles/typography";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";

import type { HelpBarProps } from "../types/fee.types";
import { helpBarBannerData, helpBarCardsData } from  "../data/fee.data";

const cardBase =
  "transition-all duration-300 hover:-translate-y-1 hover:border-[#3525CD] hover:shadow-md cursor-pointer";

export function HelpBar({ variant = "banner" }: HelpBarProps) {

  // ───────── BANNER ─────────
  if (variant === "banner") {
    const data = helpBarBannerData;

    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 rounded-2xl border border-[#E8EBF2] bg-white hover:shadow-md">

        <div className="flex items-start gap-3 flex-1">
          <div className="w-8 h-8 rounded-full bg-[#EEF2FF] flex items-center justify-center">
            <Info size={14} color="#3525CD" strokeWidth={1.5} />
          </div>

          <div>
            <p className={cn(typography.body.small, "font-semibold text-[#0B1C30]")}>
              {data.title}
            </p>
            <p className={cn(typography.body.xs, "text-gray-400")}>
              {data.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button className="px-4 py-2 rounded-lg border text-[12px] font-semibold">
            {data.buttons.call}
          </button>

          <Button className="px-4 py-2 text-[12px] font-semibold">
            {data.buttons.query}
          </Button>
        </div>

      </div>
    );
  }

  // ───────── CARDS ─────────
  const data = helpBarCardsData;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

      {/* Card 1 */}
      <div className={`${cardBase} flex flex-col gap-3 px-5 py-4 rounded-2xl border border-[#E8EBF2] bg-white`}>
        <div className="w-8 h-8 rounded-full bg-[#EEF2FF] flex items-center justify-center">
          <Info size={14} color="#3525CD" />
        </div>

        <div>
          <p className={cn(typography.body.small, "font-semibold text-[#0B1C30]")}>
            {data.needHelp.title}
          </p>
          <p className={cn(typography.body.xs, "text-gray-400 mt-1")}>
            {data.needHelp.description}
          </p>
        </div>

        <button className="text-[12px] font-semibold text-[#3525CD] text-left">
          {data.needHelp.button}
        </button>
      </div>

      {/* Card 2 */}
      <div className={`${cardBase} flex flex-col gap-3 px-5 py-4 rounded-2xl border border-[#E8EBF2] bg-white`}>
        <div className="w-8 h-8 rounded-full bg-[#E6FBF4] flex items-center justify-center">
          <FileText size={14} color="#0F6E56" />
        </div>

        <div>
          <p className={cn(typography.body.small, "font-semibold text-[#0B1C30]")}>
            {data.refund.title}
          </p>
          <p className={cn(typography.body.xs, "text-gray-400 mt-1")}>
            {data.refund.description}
          </p>
        </div>

        <button className="text-[12px] font-semibold text-[#3525CD] text-left">
          {data.refund.button}
        </button>
      </div>

      {/* Card 3 */}
      <div className={`${cardBase} relative flex flex-col gap-3 px-5 py-4 rounded-2xl bg-[#3525CD] overflow-hidden`}>

        <p className={cn(typography.body.small, "font-semibold text-white relative z-10")}>
          {data.quickPay.title}
        </p>

        <p className={cn(typography.body.xs, "text-white/70 relative z-10")}>
          {data.quickPay.description}
        </p>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 text-[11px] font-bold text-white uppercase tracking-wide relative z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Status: {data.quickPay.status}
        </span>

      </div>

    </div>
  );
}