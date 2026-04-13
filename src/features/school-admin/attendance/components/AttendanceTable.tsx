import type { ClassAttendanceRow } from "../types/attendance.types";
import { TeacherAvatar } from "./TeacherAvatar";
import { StatusBadge, MethodBadge } from "./StatusBadge";

interface Props {
  rows: ClassAttendanceRow[];
  onSendReminder: () => void;
}

const Dash = () => <span className="text-gray-300">—</span>;

export function AttendanceTable({ rows, onSendReminder }: Props) {
  const unmarkedCount = rows.filter((r) => r.status === "NOT_MARKED").length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Table header */}
      <div className="px-6 pt-5 pb-4 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-900">
          Class-wise Attendance — Today
        </h2>
        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
          7 April 2025
          <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
          <span className="text-blue-500">↻ Auto-refreshing every 60s</span>
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Class / Sec", "Class Teacher", "Total", "Present", "Absent", "Status", "Method", "Alerts"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((row) => {
              const isUnmarked = row.status === "NOT_MARKED";
              return (
                <tr
                  key={row.id}
                  className={`transition-colors ${isUnmarked ? "bg-orange-50/40" : "hover:bg-gray-50/60"}`}
                >
                  <td className="px-4 py-4 font-bold text-gray-900 text-base">
                    {row.cls}
                  </td>
                  <td className="px-4 py-4">
                    <TeacherAvatar
                      initials={row.teacherInitials}
                      name={row.teacherName}
                    />
                  </td>
                  <td className="px-4 py-4 text-gray-600">{row.total}</td>
                  <td className="px-4 py-4 font-semibold text-emerald-600">
                    {row.present ?? <Dash />}
                  </td>
                  <td className="px-4 py-4 font-semibold text-red-500">
                    {row.absent ?? <Dash />}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-4">
                    <MethodBadge method={row.method} />
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    {row.alertsSent ?? <Dash />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Send reminder CTA */}
      {unmarkedCount > 0 && (
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onSendReminder}
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-semibold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            📣 Send Reminder to All Unmarked Classes
          </button>
        </div>
      )}
    </div>
  );
}