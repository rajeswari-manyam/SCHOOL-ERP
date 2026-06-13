import { useState, useRef, useMemo } from "react";
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
        "pointer-events-none absolute z-50 bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2",
        "w-56 rounded-2xl shadow-lg border border-gray-100 bg-white overflow-hidden",
        "transition-all duration-150",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 invisible",
      ].join(" ")}
    >
      {/* Header strip */}
      <div className={`${c.header} px-3.5 py-2.5`}>
        <p className="text-[13px] font-semibold text-white leading-tight">{cell.subject}</p>
        <p className="text-[11px] text-white/75 mt-0.5">{day} · {period.time}</p>
      </div>
      {/* Details */}
      <div className="px-3.5 py-3 flex flex-col gap-2">
        {[
          { icon: <User size={11} />, label: cell.class },
          { icon: <MapPin size={11} />, label: cell.room },
          { icon: <Clock size={11} />, label: period.label },
        ].map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-[12px] text-gray-600">
            <span className="text-gray-300">{icon}</span>
            <span>{label}</span>
          </div>
        ))}
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
  const ref = useRef<HTMLTableCellElement>(null);

  const tdBase = [
    "relative border-b border-r border-gray-100 transition-colors p-1.5",
    isToday ? "bg-blue-50/30" : "bg-white",
  ].join(" ");

  if (!cell) {
    return (
      <td
        className={tdBase}
        style={{ minWidth: 120, width: 136, height: 72 }}
        aria-label="Empty period"
      />
    );
  }

  const c = COLOR_MAP[cell.colorKey];

  return (
    <td
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={cell.isFree ? -1 : 0}
      aria-label={cell.isFree ? "Free period" : `${cell.subject} — ${cell.class}, ${cell.room}`}
      className={tdBase}
      style={{ minWidth: 120, width: 136, height: 72 }}
    >
      {/* Live pulse */}
      {isCurrent && (
        <span
          aria-hidden="true"
          className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse z-10"
        />
      )}

      {/* Card */}
      <div
        className={[
          "h-full rounded-xl border px-2.5 py-2 flex flex-col justify-center gap-0.5",
          "transition-all duration-150 cursor-default",
          c.bg, c.border,
          hovered && !cell.isFree ? "shadow-md scale-[1.03]" : "",
          isCurrent ? "ring-1 ring-blue-400 ring-offset-1" : "",
        ].join(" ")}
      >
        {cell.isFree ? (
          <p className={`text-[10px] font-semibold uppercase tracking-wider ${c.text}`}>Free</p>
        ) : (
          <>
            <p className={`text-[12px] font-semibold leading-tight truncate ${c.subject}`}>
              {cell.subject}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
              <p className={`text-[10px] leading-tight truncate ${c.text}`}>{cell.class}</p>
            </div>
            {cell.room && (
              <span className={`mt-1 self-start text-[9px] font-medium px-1.5 py-0.5 rounded-md border ${c.bg} ${c.border} ${c.text}`}>
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
    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
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

  const legend = useMemo(() => {
    const seen = new Map<string, ClassColorKey>();
    for (const pid of Object.keys(grid)) {
      for (const day of DAYS) {
        const cell = grid[pid]?.[day];
        if (cell && !cell.isFree && !seen.has(cell.class)) {
          seen.set(cell.class, cell.colorKey);
        }
      }
    }
    const items = [...seen.entries()].map(([label, colorKey]) => ({ label, colorKey }));
    const hasFree = Object.values(grid).some((row) => DAYS.some((d) => row[d]?.isFree));
    if (hasFree) items.push({ label: "Free", colorKey: "slate" as ClassColorKey });
    return items;
  }, [grid]);

  return (
    <section
      aria-label="Weekly timetable"
      className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
    >
      {/* ── Toolbar ─── */}
      <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">

        {/* Week nav */}
        <div className="flex items-center gap-2">
          <NavBtn onClick={onPrevWeek} label="Previous week">
            <ChevronLeft size={14} strokeWidth={2.5} aria-hidden="true" />
          </NavBtn>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
            <CalendarDays size={12} className="text-gray-400 shrink-0" aria-hidden="true" />
            <span className="text-[13px] font-semibold text-gray-800">{weekLabel}</span>
            <span className="text-[11px] text-gray-400 whitespace-nowrap">({weekSubLabel})</span>
          </div>

          <NavBtn onClick={onNextWeek} label="Next week">
            <ChevronRight size={14} strokeWidth={2.5} aria-hidden="true" />
          </NavBtn>

          {weekOffset !== 0 && (
            <button
              type="button"
              onClick={onResetWeek}
              className="ml-1 text-[12px] font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2 focus-visible:outline-none rounded-sm"
            >
              Today
            </button>
          )}
        </div>

        {/* Legend */}
        {legend.length > 0 && (
          <div
            aria-label="Class colour legend"
            className="flex items-center gap-3 overflow-x-auto pb-0.5 sm:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            {legend.map(({ label, colorKey }) => {
              const c = COLOR_MAP[colorKey];
              return (
                <div key={label} className="flex shrink-0 items-center gap-1.5">
                  <span aria-hidden="true" className={`h-2 w-2 rounded-full ${c.dot}`} />
                  <span className="text-[11px] font-medium text-gray-500 whitespace-nowrap">{label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Table ─── */}
      <div className="overflow-auto max-h-[calc(100vh-300px)]" role="region" aria-label="Timetable grid">
        <table className="border-collapse" style={{ minWidth: 700 }} aria-label="Weekly schedule">
          <thead>
            <tr>
              {/* Time header — sticky left + top */}
              <th
                scope="col"
                className="sticky left-0 top-0 z-20 border-b border-r border-gray-100 bg-gray-50 px-4 py-3 text-left"
                style={{ minWidth: 104 }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Period</p>
                <p className="mt-0.5 text-[10px] text-gray-300">Time</p>
              </th>

              {/* Day columns */}
              {DAYS.map((day) => {
                const isToday = day === todayName;
                return (
                  <th
                    key={day}
                    scope="col"
                    className={[
                      "sticky top-0 z-10 border-b border-r px-3 py-3 text-center transition-colors",
                      isToday
                        ? "border-blue-100 bg-blue-600"
                        : "border-gray-100 bg-gray-50",
                    ].join(" ")}
                    style={{ minWidth: 120, width: 136 }}
                  >
                    <p className={`text-[12px] font-semibold ${isToday ? "text-white" : "text-gray-600"}`}>
                      {day}
                    </p>
                    {isToday && (
                      <span className="mt-0.5 inline-block rounded-full bg-white/20 px-1.5 py-px text-[9px] font-bold text-white tracking-wide">
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
                    className="sticky left-0 z-10 border-b border-r border-gray-100 bg-amber-50/60 px-4 py-2.5"
                    style={{ minWidth: 104 }}
                  >
                    <p className="text-[11px] font-semibold text-amber-600">{period.label}</p>
                    <p className="mt-0.5 text-[10px] text-amber-400">{period.time}</p>
                  </td>
                  <td
                    colSpan={DAYS.length}
                    className="border-b border-gray-100 bg-amber-50/40 px-5 py-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-4 rounded-full bg-amber-300 shrink-0" />
                      <span className="text-[12px] font-medium text-amber-600">
                        {period.kind === "LUNCH" ? "Lunch break" : "Short break"}
                      </span>
                      <span className="text-[11px] text-amber-400 ml-1">{period.time}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                // Regular period row
                <tr key={period.id}>
                  <td
                    className="sticky left-0 z-10 border-b border-r border-gray-100 bg-white px-4 py-2"
                    style={{ minWidth: 104 }}
                  >
                    <p className="text-[12px] font-semibold text-gray-700">{period.label}</p>
                    <p className="mt-0.5 text-[10px] text-gray-400 whitespace-nowrap leading-snug">
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
          className="flex items-center gap-2.5 border-t border-blue-100 bg-blue-50 px-5 py-2.5"
        >
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
          <p className="text-[12px] font-medium text-blue-700">
            Now in <span className="font-semibold">{currentPeriod.label}</span>
            <span className="text-blue-400 ml-1.5">{currentPeriod.time}</span>
          </p>
        </div>
      )}
    </section>
  );
};

export default TimetableGrid;
