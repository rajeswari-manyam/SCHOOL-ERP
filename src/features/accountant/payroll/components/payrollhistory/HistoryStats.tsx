
import { TrendingUp, Users, Wallet } from "lucide-react";
import { formatCurrency } from "../../../../../utils/formatters";
import { StatCard } from "@/components/ui/statcard";
import { Avatar } from "@/components/ui/avatar";
import type { HistoryStatsProps } from "../../types/payroll.types";


const MAX_SHOWN = 4;

const AvatarStack = ({
  avatars,
  total,
}: {
  avatars: string[];
  total: number;
}) => {
  const shown = avatars.slice(0, MAX_SHOWN);
  const extra = total - shown.length;

  const overlapStyle = (i: number) => ({
    marginLeft: i === 0 ? 0 : -8,
  });

  return (
    <div className="flex items-center">
      {shown.length > 0 ? (
        shown.map((src, i) => (
          <div key={i} style={overlapStyle(i)}>
            <Avatar src={src} size="sm" />
          </div>
        ))
      ) : (
        Array.from({ length: Math.min(MAX_SHOWN, total) }).map((_, i) => (
          <div key={i} style={overlapStyle(i)}>
            <Avatar
              fallback={String.fromCharCode(65 + i)}
              size="sm"
              className="bg-gray-100"
            />
          </div>
        ))
      )}

      {extra > 0 && (
        <div
          className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-semibold"
          style={{ marginLeft: -8 }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
};

export const HistoryStats = ({
  totalPayrollFY,
  avgMonthlyPayroll,
  staffCount,
  fyLabel = "FY 2024-25",
  growthPercent = 12.5,
  avatars = [],
}: HistoryStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

      {/* TOTAL PAYROLL */}
    <StatCard
  label={`Total Payroll ${fyLabel}`}
  icon={<TrendingUp className="w-4 h-4 text-[#3525CD]" />}
  value={
    <span className="text-[#3525CD]">
      {formatCurrency(totalPayrollFY)}
    </span>
  }
  badge={{
    text: `+${growthPercent}% vs last FY`,
    variant: "green",
  }}
/>

      {/* STAFF COUNT */}
      <StatCard
        label="Total Staff Count"
        icon={<Users className="w-4 h-4 text-blue-500" />}
        value={staffCount}
        sub={<AvatarStack avatars={avatars} total={staffCount} />}
        suffixLabel="staff members"
      />

      {/* AVG MONTHLY PAYROLL */}
      <StatCard
        label="Avg Monthly Payroll"
        icon={<Wallet className="w-4 h-4 text-[#3525CD]" />}
        value={formatCurrency(avgMonthlyPayroll)}
        sub="Calculated based on active payroll records from the current financial year cycle."
      />

    </div>
  );
};