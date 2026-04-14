import { useState, useMemo } from "react";
import type { WeeklyGrid, TimetablePeriod, UpcomingExam, TimetableSummary } from "../types/timetable.types";

// ── Constants ─────────────────────────────────────────────────────────────

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
export type DayName = typeof DAYS[number];

export const MOCK_PERIODS: TimetablePeriod[] = [
  { id: "p1", label: "P1", time: "8:00 – 8:45"   },
  { id: "p2", label: "P2", time: "8:45 – 9:30"   },
  { id: "p3", label: "P3", time: "9:45 – 10:30"  },
  { id: "p4", label: "P4", time: "10:30 – 11:15" },
  { id: "p5", label: "P5", time: "11:30 – 12:15" },
  { id: "p6", label: "P6", time: "12:15 – 1:00"  },
  { id: "p7", label: "P7", time: "2:00 – 2:45"   },
  { id: "p8", label: "P8", time: "2:45 – 3:30"   },
];

export const MOCK_GRID: WeeklyGrid = {
  p1: {
    Mon: { subject: "Mathematics", class: "Class 8-A", room: "Room 12", colorKey: "indigo" },
    Tue: { subject: "Mathematics", class: "Class 9-B", room: "Room 7",  colorKey: "violet" },
    Wed: { subject: "Mathematics", class: "Class 7-C", room: "Room 3",  colorKey: "sky"    },
    Thu: { subject: "Mathematics", class: "Class 8-A", room: "Room 12", colorKey: "indigo" },
    Fri: { subject: "Mathematics", class: "Class 9-B", room: "Room 7",  colorKey: "violet" },
    Sat: null,
  },
  p2: {
    Mon: { subject: "Mathematics", class: "Class 9-B", room: "Room 7",  colorKey: "violet"  },
    Tue: { subject: "Mathematics", class: "Class 8-B", room: "Room 11", colorKey: "emerald" },
    Wed: { subject: "Free Period", class: "Staff Room", room: "—",      colorKey: "slate", isFree: true },
    Thu: { subject: "Mathematics", class: "Class 7-C", room: "Room 3",  colorKey: "sky"    },
    Fri: { subject: "Mathematics", class: "Class 8-A", room: "Room 12", colorKey: "indigo" },
    Sat: { subject: "Mathematics", class: "Class 7-C", room: "Room 3",  colorKey: "sky"    },
  },
  p3: {
    Mon: { subject: "Mathematics", class: "Class 7-C", room: "Room 3",  colorKey: "sky"   },
    Tue: { subject: "Free Period", class: "Staff Room", room: "—",      colorKey: "slate", isFree: true },
    Wed: { subject: "Mathematics", class: "Class 9-B", room: "Room 7",  colorKey: "violet" },
    Thu: { subject: "Mathematics", class: "Class 8-B", room: "Room 11", colorKey: "emerald" },
    Fri: { subject: "Free Period", class: "Staff Room", room: "—",      colorKey: "slate", isFree: true },
    Sat: { subject: "Mathematics", class: "Class 8-B", room: "Room 11", colorKey: "emerald" },
  },
  p4: {
    Mon: { subject: "Mathematics", class: "Class 8-B", room: "Room 11", colorKey: "emerald" },
    Tue: { subject: "Mathematics", class: "Class 7-C", room: "Room 3",  colorKey: "sky"    },
    Wed: { subject: "Mathematics", class: "Class 8-A", room: "Room 12", colorKey: "indigo" },
    Thu: { subject: "Free Period", class: "Staff Room", room: "—",      colorKey: "slate", isFree: true },
    Fri: { subject: "Mathematics", class: "Class 8-B", room: "Room 11", colorKey: "emerald" },
    Sat: null,
  },
  p5: {
    Mon: { subject: "Free Period", class: "Staff Room", room: "—",      colorKey: "slate", isFree: true },
    Tue: { subject: "Mathematics", class: "Class 9-B", room: "Room 7",  colorKey: "violet"  },
    Wed: { subject: "Mathematics", class: "Class 8-B", room: "Room 11", colorKey: "emerald" },
    Thu: { subject: "Mathematics", class: "Class 8-A", room: "Room 12", colorKey: "indigo"  },
    Fri: { subject: "Mathematics", class: "Class 7-C", room: "Room 3",  colorKey: "sky"     },
    Sat: { subject: "Mathematics", class: "Class 9-B", room: "Room 7",  colorKey: "violet"  },
  },
  p6: {
    Mon: { subject: "Mathematics", class: "Class 8-A", room: "Room 12", colorKey: "indigo" },
    Tue: { subject: "Mathematics", class: "Class 8-A", room: "Room 12", colorKey: "indigo" },
    Wed: { subject: "Mathematics", class: "Class 9-B", room: "Room 7",  colorKey: "violet" },
    Thu: { subject: "Mathematics", class: "Class 7-C", room: "Room 3",  colorKey: "sky"    },
    Fri: null,
    Sat: null,
  },
  p7: {
    Mon: { subject: "Mathematics", class: "Class 9-B", room: "Room 7",  colorKey: "violet"  },
    Tue: null,
    Wed: { subject: "Free Period", class: "Staff Room", room: "—",      colorKey: "slate", isFree: true },
    Thu: { subject: "Mathematics", class: "Class 8-B", room: "Room 11", colorKey: "emerald" },
    Fri: { subject: "Mathematics", class: "Class 8-A", room: "Room 12", colorKey: "indigo"  },
    Sat: null,
  },
  p8: {
    Mon: null,
    Tue: { subject: "Mathematics", class: "Class 7-C", room: "Room 3",  colorKey: "sky"    },
    Wed: { subject: "Mathematics", class: "Class 8-A", room: "Room 12", colorKey: "indigo" },
    Thu: null,
    Fri: { subject: "Free Period", class: "Staff Room", room: "—",      colorKey: "slate", isFree: true },
    Sat: { subject: "Mathematics", class: "Class 8-A", room: "Room 12", colorKey: "indigo" },
  },
};

