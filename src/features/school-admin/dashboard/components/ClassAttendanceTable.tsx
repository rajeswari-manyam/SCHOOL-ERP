import type { ClassAttendanceRow } from "../types/sa-dashboard.types";
import { useSendWAReminders } from "../hooks/useSADashboard";

const StatusBadge = ({ status }: { status: "MARKED" | "NOT_MARKED" }) =>
  status === "MARKED" ? (
    <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
      MARKED <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
    </span>
  ) : (
    <span className="flex items-center gap-1 text-red-500 text-xs font-bold">
      NOT MARKED <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </span>
  );

const COL = "text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-4 py-2.5 text-left";

interface ClassAttendanceTableProps {
  rows?: ClassAttendanceRow[];
  isLoading: boolean;
}

const ClassAttendanceTable = ({ rows = [], isLoading }: ClassAttendanceTableProps) => {
  const { mutate, isPending } = useSendWAReminders();
  const unmarked = rows.filter((r) => r.status === "NOT_MARKED").map((r) => r.className);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <h2 className="text-base font-extrabold text-gray-900">Today's Attendance — Class-wise</h2>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
            {rows.filter((r) => r.status === "MARKED").length} Marked
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-500 border border-red-100">
            {rows.filter((r) => r.status === "NOT_MARKED").length} Pending
          </span>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="divide-y">{[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-4 animate-pulse">
            <div className="w-8 h-4 rounded bg-gray-100"/><div className="flex-1 h-3 rounded bg-gray-100"/>
            <div className="w-8 h-3 rounded bg-gray-100"/><div className="w-8 h-3 rounded bg-gray-100"/>
            <div className="w-20 h-5 rounded-full bg-gray-100"/>
          </div>
        ))}</div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-50">
              <th className={COL}>Class</th>
              <th className={COL}>Teacher</th>
              <th className={COL}>Present</th>
              <th className={COL}>Absent</th>
              <th className={COL}>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/40 transition-colors">
                <td className="px-4 py-4 text-sm font-extrabold text-indigo-600">{row.className}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{row.teacher}</td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {row.present != null ? row.present : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {row.absent != null ? row.absent : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-4 py-4"><StatusBadge status={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Footer reminder */}
      {unmarked.length > 0 && (
        <div className="bg-amber-50 border-t border-amber-100 px-5 py-3 flex items-center justify-center">
          <button
            onClick={() => mutate(unmarked)}
            disabled={isPending}
            className="flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-800 transition-colors disabled:opacity-60"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {isPending ? "Sending…" : `Send Reminder to Unmarked Classes (${unmarked.join(", ")})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ClassAttendanceTable;
