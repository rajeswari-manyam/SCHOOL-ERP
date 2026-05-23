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
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1">
    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
    <div className="flex items-end gap-2">
      <p className="text-3xl font-extrabold text-gray-900">{value}</p>
      <span className={`mb-0.5 text-xs font-bold ${accent}`}>{sub}</span>
    </div>
  </div>
);

const ReportStatCards = ({ stats }: { stats: ReportStats }) => (
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
    <Card label="Total Generated" value={stats.totalGenerated} sub="this year" accent="text-indigo-500" />
    <Card label="Scheduled Reports" value={stats.scheduledReports} sub="active" accent="text-emerald-600" />
    <Card label="Monthly Avg" value={stats.monthlyAvg} sub="reports" accent="text-gray-400" />
    <Card label="Pending Delivery" value={stats.pendingDelivery} sub="in queue" accent="text-amber-500" />
  </div>
);

export default ReportStatCards;