import { Users, FileText, CheckSquare, Calendar } from "lucide-react";

interface StatCard { label: string; value: string | number; sub?: string; accent?: string; icon: React.ReactNode; }

const Card = ({ label, value, sub, accent = "text-gray-900", icon }: StatCard) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">{icon}</div>
    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className={`text-3xl font-extrabold tracking-tight ${accent}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  </div>
);

const StrengthIcon = () => <Users size={18} className="text-current" />;
const HomeworkIcon = () => <FileText size={18} className="text-current" />;
const AttIcon = () => <CheckSquare size={18} className="text-current" />;
const LeaveIcon = () => <Calendar size={18} className="text-current" />;

interface Props { classStrength: number; homeworkPending: number; attendanceThisMonth: number; leaveBalance: number; }

const TeacherStatCards = ({ classStrength, homeworkPending, attendanceThisMonth, leaveBalance }: Props) => (
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
    <Card label="Class Strength"         value={classStrength}          sub="Total enrolled"    icon={<StrengthIcon />} />
    <Card label="Homework Pending"       value={homeworkPending}        sub="Awaiting review"   accent={homeworkPending > 0 ? "text-amber-500" : "text-gray-900"} icon={<HomeworkIcon />} />
    <Card label="Attendance This Month"  value={`${attendanceThisMonth}%`} sub="Monthly avg"   accent="text-emerald-600" icon={<AttIcon />} />
    <Card label="Leave Balance"          value={leaveBalance}           sub="Days remaining"    accent="text-indigo-600" icon={<LeaveIcon />} />
  </div>
);

export default TeacherStatCards;
