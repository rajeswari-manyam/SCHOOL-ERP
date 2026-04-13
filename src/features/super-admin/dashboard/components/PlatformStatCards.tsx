import type { PlatformStats } from "../types/dashboard.types";

const fmt = (n: number) => `₹${(n / 100000).toFixed(2)}L`.replace(".00L", "L");

interface CardProps {
  icon: React.ReactNode;
  badge?: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const Card = ({ icon, badge, label, value }: CardProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
    <div className="flex items-start justify-between">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
        {icon}
      </div>
      {badge}
    </div>
    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</p>
    </div>
  </div>
);

const SchoolIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
);
const ActiveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
);
const MrrIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
);
const UsageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const Chip = ({ text, color }: { text: string; color: string }) => (
  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color}`}>{text}</span>
);

const PlatformStatCards = ({ stats }: { stats: PlatformStats }) => (
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
    <Card
      icon={<SchoolIcon />}
      badge={<Chip text={`+${stats.totalSchoolsDelta} THIS MONTH`} color="text-emerald-600 bg-emerald-50" />}
      label="Total Schools"
      value={stats.totalSchools}
    />
    <Card
      icon={<ActiveIcon />}
      badge={<Chip text={`${stats.onTrial} ON TRIAL`} color="text-amber-600 bg-amber-50" />}
      label="Active Schools"
      value={stats.activeSchools}
    />
    <Card
      icon={<MrrIcon />}
      badge={<Chip text={`+${stats.mrrVsLastMonthPct}% VS LAST MONTH`} color="text-emerald-600 bg-emerald-50" />}
      label="MRR"
      value={`₹${stats.mrr.toLocaleString("en-IN")}`}
    />
    <Card
      icon={<UsageIcon />}
      badge={<Chip text={`${stats.usageTodayCount} OF ${stats.usageTodayTotal} SCHOOLS`} color="text-indigo-600 bg-indigo-50" />}
      label="Usage Today"
      value={`${stats.usageTodayPct}%`}
    />
  </div>
);

export default PlatformStatCards;
