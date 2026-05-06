import type { ScheduleItem } from "../types/dashboard.types";

interface Props {
  data: ScheduleItem[];
}

const periodColors: Record<string, string> = {
  P1: "bg-blue-100 text-blue-700",
  P2: "bg-gray-100 text-gray-600",
  P3: "bg-gray-100 text-gray-600",
  P4: "bg-gray-100 text-gray-600",
  P5: "bg-gray-100 text-gray-600",
  P6: "bg-gray-100 text-gray-600",
};

export const ScheduleTable = ({ data }: Props) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">Today's Schedule</h3>
        <span className="text-xs text-gray-400">April 24, Wednesday</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left text-[11px] uppercase tracking-wide text-gray-400 font-medium pb-2 pr-4">Period</th>
              <th className="text-left text-[11px] uppercase tracking-wide text-gray-400 font-medium pb-2 pr-4">Time</th>
              <th className="text-left text-[11px] uppercase tracking-wide text-gray-400 font-medium pb-2 pr-4">Subject</th>
              <th className="text-left text-[11px] uppercase tracking-wide text-gray-400 font-medium pb-2">Teacher</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => {
              if (item.isBreak) {
                return (
                  <tr key={idx} className="bg-gray-50">
                    <td colSpan={4} className="py-1.5 px-2 text-[11px] text-gray-400 italic">
                      ☕ {item.breakLabel}
                    </td>
                  </tr>
                );
              }
              const isFirst = item.period === "P1";
              return (
                <tr
                  key={idx}
                  className={`border-b border-gray-50 last:border-0 ${isFirst ? "bg-blue-50" : ""}`}
                >
                  <td className="py-2.5 pr-4">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-6 rounded text-[11px] font-medium ${
                        periodColors[item.period] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.period}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-gray-500 text-xs whitespace-nowrap">{item.time}</td>
                  <td className="py-2.5 pr-4 text-gray-800 font-medium">{item.subject}</td>
                  <td className="py-2.5 text-gray-500">{item.teacher}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
