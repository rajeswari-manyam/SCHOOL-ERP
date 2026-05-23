import type {
  AbsentDay,
  TrendDataPoint,
  AttendanceRecord,
  AbsentMeta,
} from "../types/attendance.types";

// ─── Absent list (by month) ───────────────────────────────
export const ABSENT_BY_MONTH: Record<string, AbsentDay[]> = {
  "2025-04": [
    { day: 5, label: "April 5, 2025 (Saturday)", time: "9:12 AM" },
    { day: 6, label: "April 6, 2025 (Sunday)", time: "8:52 AM" },
  ],
  "2025-03": [
    { day: 3, label: "March 3, 2025 (Monday)", time: "8:47 AM" },
    { day: 17, label: "March 17, 2025 (Monday)", time: "9:05 AM" },
  ],
  "2025-05": [
    { day: 8, label: "May 8, 2025 (Thursday)", time: "8:55 AM" },
  ],
}

// ─── Trend chart data ─────────────────────────────────────
export const TREND_DATA: TrendDataPoint[] = [
  { month: "Nov", attendance: 96 },
  { month: "Dec", attendance: 92 },
  { month: "Jan", attendance: 97 },
  { month: "Feb", attendance: 89 },
  { month: "Mar", attendance: 94 },
  { month: "Apr", attendance: 88 },
]

// ─── Calendar present / absent days ──────────────────────
export const ATTENDANCE_DATA: Record<string, AttendanceRecord> = {
  "2025-04": {
    absent: [5, 6],
    present: [1, 2, 3, 4, 7, 8, 9],
  },
}

// ─── Absent modal detail (day-level meta) ─────────────────
export const ABSENT_META: Record<string, Record<number, AbsentMeta>> = {
  "2025-04": {
    5: { label: "April 5, 2025 (Saturday)", time: "9:12 AM" },
    6: { label: "April 6, 2025 (Sunday)", time: "8:52 AM" },
  },
}