import { Calendar, Clock, User, Users } from "lucide-react";
import type { TimetableSummary } from "../types/timetable.types";

const CalIcon = () => (
  <Calendar size={16} className="text-current" strokeWidth={2} />
);
const ClockIcon = () => (
  <Clock size={16} className="text-current" strokeWidth={2} />
);
const FreeIcon = () => (
  <User size={16} className="text-current" strokeWidth={2} />
);
const ClassesIcon = () => (
  <Users size={16} className="text-current" strokeWidth={2} />
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
