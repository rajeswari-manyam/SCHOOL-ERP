import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { timetableApi } from "../api/timetable.api";
import type {
  WeeklyGrid,
  TimetablePeriod,
  TimetableSummary,
  TeacherTimetableState,
  TeacherTimetableQuery,
  UpcomingExam,
} from "../types/timetable.types";

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
export type DayName = typeof DAYS[number];

// ── Query key factory ─────────────────────────────────────────────────────

export const TIMETABLE_KEYS = {
  all:       ["teacher", "timetable"] as const,
  timetable: (teacherId: string, academicYear: string) =>
    [...TIMETABLE_KEYS.all, teacherId, academicYear] as const,
  exams:     (teacherId: string, academicYear: string) =>
    [...TIMETABLE_KEYS.all, "exams", teacherId, academicYear] as const,
};

// ── Helpers ───────────────────────────────────────────────────────────────

export const getTodayDayName = (): DayName | null => {
  const dow = new Date().getDay();
  if (dow === 0) return null;
  return DAYS[dow - 1];
};

const parseTimeFromString = (timeStr: string): number | null => {
  const m = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (m[3] === "PM" && h !== 12) h += 12;
  if (m[3] === "AM" && h === 12) h = 0;
  return h * 60 + min;
};

export const getCurrentPeriodId = (periods: TimetablePeriod[]): string | null => {
  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();
  for (const p of periods) {
    if (p.kind !== "PERIOD") continue;
    const parts = p.time.split("–");
    if (parts.length < 2) continue;
    const startMins = parseTimeFromString(parts[0].trim());
    const endMins = parseTimeFromString(parts[1].trim());
    if (startMins === null || endMins === null) continue;
    if (currentMins >= startMins && currentMins < endMins) return p.id;
  }
  return null;
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
      const cell = grid[pId]?.[day];
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

export const useTimetable = (): TeacherTimetableState => {
  const [weekOffset, setWeekOffset] = useState(0);

  const user = useAuthStore((s) => s.user);
  const teacherId = user?.id ?? "";
  const currentYear = new Date().getFullYear();
  const academicYear = `${currentYear}`;

  // Reset week offset when teacher changes
  useEffect(() => {
    setWeekOffset(0);
  }, [teacherId]);

  const queryParams = useMemo(
    (): TeacherTimetableQuery => ({
      teacher_id: teacherId,
      academic_year: academicYear,
    }),
    [teacherId, academicYear],
  );

  const {
    data: apiData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: TIMETABLE_KEYS.timetable(teacherId, academicYear),
    queryFn: () => timetableApi.getTeacherTimetable(queryParams),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    enabled: !!teacherId,
  });

  const {
    data: examsData,
    isLoading: isExamsLoading,
    isError: isExamsError,
  } = useQuery({
    queryKey: TIMETABLE_KEYS.exams(teacherId, academicYear),
    queryFn: () => timetableApi.getExamsTimetable({ teacher_id: teacherId, academic_year: academicYear }),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    enabled: !!teacherId,
  });

  const data = apiData;

  const grid = data?.grid ?? {};
  const periods = data?.periods ?? [];
  const exams: UpcomingExam[] = examsData ?? data?.exams ?? [];

  const summary = useMemo(() => {
    if (data?.summary) return data.summary;
    return computeSummary(grid, DAYS);
  }, [data, grid]);

  const classLabel = data?.classLabel ?? "";
  const section = data?.section ?? "";
  const classTeacher = data?.classTeacher ?? "";
  const apiAcademicYear = data?.academicYear ?? academicYear;
  const currentPeriodLabel = data?.currentPeriodLabel ?? null;

  const todayName = weekOffset === 0 ? getTodayDayName() : null;
  const currentPeriodId = weekOffset === 0 ? getCurrentPeriodId(periods) : null;

  const weekLabel = getWeekRangeLabel(weekOffset);
  const weekSubLabel = getWeekDatesSubLabel(weekOffset);

  return {
    weekOffset,
    setWeekOffset,
    data,
    isLoading,
    isError,
    error,
    refetch,
    grid,
    periods,
    exams,
    isExamsLoading,
    isExamsError,
    summary,
    classLabel,
    section,
    classTeacher,
    academicYear: apiAcademicYear,
    currentPeriodLabel,
    todayName,
    currentPeriodId,
    weekLabel,
    weekSubLabel,
  };
};
