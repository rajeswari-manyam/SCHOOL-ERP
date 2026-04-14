import type { TimetableSummary } from "../types/timetable.types";

const CalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8"  y1="2" x2="8"  y2="6"/>
    <line x1="3"  y1="10" x2="21" y2="10"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);
const FreeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <line x1="19" y1="8" x2="19" y2="14"/>
    <line x1="22" y1="11" x2="16" y2="11"/>
  </svg>
);
const ClassesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

interface CardProps {
  label: string;
  value: string | number;
  sub?: string;
  accentClass: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}

const Card = ({ label, value, sub, accentClass, iconBg, iconColor, icon }: CardProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
      {icon}
    </div>
    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className={`text-3xl font-extrabold tracking-tight ${accentClass}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  </div>
);

interface Props {
  summary: TimetableSummary;
}

const TimetableSummaryCards = ({ summary }: Props) => (
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
    <Card
      label="Total Periods / Week"
      value={summary.totalPeriods}
      sub="across all classes"
      accentClass="text-indigo-600"
      iconBg="bg-indigo-50"
      iconColor="text-indigo-500"
      icon={<CalIcon />}
    />
    <Card
      label="Teaching Hours"
      value={`${summary.teachingHours}h`}
      sub="45 min per period"
      accentClass="text-violet-600"
      iconBg="bg-violet-50"
      iconColor="text-violet-500"
      icon={<ClockIcon />}
    />
    <Card
      label="Free Periods"
      value={summary.freePeriods}
      sub="per week"
      accentClass="text-amber-500"
      iconBg="bg-amber-50"
      iconColor="text-amber-500"
      icon={<FreeIcon />}
    />
    <Card
      label="Classes Taught"
      value={summary.classesTaught}
      sub="distinct classes"
      accentClass="text-emerald-600"
      iconBg="bg-emerald-50"
      iconColor="text-emerald-500"
      icon={<ClassesIcon />}
    />
  </div>
);

export default TimetableSummaryCards;
