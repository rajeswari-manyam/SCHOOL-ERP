import { UserRound, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import typography from "@/styles/typography";
import { cn } from "@/utils/cn";

import type { StudentCardProps } from "../types/fee.types";

export function StudentCard({
  name,
  className,
  rollNo,
  status = "good",
}: StudentCardProps) {
  const isGood = status === "good";

  return (
    <Card className={cn(
      "group w-[320px] h-[233px]",
      "flex flex-col items-center justify-center gap-3",
      "bg-white border border-[#C7C4D833] rounded-[24px]",
      "transition-all duration-300",
      "hover:border-[#3525CD] hover:shadow-sm"
    )}>

      <CardContent className="flex flex-col items-center justify-center gap-3 p-0">

        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-[#b2dfdb] flex items-center justify-center">
          <UserRound size={32} className="text-[#2d6a4f]" />
        </div>

        {/* INFO */}
        <div className="text-center">
          <p className={cn(
            typography.body.base,
            "font-semibold text-[#0B1C30] group-hover:text-[#3525CD]"
          )}>
            {name}
          </p>

          <p className={cn(
            typography.body.xs,
            "text-gray-400 mt-0.5 group-hover:text-gray-600"
          )}>
            {className} · Roll No. {rollNo}
          </p>
        </div>

        {/* STATUS */}
        <span className={cn(
          "flex items-center gap-1.5 text-[10px] font-semibold px-4 py-1.5 rounded-full border tracking-widest uppercase transition-all",
          isGood
            ? "text-[#006C49] bg-[#006C49]/20 border-[#E8EBF2]"
            : "text-amber-600 bg-amber-100 border-amber-200"
        )}>
          <ShieldCheck size={12} />
          {isGood ? "Good Standing" : "Attention Required"}
        </span>

      </CardContent>
    </Card>
  );
}
