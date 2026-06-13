import type { DayName } from "../types/Classtimetable.types";

export const WEEK_DAYS: DayName[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Static subject colors for well-known names
const STATIC_SUBJECT_COLORS: Record<string, string> = {
  English: "text-blue-600",
  Maths: "text-green-600",
  Mathematics: "text-green-600",
  Physics: "text-violet-600",
  Chemistry: "text-cyan-600",
  Biology: "text-amber-600",
  "Social Studies": "text-yellow-600",
  Hindi: "text-red-500",
  FREE: "text-gray-400",
};

// Rotating palette for any subject not in the static map
const FALLBACK_TEXT_COLORS = [
  "text-indigo-600",
  "text-teal-600",
  "text-pink-600",
  "text-orange-500",
  "text-lime-600",
  "text-sky-600",
  "text-fuchsia-600",
];

const dynamicColorCache = new Map<string, string>();

export const SUBJECT_CELL_COLORS: Record<string, string> = new Proxy(
  STATIC_SUBJECT_COLORS,
  {
    get(target, key: string) {
      if (key in target) return target[key];
      if (!dynamicColorCache.has(key)) {
        const idx = dynamicColorCache.size % FALLBACK_TEXT_COLORS.length;
        dynamicColorCache.set(key, FALLBACK_TEXT_COLORS[idx]);
      }
      return dynamicColorCache.get(key)!;
    },
  }
);

const STATIC_SUBJECT_BG: Record<string, string> = {
  English: "bg-blue-50",
  Maths: "bg-green-50",
  Mathematics: "bg-green-50",
  Physics: "bg-violet-50",
  Chemistry: "bg-cyan-50",
  Biology: "bg-amber-50",
  "Social Studies": "bg-yellow-50",
  Hindi: "bg-red-50",
  FREE: "bg-gray-50",
};

const FALLBACK_BG_COLORS = [
  "bg-indigo-50",
  "bg-teal-50",
  "bg-pink-50",
  "bg-orange-50",
  "bg-lime-50",
  "bg-sky-50",
  "bg-fuchsia-50",
];

const dynamicBgCache = new Map<string, string>();

export const SUBJECT_BG_COLORS: Record<string, string> = new Proxy(
  STATIC_SUBJECT_BG,
  {
    get(target, key: string) {
      if (key in target) return target[key];
      if (!dynamicBgCache.has(key)) {
        const idx = dynamicBgCache.size % FALLBACK_BG_COLORS.length;
        dynamicBgCache.set(key, FALLBACK_BG_COLORS[idx]);
      }
      return dynamicBgCache.get(key)!;
    },
  }
);

export function isPeriodNow(startTime?: string, endTime?: string): boolean {
  if (!startTime || !endTime) return false;

  const toMinutes = (t: string) => {
    const parts = t.split(":");
    if (parts.length < 2) return NaN;
    const [h, m] = parts.map(Number);
    return h * 60 + m;
  };

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);

  if (isNaN(start) || isNaN(end)) return false;

  return nowMinutes >= start && nowMinutes < end;
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
