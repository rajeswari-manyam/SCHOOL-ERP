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

const StrengthIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const HomeworkIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>;
const AttIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
const LeaveIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;

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
