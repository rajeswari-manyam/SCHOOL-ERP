import type { ScheduleItem } from "../types/dashboard.types";

interface Props {
  data: ScheduleItem[];
}

const BRAND = "#3525CD";

export const ScheduleTable = ({ data }: Props) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-200 md:hover:border-[#3525CD] md:hover:shadow-md">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-4 sm:px-5 py-3 sm:py-4">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900">
          Today's Schedule
        </h3>
        <span className="text-xs sm:text-sm font-medium text-indigo-700">
          April 24, Wednesday
        </span>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="block md:hidden">
        <div className="flex flex-col">
          {data.map((item, idx) => {
            if (item.isBreak) {
              return (
                <div
                  key={idx}
                  className="bg-[#EEF0FF] px-4 py-2 text-xs text-indigo-400 italic font-medium"
                >
                  {item.breakLabel}
                </div>
              );
            }

            const isActive = item.period === "P1";

            return (
              <div
                key={idx}
                className={`
                  px-4 py-3 border-b border-gray-100
                  ${isActive ? "bg-[#3525CD] text-white" : "bg-white"}
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    {item.period}
                  </span>
                  <span
                    className={`text-xs ${
                      isActive ? "text-indigo-200" : "text-gray-500"
                    }`}
                  >
                    {item.time}
                  </span>
                </div>

                <div className="mt-1 font-semibold text-sm">
                  {item.subject}
                </div>

                <div
                  className={`text-xs mt-0.5 ${
                    isActive ? "text-indigo-200" : "text-gray-500"
                  }`}
                >
                  {item.teacher}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= DESKTOP TABLE VIEW ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ backgroundColor: BRAND }}>
              <th className="text-left text-xs font-semibold uppercase tracking-wider text-white px-5 py-3 w-20">
                Period
              </th>
              <th className="text-left text-xs font-semibold uppercase tracking-wider text-white px-4 py-3 w-36">
                Time
              </th>
              <th className="text-left text-xs font-semibold uppercase tracking-wider text-white px-4 py-3">
                Subject
              </th>
              <th className="text-left text-xs font-semibold uppercase tracking-wider text-white px-4 py-3">
                Teacher
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, idx) => {
              if (item.isBreak) {
                return (
                  <tr
                    key={idx}
                    className="bg-[#EEF0FF]"
                  >
                    <td
                      colSpan={4}
                      className="px-5 py-2.5 text-xs text-indigo-400 italic font-medium"
                    >
                      {item.breakLabel}
                    </td>
                  </tr>
                );
              }

              const isActive = item.period === "P1";

              return (
                <tr
                  key={idx}
                  style={isActive ? { backgroundColor: BRAND } : undefined}
                  className={`border-b border-gray-100 last:border-0 transition-all duration-150 ${
                    !isActive
                      ? "hover:bg-gray-50"
                      : ""
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-sm font-semibold ${
                        isActive ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {item.period}
                    </span>
                  </td>

                  <td
                    className={`px-4 py-3.5 text-xs whitespace-nowrap tabular-nums ${
                      isActive ? "text-indigo-200" : "text-gray-500"
                    }`}
                  >
                    {item.time}
                  </td>

                  <td
                    className={`px-4 py-3.5 font-semibold ${
                      isActive ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {item.subject}
                  </td>

                  <td
                    className={`px-4 py-3.5 ${
                      isActive ? "text-indigo-200" : "text-gray-500"
                    }`}
                  >
                    {item.teacher}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};