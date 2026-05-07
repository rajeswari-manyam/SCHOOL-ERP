import type { AttendanceDay } from "../types/attendance.types";

interface Props {
  days: AttendanceDay[];
  monthLabel?: string;
}

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    weekday: "short",
  });
};

export const AbsentList: React.FC<Props> = ({
  days,
  monthLabel = "April 2025",
}) => {
  const absentDays = days.filter((d) => d.status === "absent");

  return (
    <div className="
      bg-white
      rounded-xl sm:rounded-2xl
      p-3 sm:p-5
      shadow-sm
      border border-gray-100
      flex flex-col
      transition-all duration-200
      hover:border-[#4F46E5]
      hover:shadow-md
    ">

      {/* HEADER */}
      <p className="text-sm font-semibold text-gray-900 mb-3">
        Absent Days — {monthLabel}
      </p>

      {/* LIST */}
      <div className="flex flex-col gap-2 flex-1">
        {absentDays.length === 0 ? (
          <p className="text-sm text-gray-400">
            No absences this month 🎉
          </p>
        ) : (
          absentDays.map((d) => (
            <div
              key={d.date}
              className="
                px-3 py-2 sm:px-3.5 sm:py-3
                rounded-lg sm:rounded-xl
                bg-red-50
                border-l-[3px] border-red-500
                transition-all duration-200
                hover:border-[#4F46E5]
                hover:shadow-sm
                hover:-translate-y-0.5
                cursor-pointer
              "
            >
              {/* DATE */}
              <p className="text-[12.5px] sm:text-[13px] font-semibold text-gray-800">
                {formatDate(d.date)}
              </p>

              {/* WHATSAPP INFO */}
              {d.whatsappTime && (
                <div className="flex items-start sm:items-center gap-1.5 mt-1 flex-wrap">
                  <span className="bg-[#25D366] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    WA
                  </span>

                  <span className="text-[11px] sm:text-[11.5px] text-gray-400 leading-snug">
                    Alert sent {d.whatsappTime} via WhatsApp
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* MOTIVATION BANNER */}
      <div className="
        mt-4
        bg-gradient-to-br from-indigo-50 to-violet-100
        rounded-xl
        px-3 sm:px-4
        py-3 sm:py-4
        flex items-center justify-between
        border border-indigo-100
      ">
        <p className="text-[12.5px] sm:text-[13.5px] font-semibold text-indigo-700 leading-snug">
          Consistency is key to<br className="sm:hidden" />
          academic success!
        </p>

        <span className="text-2xl sm:text-3xl opacity-70">🎓</span>
      </div>
    </div>
  );
};