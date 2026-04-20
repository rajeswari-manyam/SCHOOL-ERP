import { CheckCircle } from "lucide-react";
import { formatCurrency } from "../../utils/payroll.utils";
import type { PayrollSummary } from "../../types/payroll.types";
import { StatCard } from "../../../../../components/ui/statcard";
import typography, { combineTypography } from "@/styles/typography";

interface PayrollStatsProps {
  summary: PayrollSummary;
}

export const PayrollStats = ({ summary }: PayrollStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      
      {/* Total Staff */}
      <StatCard
        label={
          <span
            className={combineTypography(
              typography.body.xs,
              "uppercase text-gray-500 font-medium"
            )}
          >
            Total Staff on Payroll
          </span>
        }
        value={
          <span
            className={combineTypography(
              typography.heading.h4,
              "text-gray-900"
            )}
          >
            {summary.totalStaff}
          </span>
        }
      />

      {/* Total Monthly Outflow */}
      <StatCard
        label={
          <span
            className={combineTypography(
              typography.body.xs,
              "uppercase text-gray-500 font-medium"
            )}
          >
            Total Monthly Outflow
          </span>
        }
        value={
          <span
            className={combineTypography(
              typography.heading.h5,
              "text-gray-900 leading-tight"
            )}
          >
            {formatCurrency(summary.totalNet)}
          </span>
        }
      />

      {/* Payroll Status */}
      <StatCard
        label={
          <span
            className={combineTypography(
              typography.body.xs,
              "uppercase text-gray-500 font-medium"
            )}
          >
            March Payroll
          </span>
        }
        value={
          <span
            className={combineTypography(
              typography.body.small,
              "flex items-center gap-1 text-gray-900 font-semibold"
            )}
          >
            Paid <CheckCircle className="w-4 h-4 text-green-500" />
          </span>
        }
      />

      {/* Pending Approvals */}
      <StatCard
        label={
          <span
            className={combineTypography(
              typography.body.xs,
              "uppercase text-gray-500 font-medium"
            )}
          >
            Pending Approvals
          </span>
        }
        value={
          <span
            className={combineTypography(
              typography.heading.h4,
              "text-gray-900"
            )}
          >
            0
          </span>
        }
      />
    </div>
  );
};