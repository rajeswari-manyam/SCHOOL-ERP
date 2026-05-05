import type { AttendanceSummary } from "../types/dashboard.types";
import { joinClassNames } from "../utils/formatters.ts";
import { Button } from "@/components/ui/button";

interface Props {
  attendance: AttendanceSummary;
  onSendReminder: () => void;
}

export function AttendanceSummaryCard({ attendance, onSendReminder }: Props) {
  return (
    <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 text-base">Today's Attendance — Class-wise</h2>
        <div className="flex gap-2">
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">{attendance.classCount} Marked</span>
          <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">{attendance.totalClasses - attendance.classCount} Pending</span>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
            <th className="text-left pb-2 font-semibold">Class</th>
            <th className="text-left pb-2 font-semibold">Teacher</th>
            <th className="text-left pb-2 font-semibold">Present</th>
            <th className="text-left pb-2 font-semibold">Absent</th>
            <th className="text-left pb-2 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.rows.map((row) => (
            <tr key={row.cls} className="border-b border-gray-50 hover:bg-gray-50 transition">
              <td className="py-3 font-bold text-gray-900">{row.cls}</td>
              <td className="py-3 text-gray-600">{row.teacher}</td>
              <td className="py-3 text-gray-700">{row.present}</td>
              <td className="py-3 text-gray-700">{row.absent}</td>
              <td className="py-3">
                {row.marked ? (
                  <span className="text-green-600 font-semibold text-xs">MARKED ✓</span>
                ) : (
                  <span className="text-red-500 font-semibold text-xs">NOT MARKED ✗</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {attendance.totalClasses - attendance.classCount > 0 && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-center">
          <Button
            variant="link"
            onClick={onSendReminder}
            className="text-amber-700 text-sm font-medium p-0 h-auto"
          >
            🔔 Send Reminder to Unmarked Classes ({joinClassNames(attendance.pendingClasses)})
          </Button>
        </div>
      )}
    </div>
  );
}
