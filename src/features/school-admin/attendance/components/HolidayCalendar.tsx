import { useAttendanceStore } from "../store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// Full on md+, 3-letter on sm, 1-letter on mobile
const DAYS_FULL  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DAYS_SHORT = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const DAYS_MIN   = ["S","M","T","W","T","F","S"];

const holidayTypeColors: Record<
  string,
  { bg: string; text: string; dot: string; border: string; label: string }
> = {
  SCHOOL_DAY:       { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500",   border: "border-blue-200",  label: "School Day"       },
  NATIONAL_HOLIDAY: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-400", border: "border-yellow-200",label: "National Holiday" },
  PUBLIC_HOLIDAY:   { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500",    border: "border-red-200",   label: "Public Holiday"   },
  SCHOOL_EVENT:     { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500",  border: "border-green-200", label: "School Event"     },
};

const HolidayCalendar = () => {
  const {
    calendarData, calendarMonth, calendarYear,
    goToPrevMonth, goToNextMonth, openAddHoliday,
  } = useAttendanceStore();

  const firstDay    = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const today       = new Date();
  const isCurrentMonthYear =
    today.getMonth() === calendarMonth && today.getFullYear() === calendarYear;

  const getHolidayForDate = (day: number) => {
    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return calendarData.holidays.find((h) => h.date === dateStr);
  };

  const calendarCells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* ══════════════════════════════════════════
          CALENDAR CARD
      ══════════════════════════════════════════ */}
      <Card>

        {/* Header */}
        <CardHeader className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">

          {/* Month navigation */}
          <div className="flex items-center gap-2">
            <Button
              onClick={goToPrevMonth}
              variant="outline"
              size="sm"
              aria-label="Previous month"
              className="flex h-8 w-8 items-center justify-center p-0 text-base"
            >
              ‹
            </Button>
            <CardTitle className="min-w-[140px] text-center text-sm sm:text-base">
              {MONTHS[calendarMonth]} {calendarYear}
            </CardTitle>
            <Button
              onClick={goToNextMonth}
              variant="outline"
              size="sm"
              aria-label="Next month"
              className="flex h-8 w-8 items-center justify-center p-0 text-base"
            >
              ›
            </Button>
          </div>

          {/* Add holiday CTA — full width on mobile */}
          <Button
            onClick={openAddHoliday}
            size="sm"
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700 sm:w-auto sm:px-4"
          >
            + Add Holiday
          </Button>
        </CardHeader>

        <CardContent className="p-3 sm:p-5">

          {/* ── Grid wrapper — scrolls horizontally on very small screens ── */}
          <div className="overflow-x-auto">
            <div className="min-w-[280px]">

              {/* Day-of-week headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS_MIN.map((d, i) => (
                  <div
                    key={i}
                    title={DAYS_FULL[i]}
                    className="py-1.5 text-center text-[9px] font-bold uppercase tracking-widest text-gray-400 sm:py-2 sm:text-[10px] md:text-xs"
                  >
                    {/* 1 char on xs, 3-char on sm+ */}
                    <span className="sm:hidden">{d}</span>
                    <span className="hidden sm:inline">{DAYS_SHORT[i]}</span>
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 border-l border-t border-gray-100">
                {calendarCells.map((day, i) => {
                  if (!day) {
                    return (
                      <div
                        key={`empty-${i}`}
                        className="border-b border-r border-gray-100 bg-gray-50/50"
                        style={{ minHeight: "clamp(40px, 8vw, 80px)" }}
                      />
                    );
                  }

                  const holiday   = getHolidayForDate(day);
                  const dayOfWeek = new Date(calendarYear, calendarMonth, day).getDay();
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                  const isToday   = isCurrentMonthYear && day === today.getDate();
                  const style     = holiday ? holidayTypeColors[holiday.type] : null;

                  return (
                    <div
                      key={day}
                      className={[
                        "relative border-b border-r border-gray-100 p-1 sm:p-1.5",
                        isWeekend ? "bg-gray-50" : "bg-white",
                        isToday   ? "ring-2 ring-inset ring-indigo-400" : "",
                      ].join(" ")}
                      style={{ minHeight: "clamp(44px, 10vw, 84px)" }}
                    >
                      {/* Day number */}
                      <div className="flex items-start justify-between">
                        <span
                          className={[
                            "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold sm:h-6 sm:w-6 sm:text-xs",
                            isToday   ? "bg-indigo-600 text-white"
                              : isWeekend ? "text-gray-400"
                              : "text-gray-700",
                          ].join(" ")}
                        >
                          {day}
                        </span>
                        {isToday && (
                          <span className="hidden text-[8px] font-bold uppercase text-indigo-600 sm:block">
                            TODAY
                          </span>
                        )}
                      </div>

                      {/* Holiday chip */}
                      {holiday && style && (
                        <div
                          className={[
                            "mt-0.5 rounded px-0.5 py-px sm:mt-1 sm:px-1",
                            style.bg, style.text,
                          ].join(" ")}
                        >
                          {/* Name — hidden on xs to save space */}
                          <p className="hidden truncate text-[8px] font-semibold leading-tight sm:block">
                            {holiday.name}
                          </p>
                          {/* Coloured dot only on xs */}
                          <span
                            className={`inline-block h-1.5 w-1.5 rounded-full sm:hidden ${style.dot}`}
                            title={holiday.name}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legend — wraps gracefully */}
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-100 pt-4">
            {Object.entries(holidayTypeColors).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${val.dot}`} />
                <span className="text-[10px] font-medium text-gray-500 sm:text-xs">
                  {val.label}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-gray-300" />
              <span className="text-[10px] font-medium text-gray-500 sm:text-xs">
                Weekend
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════
          HOLIDAYS LIST CARD
      ══════════════════════════════════════════ */}
      <Card>
        <CardHeader className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="min-w-0">
            <CardTitle className="text-sm sm:text-base">
              Holidays This Academic Year
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs sm:text-sm">
              {calendarData.totalHolidaysThisYear} holidays scheduled for{" "}
              {calendarData.academicYear}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full shrink-0 text-[10px] uppercase tracking-wide sm:w-auto sm:text-xs"
          >
            Academic Year Plan
          </Button>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          <div className="space-y-0">
            {calendarData.holidays.map((h) => {
              const style   = holidayTypeColors[h.type];
              const dateObj = new Date(h.date);

              return (
                <div
                  key={h.id}
                  className="flex flex-col gap-1.5 border-b border-gray-50 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                >
                  {/* Left: dot + name + badge */}
                  <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
                    <span className="truncate text-xs font-medium text-gray-800 sm:text-sm">
                      {h.name}
                    </span>
                    <Badge
                      className={[
                        "shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold sm:text-[10px]",
                        style.bg, style.text,
                      ].join(" ")}
                    >
                      {style.label}
                    </Badge>
                  </div>

                  {/* Right: date */}
                  <span className="pl-4 text-[10px] text-gray-400 sm:pl-0 sm:text-xs sm:text-gray-500">
                    {dateObj.toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HolidayCalendar;