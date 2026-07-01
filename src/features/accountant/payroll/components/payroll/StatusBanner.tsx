import { CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import typography, { combineTypography } from "@/styles/typography";
import { formatINR } from "../../../../../utils/formatters";
import type { StatusBannerProps } from "../../types/payroll.types";

export const StatusBanner = ({
  isProcessed,
  summary,
  processedDate,
  processedBy,
  onStartProcessing,
}: StatusBannerProps) => {
  if (isProcessed) {
    return (
      <Alert
        variant="success"
        icon={<CheckCircle className="w-4 h-4 text-green-600" />}
        title={
          <span className={combineTypography(typography.body.small, "font-semibold")}>
            April 2025 Payroll Processed
          </span>
        }
        description={
          <span className={combineTypography(typography.body.xs, "text-green-700 block")}>
            <span className="hidden sm:inline">
              {summary.totalStaff} payslips generated | {formatINR(summary.totalNet)} total | Processed on {processedDate} by {processedBy}
            </span>
            <span className="sm:hidden space-y-1 block">
              <span className="block">{summary.totalStaff} payslips generated</span>
              <span className="block">{formatINR(summary.totalNet)} total</span>
              <span className="block">By {processedBy}</span>
              <span className="block">{processedDate}</span>
            </span>
          </span>
        }
      />
    );
  }

  return (
    <Alert
      variant="warning"
      icon={<AlertTriangle className="w-4 h-4 text-amber-600" />}
      title={
        <span className={combineTypography(typography.body.small, "font-semibold")}>
          April 2025 Payroll Pending
        </span>
      }
      description={
        <span className={combineTypography(typography.body.xs, "text-amber-700 block")}>
          <span className="hidden sm:inline">
            Expected total: {formatINR(summary.totalNet)} | Processing due: {summary.processingDueDate}
          </span>
          <span className="sm:hidden space-y-1 block">
            <span className="block">Expected: {formatINR(summary.totalNet)}</span>
            <span className="block">Due: {summary.processingDueDate}</span>
          </span>
        </span>
      }
      action={
        <div className="w-full sm:w-auto">
          <Button
            size="sm"
            className="w-full sm:w-auto h-9 text-xs bg-[#3525CD] hover:bg-[#2a1fb5] text-white"
            onClick={onStartProcessing}
          >
            Start Processing
          </Button>
        </div>
      }
    />
  );
};