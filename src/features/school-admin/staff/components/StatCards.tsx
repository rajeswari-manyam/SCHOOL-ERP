import { CalendarClock } from "lucide-react";

interface Props {
  stats: {
    total: number;
    teachers: number;
    nonTeaching: number;
    leavePending: number;
  };
}

export const StatsCards = ({ stats }: Props) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2 border-l-4 border-l-blue-500">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Staff</p>
      <p className="text-4xl font-extrabold text-gray-900 leading-none tabular-nums">{stats.total}</p>
    </div>

    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2 border-l-4 border-l-indigo-500">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Teachers</p>
      <p className="text-4xl font-extrabold text-gray-900 leading-none tabular-nums">{stats.teachers}</p>
    </div>

    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2 border-l-4 border-l-slate-400">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Non-Teaching</p>
      <p className="text-4xl font-extrabold text-gray-900 leading-none tabular-nums">{stats.nonTeaching}</p>
    </div>

    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2 border-l-4 border-l-amber-400">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Leave Pending</p>
      <div className="flex items-center gap-2">
        <p className="text-4xl font-extrabold text-amber-500 leading-none tabular-nums">{stats.leavePending}</p>
        <CalendarClock className="w-5 h-5 text-amber-400 mb-0.5" />
      </div>
    </div>

  </div>
);