export const MOCK_UPCOMING_EXAMS: UpcomingExam[] = [
  { id: "e1", exam: "Unit Test – I",    subject: "Mathematics", class: "Class 8-A", date: "2025-08-12", time: "10:00 AM", venue: "Exam Hall A", hallTicketUrl: "#" },
  { id: "e2", exam: "Unit Test – I",    subject: "Mathematics", class: "Class 9-B", date: "2025-08-13", time: "10:00 AM", venue: "Exam Hall B", hallTicketUrl: "#" },
  { id: "e3", exam: "Half Yearly Exam", subject: "Mathematics", class: "Class 7-C", date: "2025-09-20", time: "9:00 AM",  venue: "Main Hall",   hallTicketUrl: "#" },
  { id: "e4", exam: "Half Yearly Exam", subject: "Mathematics", class: "Class 8-B", date: "2025-09-21", time: "9:00 AM",  venue: "Main Hall",   hallTicketUrl: "#" },
];

// ── Period time ranges for "current period" detection ─────────────────────

const PERIOD_RANGES: { id: string; start: number; end: number }[] = [
  { id: "p1", start: 8 * 60,        end: 8 * 60 + 45  },
  { id: "p2", start: 8 * 60 + 45,   end: 9 * 60 + 30  },
  { id: "p3", start: 9 * 60 + 45,   end: 10 * 60 + 30 },
  { id: "p4", start: 10 * 60 + 30,  end: 11 * 60 + 15 },
  { id: "p5", start: 11 * 60 + 30,  end: 12 * 60 + 15 },
  { id: "p6", start: 12 * 60 + 15,  end: 13 * 60       },
  { id: "p7", start: 14 * 60,        end: 14 * 60 + 45 },
  { id: "p8", start: 14 * 60 + 45,  end: 15 * 60 + 30 },
];

// ── Helpers ───────────────────────────────────────────────────────────────

export const getTodayDayName = (): DayName | null => {
  const dow = new Date().getDay(); // 0=Sun
  if (dow === 0) return null;
  return DAYS[dow - 1];
};

export const getCurrentPeriodId = (): string | null => {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  return PERIOD_RANGES.find(r => mins >= r.start && mins < r.end)?.id ?? null;
};

export const getWeekRangeLabel = (offset: number): string => {
  if (offset === 0)  return "This week";
  if (offset === -1) return "Last week";
  if (offset === 1)  return "Next week";
  const now = new Date();
  const dow = now.getDay();
  const mon = new Date(now);
  mon.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1) + offset * 7);
  const sat = new Date(mon);
  sat.setDate(mon.getDate() + 5);
  const fmt = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return `${fmt(mon)} – ${fmt(sat)}`;
};

export const getWeekDatesSubLabel = (offset: number): string => {
  const now = new Date();
  const dow = now.getDay();
  const mon = new Date(now);
  mon.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1) + offset * 7);
  const sat = new Date(mon);
  sat.setDate(mon.getDate() + 5);
  const fmt = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return `${fmt(mon)} – ${fmt(sat)}`;
};

export const formatExamDate = (iso: string): string => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export const computeSummary = (grid: WeeklyGrid, days: readonly string[]): TimetableSummary => {
  let totalPeriods = 0;
  let freePeriods = 0;
  const classSet = new Set<string>();

  for (const pId of Object.keys(grid)) {
    for (const day of days) {
      const cell = grid[pId][day];
      if (cell) {
        totalPeriods++;
        if (cell.isFree) freePeriods++;
        else classSet.add(cell.class);
      }
    }
  }
  const teachingPeriods = totalPeriods - freePeriods;
  return {
    totalPeriods,
    teachingHours: parseFloat((teachingPeriods * 0.75).toFixed(1)),
    freePeriods,
    classesTaught: classSet.size,
  };
};

// ── Hook ──────────────────────────────────────────────────────────────────

export const useTimetable = () => {
  const [weekOffset, setWeekOffset] = useState(0);

  // Replace with useQuery in production
  const grid      = MOCK_GRID;
  const periods   = MOCK_PERIODS;
  const exams     = MOCK_UPCOMING_EXAMS;

  const summary = useMemo(() => computeSummary(grid, DAYS), [grid]);

  const todayName      = weekOffset === 0 ? getTodayDayName() : null;
  const currentPeriodId = weekOffset === 0 ? getCurrentPeriodId() : null;

  const weekLabel     = getWeekRangeLabel(weekOffset);
  const weekSubLabel  = getWeekDatesSubLabel(weekOffset);

  return {
    weekOffset,
    setWeekOffset,
    grid,
    periods,
    exams,
    summary,
    todayName,
    currentPeriodId,
    weekLabel,
    weekSubLabel,
  };
};
