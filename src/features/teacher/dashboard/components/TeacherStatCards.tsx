import { Users, FileText, CheckSquare, Calendar } from "lucide-react";

interface StatCard {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  icon: React.ReactNode;
}

const Card = ({
  label,
  value,
  sub,
  accent = "text-gray-900",
  icon,
}: StatCard) => (
  <div
    className="
      bg-white
      rounded-lg
      border
      border-gray-100
      shadow-sm
      p-2
      h-[75px]
      flex
      items-center
      gap-2
      overflow-hidden
      transition-all
      duration-200
      hover:shadow-md
    "
  >
    {/* Icon */}
    <div className="w-7 h-7 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
      {icon}
    </div>

    {/* Content */}
    <div className="min-w-0 flex-1">
      <p className="text-[7px] font-bold uppercase tracking-wide text-gray-400 truncate">
        {label}
      </p>

      <p className={`text-[14px] font-bold leading-none mt-0.5 truncate ${accent}`}>
        {value}
      </p>

      {sub && (
        <p className="text-[8px] text-gray-400 truncate mt-0.5">
          {sub}
        </p>
      )}
    </div>
  </div>
);

const StrengthIcon = () => (
  <Users size={14} className="text-current" />
);

const HomeworkIcon = () => (
  <FileText size={14} className="text-current" />
);

const AttIcon = () => (
  <CheckSquare size={14} className="text-current" />
);

const LeaveIcon = () => (
  <Calendar size={14} className="text-current" />
);

interface Props {
  classStrength: number;
  homeworkPending: number;
  attendanceThisMonth: number;
  leaveBalance: number;
}

const TeacherStatCards = ({
  classStrength,
  homeworkPending,
  attendanceThisMonth,
  leaveBalance,
}: Props) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
    <Card
      label="Class Strength"
      value={classStrength}
      sub="Total enrolled"
      icon={<StrengthIcon />}
    />

    <Card
      label="Homework Pending"
      value={homeworkPending}
      sub="Awaiting review"
      accent={
        homeworkPending > 0
          ? "text-amber-500"
          : "text-gray-900"
      }
      icon={<HomeworkIcon />}
    />

    <Card
      label="Attendance"
      value={`${attendanceThisMonth}%`}
      sub="Monthly avg"
      accent="text-emerald-600"
      icon={<AttIcon />}
    />

    <Card
      label="Leave Balance"
      value={leaveBalance}
      sub="Days remaining"
      accent="text-indigo-600"
      icon={<LeaveIcon />}
    />
  </div>
);

export default TeacherStatCards;