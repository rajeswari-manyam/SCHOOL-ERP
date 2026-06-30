import { Users, FileText, CheckSquare, Calendar } from "lucide-react";

interface StatCard {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  iconBg?: string;
  icon: React.ReactNode;
}

const Card = ({ label, value, sub, accent = "text-gray-900", iconBg = "bg-indigo-50", icon }: StatCard) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 flex items-center gap-3 hover:shadow-md transition-shadow duration-200">
    <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-gray-500 truncate">{label}</p>
      <p className={`text-base font-semibold leading-tight truncate ${accent}`}>{value}</p>
      {sub && <p className="text-[10px] text-gray-400 truncate">{sub}</p>}
    </div>
  </div>
);

interface Props {
  currentStrength: number;
  totalStrength: number;
  className?: string;
  sectionName?: string;
  homeworkPending: number;
  attendanceThisMonth: number;
  leaveUsed: number;
  leaveAllocated: number;
}

const TeacherStatCards = ({ currentStrength, totalStrength, className, sectionName, homeworkPending, attendanceThisMonth, leaveUsed, leaveAllocated }: Props) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    <Card
      label="Class Strength"
      value={`${currentStrength}/${totalStrength}`}
      sub={className ? `${className}${sectionName ? ` · ${sectionName}` : ""}` : "Total enrolled"}
      icon={<Users size={14} className="text-indigo-600" />}
    />
    <Card
      label="Homework Pending"
      value={homeworkPending}
      sub="Awaiting review"
      accent={homeworkPending > 0 ? "text-amber-500" : "text-gray-900"}
      iconBg={homeworkPending > 0 ? "bg-amber-50" : "bg-indigo-50"}
      icon={<FileText size={14} className={homeworkPending > 0 ? "text-amber-500" : "text-indigo-600"} />}
    />
    <Card
      label="Attendance"
      value={`${attendanceThisMonth}%`}
      sub="Monthly average"
      accent="text-emerald-600"
      iconBg="bg-emerald-50"
      icon={<CheckSquare size={14} className="text-emerald-600" />}
    />
    <Card
      label="Leave Balance"
      value={`${leaveUsed}/${leaveAllocated}`}
      sub="Used / Total days"
      accent="text-indigo-600"
      iconBg="bg-indigo-50"
      icon={<Calendar size={14} className="text-indigo-600" />}
    />
  </div>
);

export default TeacherStatCards;
