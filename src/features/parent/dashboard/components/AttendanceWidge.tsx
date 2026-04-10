import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import typography from "@/styles/typography";

export const AttendanceWidget = () => {
  const days = [
    { label: "Mon", present: true },
    { label: "Tue", present: true },
    { label: "Wed", present: true },
    { label: "Thu", present: true },
    { label: "Fri", present: true },
    { label: "Sat", present: false },
    { label: "Sun", present: true },
  ];

  const percentage = 81.7;

  return (
    <Card
      className="
        rounded-xl border border-[#E8EBF2] shadow-none w-full
        transition-transform duration-200 ease-in-out
        hover:shadow-lg hover:scale-[1.02]
      "
    >
      {/* Header */}
      <CardHeader className="pb-2 px-4 sm:px-5 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className={`${typography.form.label} text-[#0B1C30]`}>
            Recent Attendance
          </CardTitle>

          <div className="flex items-center gap-2">
            <span className={`${typography.heading.h6} text-[#0B1C30]`}>
              {percentage}%
            </span>
            <span className={`${typography.body.xs} text-gray-400`}>
              Monthly avg
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-5 pb-4">
        {/* Days Scroll (mobile safe) */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {days.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1 min-w-[40px]">
              <span className={`${typography.body.xs} text-gray-400`}>
                {d.label}
              </span>

              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-medium
                ${d.present
                    ? "bg-[#1DB954] text-white"
                    : "bg-[#F0F0F0] border border-gray-200 text-gray-400"
                  }`}
              >
                {d.present ? "✓" : "✕"}
              </div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="mt-3 h-[4px] bg-[#E8EBF2] rounded-full">
          <div
            className="h-full bg-[#1DB954] rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};