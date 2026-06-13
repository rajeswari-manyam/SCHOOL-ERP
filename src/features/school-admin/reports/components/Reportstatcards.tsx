import type { ReportStats } from "../types/reports.types";

const Card = ({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub: string;
  accent: string;
}) => (
  <div
    className="
      bg-white
      rounded-lg
      border
      border-gray-100
      shadow-sm
      px-2
      py-1.5
      h-[80px]
      flex
      flex-col
      justify-center
      overflow-hidden
      transition-shadow
      duration-200
      hover:shadow-md
    "
  >
    {/* Label */}
    <p className="text-[7px] font-bold uppercase tracking-wide text-gray-400 truncate">
      {label}
    </p>

    {/* Value + Sub */}
    <div className="flex items-end gap-1 mt-0.5">
      <p className="text-[13px] font-bold leading-none text-gray-900 truncate">
        {value}
      </p>

      <span
        className={`text-[7px] font-medium leading-none truncate ${accent}`}
      >
        {sub}
      </span>
    </div>
  </div>
);

const ReportStatCards = ({
  stats,
}: {
  stats: ReportStats;
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      <Card
        label="Total Generated"
        value={stats.totalGenerated}
        sub="this year"
        accent="text-indigo-500"
      />

      <Card
        label="Scheduled Reports"
        value={stats.scheduledReports}
        sub="active"
        accent="text-emerald-600"
      />

      <Card
        label="Monthly Avg"
        value={stats.monthlyAvg}
        sub="reports"
        accent="text-gray-400"
      />

      <Card
        label="Pending Delivery"
        value={stats.pendingDelivery}
        sub="in queue"
        accent="text-amber-500"
      />
    </div>
  );
};

export default ReportStatCards;