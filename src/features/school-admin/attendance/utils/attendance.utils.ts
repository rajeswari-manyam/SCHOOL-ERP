import type { AttendanceSummary } from "../types/attendance.types";

/** Format a YYYY-MM-DD string to "7 April 2025" */
export const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

/** Format date to "Mon, 7 Apr" */
export const formatShortDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
};

/** Get attendance percentage as a string */
export const getAttendancePercentage = (present: number, total: number): string => {
  if (total === 0) return "0%";
  return `${((present / total) * 100).toFixed(1)}%`;
};

/** Get the colour class for an absent-days severity */
export const getAbsentSeverityClass = (days: number): "high" | "medium" | "low" => {
  if (days >= 8) return "high";
  if (days >= 6) return "medium";
  return "low";
};

/** Check if all classes have been marked */
export const allClassesMarked = (summary: AttendanceSummary): boolean => {
  return summary.classesMarked >= summary.classesTotal;
};

/** Download a Blob as a file */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/** Get today's date as YYYY-MM-DD */
export const getTodayISO = (): string => {
  return new Date().toISOString().slice(0, 10);
};

/** Get first day of a month as YYYY-MM-DD */
export const getMonthStart = (year: number, month: number): string => {
  return `${year}-${String(month + 1).padStart(2, "0")}-01`;
};

/** Get last day of a month as YYYY-MM-DD */
export const getMonthEnd = (year: number, month: number): string => {
  const d = new Date(year, month + 1, 0);
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
