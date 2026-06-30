import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, Clock, MapPin, User } from "lucide-react";
import type {
  WeeklyGrid,
  TimetablePeriod,
  TimetableCell,
  ClassColorKey,
} from "../types/timetable.types";
import type { DayName } from "../hooks/useTimetable";
import { DAYS } from "../hooks/useTimetable";

// ── Colour tokens ─────────────────────────────────────────────────────────────
const COLOR_MAP: Record<
  ClassColorKey,
  { bg: string; text: string; subject: string; border: string; dot: string; header: string }
> = {
  indigo:  { bg: "bg-indigo-50",  text: "text-indigo-500",  subject: "text-indigo-700",  border: "border-indigo-100",  dot: "bg-indigo-400",  header: "bg-indigo-500"  },
  violet:  { bg: "bg-violet-50",  text: "text-violet-500",  subject: "text-violet-700",  border: "border-violet-100",  dot: "bg-violet-400",  header: "bg-violet-500"  },
  sky:     { bg: "bg-sky-50",     text: "text-sky-500",     subject: "text-sky-700",     border: "border-sky-100",     dot: "bg-sky-400",     header: "bg-sky-500"     },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-500", subject: "text-emerald-700", border: "border-emerald-100", dot: "bg-emerald-400", header: "bg-emerald-500" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-500",   subject: "text-amber-700",   border: "border-amber-100",   dot: "bg-amber-400",   header: "bg-amber-500"   },
  rose:    { bg: "bg-rose-50",    text: "text-rose-500",    subject: "text-rose-700",     border: "border-rose-100",    dot: "bg-rose-400",    header: "bg-rose-500"    },
  slate:   { bg: "bg-slate-50",   text: "text-slate-400",   subject: "text-slate-500",   border: "border-slate-100",   dot: "bg-slate-300",   header: "bg-slate-400"   },
};

const PRIMARY = "#5B5CEB";

// ── Week date helper ──────────────────────────────────────────────────────────
const getWeekDates = (offset: number): Record<string, string> => {
  const now = new Date();
  const dow = now.getDay();
  const mon = new Date(now);
  mon.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1) + offset * 7);
  const result: Record<string, string> = {};
  DAYS.forEach((day, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    result[day] = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  });
  return result;
};

// ── Tooltip ───────────────────────────────────────────────────────────────────
interface TooltipProps {
  cell: TimetableCell;
  period: TimetablePeriod;
  day: string;
  visible: boolean;
}

const PeriodTooltip = ({ cell, period, day, visible }: TooltipProps) => {
  const c = COLOR_MAP[cell.colorKey];
  return (
    <div
      role="tooltip"
      className={[
        "pointer-events-none absolute z-50 bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2",
        "w-52 shadow-lg border border-[#E5E7EB] bg-white overflow-hidden",
        "transition-all duration-150",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 invisible",
      ].join(" ")}
      style={{ borderRadius: 12 }}
    >
      <div className={`${c.header} px-3 py-2`}>
        <p className="text-[12px] font-semibold text-white leading-tight">{cell.subject}</p>
        <p className="text-[10px] text-white/75 mt-0.5">{day} · {period.time}</p>
      </div>
      <div className="px-3 py-2.5 flex flex-col gap-1.5">
        {[
          { icon: <User size={10} />, label: cell.class },
          { icon: <MapPin size={10} />, label: cell.room },
          { icon: <Clock size={10} />, label: period.label },
        ].map(({ icon, label }) => label ? (
          <div key={label} className="flex items-center gap-2 text-[11px] text-gray-600">
            <span className="text-gray-300">{icon}</span>
            <span>{label}</span>
          </div>
        ) : null)}
      </div>
    </div>
  );
};

// ── Period card ───────────────────────────────────────────────────────────────
interface CellProps {
  cell: TimetableCell | null;
  period: TimetablePeriod;
  day: string;
  isCurrent: boolean;
  isToday: boolean;
}

