import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { FeeBannerProps } from "../types/fee.types";
import { feeBannerDummy } from "../data/fee.data";

export function FeeBanner({
  text = feeBannerDummy.text,
  onPayNow,
}: FeeBannerProps) {
  return (
    <div
      className="
        w-full max-w-[864px]
        h-[68px]
        flex items-center justify-between
        px-4
        bg-[#FFFBEB]
        border-l-4 border-[#F59E0B]
        rounded-tr-xl rounded-br-xl
        transition-all duration-200 ease-in-out
        hover:bg-[#FFF7D6]
        hover:border-[#3525CD]
        hover:shadow-md
        hover:-translate-y-[1px]
        cursor-pointer
      "
    >
      {/* Left side */}
      <div className="flex items-center gap-2">
        <AlertTriangle size={16} color="#92400E" strokeWidth={1.5} />
        <span className="text-[13px] text-[#92400E] font-medium">
          {text}
        </span>
      </div>

      {/* Button */}
      <Button
        onClick={onPayNow}
        className="
          shrink-0
          bg-[#006C49]
          text-white
          text-[12px]
          font-semibold
          px-4 py-1.5
          rounded-lg
          hover:bg-[#1a2f47]
          transition-colors
        "
      >
        Pay Now
      </Button>
    </div>
  );
}