import { useState, useRef } from "react";
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from "lucide-react";
import type { WeeklyGrid, TimetablePeriod, TimetableCell, ClassColorKey } from "../types/timetable.types";
import type { DayName } from "../hooks/useTimetable";
import { DAYS } from "../hooks/useTimetable";

// ── Colour map ────────────────────────────────────────────────────────────

const COLOR_MAP: Record<
  ClassColorKey,
  { bg: string; text: string; border: string; tooltipBg: string }
> = {
  indigo:  { bg: "bg-indigo-50",   text: "text-indigo-700",  border: "border-indigo-200",  tooltipBg: "bg-indigo-600"  },
  violet:  { bg: "bg-violet-50",   text: "text-violet-700",  border: "border-violet-200",  tooltipBg: "bg-violet-600"  },
  sky:     { bg: "bg-sky-50",      text: "text-sky-700",     border: "border-sky-200",     tooltipBg: "bg-sky-600"     },
  emerald: { bg: "bg-emerald-50",  text: "text-emerald-700", border: "border-emerald-200", tooltipBg: "bg-emerald-600" },
  amber:   { bg: "bg-amber-50",    text: "text-amber-700",   border: "border-amber-200",   tooltipBg: "bg-amber-500"   },
  rose:    { bg: "bg-rose-50",     text: "text-rose-700",    border: "border-rose-200",    tooltipBg: "bg-rose-600"    },
  slate:   { bg: "bg-slate-50",    text: "text-slate-400",   border: "border-slate-200",   tooltipBg: "bg-slate-500"   },
};

// ── Tooltip ───────────────────────────────────────────────────────────────

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
      className={`
        pointer-events-none absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2
        w-52 rounded-xl shadow-xl border border-gray-100 bg-white
        transition-all duration-150
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}
      `}
    >
      <div className={`${c.tooltipBg} rounded-t-xl px-3 py-2`}>
        <p className="text-xs font-bold text-white">{cell.subject}</p>
        <p className="text-[10px] text-white/80 mt-0.5">{day} · {period.time}</p>
      </div>
      <div className="px-3 py-2.5 flex flex-col gap-1.5">
        {[["Class", cell.class], ["Room", cell.room], ["Period", period.label]].map(([k, v]) => (
          <div key={k} className="flex justify-between text-xs">
            <span className="text-gray-400 font-medium">{k}</span>
            <span className="text-gray-800 font-semibold">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Single cell ───────────────────────────────────────────────────────────

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

  if (!cell) {
    return (
      <td
        className={`border border-gray-100 ${isToday ? "bg-indigo-50/30" : "bg-white"}`}
        style={{ minWidth: 100, width: 110, height: 60 }}
      />
    );
  }

  const c = COLOR_MAP[cell.colorKey];

  return (
    <td
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        border relative group cursor-default select-none transition-all
        ${isToday ? "border-indigo-100 bg-indigo-50/20" : "border-gray-100 bg-white"}
        ${isCurrent ? "ring-2 ring-inset ring-indigo-400" : ""}
      `}
      style={{ minWidth: 100, width: 110, height: 60, padding: "6px 8px" }}
    >
      {isCurrent && (
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
      )}

      <div className={`h-full rounded-lg px-2 py-1.5 flex flex-col justify-center ${c.bg} ${c.border} border`}>
        {cell.isFree ? (
          <p className={`text-[10px] font-bold uppercase tracking-wide ${c.text}`}>Free</p>
        ) : (
          <>
            <p className={`text-[11px] font-bold leading-tight truncate ${c.text}`}>{cell.class}</p>
            <p className={`text-[10px] leading-tight mt-0.5 ${c.text} opacity-70`}>{cell.room}</p>
          </>
        )}
      </div>

      {!cell.isFree && (
        <PeriodTooltip cell={cell} period={period} day={day} visible={hovered} />
      )}
    </td>
  );
};



// ── Colour legend ─────────────────────────────────────────────────────────

const CLASS_LEGEND: { label: string; colorKey: ClassColorKey }[] = [
  { label: "Class 8-A", colorKey: "indigo"  },
  { label: "Class 9-B", colorKey: "violet"  },
  { label: "Class 7-C", colorKey: "sky"     },
  { label: "Class 8-B", colorKey: "emerald" },
  { label: "Free Period", colorKey: "slate" },
];

const DOT_COLORS: Record<ClassColorKey, string> = {
  indigo:  "bg-indigo-500",
  violet:  "bg-violet-500",
  sky:     "bg-sky-500",
  emerald: "bg-emerald-500",
  amber:   "bg-amber-400",
  rose:    "bg-rose-500",
  slate:   "bg-slate-300",
};

// ── Main component ────────────────────────────────────────────────────────

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
  const currentPeriod = periods.find(p => p.id === currentPeriodId);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button onClick={onPrevWeek}
            className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors text-gray-500">
           <ChevronLeftIcon size={14} className="text-current" strokeWidth={2.5} />
          </button>
          <div className="min-w-[180px] text-center">
            <span className="text-sm font-bold text-gray-800">{weekLabel}</span>
            {weekOffset !== 0 && (
              <span className="ml-1.5 text-[10px] font-semibold text-gray-400">({weekSubLabel})</span>
            )}
            {weekOffset === 0 && (
              <span className="ml-1.5 text-[10px] font-semibold text-gray-400">({weekSubLabel})</span>
            )}
          </div>
          <button onClick={onNextWeek}
            className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors text-gray-500">
          <ChevronRightIcon size={14} className="text-current" strokeWidth={2.5} />
          </button>
          {weekOffset !== 0 && (
            <button onClick={onResetWeek}
              className="ml-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-2">
              Today
            </button>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3">
          {CLASS_LEGEND.map(({ label, colorKey }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${DOT_COLORS[colorKey]}`} />
              <span className="text-[11px] font-medium text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="border-collapse" style={{ minWidth: 700 }}>
          <thead>
            <tr>
              <th className="border border-gray-100 bg-gray-50 text-left px-4 py-3 sticky left-0 z-10" style={{ minWidth: 110 }}>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Period</p>
                <p className="text-[10px] text-gray-300 font-medium mt-0.5">Time</p>
              </th>
              {DAYS.map(day => {
                const isToday = day === todayName;
                return (
                  <th key={day}
                    className={`border px-3 py-3 text-center transition-colors ${isToday ? "border-indigo-200 bg-indigo-600" : "border-gray-100 bg-gray-50"}`}
                    style={{ minWidth: 100, width: 110 }}
                  >
                    <p className={`text-xs font-extrabold ${isToday ? "text-white" : "text-gray-700"}`}>{day}</p>
                    {isToday && (
                      <span className="mt-0.5 inline-block px-1.5 py-0.5 rounded-full bg-white/20 text-[9px] font-bold text-white">TODAY</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {periods.map(period => (
              <tr key={period.id}>
                <td className="border border-gray-100 bg-gray-50 sticky left-0 z-10 px-4 py-2" style={{ minWidth: 110 }}>
                  <p className="text-xs font-extrabold text-gray-700">{period.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 whitespace-nowrap">{period.time}</p>
                </td>
                {DAYS.map(day => (
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Current period bar */}
      {currentPeriod && weekOffset === 0 && (
        <div className="border-t border-indigo-100 bg-indigo-50 px-5 py-2.5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <p className="text-xs font-semibold text-indigo-700">
            Currently in {currentPeriod.label} · {currentPeriod.time}
          </p>
        </div>
      )}
    </div>
  );
};

export default TimetableGrid;
