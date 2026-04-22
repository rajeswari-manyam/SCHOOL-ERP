import { CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import typography, { combineTypography } from "@/styles/typography";

import { formatCurrency } from "../../../../../utils/formatters";
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
          <span
            className={combineTypography(
              typography.body.small,
              "font-semibold"
            )}
          >
            April 2025 Payroll Processed Successfully
          </span>
        }
        description={
          <span
            className={combineTypography(
              typography.body.xs,
              "text-green-700"
            )}
          >
            {summary.totalStaff} payslips generated |{" "}
            {formatCurrency(summary.totalNet)} total | Processed on{" "}
            {processedDate} by {processedBy}
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
        <span
          className={combineTypography(
            typography.body.small,
            "font-semibold"
          )}
        >
          April 2025 Payroll — Not yet processed
        </span>
      }
      description={
        <span
          className={combineTypography(
            typography.body.xs,
            "text-amber-700"
          )}
        >
          Expected total: {formatCurrency(summary.totalNet)} | Processing due:{" "}
          {summary.processingDueDate}
        </span>
      }
      action={
        <Button
          size="sm"
          className="h-8 text-xs bg-[#3525CD] hover:bg-[#2a1fb5] text-white"
          onClick={onStartProcessing}
        >
          Start Processing
        </Button>
      }
    />
  );
};