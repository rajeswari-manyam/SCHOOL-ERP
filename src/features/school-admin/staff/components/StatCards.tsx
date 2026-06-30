import { CalendarClock } from "lucide-react";

interface StaffStats {
  total: number;
  teachers: number;
  nonTeaching: number;
  leavePending: number;
}

interface LeaveBalanceStats {
  totalAllocated: number;
  totalUsed: number;
  totalBalance: number;
}

interface Props {
  stats: StaffStats;
  leaveBalance?: LeaveBalanceStats | null;
  selectedStaffName?: string;
  loading?: boolean;
}

export const StatsCards = ({ stats, leaveBalance, selectedStaffName, loading }: Props) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
    {leaveBalance !== undefined && loading ? (
      // Loading skeleton when staff selected but balance not yet loaded
      <>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
            <div className="h-3 bg-gray-100 rounded w-24 mb-3" />
            <div className="h-7 bg-gray-100 rounded w-12" />
          </div>
        ))}
      </>
    ) : leaveBalance ? (
      <>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2 border-l-4 border-l-blue-500">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {selectedStaffName ?? "Staff"} — Allocated
          </p>
          <p className="text-2xl font-bold text-gray-900 leading-none tabular-nums">{leaveBalance.totalAllocated}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2 border-l-4 border-l-indigo-500">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {selectedStaffName ?? "Staff"} — Used
          </p>
          <p className="text-2xl font-bold text-gray-900 leading-none tabular-nums">{leaveBalance.totalUsed}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2 border-l-4 border-l-emerald-500">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {selectedStaffName ?? "Staff"} — Balance
          </p>
          <p className="text-2xl font-bold text-emerald-600 leading-none tabular-nums">{leaveBalance.totalBalance}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2 border-l-4 border-l-amber-400">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Leave Pending</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-amber-500 leading-none tabular-nums">{stats.leavePending}</p>
            <CalendarClock className="w-5 h-5 text-amber-400 mb-0.5" />
          </div>
        </div>
      </>
    ) : (
      <>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2 border-l-4 border-l-blue-500">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Staff</p>
          <p className="text-2xl font-bold text-gray-900 leading-none tabular-nums">{stats.total}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2 border-l-4 border-l-indigo-500">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Teachers</p>
          <p className="text-2xl font-bold text-gray-900 leading-none tabular-nums">{stats.teachers}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2 border-l-4 border-l-slate-400">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Non-Teaching</p>
          <p className="text-2xl font-bold text-gray-900 leading-none tabular-nums">{stats.nonTeaching}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2 border-l-4 border-l-amber-400">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Leave Pending</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-amber-500 leading-none tabular-nums">{stats.leavePending}</p>
            <CalendarClock className="w-5 h-5 text-amber-400 mb-0.5" />
          </div>
        </div>
      </>
    )}
  </div>
);
