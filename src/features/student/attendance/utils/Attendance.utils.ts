import type { AttendanceStatus } from "../types/Attendance.types";

// ─── Calendar helpers ──────────────────────────────────────────────────────────

/** Returns the weekday index (0=Mon … 6=Sun) of the 1st of the given month */
export function getMonthStartOffset(year: number, month: number): number {
  const jsDay = new Date(year, month - 1, 1).getDay(); // 0=Sun
  return jsDay === 0 ? 6 : jsDay - 1; // convert to Mon-based
}

/** Returns total days in a month */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

// ─── Colour maps ───────────────────────────────────────────────────────────────

export const ATTENDANCE_CELL_STYLES: Record<AttendanceStatus, string> = {
  PRESENT: "bg-indigo-600 text-white",
  ABSENT:  "bg-red-500 text-white",
  HOLIDAY: "bg-gray-300 text-gray-500",
  NONE:    "text-gray-400",
};

export const ATTENDANCE_DOT_COLORS: Record<AttendanceStatus, string> = {
  PRESENT: "#4F46E5",
  ABSENT:  "#EF4444",
  HOLIDAY: "#D1D5DB",
  NONE:    "transparent",
};

// ─── Policy badge ──────────────────────────────────────────────────────────────

export const POLICY_STATUS_STYLES = {
  SAFE:    { badge: "bg-green-100 text-green-700 border-green-300", label: "SAFE" },
  AT_RISK: { badge: "bg-yellow-100 text-yellow-700 border-yellow-300", label: "AT RISK" },
  DANGER:  { badge: "bg-red-100 text-red-700 border-red-300", label: "DANGER" },
};

// ─── Formatters ────────────────────────────────────────────────────────────────

/** e.g. 91.7 → "91.7%" */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/** Convert a numeric month offset to a display label */
export function getMonthLabel(month: string, year: number): string {
  return `${month} ${year}`;
}