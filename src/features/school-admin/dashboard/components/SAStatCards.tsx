import { useNavigate } from "react-router-dom";
import type { DashboardStat } from "../types/sa-dashboard.types";

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 relative overflow-hidden ${className}`}>
    {children}
  </div>
);

const BgIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute bottom-3 right-3 opacity-[0.06] text-gray-900">{children}</div>
);

const UserIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const CheckIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
const CashIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const AdmIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>;

const SAStatCards = ({ stats }: { stats?: DashboardStat }) => {
  const navigate = useNavigate();
  
  if (!stats) return null;
  
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">

      {/* Students present */}
      <Card>
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Students Present Today</p>
        <div className="flex items-end gap-2">
          <p className="text-3xl font-extrabold text-gray-900">{stats.studentsPresent}/{stats.studentsTotal}</p>
          <span className="mb-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
            {stats.attendanceRate}% RATE
          </span>
        </div>
        <p className="text-xs text-gray-400">{stats.absentCount} absent across {stats.absentClasses} classes</p>
        <button onClick={() => navigate("/school-admin/attendance")} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 text-left transition-colors">View Details →</button>
        <BgIcon><UserIcon /></BgIcon>
      </Card>

      {/* Classes marked */}
      <Card>
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Classes Marked Today</p>
        <div className="flex items-end gap-2">
          <p className="text-3xl font-extrabold text-gray-900">{stats.classesMarked}/{stats.classesTotal}</p>
          {stats.classesMarked < stats.classesTotal && (
            <span className="mb-0.5 text-[10px] font-bold text-amber-500 flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />Action needed
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400">{stats.classesTotal - stats.classesMarked} classes pending</p>
        <button className="text-xs font-bold text-amber-500 hover:text-amber-700 text-left transition-colors">Send Reminders →</button>
        <BgIcon><CheckIcon /></BgIcon>
      </Card>

      {/* Fee collected */}
      <Card>
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Collected This Month</p>
        <div className="flex items-end gap-2">
          <p className="text-3xl font-extrabold text-gray-900">{fmt(stats.collectedThisMonth)}</p>
          <span className="mb-0.5 text-xs font-bold text-gray-400">{stats.collectionPct}% PAID</span>
        </div>
        <p className="text-xs text-gray-400">{fmt(stats.pendingAmount)} still pending</p>
        <button onClick={() => navigate("/school-admin/fees")} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 text-left transition-colors">View Defaulters →</button>
        <BgIcon><CashIcon /></BgIcon>
      </Card>

      {/* Admissions */}
      <Card>
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Admissions This Week</p>
        <div className="flex items-end gap-2">
          <p className="text-3xl font-extrabold text-gray-900">{stats.admissionsThisWeek}</p>
          <span className="mb-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
            +{stats.admissionsVsLastWeek} vs LW
          </span>
        </div>
        <p className="text-xs text-gray-400">{stats.admissionsPendingFollowup} pending follow-up</p>
        <button onClick={() => navigate("/school-admin/admissions")} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 text-left transition-colors">View Pipeline →</button>
        <BgIcon><AdmIcon /></BgIcon>
      </Card>
    </div>
  );
};

export default SAStatCards;
