import type { TemplateStats } from "../types/templates.types";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  badge?: { text: string; variant: "success" | "info" | "active" };
}

const badgeStyles = {
  success: "text-emerald-600 bg-emerald-50",
  info:    "text-blue-600 bg-blue-50",
  active:  "text-indigo-600 bg-indigo-50",
};

const StatCard = ({ icon, label, value, badge }: StatCardProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <span className="text-2xl">{icon}</span>
      {badge && (
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${badgeStyles[badge.variant]}`}>
          {badge.text}
        </span>
      )}
    </div>
    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className="text-3xl font-extrabold text-gray-900">{value}</p>
    </div>
  </div>
);

const TemplateStatCards = ({ stats }: { stats: TemplateStats }) => (
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
    <StatCard
      icon="✅"
      label="Approved"
      value={stats.approved}
      badge={{ text: `+${stats.approvedWeekDelta} this week`, variant: "success" }}
    />
    <StatCard icon="🕐" label="Pending Approval" value={stats.pendingApproval} />
    <StatCard icon="❌" label="Rejected" value={stats.rejected} />
    <StatCard
      icon="📋"
      label="Schools Using WA"
      value={stats.schoolsUsingWA}
      badge={{ text: "Active", variant: "active" }}
    />
  </div>
);

export default TemplateStatCards;
