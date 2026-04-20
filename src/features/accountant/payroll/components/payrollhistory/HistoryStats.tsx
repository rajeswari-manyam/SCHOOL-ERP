import { TrendingUp, Users, Wallet } from "lucide-react";
import { formatCurrency } from "../../utils/payroll.utils";
import { StatCard } from "@/components/ui/statcard";

/* =========================
   TYPES
========================= */
interface HistoryStatsProps {
  totalPayrollFY: number;
  avgMonthlyPayroll: number;
  staffCount: number;
  fyLabel?: string;
  growthPercent?: number;
  avatars?: string[];
}

/* =========================
   AVATAR STACK
========================= */
const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-sky-100 text-sky-700",
  "bg-pink-100 text-pink-700",
  "bg-amber-100 text-amber-700",
];

const AvatarStack = ({
  avatars,
  total,
}: {
  avatars: string[];
  total: number;
}) => {
  const MAX_SHOWN = 4;
  const shown = avatars.slice(0, MAX_SHOWN);
  const extra = total - shown.length;

  return (
    <div className="flex items-center">
      {shown.length > 0
        ? shown.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="w-7 h-7 rounded-full border-2 border-white object-cover"
              style={{ marginLeft: i === 0 ? 0 : -8 }}
            />
          ))
        : Array.from({ length: Math.min(MAX_SHOWN, total) }).map((_, i) => (
            <div
              key={i}
              className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-semibold ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
              style={{ marginLeft: i === 0 ? 0 : -8 }}
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
      {extra > 0 && (
        <div
          className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-semibold"
          style={{ marginLeft: -8 }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
};

/* =========================
   MAIN COMPONENT
========================= */
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
          <span className="text-[#3525CD]">{formatCurrency(totalPayrollFY)}</span>
        }
        badge={{ text: `+${growthPercent}% vs last FY`, variant: "green" }}
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