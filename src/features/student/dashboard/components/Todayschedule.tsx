import type { ScheduleSlot } from "../types/Student dashboard.types";
import { getTodayDateLabel } from "../utils/Student dashboard.utils";

interface TodayScheduleProps {
  slots: ScheduleSlot[];
}

const TodaySchedule = ({ slots }: TodayScheduleProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-bold text-gray-900">Today's Schedule</h2>
      <span className="text-sm font-semibold text-indigo-500">{getTodayDateLabel()}</span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs font-semibold uppercase tracking-wide text-gray-400 border-b border-gray-100">
            <th className="pb-3 text-left pr-4 w-16">Period</th>
            <th className="pb-3 text-left pr-4">Time</th>
            <th className="pb-3 text-left pr-4">Subject</th>
            <th className="pb-3 text-left">Teacher</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((slot, idx) => {
            if (slot.kind === "break") {
              return (
                <tr key={`break-${idx}`}>
                  <td
                    colSpan={4}
                    className="py-2 px-4 text-xs text-gray-400 font-medium bg-gray-50 rounded-lg my-1 text-center"
                  >
                    {slot.label} ({slot.startTime} - {slot.endTime})
                  </td>
                </tr>
              );
            }

            return (
              <tr
                key={slot.id}
                className={`border-b border-gray-50 last:border-0 ${
                  slot.isActive
                    ? "bg-indigo-600 text-white rounded-xl"
                    : "hover:bg-gray-50 transition-colors"
                }`}
              >
                <td className={`py-3 pr-4 font-bold ${slot.isActive ? "text-white" : "text-gray-500"}`}>
                  <span className={`inline-block px-2 py-0.5 rounded ${slot.isActive ? "" : ""}`}>
                    {slot.label}
                  </span>
                </td>
                <td className={`py-3 pr-4 ${slot.isActive ? "text-indigo-100" : "text-gray-500"}`}>
                  {slot.startTime} - {slot.endTime}
                </td>
                <td className={`py-3 pr-4 font-semibold ${slot.isActive ? "text-white" : "text-gray-800"}`}>
                  {slot.subject}
                </td>
                <td className={`py-3 ${slot.isActive ? "text-indigo-100" : "text-gray-500"}`}>
                  {slot.teacher}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default TodaySchedule;