const GridCell = ({ cell, period, day, isCurrent, isToday }: CellProps) => {
  const [hovered, setHovered] = useState(false);

  const tdBase = [
    "relative border-b border-r border-[#E5E7EB] transition-colors p-1.5",
    isToday ? "bg-[#5B5CEB]/[0.04]" : "bg-white",
  ].join(" ");

  if (!cell) {
    return (
      <td
        className={tdBase}
        style={{ minWidth: 120, width: 140, height: 80 }}
        aria-label="Empty period"
      />
    );
  }

  const c = COLOR_MAP[cell.colorKey];

  return (
    <td
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={cell.isFree ? -1 : 0}
      aria-label={cell.isFree ? "Free period" : `${cell.subject} — ${cell.class}, ${cell.room}`}
      className={tdBase}
      style={{ minWidth: 120, width: 140, height: 80 }}
    >
      {/* Live pulse */}
      {isCurrent && (
        <span
          aria-hidden="true"
          className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full animate-pulse z-10"
          style={{ background: PRIMARY }}
        />
      )}

      {/* Card */}
      <div
        className={[
          "h-full border px-2.5 py-2 flex flex-col justify-center gap-1",
          "transition-all duration-150 cursor-default",
          c.bg, c.border,
          hovered && !cell.isFree ? "shadow-md scale-[1.02]" : "",
          isCurrent ? "ring-1 ring-offset-1" : "",
        ].join(" ")}
        style={{
          borderRadius: 10,
          ...(isCurrent ? { boxShadow: `0 0 0 1px ${PRIMARY}` } : {}),
        }}
      >
        {cell.isFree ? (
          <p className={`text-xs font-semibold uppercase tracking-wider ${c.text}`}>Free</p>
        ) : (
          <>
            <p className={`text-sm font-semibold leading-tight truncate ${c.subject}`}>
              {cell.subject}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
              <p className={`text-xs leading-tight truncate ${c.text}`}>{cell.class}</p>
            </div>
            {cell.room && (
              <span
                className={`mt-1 self-start text-[10px] font-medium px-1.5 py-0.5 border rounded ${c.bg} ${c.border} ${c.text}`}
              >
                {cell.room}
              </span>
            )}
          </>
        )}
      </div>

      {!cell.isFree && (
        <PeriodTooltip cell={cell} period={period} day={day} visible={hovered} />
      )}
    </td>
  );
};

