import { useState } from "react";
import { useAttendanceStore } from "../store";
import { useAllHolidays } from "../hooks/useAttendance";
import BulkAddHolidayModal from "./BulkAddHolidayModal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";

/* ─── Types ─────────────────────────────────────────────────────────────────── */

interface NormalisedHoliday {
  id: string;
  name: string;
  date: string;      // YYYY-MM-DD
  type: string;      // normalised uppercase key
  note: string;
}

interface NormalisedCalendar {
  holidays: NormalisedHoliday[];
  totalHolidaysThisYear: number;
  academicYear: string;
}

/* ─── Constants ──────────────────────────────────────────────────────────────── */

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const DAYS_FULL  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DAYS_SHORT = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const DAYS_MIN   = ["S","M","T","W","T","F","S"];

/* ─── Holiday type → visual style ───────────────────────────────────────────── */
// API sends lowercase type values ("public", "optional", "national", "school", "event")
// Figma uses: SCHOOL_DAY · NATIONAL_HOLIDAY · PUBLIC_HOLIDAY · SCHOOL_EVENT · SUNDAY/WEEKEND

const holidayTypeConfig: Record<
  string,
  { bg: string; text: string; dot: string; border: string; label: string }
> = {
  NATIONAL_HOLIDAY: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-400", border: "border-yellow-400", label: "National Holiday" },
  PUBLIC_HOLIDAY:   { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500",    border: "border-red-400",    label: "Public Holiday"   },
  SCHOOL_EVENT:     { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500",  border: "border-green-400",  label: "School Event"     },
  SCHOOL_DAY:       { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500",   border: "border-blue-400",   label: "School Day"       },
  OPTIONAL:         { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400", border: "border-purple-400", label: "Optional Holiday" },
  OTHER:            { bg: "bg-gray-50",   text: "text-gray-700",   dot: "bg-gray-400",   border: "border-gray-400",   label: "Other"            },
};

/**
 * Map raw API `type` field → normalised uppercase key used in holidayTypeConfig.
 * Prioritises the `type` field; `note` is only used as a last-resort fallback
 * when `type` is blank/unrecognised, to avoid all entries collapsing to one category.
 *
 * API sends:
 *   type: "public" | "optional" | "national" | "school" | "event" | …
 */
const resolveHolidayType = (rawType: string, note: string): string => {
  const t = (rawType ?? "").toLowerCase().trim();

  if (t === "national")          return "NATIONAL_HOLIDAY";
  if (t === "public")            return "PUBLIC_HOLIDAY";
  if (t === "event")             return "SCHOOL_EVENT";
  if (t === "school")            return "SCHOOL_DAY";
  if (t === "optional")          return "OPTIONAL";
  if (t === "national_holiday")  return "NATIONAL_HOLIDAY";
  if (t === "public_holiday")    return "PUBLIC_HOLIDAY";
  if (t === "school_event")      return "SCHOOL_EVENT";
  if (t === "school_day")        return "SCHOOL_DAY";

  // Fallback: try note only when type is completely unrecognised
  const n = (note ?? "").toLowerCase().trim();
  if (n === "national holiday")  return "NATIONAL_HOLIDAY";
  if (n === "public holiday")    return "PUBLIC_HOLIDAY";
  if (n === "school event")      return "SCHOOL_EVENT";
  if (n === "school day")        return "SCHOOL_DAY";

  return "OTHER";
};

/* ─── API response normaliser ────────────────────────────────────────────────── */
// Handles the actual shape: { status, count, data: HolidayFromApi[] }

const normalise = (raw: any): NormalisedCalendar => {
  const empty: NormalisedCalendar = { holidays: [], totalHolidaysThisYear: 0, academicYear: "" };
  if (!raw) return empty;

  // Determine the raw array regardless of envelope shape
  let arr: any[] = [];
  if (Array.isArray(raw.data))                                   arr = raw.data;
  else if (raw.data && Array.isArray(raw.data.holidays))         arr = raw.data.holidays;
  else if (Array.isArray(raw.holidays))                          arr = raw.holidays;

  const holidays: NormalisedHoliday[] = arr.map((h: any) => ({
    id:   h.id   ?? h._id ?? "",
    name: h.holidayname ?? h.name ?? h.holiday_name ?? "Untitled",
    date: h.date ?? "",
    type: resolveHolidayType(h.type ?? "", h.note ?? ""),
    note: h.note ?? "",
  }));

  return {
    holidays,
    totalHolidaysThisYear: raw.count ?? raw.totalHolidaysThisYear ?? raw.data?.totalHolidaysThisYear ?? holidays.length,
    academicYear:          raw.academicYear ?? raw.data?.academicYear ?? "",
  };
};

/* ─── Sub-components ─────────────────────────────────────────────────────────── */

const CalendarSkeleton = () => (
  <div className="space-y-4 animate-pulse p-4">
    <div className="flex items-center justify-between">
      <div className="h-5 w-40 rounded bg-gray-200" />
      <div className="h-8 w-28 rounded bg-gray-200" />
    </div>
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 35 }).map((_, i) => (
        <div key={i} className="aspect-square rounded bg-gray-100" />
      ))}
    </div>
  </div>
);

const CalendarError = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
    <span className="text-3xl">⚠️</span>
    <p className="text-sm text-red-600 max-w-xs">{message}</p>
    <Button onClick={onRetry} variant="outline" size="sm">Try Again</Button>
  </div>
);

