import type { MarketingStats } from "../types/marketing.types";

interface CardProps { label: string; value: React.ReactNode; sub: React.ReactNode; accent?: string }

const Card = ({ label, value, sub, accent = "text-gray-900" }: CardProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
    <p className={`text-4xl font-extrabold tracking-tight ${accent}`}>{value}</p>
    <div className="text-sm text-gray-500">{sub}</div>
  </div>
);

const MarketingStatCards = ({ stats }: { stats: MarketingStats }) => (
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
    <Card label="Total Reps"        value={stats.totalReps}         accent="text-gray-900"   sub="Active personnel" />
    <Card label="Present Today"     value={<span className="text-emerald-600">{stats.presentToday}</span>}
      sub={<span className="text-emerald-500 font-medium">{stats.presentPct}% Attendance</span>} />
    <Card label="Demos This Month"  value={stats.demosThisMonth}    accent="text-gray-900"
      sub={<span className="text-gray-400">Target: {stats.demosTarget}</span>} />
    <Card label="Schools Closed"    value={<span className="text-indigo-600">{stats.schoolsClosed}</span>}
      sub={<span className="text-indigo-400 text-xs font-medium">+{stats.schoolsClosedDelta} since last week</span>} />
  </div>
);

export default MarketingStatCards;
