import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import typography from "@/styles/typography"
import { useDashboardStore } from "../store/uistore"

function SkeletonDot() {
  return (
    <div className="flex flex-col items-center gap-1 min-w-[40px]">
      <div className="w-8 h-3 rounded bg-gray-200 animate-pulse" />
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-200 animate-pulse" />
    </div>
  )
}

export const AttendanceWidget = () => {
  const { weekDays, weeklyPct, monthlyPct, isLoadingAttendance } =
    useDashboardStore()

  // Display weekly % if available, fallback to monthly
  const displayPct = weeklyPct > 0 ? weeklyPct : monthlyPct

  return (
    <Card className="rounded-xl w-full border border-[#E8EBF2] shadow-none transition-colors duration-200 ease-in-out hover:border-[#3525CD]">
      <CardHeader className="px-4 sm:px-5 pt-4 pb-2 border-none !border-0">
        <div className="flex items-start justify-between">
          <CardTitle className={`${typography.form.label} text-[#0B1C30]`}>
            Recent Attendance
          </CardTitle>
          <div className="flex flex-col items-end leading-tight">
            {isLoadingAttendance ? (
              <div className="w-12 h-5 rounded bg-gray-200 animate-pulse" />
            ) : (
              <span className={`${typography.heading.h6} text-[#3525CD]`}>
                {displayPct}%
              </span>
            )}
            <span className="text-[11px] text-gray-400">
              {weeklyPct > 0 ? "Weekly" : "Monthly"} average
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-5 pb-4 border-none !border-0">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {isLoadingAttendance
            ? Array.from({ length: 7 }).map((_, i) => <SkeletonDot key={i} />)
            : weekDays.length > 0
            ? weekDays.map((d, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1 min-w-[40px]"
                >
                  <span className={`${typography.body.xs} text-gray-400`}>
                    {d.label}
                  </span>
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-medium
                      ${d.present
                        ? "bg-[#006C49] text-white"
                        : "bg-[#F0F0F0] border border-gray-200 text-gray-400"
                      }`}
                  >
                    {d.present ? "✓" : "✕"}
                  </div>
                </div>
              ))
            : (
              <p className="text-[12px] text-gray-400 py-2">
                No attendance data this week
              </p>
            )}
        </div>

        <div className="mt-3 h-[4px] bg-[#E8EBF2] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#3525CD] rounded-full transition-all duration-500"
            style={{ width: `${displayPct}%` }}
          />
        </div>
      </CardContent>
    </Card>
  )
}