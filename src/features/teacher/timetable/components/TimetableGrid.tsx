import { useState, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import type {
  WeeklyGrid,
  TimetablePeriod,
  TimetableCell,
  ClassColorKey,
} from "../types/timetable.types";
import type { DayName } from "../hooks/useTimetable";
import { DAYS } from "../hooks/useTimetable";

// ── Colour map ────────────────────────────────────────────────────────────────
const COLOR_MAP: Record<
  ClassColorKey,
  { bg: string; text: string; border: string; tooltipBg: string }
> = {
  indigo:  { bg: "bg-indigo-50 dark:bg-indigo-950/60",   text: "text-indigo-700 dark:text-indigo-300",  border: "border-indigo-200 dark:border-indigo-800",  tooltipBg: "bg-indigo-600"  },
  violet:  { bg: "bg-violet-50 dark:bg-violet-950/60",   text: "text-violet-700 dark:text-violet-300",  border: "border-violet-200 dark:border-violet-800",  tooltipBg: "bg-violet-600"  },
  sky:     { bg: "bg-sky-50 dark:bg-sky-950/60",         text: "text-sky-700 dark:text-sky-300",        border: "border-sky-200 dark:border-sky-800",        tooltipBg: "bg-sky-600"     },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-950/60", text: "text-emerald-700 dark:text-emerald-300",border: "border-emerald-200 dark:border-emerald-800", tooltipBg: "bg-emerald-600" },
  amber:   { bg: "bg-amber-50 dark:bg-amber-950/60",     text: "text-amber-700 dark:text-amber-300",    border: "border-amber-200 dark:border-amber-800",    tooltipBg: "bg-amber-500"   },
  rose:    { bg: "bg-rose-50 dark:bg-rose-950/60",       text: "text-rose-700 dark:text-rose-300",      border: "border-rose-200 dark:border-rose-800",      tooltipBg: "bg-rose-600"    },
  slate:   { bg: "bg-slate-50 dark:bg-slate-800/60",     text: "text-slate-400 dark:text-slate-500",    border: "border-slate-200 dark:border-slate-700",    tooltipBg: "bg-slate-500"   },
};

const DOT_COLORS: Record<ClassColorKey, string> = {
  indigo:  "bg-indigo-500",
  violet:  "bg-violet-500",
  sky:     "bg-sky-500",
  emerald: "bg-emerald-500",
  amber:   "bg-amber-400",
  rose:    "bg-rose-500",
  slate:   "bg-slate-300 dark:bg-slate-600",
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
        "pointer-events-none absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2",
        "w-52 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900",
        "transition-all duration-150",
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 invisible",
      ].join(" ")}
    >
      <div className={`${c.tooltipBg} rounded-t-xl px-3 py-2`}>
        <p className="text-xs font-bold text-white">{cell.subject}</p>
        <p className="text-[10px] text-white/80 mt-0.5">{day} · {period.time}</p>
      </div>
      <div className="px-3 py-2.5 flex flex-col gap-1.5">
        {([ ["Class", cell.class], ["Room", cell.room], ["Period", period.label] ] as const).map(([k, v]) => (
          <div key={k} className="flex justify-between text-xs">
            <span className="text-gray-400 dark:text-slate-500 font-medium">{k}</span>
            <span className="text-gray-800 dark:text-slate-100 font-semibold">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Grid cell ─────────────────────────────────────────────────────────────────
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

  const baseCell = [
    "border relative group cursor-default select-none transition-colors",
    isToday
      ? "border-indigo-100 dark:border-indigo-900 bg-indigo-50/20 dark:bg-indigo-950/20"
      : "border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900",
    isCurrent ? "ring-2 ring-inset ring-indigo-400 dark:ring-indigo-500" : "",
  ].join(" ");

  if (!cell) {
    return (
      <td
        className={baseCell}
        style={{ minWidth: 96, width: 108, height: 58 }}
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
      className={baseCell}
      style={{ minWidth: 96, width: 108, height: 58, padding: "5px 6px" }}
    >
      {/* Live indicator */}
      {isCurrent && (
        <span
          aria-hidden="true"
          className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"
        />
      )}

      <div
          className={[
            "h-full rounded-lg px-2 py-1.5 flex flex-col justify-center",
            c.bg, c.border, "border",
          ].join(" ")}
        >
          {cell.isFree ? (
            <p className={`text-[10px] font-bold uppercase tracking-wide ${c.text}`}>Free</p>
          ) : (
            <>
              <p className={`text-[11px] font-bold leading-tight truncate ${c.text}`}>{cell.subject}</p>
              <p className={`text-[10px] leading-tight mt-0.5 ${c.text} opacity-70 truncate`}>{cell.class}</p>
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
const NavBtn = ({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={[
      "flex h-8 w-8 items-center justify-center rounded-lg",
      "border border-gray-200 dark:border-slate-700",
      "bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400",
      "hover:bg-gray-50 dark:hover:bg-slate-800",
      "transition-colors focus-visible:outline-none",
      "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
    ].join(" ")}
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

  // Build dynamic legend from grid data
  const legend = useMemo(() => {
    const seen = new Map<string, ClassColorKey>();
    for (const pid of Object.keys(grid)) {
      for (const day of DAYS) {
        const cell = grid[pid]?.[day];
        if (cell && !cell.isFree) {
          if (!seen.has(cell.class)) {
            seen.set(cell.class, cell.colorKey);
          }
        }
      }
    }
    const items = [...seen.entries()].map(([label, colorKey]) => ({ label, colorKey }));
    const hasFree = Object.values(grid).some((row) =>
      DAYS.some((d) => row[d]?.isFree)
    );
    if (hasFree) items.push({ label: "Free Period", colorKey: "slate" as ClassColorKey });
    return items;
  }, [grid]);

  return (
    <section
      aria-label="Weekly timetable"
      className="overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 border-b border-gray-100 dark:border-slate-800 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">

        {/* Week nav */}
        <div className="flex items-center gap-2">
          <NavBtn onClick={onPrevWeek} label="Previous week">
            <ChevronLeft size={14} strokeWidth={2.5} aria-hidden="true" />
          </NavBtn>

          <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 sm:min-w-[180px] sm:flex-none">
            <CalendarDays size={13} className="shrink-0 text-gray-400 dark:text-slate-500" aria-hidden="true" />
            <span className="text-sm font-bold text-gray-800 dark:text-white truncate">
              {weekLabel}
            </span>
            <span className="shrink-0 text-[10px] font-semibold text-gray-400 dark:text-slate-500">
              ({weekSubLabel})
            </span>
          </div>

          <NavBtn onClick={onNextWeek} label="Next week">
            <ChevronRight size={14} strokeWidth={2.5} aria-hidden="true" />
          </NavBtn>

          {weekOffset !== 0 && (
            <button
              type="button"
              onClick={onResetWeek}
              className={[
                "ml-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400",
                "underline underline-offset-2 hover:text-indigo-700 dark:hover:text-indigo-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm",
              ].join(" ")}
            >
              Today
            </button>
          )}
        </div>

        {/* Legend — dynamically built from grid, scrollable on mobile */}
        {legend.length > 0 && (
          <div
            aria-label="Class colour legend"
            className="flex items-center gap-3 overflow-x-auto pb-0.5 sm:pb-0 sm:flex-wrap scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            {legend.map(({ label, colorKey }) => (
              <div key={label} className="flex shrink-0 items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 rounded-full ${DOT_COLORS[colorKey]}`}
                />
                <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400 whitespace-nowrap">
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Table — horizontally scrollable ────────────────────────────── */}
      <div className="overflow-x-auto" role="region" aria-label="Timetable grid, scroll horizontally on small screens">
        <table
          className="border-collapse"
          style={{ minWidth: 640 }}
          aria-label="Weekly schedule"
        >
          <thead>
            <tr>
              {/* Period/Time header — sticky left */}
              <th
                scope="col"
                className={[
                  "sticky left-0 z-10 border border-gray-100 dark:border-slate-800",
                  "bg-gray-50 dark:bg-slate-800/80 px-3 py-3 text-left",
                ].join(" ")}
                style={{ minWidth: 100 }}
              >
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-slate-500">
                  Period
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-gray-300 dark:text-slate-600">
                  Time
                </p>
              </th>

              {/* Day columns */}
              {DAYS.map((day) => {
                const isToday = day === todayName;
                return (
                  <th
                    key={day}
                    scope="col"
                    className={[
                      "border px-3 py-3 text-center transition-colors",
                      isToday
                        ? "border-indigo-200 dark:border-indigo-700 bg-indigo-600 dark:bg-indigo-700"
                        : "border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/80",
                    ].join(" ")}
                    style={{ minWidth: 96, width: 108 }}
                  >
                    <p className={`text-xs font-extrabold ${isToday ? "text-white" : "text-gray-700 dark:text-slate-200"}`}>
                      {day}
                    </p>
                    {isToday && (
                      <span className="mt-0.5 inline-block rounded-full bg-white/20 px-1.5 py-0.5 text-[9px] font-bold text-white">
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
                <tr key={period.id}>
                  <td
                    className="sticky left-0 z-10 border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/80 px-3 py-2"
                    style={{ minWidth: 100 }}
                  >
                    <p className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                      {period.label}
                    </p>
                    <p className="mt-0.5 text-[10px] text-gray-400 dark:text-slate-500 whitespace-nowrap">
                      {period.time}
                    </p>
                  </td>
                  <td
                    colSpan={DAYS.length}
                    className="border border-gray-100 dark:border-slate-800 bg-amber-50/50 dark:bg-amber-950/20 px-4 py-3 text-center"
                  >
                    <span className="text-xs font-semibold text-amber-500 dark:text-amber-400">
                      {period.kind === "LUNCH" ? "Lunch" : "Break"}
                    </span>
                  </td>
                </tr>
              ) : (
                <tr key={period.id}>
                  <td
                    className={[
                      "sticky left-0 z-10 border border-gray-100 dark:border-slate-800",
                      "bg-gray-50 dark:bg-slate-800/80 px-3 py-2",
                    ].join(" ")}
                    style={{ minWidth: 100 }}
                  >
                    <p className="text-xs font-extrabold text-gray-700 dark:text-slate-200">
                      {period.label}
                    </p>
                    <p className="mt-0.5 text-[10px] text-gray-400 dark:text-slate-500 whitespace-nowrap">
                      {period.time}
                    </p>
                  </td>

                  {DAYS.map((day) => (
                    <GridCell
                      key={day}
                      cell={grid[period.id]?.[day] ?? null}
                      period={period}
                      day={day}
                      isCurrent={
                        weekOffset === 0 &&
                        period.id === currentPeriodId &&
                        day === todayName
                      }
                      isToday={day === todayName}
                    />
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* ── Current period bar ──────────────────────────────────────────── */}
      {currentPeriod && weekOffset === 0 && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 border-t border-indigo-100 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/40 px-4 py-2.5 sm:px-5"
        >
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"
          />
          <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            Currently in {currentPeriod.label} · {currentPeriod.time}
          </p>
        </div>
      )}
    </section>
  );
};

export default TimetableGrid;