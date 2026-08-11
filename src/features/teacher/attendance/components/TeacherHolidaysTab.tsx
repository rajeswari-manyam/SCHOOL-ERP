import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarOff } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllHolidays } from "@/services/holidays.api";


const PAGE_SIZE = 8;

/* ─── Constants ──────────────────────────────────────────────────────────────── */

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const DAYS_FULL  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DAYS_SHORT = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const DAYS_MIN   = ["S","M","T","W","T","F","S"];

/* ─── Holiday type → visual style ───────────────────────────────────────────── */

const holidayTypeConfig: Record<
  string,
  { bg: string; text: string; dot: string; label: string }
> = {
  NATIONAL_HOLIDAY: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-400", label: "National Holiday" },
  PUBLIC_HOLIDAY:   { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500",    label: "Public Holiday"   },
  SCHOOL_EVENT:     { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500",  label: "School Event"     },
  SCHOOL_DAY:       { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500",   label: "School Day"       },
  OPTIONAL:         { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400", label: "Optional Holiday" },
  OTHER:            { bg: "bg-gray-50",   text: "text-gray-700",   dot: "bg-gray-400",   label: "Other"            },
};

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
  const n = (note ?? "").toLowerCase().trim();
  if (n === "national holiday")  return "NATIONAL_HOLIDAY";
  if (n === "public holiday")    return "PUBLIC_HOLIDAY";
  if (n === "school event")      return "SCHOOL_EVENT";
  if (n === "school day")        return "SCHOOL_DAY";
  return "OTHER";
};

/* ─── Normaliser ─────────────────────────────────────────────────────────────── */

interface NormalisedHoliday {
  id: string;
  name: string;
  date: string;
  type: string;
  note: string;
}

const normalise = (raw: any): NormalisedHoliday[] => {
  if (!raw) return [];
  let arr: any[] = [];
  if (Array.isArray(raw.data))                            arr = raw.data;
  else if (raw.data && Array.isArray(raw.data.holidays))  arr = raw.data.holidays;
  else if (Array.isArray(raw.holidays))                   arr = raw.holidays;

  return arr.map((h: any) => ({
    id:   h.id ?? h._id ?? "",
    name: h.holidayname ?? h.name ?? "Untitled",
    date: h.date ?? "",
    type: resolveHolidayType(h.type ?? "", h.note ?? ""),
    note: h.note ?? "",
  }));
};

/* ─── Main Component ────────────────────────────────────────────────────────── */

export default function TeacherHolidaysTab() {
  const now = new Date();
  const [calendarMonth, setCalendarMonth] = useState(now.getMonth());
  const [calendarYear,  setCalendarYear]  = useState(now.getFullYear());
  const [page, setPage] = useState(1);

  const { data: rawData, isLoading, isError } = useQuery({
    queryKey: ["teacher-holidays"],
    queryFn: () => getAllHolidays(),
    staleTime: 10 * 60_000,
  });

  const holidays = normalise(rawData);

  const goToPrevMonth = () => {
    if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear((y) => y - 1); }
    else setCalendarMonth((m) => m - 1);
  };

  const goToNextMonth = () => {
    if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear((y) => y + 1); }
    else setCalendarMonth((m) => m + 1);
  };

  const firstDay    = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const isCurrentMonthYear =
    now.getMonth() === calendarMonth && now.getFullYear() === calendarYear;

  const getHolidayForDate = (day: number) => {
    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return holidays.find((h) => h.date === dateStr);
  };

  const calendarCells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const sortedHolidays = [...holidays].sort((a, b) => a.date.localeCompare(b.date));
  const totalPages = Math.max(1, Math.ceil(sortedHolidays.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedHolidays = sortedHolidays.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  if (isLoading) {
    return (
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
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <CalendarOff size={40} className="text-gray-300" />
        <p className="text-sm text-red-500">Failed to load holidays.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* ── Calendar Card ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Month navigator */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <button
            onClick={goToPrevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={16} className="text-gray-600" />
          </button>
          <p className="text-sm font-bold text-gray-800">
            {MONTHS[calendarMonth]} {calendarYear}
          </p>
          <button
            onClick={goToNextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        </div>

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
            const isToday   = isCurrentMonthYear && day === now.getDate();
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
                ].join(" ")}
                style={{ minHeight: "clamp(38px, 5vw, 55px)" }}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={[
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
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

                {!holiday && isWeekend && (
                  <p className="mt-1 text-[9px] font-medium uppercase tracking-wide text-gray-300">
                    {dayOfWeek === 0 ? "SUNDAY" : "SAT"}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-5 gap-y-2.5 px-5 py-3 border-t border-gray-100 bg-gray-50/50">
          {(["NATIONAL_HOLIDAY","PUBLIC_HOLIDAY","SCHOOL_EVENT","SCHOOL_DAY","OPTIONAL"] as const).map((key) => {
            const cfg = holidayTypeConfig[key];
            return (
              <div key={key} className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${cfg.dot}`} />
                <span className="text-[10px] font-medium text-gray-500">{cfg.label}</span>
              </div>
            );
          })}
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
            <span className="text-[10px] font-medium text-gray-500">Weekend</span>
          </div>
        </div>
      </div>

      {/* ── Holidays List Card ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-900">
            Holidays This Academic Year
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">
            {holidays.length} {holidays.length === 1 ? "holiday" : "holidays"} scheduled
          </p>
        </div>

        <div className="p-4 sm:p-5">
          {sortedHolidays.length === 0 ? (
            <div className="py-8 text-center">
              <CalendarOff size={36} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">No holidays scheduled yet.</p>
            </div>
          ) : (
            <>
              <div className="space-y-0">
                {pagedHolidays.map((h) => {
                  const cfg     = holidayTypeConfig[h.type] ?? holidayTypeConfig.OTHER;
                  const dateObj = new Date(h.date + "T00:00:00");
                  return (
                    <div
                      key={h.id}
                      className="flex flex-col gap-1.5 border-b border-gray-100 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                    >
                      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${cfg.dot}`} />
                        <span className="truncate text-xs font-medium text-gray-800">{h.name}</span>
                        <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 pl-4 sm:pl-0">
                        {h.note && (
                          <span className="text-xs text-gray-400 italic">{h.note}</span>
                        )}
                        <span className="text-[10px] text-gray-500 shrink-0">
                          {dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-4 mt-2 border-t border-gray-100">
                  <p className="text-[11px] text-gray-400">
                    Page {safePage} of {totalPages}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={safePage <= 1}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg text-[11px] font-semibold transition-colors ${
                          p === safePage
                            ? "bg-indigo-600 text-white"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={safePage >= totalPages}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
