import { useAttendanceStore } from "../store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const holidayTypeColors: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  SCHOOL_DAY: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-600", label: "SCHOOL DAY" },
  NATIONAL_HOLIDAY: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-400", label: "NATIONAL HOLIDAY" },
  PUBLIC_HOLIDAY: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", label: "PUBLIC HOLIDAY" },
  SCHOOL_EVENT: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", label: "SCHOOL EVENT" },
};

const HolidayCalendar = () => {
  const { calendarData, calendarMonth, calendarYear, goToPrevMonth, goToNextMonth, openAddHoliday } =
    useAttendanceStore();

  const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonthYear =
    today.getMonth() === calendarMonth && today.getFullYear() === calendarYear;

  const getHolidayForDate = (day: number) => {
    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return calendarData.holidays.find((h) => h.date === dateStr);
  };

  const calendarCells = [];
  // Empty cells before the first day
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null);
  }
  // Days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  return (
    <div className="space-y-6">
      {/* Calendar Card */}
      <Card>
        <CardHeader className="flex items-center justify-between gap-3 p-5">
          <div className="flex items-center gap-3">
            <Button onClick={goToPrevMonth} variant="outline" size="sm" className="w-8 h-8 p-0">
              ‹
            </Button>
            <CardTitle className="text-base">{MONTHS[calendarMonth]} {calendarYear}</CardTitle>
            <Button onClick={goToNextMonth} variant="outline" size="sm" className="w-8 h-8 p-0">
              ›
            </Button>
          </div>
          <Button onClick={openAddHoliday} size="sm" className="px-4">
            + Add Holiday
          </Button>
        </CardHeader>

        <CardContent className="p-5">
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
          {DAYS_OF_WEEK.map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {calendarCells.map((day, i) => {
            if (!day) {
              return <div key={`empty-${i}`} className="aspect-[1] p-1" />;
            }

            const holiday = getHolidayForDate(day);
            const isSunday = (i % 7 === 0) || (new Date(calendarYear, calendarMonth, day).getDay() === 0);
            const isSaturday = new Date(calendarYear, calendarMonth, day).getDay() === 6;
            const isToday = isCurrentMonthYear && day === today.getDate();
            const style = holiday ? holidayTypeColors[holiday.type] : null;

            return (
              <div
                key={day}
                className={`min-h-[70px] border border-gray-100 p-1.5 relative ${
                  isSunday || isSaturday ? "bg-gray-50" : "bg-white"
                } ${isToday ? "ring-2 ring-indigo-400 ring-inset" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center ${
                      isToday
                        ? "bg-indigo-600 text-white"
                        : isSunday || isSaturday
                        ? "text-gray-400"
                        : "text-gray-700"
                    }`}
                  >
                    {day}
                  </span>
                  {isToday && (
                    <span className="text-[9px] font-bold text-indigo-600 uppercase">TODAY</span>
                  )}
                </div>
                {holiday && style && (
                  <div className={`mt-1 px-1 py-0.5 rounded text-[9px] font-semibold ${style.bg} ${style.text} leading-tight`}>
                    <div className="truncate">{holiday.name}</div>
                    <div className="opacity-75 uppercase">{style.label}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
            {Object.entries(holidayTypeColors).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${val.dot}`} />
                <span className="text-xs text-gray-500 font-medium">{val.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              <span className="text-xs text-gray-500 font-medium">SUNDAY/WEEKEND</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Holidays This Academic Year */}
      <Card>
        <CardHeader className="flex items-center justify-between mb-0 p-5">
          <div>
            <CardTitle>Holidays This Academic Year</CardTitle>
            <CardDescription className="mt-0.5">
              {calendarData.totalHolidaysThisYear} holidays scheduled for {calendarData.academicYear}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="uppercase tracking-wide">
            Academic Year Plan
          </Button>
        </CardHeader>
        <CardContent className="p-5 space-y-2">
          {calendarData.holidays.map((h) => {
            const style = holidayTypeColors[h.type];
            const dateObj = new Date(h.date);
            return (
              <div key={h.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                  <span className="text-sm text-gray-800 font-medium">{h.name}</span>
                  <Badge className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${style.bg} ${style.text}`}>
                    {style.label}
                  </Badge>
                </div>
                <span className="text-xs text-gray-500">
                  {dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default HolidayCalendar;
