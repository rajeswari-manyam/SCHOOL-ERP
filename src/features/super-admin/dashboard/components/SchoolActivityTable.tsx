import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
import type { SchoolActivityRow } from "../types/dashboard.types";

const PlanBadge = ({ plan }: { plan: string }) => (
  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide bg-indigo-100 text-indigo-700">{plan}</span>
);

const AttendanceDot = ({ marked }: { marked: boolean }) =>
  marked ? <CheckCircle size={16} className="text-emerald-500" /> : <Clock size={16} className="text-gray-400" />;

const FeeAlertDot = ({ alert }: { alert: boolean }) =>
  alert ? <AlertTriangle size={16} className="text-amber-500" /> : <span className="text-gray-300 text-xs">—</span>;

const timeAgo = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

const COL = "text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-3 py-2 text-left";

interface SchoolActivityTableProps {
  rows: SchoolActivityRow[];
  isLoading: boolean;
}

const SchoolActivityTable = ({ rows, isLoading }: SchoolActivityTableProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="px-4 py-3 border-b border-gray-50">
      <h2 className="text-[13px] font-extrabold text-gray-900">Schools Activity Today</h2>
    </div>

    {isLoading ? (
      <div className="divide-y">{[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-3 px-4 py-3 animate-pulse">
          <div className="flex-1 h-3 rounded bg-gray-100"/><div className="w-14 h-5 rounded bg-gray-100"/>
          <div className="w-6 h-6 rounded-full bg-gray-100"/><div className="w-10 h-3 rounded bg-gray-100"/>
          <div className="w-16 h-3 rounded bg-gray-100"/>
        </div>
      ))}</div>
    ) : rows.length === 0 ? (
      <div className="py-10 text-center text-sm text-gray-400">No school activity recorded today.</div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-full table-auto">
        <thead>
          <tr className="bg-[#EFF4FF] border-b border-gray-50">
            <th className={COL}>School Name</th>
            <th className={COL}>Plan</th>
            <th className={COL}>Attendance</th>
            <th className={COL}>Fee Alerts</th>
            <th className={COL}>Last Active</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50/40 transition-colors">
              <td className="px-3 py-2.5 text-xs font-semibold text-gray-900">{row.name}</td>
              <td className="px-3 py-2.5"><PlanBadge plan={row.plan} /></td>
              <td className="px-3 py-2.5"><AttendanceDot marked={row.attendanceMarked} /></td>
              <td className="px-3 py-2.5"><FeeAlertDot alert={row.feeAlerts} /></td>
              <td className="px-3 py-2.5 text-xs text-gray-400 whitespace-nowrap">{timeAgo(row.lastActive)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    )}
  </div>
);

export default SchoolActivityTable;
