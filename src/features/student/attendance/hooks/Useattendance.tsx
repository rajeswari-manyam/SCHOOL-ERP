import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { attendanceApi } from "../api/Attendance.api";

// ─── Query key factory ──────────────────────────────────────────────────────────
export const ATTENDANCE_KEYS = {
  all: ["attendance"] as const,
  dashboard: () => [...ATTENDANCE_KEYS.all, "dashboard"] as const,
  month: (year: number, month: number) =>
    [...ATTENDANCE_KEYS.all, "month", year, month] as const,
};

// ─── Full attendance dashboard ──────────────────────────────────────────────────
export const useAttendanceDashboard = () =>
  useQuery({
    queryKey: ATTENDANCE_KEYS.dashboard(),
    queryFn: attendanceApi.getDashboard,
    staleTime: 1000 * 60 * 5,
  });

// ─── Single month attendance ────────────────────────────────────────────────────
export const useMonthAttendance = (year: number, month: number) =>
  useQuery({
    queryKey: ATTENDANCE_KEYS.month(year, month),
    queryFn: () => attendanceApi.getMonthAttendance(year, month),
    staleTime: 1000 * 60 * 10,
  });

// ─── Month navigation ───────────────────────────────────────────────────────────
export const useMonthNavigation = (initialMonth: string, initialYear: number) => {
  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const [month, setMonth] = useState(initialMonth);
  const [year, setYear]   = useState(initialYear);

  const prev = () => {
    const idx = MONTHS.indexOf(month);
    if (idx === 0) {
      setMonth(MONTHS[11]);
      setYear((y) => y - 1);
    } else {
      setMonth(MONTHS[idx - 1]);
    }
  };

  const next = () => {
    const idx = MONTHS.indexOf(month);
    if (idx === 11) {
      setMonth(MONTHS[0]);
      setYear((y) => y + 1);
    } else {
      setMonth(MONTHS[idx + 1]);
    }
  };

  return { month, year, prev, next, label: `${month} ${year}` };
};