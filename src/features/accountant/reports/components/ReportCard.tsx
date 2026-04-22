import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  AlertTriangle,
  Wallet,
  Calendar,
  Users,
  TrendingUp,
  Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReportCardProps, ReportIconType } from "../types/reports.types";

const iconMap: Record<ReportIconType, LucideIcon> = {
  fee: FileText,
  defaulters: AlertTriangle,
  reconciliation: Wallet,
  annual: Calendar,
  payroll: Users,
  ledger: TrendingUp,
};

const iconBgMap: Record<ReportIconType, string> = {
  fee:            "bg-indigo-50 text-indigo-600",
  defaulters:     "bg-amber-50 text-amber-600",
  reconciliation: "bg-emerald-50 text-emerald-700",
  annual:         "bg-violet-50 text-violet-600",
  payroll:        "bg-rose-50 text-rose-600",
  ledger:         "bg-teal-50 text-teal-600",
};

export const ReportCard = ({
  title,
  description,
  icon,
  autoSend,
  onGenerate,
}: ReportCardProps) => {
  const Icon = iconMap[icon];
  const iconBg = iconBgMap[icon];

  return (
    <Card className="bg-white border border-gray-200 hover:border-[#3525CD] transition-all duration-200 overflow-hidden rounded-xl">
      <CardContent className="p-4 sm:p-5">

        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-lg ${iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>

          {autoSend && (
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#3525CD] bg-[#EEF2FF] px-2 py-1 rounded-full">
              <Check className="w-3 h-3 flex-shrink-0" />
              <span className="hidden sm:inline">Auto-sent to Principal on 1st</span>
              <span className="sm:hidden">Auto-sent</span>
            </div>
          )}
        </div>

        <h3 className="text-sm font-semibold text-gray-900 mb-1">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={onGenerate}
            className="text-white text-xs sm:text-sm h-8 px-3 sm:px-4 bg-[#3525CD] hover:bg-[#2a1eb0] transition-colors"
          >
            Generate
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="text-xs sm:text-sm h-8 px-3 sm:px-4 border-gray-200 text-gray-600 hover:border-[#3525CD] hover:text-[#3525CD] transition-colors"
          >
            PDF
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="text-xs sm:text-sm h-8 px-3 sm:px-4 border-gray-200 text-gray-600 hover:border-[#3525CD] hover:text-[#3525CD] transition-colors"
          >
            Excel
          </Button>
        </div>

      </CardContent>
    </Card>
  );
};