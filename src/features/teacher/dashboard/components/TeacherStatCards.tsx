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
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
    <div className={`w-11 h-11 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm text-gray-500 truncate">{label}</p>
      <p className={`text-2xl font-semibold leading-tight truncate ${accent}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 truncate mt-0.5">{sub}</p>}
    </div>
  </div>
);

interface Props {
  classStrength: number;
  homeworkPending: number;
  attendanceThisMonth: number;
  leaveBalance: number;
}

const TeacherStatCards = ({ classStrength, homeworkPending, attendanceThisMonth, leaveBalance }: Props) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <Card
      label="Class Strength"
      value={classStrength}
      sub="Total enrolled"
      icon={<Users size={18} className="text-indigo-600" />}
    />
    <Card
      label="Homework Pending"
      value={homeworkPending}
      sub="Awaiting review"
      accent={homeworkPending > 0 ? "text-amber-500" : "text-gray-900"}
      iconBg={homeworkPending > 0 ? "bg-amber-50" : "bg-indigo-50"}
      icon={<FileText size={18} className={homeworkPending > 0 ? "text-amber-500" : "text-indigo-600"} />}
    />
    <Card
      label="Attendance"
      value={`${attendanceThisMonth}%`}
      sub="Monthly average"
      accent="text-emerald-600"
      iconBg="bg-emerald-50"
      icon={<CheckSquare size={18} className="text-emerald-600" />}
    />
    <Card
      label="Leave Balance"
      value={leaveBalance}
      sub="Days remaining"
      accent="text-indigo-600"
      iconBg="bg-indigo-50"
      icon={<Calendar size={18} className="text-indigo-600" />}
    />
  </div>
);

export default TeacherStatCards;
