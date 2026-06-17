import { FileText, BarChart3, Clock } from "lucide-react";
import type { ReportStats } from "../types/reports.types";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent: string;
}

const StatCard = ({ icon, label, value, accent }: StatCardProps) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accent}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
    </div>
  </div>
);

const ReportStatCards = ({ stats }: { stats: ReportStats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <StatCard
        icon={<FileText className="w-6 h-6 text-indigo-600" />}
        label="Total Reports"
        value={stats.totalGenerated}
        accent="bg-indigo-50"
      />
      <StatCard
        icon={<BarChart3 className="w-6 h-6 text-emerald-600" />}
        label="Monthly Average"
        value={stats.monthlyAvg}
        accent="bg-emerald-50"
      />
      <StatCard
        icon={<Clock className="w-6 h-6 text-amber-600" />}
        label="Pending Reports"
        value={stats.pendingDelivery}
        accent="bg-amber-50"
      />
    </div>
  );
};

export default ReportStatCards;
