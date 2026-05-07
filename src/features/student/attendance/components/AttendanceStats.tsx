import type { AttendanceSummary } from "../types/attendance.types";

interface Props {
  title: string;
  data: AttendanceSummary;
  variant?: "default" | "absent";
}

export const AttendanceStats: React.FC<Props> = ({
  title,
  data,
  variant = "default",
}) => {
  const isAbsent = variant === "absent";

  return (
    <div
      className="
        relative
        bg-white
        rounded-xl sm:rounded-2xl
        px-4 sm:px-6
        py-4 sm:py-5
        shadow-sm
        border border-gray-100
        overflow-hidden
        transition-all duration-200
        hover:border-indigo-500
        hover:shadow-md
        hover:-translate-y-0.5
        cursor-pointer
      "
    >
      {/* ACCENT BAR */}
      <div
        className={`
          absolute left-0 top-0 w-1 h-full rounded-l-2xl
          ${isAbsent ? "bg-red-500" : "bg-indigo-700"}
        `}
      />

      {/* TITLE */}
      <p className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2 sm:mb-3">
        {title}
      </p>

      {/* VALUE ROW */}
      <div className="flex items-start sm:items-baseline gap-2 flex-wrap">

        <span
          className={`
            text-xl sm:text-2xl
            font-bold tracking-tight
            leading-snug
            ${isAbsent ? "text-red-500" : "text-gray-900"}
          `}
        >
          {isAbsent
            ? `${data.absentDays} days`
            : `${data.presentDays} / ${data.totalDays} days`}
        </span>

        {/* PERCENTAGE BADGE */}
        {!isAbsent && (
          <span
            className="
              text-[10px] sm:text-xs
              font-semibold
              text-green-600
              bg-green-50
              px-2 py-0.5
              rounded-full
              whitespace-nowrap
            "
          >
            {data.percentage}%
          </span>
        )}
      </div>
    </div>
  );
};