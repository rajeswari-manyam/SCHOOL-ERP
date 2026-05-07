import type { DayName } from "../types/Classtimetable.types";

export const WEEK_DAYS: DayName[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const SUBJECT_CELL_COLORS: Record<string, string> = {
  English: "text-blue-600",
  Maths: "text-green-600",
  Physics: "text-violet-600",
  Chemistry: "text-cyan-600",
  Biology: "text-amber-600",
  "Social Studies": "text-yellow-600",
  Hindi: "text-red-500",
  FREE: "text-gray-400",
};

export const SUBJECT_BG_COLORS: Record<string, string> = {
  English: "bg-blue-50",
  Maths: "bg-green-50",
  Physics: "bg-violet-50",
  Chemistry: "bg-cyan-50",
  Biology: "bg-amber-50",
  "Social Studies": "bg-yellow-50",
  Hindi: "bg-red-50",
  FREE: "bg-gray-50",
};

export function isPeriodNow(startTime: string, endTime: string): boolean {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  return nowMinutes >= toMinutes(startTime) && nowMinutes < toMinutes(endTime);
}

export function getTodayDay(): DayName {
  const days: (DayName | null)[] = [
    null,
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const d = new Date().getDay();
  return (days[d] as DayName) ?? "Monday";
}