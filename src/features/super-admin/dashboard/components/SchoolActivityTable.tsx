import type { SchoolActivityRow, SchoolPlan, AttendanceStatus } from "../types/dashboard.types";

const planStyles: Record<SchoolPlan, string> = {
  PRO:     "bg-gray-900 text-white",
  GROWTH:  "bg-indigo-100 text-indigo-700",
  STARTER: "bg-gray-100 text-gray-600",
};

const PlanBadge = ({ plan }: { plan: SchoolPlan }) => (
  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${planStyles[plan]}`}>{plan}</span>
);

const AttendanceDot = ({ status }: { status: AttendanceStatus }) => {
  if (status === "OK") return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/><circle cx="12" cy="12" r="10"/>
    </svg>
  );
  if (status === "PENDING") return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
  return <span className="text-gray-300 text-xs">—</span>;
};

const COL = "text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-3 py-2.5 text-left";

interface SchoolActivityTableProps {
  rows: SchoolActivityRow[];
  isLoading: boolean;
  onViewAll: () => void;
}

const SchoolActivityTable = ({ rows, isLoading, onViewAll }: SchoolActivityTableProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-4 py-4 border-b border-gray-50">
      <h2 className="text-sm font-extrabold text-gray-900">Schools Activity Today</h2>
      <button onClick={onViewAll} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
        View Detailed Stats
      </button>
    </div>

    {isLoading ? (
      <div className="divide-y">{[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-3 px-4 py-3 animate-pulse">
          <div className="flex-1 h-3 rounded bg-gray-100"/><div className="w-14 h-5 rounded bg-gray-100"/>
          <div className="w-6 h-6 rounded-full bg-gray-100"/><div className="w-10 h-3 rounded bg-gray-100"/>
          <div className="w-16 h-3 rounded bg-gray-100"/>
        </div>
      ))}</div>
    ) : (
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50/60 border-b border-gray-50">
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
              <td className="px-3 py-3 text-sm font-semibold text-gray-900">{row.name}</td>
              <td className="px-3 py-3"><PlanBadge plan={row.plan} /></td>
              <td className="px-3 py-3"><AttendanceDot status={row.attendanceStatus} /></td>
              <td className="px-3 py-3 text-sm text-gray-600">
                {row.feeAlerts != null ? row.feeAlerts.toLocaleString() : <span className="text-gray-300">—</span>}
              </td>
              <td className="px-3 py-3 text-sm text-gray-400 whitespace-nowrap">{row.lastActive}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default SchoolActivityTable;
