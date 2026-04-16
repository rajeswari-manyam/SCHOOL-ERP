import type { AttendanceStatus, ExamResultStatus, Announcement } from "../types/Student dashboard.types";

// ─── Date helpers ───────────────────────────────────────────────────────────────
export const formatDisplayDate = (isoDate: string): string => {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDueDate = (isoDate: string): string => {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export const getTodayDateLabel = (): string => {
  const d = new Date();
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    weekday: "long",
  });
};

export const getTimeAgo = (isoDate: string): string => {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffH = Math.floor(diffMs / 3_600_000);
  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH} hour${diffH > 1 ? "s" : ""} ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "Yesterday";
  return `${diffD} days ago`;
};

// ─── Attendance ─────────────────────────────────────────────────────────────────
export const ATTENDANCE_COLORS: Record<AttendanceStatus, string> = {
  PRESENT: "bg-indigo-700 text-white",
  ABSENT: "bg-red-500 text-white",
  HOLIDAY: "bg-gray-100 text-gray-400",
  NONE: "bg-transparent text-gray-400",
};

export const ATTENDANCE_DOT_COLORS: Record<AttendanceStatus, string> = {
  PRESENT: "bg-indigo-700",
  ABSENT: "bg-red-500",
  HOLIDAY: "bg-gray-200",
  NONE: "",
};

// ─── Exam result ────────────────────────────────────────────────────────────────
export const RESULT_STATUS_STYLES: Record<ExamResultStatus, string> = {
  PASS: "bg-green-100 text-green-700",
  FAIL: "bg-red-100 text-red-700",
  DISTINCTION: "bg-purple-100 text-purple-700",
};

export const getScorePercentage = (obtained: number, total: number): number =>
  Math.round((obtained / total) * 100);

// ─── Announcement icons ─────────────────────────────────────────────────────────
export const ANNOUNCEMENT_ICON_CONFIG: Record<
  Announcement["iconType"],
  { bg: string; emoji: string }
> = {
  sports: { bg: "bg-orange-100", emoji: "🏅" },
  holiday: { bg: "bg-blue-100", emoji: "📅" },
  general: { bg: "bg-gray-100", emoji: "📢" },
  academic: { bg: "bg-green-100", emoji: "📚" },
};

// ─── Schedule ───────────────────────────────────────────────────────────────────
/** Build the 7-column header labels for the attendance calendar */
export const WEEK_DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

/** Returns the number of leading blank cells before the 1st of a month */
export const getMonthStartOffset = (year: number, month: number): number =>
  new Date(year, month - 1, 1).getDay();