// ── Nav button ────────────────────────────────────────────────────────────────
const NavBtn = ({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="flex h-8 w-8 items-center justify-center border border-[#E5E7EB] bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded-lg"
  >
    {children}
  </button>
);

// ── TimetableGrid ─────────────────────────────────────────────────────────────
interface Props {
  grid: WeeklyGrid;
  periods: TimetablePeriod[];
  weekOffset: number;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onResetWeek: () => void;
  weekLabel: string;
  weekSubLabel: string;
  todayName: DayName | null;
  currentPeriodId: string | null;
}

const TimetableGrid = ({
  grid, periods,
  weekOffset, onPrevWeek, onNextWeek, onResetWeek,
  weekLabel, weekSubLabel,
  todayName, currentPeriodId,
}: Props) => {
  const currentPeriod = periods.find((p) => p.id === currentPeriodId);
  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);

  const classCount = useMemo(() => {
    const seen = new Set<string>();
    for (const pid of Object.keys(grid)) {
      for (const day of DAYS) {
        const cell = grid[pid]?.[day];
        if (cell && !cell.isFree) seen.add(cell.class);
      }
    }
    return seen.size;
  }, [grid]);

  return (
    <section
      aria-label="Weekly timetable"
      className="overflow-hidden bg-white border border-[#E5E7EB] shadow-sm"
      style={{ borderRadius: 14 }}
    >
      {/* ── Toolbar ─── */}
      <div className="flex items-center justify-between gap-2 border-b border-[#E5E7EB] px-4 py-3">

        {/* Week nav */}
        <div className="flex items-center gap-2">
          <NavBtn onClick={onPrevWeek} label="Previous week">
            <ChevronLeft size={14} strokeWidth={2.5} aria-hidden="true" />
          </NavBtn>

          <div className="flex items-center gap-2 px-3 py-1.5 border border-[#E5E7EB] bg-[#F8FAFC] rounded-lg">
            <CalendarDays size={13} className="text-gray-400 shrink-0" aria-hidden="true" />
            <span className="text-sm font-semibold text-[#111827]">{weekLabel}</span>
            <span className="text-xs text-[#6B7280] whitespace-nowrap">({weekSubLabel})</span>
          </div>

          <NavBtn onClick={onNextWeek} label="Next week">
            <ChevronRight size={14} strokeWidth={2.5} aria-hidden="true" />
          </NavBtn>

          {weekOffset !== 0 && (
            <button
              type="button"
              onClick={onResetWeek}
              className="ml-1 text-xs font-semibold underline underline-offset-2 focus-visible:outline-none rounded-sm transition-colors"
              style={{ color: PRIMARY }}
            >
              Today
            </button>
          )}
        </div>

        {/* Class count badge */}
        {classCount > 0 && (
          <div className="flex items-center gap-1.5">
            <span aria-hidden="true" className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-sm font-medium text-indigo-600">
              {classCount} class{classCount !== 1 ? "es" : ""}
            </span>
          </div>
        )}
      </div>

      {/* ── Table ─── */}
      <div className="overflow-auto max-h-[calc(100vh-300px)]" role="region" aria-label="Timetable grid">
        <table className="border-collapse" style={{ minWidth: 560 }} aria-label="Weekly schedule">
          <thead>
            <tr>
              {/* Period/Time header */}
              <th
                scope="col"
                className="sticky left-0 top-0 z-20 border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3 text-left"
                style={{ minWidth: 130 }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Period</p>
                <p className="mt-0.5 text-[9px] text-gray-300">Time</p>
              </th>

              {/* Day columns */}
              {DAYS.map((day) => {
                const isToday = day === todayName;
                return (
                  <th
                    key={day}
                    scope="col"
                    className={[
                      "sticky top-0 z-10 border-b border-r px-2 py-2.5 text-center transition-colors",
                      isToday ? "border-[#5B5CEB]/20" : "border-[#E5E7EB] bg-[#F8FAFC]",
                    ].join(" ")}
                    style={{
                      minWidth: 120,
                      width: 140,
                      ...(isToday ? { background: PRIMARY } : {}),
                    }}
                  >
                    <p className={`text-xs font-semibold ${isToday ? "text-white" : "text-[#374151]"}`}>
                      {day}
                    </p>
                    <p className={`text-[11px] mt-0.5 ${isToday ? "text-white/80" : "text-gray-400"}`}>
                      {weekDates[day]}
                    </p>
                    {isToday && (
                      <span className="mt-1 inline-block rounded-full bg-white/20 px-2 py-px text-[9px] font-bold text-white tracking-wide">
                        TODAY
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {periods.map((period) =>
              period.kind !== "PERIOD" ? (
                // Break / Lunch strip
                <tr key={period.id}>
                  <td
                    className="sticky left-0 z-10 border-b border-r border-[#E5E7EB] bg-amber-50/70 px-3 py-2"
                    style={{ minWidth: 130 }}
                  >
                    <p className="text-xs font-semibold text-amber-600">{period.label}</p>
                    <p className="mt-0.5 text-[10px] text-amber-400">{period.time}</p>
                  </td>
                  <td
                    colSpan={DAYS.length}
                    className="border-b border-[#E5E7EB] bg-amber-50/40 px-4 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-0.5 h-4 rounded-full bg-amber-400 shrink-0" />
                      <span className="text-sm font-medium text-amber-600">
                        {period.kind === "LUNCH" ? "Lunch Break" : "Short Break"}
                      </span>
                      <span className="text-xs text-amber-400 ml-1">{period.time}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                // Regular period row
                <tr key={period.id}>
                  <td
                    className="sticky left-0 z-10 border-b border-r border-[#E5E7EB] bg-white px-3 py-2"
                    style={{ minWidth: 130 }}
                  >
                    <p className="text-sm font-semibold text-[#374151]">{period.label}</p>
                    <p className="mt-0.5 text-xs text-[#6B7280] whitespace-nowrap leading-snug">
                      {period.time}
                    </p>
                  </td>

                  {DAYS.map((day) => (
                    <GridCell
                      key={day}
                      cell={grid[period.id]?.[day] ?? null}
                      period={period}
                      day={day}
                      isCurrent={weekOffset === 0 && period.id === currentPeriodId && day === todayName}
                      isToday={day === todayName}
                    />
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* ── Live period bar ─── */}
      {currentPeriod && weekOffset === 0 && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 border-t px-4 py-2"
          style={{ borderColor: `${PRIMARY}20`, background: `${PRIMARY}08` }}
        >
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full animate-pulse shrink-0"
            style={{ background: PRIMARY }} />
          <p className="text-xs font-medium" style={{ color: PRIMARY }}>
            Now in <span className="font-semibold">{currentPeriod.label}</span>
            <span className="ml-1.5 opacity-60">{currentPeriod.time}</span>
          </p>
        </div>
      )}

      {/* ── Bottom legend ─── */}
      <div className="flex items-center gap-6 px-4 py-3 border-t border-gray-100">
        <span className="flex items-center gap-2 text-xs text-gray-500">
          <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          Scheduled Class
        </span>
        <span className="flex items-center gap-2 text-xs text-gray-500">
          <span aria-hidden="true" className="w-0.5 h-4 rounded-full bg-amber-400 shrink-0" />
          Break Time
        </span>
        <span className="flex items-center gap-2 text-xs text-gray-500">
          <span aria-hidden="true" className="w-px h-4 bg-gray-300 shrink-0" />
          Free Period
        </span>
      </div>
    </section>
  );
};

export default TimetableGrid;
