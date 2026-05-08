import { CheckCircle } from "lucide-react";
import { formatCurrency } from "../../../../../utils/formatters";
import type {  PayrollStatsProps } from "../../types/payroll.types";
import { StatCard } from "../../../../../components/ui/statcard";



export const PayrollStats = ({ summary }: PayrollStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      
      {/* Total Staff */}
      <StatCard
        label={
          <span className="text-[11px] sm:text-xs uppercase text-gray-500 font-medium">
            Total Staff on Payroll
          </span>
        }
        value={
          <span className="text-lg sm:text-xl font-semibold text-gray-900">
            {summary.totalStaff}
          </span>
        }
      />

      {/* Total Monthly Outflow */}
      <StatCard
        label={
          <span className="text-[11px] sm:text-xs uppercase text-gray-500 font-medium">
            Total Monthly Outflow
          </span>
        }
        value={
          <span className="text-base sm:text-lg font-semibold text-gray-900">
            {formatCurrency(summary.totalNet)}
          </span>
        }
      />

      {/* Payroll Status */}
      <StatCard
        label={
          <span className="text-[11px] sm:text-xs uppercase text-gray-500 font-medium">
            March Payroll
          </span>
        }
        value={
          <span className="flex items-center gap-1 text-sm sm:text-base font-semibold text-gray-900">
            Paid <CheckCircle className="w-4 h-4 text-green-500" />
          </span>
        }
      />

      {/* Pending Approvals */}
      <StatCard
        label={
          <span className="text-[11px] sm:text-xs uppercase text-gray-500 font-medium">
            Pending Approvals
          </span>
        }
        value={
          <span className="text-lg sm:text-xl font-semibold text-gray-900">
            0
          </span>
        }
      />
    </div>
  );
};