/* ─── Main Component ──────────────────────────────────────────────────────────── */

const HolidayCalendar = () => {
  const {
    calendarMonth, calendarYear,
    goToPrevMonth, goToNextMonth, openAddHoliday,
  } = useAttendanceStore();

  const [showBulkModal, setShowBulkModal] = useState(false);

  const { data: rawData, isLoading, isError, error, refetch } = useAllHolidays();

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Card><CalendarSkeleton /></Card>
        <Card><CalendarSkeleton /></Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Card>
          <CalendarError
            message={(error as any)?.message ?? "Failed to load holidays. Please try again."}
            onRetry={() => refetch()}
          />
        </Card>
      </div>
    );
  }

  const cal = normalise(rawData);

  const firstDay    = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const today       = new Date();
  const isCurrentMonthYear =
    today.getMonth() === calendarMonth && today.getFullYear() === calendarYear;

  const getHolidayForDate = (day: number) => {
    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return cal.holidays.find((h) => h.date === dateStr);
  };

  const calendarCells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* ── Calendar card ───────────────────────────────────────────────────── */}
      <Card className="overflow-hidden border-0 shadow-sm">

        <CardHeader className="flex flex-col gap-2 border-b-0 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={goToPrevMonth}
              variant="outline" size="sm"
              aria-label="Previous month"
              className="flex h-8 w-8 items-center justify-center rounded-lg p-0 text-base border-gray-200 hover:bg-gray-50"
            >‹</Button>
            <CardTitle className="min-w-[140px] text-center text-base font-bold text-gray-900">
              {MONTHS[calendarMonth]} {calendarYear}
            </CardTitle>
            <Button
              onClick={goToNextMonth}
              variant="outline" size="sm"
              aria-label="Next month"
              className="flex h-8 w-8 items-center justify-center rounded-lg p-0 text-base border-gray-200 hover:bg-gray-50"
            >›</Button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={() => setShowBulkModal(true)}
              size="sm"
              variant="outline"
              className="flex-1 sm:flex-none rounded-lg border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 sm:px-4"
            >
              Bulk Add
            </Button>
            <Button
              onClick={openAddHoliday}
              size="sm"
              className="flex-1 sm:flex-none rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 sm:px-5"
            >
              + Add Holiday
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[320px]">

              {/* Day-of-week headers */}
              <div className="grid grid-cols-7 bg-purple-50">
                {DAYS_SHORT.map((d, i) => (
                  <div
                    key={i}
                    title={DAYS_FULL[i]}
                    className="py-2 text-center text-[10px] font-bold uppercase tracking-widest text-purple-600 sm:text-xs"
                  >
                    <span className="sm:hidden">{DAYS_MIN[i]}</span>
                    <span className="hidden sm:inline">{d}</span>
                  </div>
                ))}
              </div>

              {/* Calendar cells */}
              <div className="grid grid-cols-7">
                {calendarCells.map((day, i) => {
                  if (!day) {
                    return (
                      <div
                        key={`empty-${i}`}
                        className="bg-gray-50/30"
                        style={{ minHeight: "clamp(38px, 5vw, 55px)" }}
                      />
                    );
                  }

                  const holiday   = getHolidayForDate(day);
                  const dayOfWeek = new Date(calendarYear, calendarMonth, day).getDay();
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                  const isToday   = isCurrentMonthYear && day === today.getDate();
                  const cfg       = holiday
                    ? (holidayTypeConfig[holiday.type] ?? holidayTypeConfig.OTHER)
                    : null;

                  return (
                    <div
                      key={day}
                      className={[
                        "relative p-1.5 sm:p-2",
                        isWeekend ? "bg-gray-50/50" : "bg-white",
                        isToday   ? "ring-1 ring-inset ring-indigo-400" : "",
                        cfg       ? `` : "",
                      ].join(" ")}
                      style={{ minHeight: "clamp(38px, 5vw, 55px)" }}
                    >
                      {/* Day number */}
                      <div className="flex items-start justify-between">
                        <span
                          className={[
                            "flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
                            isToday
                              ? "bg-indigo-600 text-white"
                              : isWeekend
                              ? "text-gray-400"
                              : "text-gray-700",
                          ].join(" ")}
                        >
                          {day}
                        </span>
                        {isToday && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-500">
                            TODAY
                          </span>
                        )}
                      </div>

                      {/* Holiday label */}
                      {holiday && cfg && (
                        <div className={["mt-1 rounded-r px-1.5 py-1", cfg.bg].join(" ")}>
                          <p className={["truncate text-[10px] font-semibold leading-tight", cfg.text].join(" ")}>
                            {holiday.name}
                          </p>
                          <p className="truncate text-[8px] font-medium uppercase tracking-wide text-gray-500">
                            {cfg.label}
                          </p>
                        </div>
                      )}

                      {/* Weekend label (no holiday) */}
                      {!holiday && isWeekend && (
                        <p className="mt-1 text-[9px] font-medium uppercase tracking-wide text-gray-300">
                          {dayOfWeek === 0 ? "SUNDAY" : "SAT"}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-5 gap-y-2.5 px-5 py-4">
            {(["NATIONAL_HOLIDAY","PUBLIC_HOLIDAY","SCHOOL_EVENT","SCHOOL_DAY","OPTIONAL"] as const).map((key) => {
              const cfg = holidayTypeConfig[key];
              return (
                <div key={key} className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${cfg.dot}`} />
                  <span className="text-[11px] font-medium text-gray-500 sm:text-xs">{cfg.label}</span>
                </div>
              );
            })}
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
              <span className="text-[11px] font-medium text-gray-500 sm:text-xs">Sunday/Weekend</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Holidays list card ───────────────────────────────────────────────── */}
      <Card className="border border-gray-200">
        <CardHeader className="flex flex-col gap-3 border-b-0 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="min-w-0">
            <CardTitle className="text-sm font-bold text-gray-900 sm:text-base">
              Holidays This Academic Year
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              {cal.totalHolidaysThisYear} holidays scheduled
              {cal.academicYear ? ` for ${cal.academicYear}` : ""}
            </CardDescription>
          </div>
          <Button
            variant="outline" size="sm"
            className="w-full shrink-0 rounded-lg text-[11px] font-medium uppercase tracking-wide sm:w-auto sm:text-xs"
          >
            Academic Year Plan
          </Button>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          {cal.holidays.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">No holidays scheduled yet.</p>
          ) : (
            <div className="space-y-0">
              {cal.holidays.map((h) => {
                const cfg     = holidayTypeConfig[h.type] ?? holidayTypeConfig.OTHER;
                // Parse date with UTC offset so "2026-06-12" doesn't shift a day
                const dateObj = new Date(h.date + "T00:00:00");
                return (
                  <div
                    key={h.id}
                    className="flex flex-col gap-1.5 border-b border-gray-100 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                  >
                    <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${cfg.dot}`} />
                      <span className="truncate text-sm font-medium text-gray-800">{h.name}</span>
                      <Badge
                        className={[
                          "shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold border-0",
                          cfg.bg, cfg.text,
                        ].join(" ")}
                      >
                        {cfg.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 pl-4 sm:pl-0">
                      {h.note && (
                        <span className="text-xs text-gray-400 italic">{h.note}</span>
                      )}
                      <span className="text-xs text-gray-500 shrink-0">
                        {dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {showBulkModal && (
        <BulkAddHolidayModal onClose={() => setShowBulkModal(false)} />
      )}
    </div>
  );
};

export default HolidayCalendar;