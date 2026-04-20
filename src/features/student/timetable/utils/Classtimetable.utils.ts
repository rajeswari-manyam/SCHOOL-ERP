import type { SubjectName, DayName } from "../types/Classtimetable.types";

// ─── Days ────────────────────────────────────────────────────────────────────────
export const WEEK_DAYS: DayName[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const getTodayDay = (): DayName => {
  const names: DayName[] = [
    "Sunday" as DayName,
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return names[new Date().getDay()] as DayName;
};

// ─── Subject colours (cell background) ──────────────────────────────────────────
export const SUBJECT_CELL_COLORS: Record<string, string> = {
  English:         "text-blue-600",
  Maths:           "text-green-600",
  Physics:         "text-sky-600",
  Chemistry:       "text-purple-600",
  Biology:         "text-emerald-600",
  "Social Studies":"text-yellow-600",
  Hindi:           "text-red-500",
  FREE:            "text-gray-400",
};

export const SUBJECT_BG_COLORS: Record<string, string> = {
  English:         "bg-blue-50",
  Maths:           "bg-green-50",
  Physics:         "bg-sky-50",
  Chemistry:       "bg-purple-50",
  Biology:         "bg-emerald-50",
  "Social Studies":"bg-yellow-50",
  Hindi:           "bg-pink-50",
  FREE:            "bg-gray-50",
};

export const SUBJECT_DOT_COLORS: Record<string, string> = {
  English:         "bg-blue-400",
  Maths:           "bg-green-500",
  Physics:         "bg-sky-500",
  Chemistry:       "bg-purple-400",
  Biology:         "bg-emerald-500",
  "Social Studies":"bg-yellow-500",
  Hindi:           "bg-red-500",
};

// ─── Format time display ─────────────────────────────────────────────────────────
export const formatTimeRange = (from: string, to: string): string =>
  `${from}–${to}`;

// ─── Check if a period is currently active ───────────────────────────────────────
export const isPeriodNow = (startTime: string, endTime: string): boolean => {
  const now = new Date();
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const startMins = sh * 60 + sm;
  const endMins = eh * 60 + em;
  return nowMins >= startMins && nowMins < endMins;
};