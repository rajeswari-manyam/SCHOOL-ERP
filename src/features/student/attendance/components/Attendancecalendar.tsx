import type { AttendanceDay, AttendanceStatus } from "../types/attendance.types";

interface Props {
  days: AttendanceDay[];
  month?: number;
  year?: number;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const dayClasses: Record<AttendanceStatus | "empty", string> = {
  present: "bg-indigo-700 text-white font-semibold",
  absent: "bg-red-500 text-white font-semibold",
  holiday: "bg-gray-200 text-gray-500",
  empty: "bg-transparent",
};

export const AttendanceCalendar: React.FC<Props> = ({
  days,
  month = 3,
  year = 2025,
}) => {
  const statusMap: Partial<Record<string, AttendanceStatus>> = {};

  days.forEach((d) => {
    statusMap[d.date] = d.status;
  });

  const firstDow = new Date(year, month, 1).getDay();
  const startOffset = firstDow === 0 ? 6 : firstDow - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  type Cell = { day: number | null; date: string | null };

  const cells: Cell[] = [];

  for (let i = 0; i < startOffset; i++) {
    cells.push({ day: null, date: null });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    cells.push({ day: d, date: `${year}-${mm}-${dd}` });
  }

  return (
    <div className="w-full">

      {/* LEGEND */}
      <div className="flex flex-wrap gap-3 mb-3">
        {[
          { label: "Present", cls: "bg-indigo-700" },
          { label: "Absent", cls: "bg-red-500" },
          { label: "Holiday", cls: "bg-gray-300" },
        ].map(({ label, cls }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${cls}`} />
            <span className="text-[11px] text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      {/* WEEKDAYS */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className="text-center text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase py-1"
          >
            {wd}
          </div>
        ))}
      </div>

      {/* DAYS GRID */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">

        {cells.map((cell, i) => {
          if (!cell.day || !cell.date) {
            return (
              <div
                key={`e-${i}`}
                className="aspect-square"
              />
            );
          }

          const status = statusMap[cell.date] ?? "empty";
          const isActive = status !== "empty";

          return (
            <div
              key={cell.date}
              title={status}
              className={`
                aspect-square
                flex items-center justify-center
                rounded-full
                text-[11px] sm:text-[12px]

                /* RESPONSIVE SIZE */
                w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10

                mx-auto

                transition-all duration-200

                ${dayClasses[status]}

                ${isActive ? "cursor-pointer" : ""}

                /* hover only on desktop */
                ${isActive ? "md:hover:scale-105 md:hover:shadow-md" : ""}
              `}
            >
              {cell.day}
            </div>
          );
        })}
      </div>
    </div>
  );
};