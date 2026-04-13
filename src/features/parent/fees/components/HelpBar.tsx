import typography from "@/styles/typography";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";

type HelpBarVariant = "banner" | "cards";

interface HelpBarProps {
  variant?: HelpBarVariant;
}

const cardBase =
  "transition-all duration-300 hover:-translate-y-1 hover:border-[#3525CD] hover:shadow-md cursor-pointer";

export function HelpBar({ variant = "banner" }: HelpBarProps) {

  // ── BANNER ──
  if (variant === "banner") {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 rounded-2xl border border-[#E8EBF2] bg-white transition-all duration-300 hover:shadow-md">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-8 h-8 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="#3525CD" strokeWidth="1.2" />
              <path d="M7 6.5v4" stroke="#3525CD" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="7" cy="4.5" r="0.6" fill="#3525CD" />
            </svg>
          </div>
          <div>
            <p className={cn(typography.body.small, "font-semibold text-[#0B1C30]")}>
              Need help with fee payments?
            </p>
            <p className={cn(typography.body.xs, "text-gray-400")}>
              Contact the school accounts department for any discrepancies.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button className="px-4 py-2 rounded-lg border border-[#E8EBF2] text-[12px] font-semibold text-[#0B1C30] hover:bg-[#F8F9FF] transition">
            Call Office
          </button>

          <Button className="px-4 py-2 rounded-lg bg-[#3525CD] text-white text-[12px] font-semibold hover:bg-[#2a1db5] transition">
            Raise Query
          </Button>
        </div>
      </div>
    );
  }

  // ── CARDS ──
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

      {/* Card 1 */}
      <div className={`${cardBase} flex flex-col gap-3 px-5 py-4 rounded-2xl border border-[#E8EBF2] bg-white hover:border-[#3525CD]`}>
        <div className="w-8 h-8 rounded-full bg-[#EEF2FF] flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="#3525CD" strokeWidth="1.2" />
            <path d="M7 6.5v4" stroke="#3525CD" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="7" cy="4.5" r="0.6" fill="#3525CD" />
          </svg>
        </div>

        <div>
          <p className={cn(typography.body.small, "font-semibold text-[#0B1C30]")}>
            Need Help?
          </p>
          <p className={cn(typography.body.xs, "text-gray-400 mt-1")}>
            Questions regarding fee structure or missed payments? Contact our administrative office.
          </p>
        </div>

        <button className="text-[12px] font-semibold text-[#3525CD] hover:underline text-left">
          Contact Admin
        </button>
      </div>

      {/* Card 2 */}
      <div className={`${cardBase} flex flex-col gap-3 px-5 py-4 rounded-2xl border border-[#E8EBF2] bg-white hover:border-[#3525CD]`}>
        <div className="w-8 h-8 rounded-full bg-[#E6FBF4] flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="2" y="1.5" width="10" height="11" rx="1.5" stroke="#0F6E56" strokeWidth="1.2" />
            <path d="M4.5 5h5M4.5 7.5h5M4.5 10h3" stroke="#0F6E56" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>

        <div>
          <p className={cn(typography.body.small, "font-semibold text-[#0B1C30]")}>
            Refund Policy
          </p>
          <p className={cn(typography.body.xs, "text-gray-400 mt-1")}>
            Read about our fee refund guidelines and cancellation policies for the academic year.
          </p>
        </div>

        <button className="text-[12px] font-semibold text-[#3525CD] hover:underline text-left">
          View Policy
        </button>
      </div>

      {/* Card 3 */}
      <div className={`${cardBase} relative flex flex-col gap-3 px-5 py-4 rounded-2xl bg-[#3525CD] overflow-hidden`}>
        <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full bg-white/10" />

        <p className={cn(typography.body.small, "font-semibold text-white relative z-10")}>
          Quick Pay
        </p>

        <p className={cn(typography.body.xs, "text-white/70 relative z-10")}>
          You have no upcoming dues for the next 30 days. You're all caught up!
        </p>

        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 text-[11px] font-bold text-white uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Status: Excellent
          </span>
        </div>
      </div>

    </div>
  );
}