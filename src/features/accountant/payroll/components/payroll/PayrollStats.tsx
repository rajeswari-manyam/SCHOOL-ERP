import { CheckCircle } from "lucide-react";
import { formatCurrency } from "../../../../../utils/formatters";
import type {  PayrollStatsProps } from "../../types/payroll.types";
import { StatCard } from "../../../../../components/ui/statcard";



export const PayrollStats = ({ summary }: PayrollStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">

      {/* Total Staff */}
      <StatCard
        label={
          <span className="text-[10px] uppercase text-gray-500 font-medium">
            Total Staff on Payroll
          </span>
        }
        value={
          <span className="text-base font-semibold text-gray-900">
            {summary.totalStaff}
          </span>
        }
      />

      {/* Total Monthly Outflow */}
      <StatCard
        label={
          <span className="text-[10px] uppercase text-gray-500 font-medium">
            Total Monthly Outflow
          </span>
        }
        value={
          <span className="text-base font-semibold text-gray-900">
            {formatCurrency(summary.totalNet)}
          </span>
        }
      />

      {/* Payroll Status */}
      <StatCard
        label={
          <span className="text-[10px] uppercase text-gray-500 font-medium">
            March Payroll
          </span>
        }
        value={
          <span className="flex items-center gap-1 text-sm font-semibold text-gray-900">
            Paid <CheckCircle className="w-3.5 h-3.5 text-green-500" />
          </span>
        }
      />

      {/* Pending Approvals */}
      <StatCard
        label={
          <span className="text-[10px] uppercase text-gray-500 font-medium">
            Pending Approvals
          </span>
        }
        value={
          <span className="text-base font-semibold text-gray-900">
            0
          </span>
        }
      />
    </div>
  );
};