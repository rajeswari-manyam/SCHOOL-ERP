import type { ClassAttendanceRow, AbsenceSeverity, ChronicAbsentee } from "../types/attendance.types";

/** Returns attendance percentage (0–100), or null if not yet marked. */
export function calcAttendancePct(row: ClassAttendanceRow): number | null {
  if (row.present === null || row.total === 0) return null;
  return Math.round((row.present / row.total) * 100);
}

/** Tailwind text-colour class for a numeric attendance %. */
export function pctColorClass(pct: number): string {
  if (pct >= 90) return "text-emerald-600";
  if (pct >= 75) return "text-amber-500";
  return "text-red-500";
}

/** Tailwind badge classes for an AbsenceSeverity. */
export function severityBadgeClass(severity: AbsenceSeverity): string {
  switch (severity) {
    case "critical": return "bg-red-100 text-red-700";
    case "high":     return "bg-orange-100 text-orange-700";
    default:         return "bg-yellow-100 text-yellow-700";
  }
}

/** Format ISO date string to readable label. */
export function formatHolidayDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** Download a 2-D array as a CSV file. */
export function downloadCSV(filename: string, rows: string[][]): void {
  const content = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Build CSV rows from today's attendance data. */
export function buildAttendanceCSV(
  date: string,
  rows: ClassAttendanceRow[]
): string[][] {
  const header = ["Class", "Section", "Teacher", "Total Students", "Present", "Absent", "Attendance %"];
  const dataRows = rows.map((r) => [
    r.cls,
    r.section,
    r.teacherName,
    String(r.total),
    r.present !== null ? String(r.present) : "N/A",
    r.absent !== null ? String(r.absent) : "N/A",
    r.present !== null ? `${calcAttendancePct(r)}%` : "Not marked",
  ]);
  return [header, ...dataRows];
}