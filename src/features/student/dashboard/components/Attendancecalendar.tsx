import type { AttendanceDay } from "../types/dashboard.types";

interface Props {
  data: AttendanceDay[];
  today?: number;
  monthLabel?: string;
}

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const BRAND = "#3525CD";
const BRAND_ABSENT = "#C0392B";

export const AttendanceCalendar = ({
  data,
  today = 24,
  monthLabel = "My Attendance - April",
}: Props) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-5 shadow-sm sm:hover:border-[#3525CD] sm:hover:shadow-md transition-all duration-200">
      
      {/* Title */}
      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">
        {monthLabel}
      </h3>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_NAMES.map((d) => (
          <div
            key={d}
            className="text-center text-[9px] sm:text-[11px] font-semibold tracking-wide text-gray-400"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1 sm:gap-y-2">
        {data.map((entry, idx) => {
          const isToday = entry.day === today;

          if (entry.status === "empty") {
            return <div key={idx} className="aspect-square" />;
          }

          const baseCircle =
            "flex items-center justify-center aspect-square";

          const circleSize =
            "w-7 h-7 sm:w-9 sm:h-9 text-[11px] sm:text-[13px]";

          /* Present */
          if (entry.status === "present") {
            return (
              <div key={idx} className={baseCircle}>
                <div
                  className={`${circleSize} rounded-full flex items-center justify-center font-semibold text-white`}
                  style={{
                    backgroundColor: BRAND,
                    boxShadow: isToday
                      ? `0 0 0 2px white, 0 0 0 3px ${BRAND}`
                      : "none",
                  }}
                >
                  {entry.day}
                </div>
              </div>
            );
          }

          /* Absent */
          if (entry.status === "absent") {
            return (
              <div key={idx} className={baseCircle}>
                <div
                  className={`${circleSize} rounded-full flex items-center justify-center font-semibold text-white`}
                  style={{
                    backgroundColor: BRAND_ABSENT,
                    boxShadow: isToday
                      ? `0 0 0 2px white, 0 0 0 3px ${BRAND_ABSENT}`
                      : "none",
                  }}
                >
                  {entry.day}
                </div>
              </div>
            );
          }

          /* Holiday / future */
          return (
            <div key={idx} className={baseCircle}>
              <div
                className={`${circleSize} rounded-full flex items-center justify-center font-medium`}
                style={{
                  color: "#C5C8D8",
                  backgroundColor: "transparent",
                  border: isToday ? `2px solid ${BRAND}` : "none",
                }}
              >
                {entry.day}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 sm:gap-5 mt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: BRAND }} />
          <span className="text-[11px] sm:text-xs text-gray-500 font-medium">Present</span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: BRAND_ABSENT }} />
          <span className="text-[11px] sm:text-xs text-gray-500 font-medium">Absent</span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-gray-300 bg-[#EEF0FF]" />
          <span className="text-[11px] sm:text-xs text-gray-500 font-medium">Holiday</span>
        </div>
      </div>
    </div>
  );
};