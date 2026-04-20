// components/ReportCard.tsx
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

import typography, { combineTypography } from "@/styles/typography";

interface ReportCardProps {
  id: string;
  title: string;
  description: string;
  icon: "fee" | "defaulters" | "reconciliation" | "annual" | "payroll" | "ledger";
  autoSend?: boolean;
  onGenerate: () => void;
}

const iconMap = {
  fee: FileText,
  defaulters: AlertTriangle,
  reconciliation: Wallet,
  annual: Calendar,
  payroll: Users,
  ledger: TrendingUp,
};

export const ReportCard = ({
  title,
  description,
  icon,
  autoSend,
  onGenerate,
}: ReportCardProps) => {
  const Icon = iconMap[icon];

  return (
    <Card
      className="
        bg-white
        border border-gray-200
        hover:border-[#3525CD]
        transition-all duration-200
        overflow-hidden
        rounded-xl
      "
    >
      <CardContent className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="p-2.5 rounded-lg bg-gray-100 text-gray-700">
            <Icon className="w-5 h-5" />
          </div>

          {autoSend && (
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#3525CD] bg-[#EEF2FF] px-2 py-1 rounded-full">
              <Check className="w-3 h-3" />
              <span className="hidden sm:inline">Auto-sent to Principal on 1st</span>
              <span className="sm:hidden">Auto-sent</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3
          className={combineTypography(
            typography.fontSize.lg,
            "font-semibold text-gray-900 mb-1"
          )}
        >
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {/* Generate Button */}
          <Button
            size="sm"
            onClick={onGenerate}
            className="
              text-white text-xs sm:text-sm
              h-8 px-3 sm:px-4
              bg-gradient-to-r from-[#3525CD] to-[#4F46E5]
              hover:from-white hover:to-white
              hover:text-[#3525CD]
              hover:border hover:border-[#3525CD]
              transition-all
            "
          >
            Generate
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="
              text-xs sm:text-sm
              h-8 px-3 sm:px-4
              border-gray-300
              hover:border-[#3525CD]
              hover:text-[#3525CD]
              transition-all
            "
          >
            PDF
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="
              text-xs sm:text-sm
              h-8 px-3 sm:px-4
              border-gray-300
              hover:border-[#3525CD]
              hover:text-[#3525CD]
              transition-all
            "
          >
            Excel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};