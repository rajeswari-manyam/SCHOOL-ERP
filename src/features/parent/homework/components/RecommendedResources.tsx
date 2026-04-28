import { Card, CardContent } from "@/components/ui/card";
import typography, { combineTypography } from "@/styles/typography";
import { Download, Link } from "lucide-react";

import { resources } from "../data/HomeWork.data";
import type { RecommendedResource } from "../types/homework.types";

export function RecommendedResources() {
  return (
    <Card className="border-none shadow-none bg-white">
      <CardContent className="p-4 flex flex-col gap-3">

        <p className={combineTypography(typography.body.small, "font-semibold text-[#0B1C30]")}>
          Recommended Resources
        </p>

        <div className="flex flex-col gap-2">
          {resources.map((r: RecommendedResource) => (
            <div
              key={r.id}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-[#F8FAFC] hover:bg-[#3525CD] transition-all duration-200 cursor-pointer group"
            >
              <div>
                <p className={combineTypography(
                  typography.body.small,
                  "font-semibold text-[#0B1C30] group-hover:text-white"
                )}>
                  {r.title}
                </p>

                <p className={combineTypography(
                  typography.body.xs,
                  "text-gray-400 group-hover:text-white/70"
                )}>
                  {r.subtitle}
                </p>
              </div>

              <span className="flex items-center text-gray-300 group-hover:text-white">
                {r.type === "download" ? (
                  <Download size={14} strokeWidth={1.5} />
                ) : (
                  <Link size={14} strokeWidth={1.3} />
                )}
              </span>
            </div>
          ))}
        </div>

        <button className="w-full py-2 rounded-xl border border-[#E8EBF2] text-[12px] font-semibold text-[#3525CD] hover:bg-[#3525CD] hover:text-white transition-all">
          View All Study Materials
        </button>

      </CardContent>
    </Card>
  );
}