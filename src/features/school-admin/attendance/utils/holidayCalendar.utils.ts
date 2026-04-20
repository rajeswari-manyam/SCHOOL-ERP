import type { DayData, HolidayCalendarType } from "../types/holidayCalendar.types";

export const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const calendarData: DayData[] = [
  { day: null, type: "weekend" },
  { day: null, type: "weekend" },
  { day: 1, type: "school-day", label: "", tag: "SCHOOL DAY" },
  { day: 2, type: "none" },
  { day: 3, type: "none" },
  { day: 4, type: "none" },
  { day: 5, type: "weekend" },

  { day: 6, type: "weekend", isSunday: true },
  { day: 7, type: "none", isToday: true },
  { day: 8, type: "none" },
  { day: 9, type: "none" },
  { day: 10, type: "none" },
  { day: 11, type: "none" },
  { day: 12, type: "weekend" },

  { day: 13, type: "weekend" },
  { day: 14, type: "national-holiday", label: "Ambedkar Jayanti", tag: "NATIONAL HOLIDAY" },
  { day: 15, type: "none" },
  { day: 16, type: "none" },
  { day: 17, type: "none" },
  { day: 18, type: "public-holiday", label: "Good Friday", tag: "PUBLIC HOLIDAY" },
  { day: 19, type: "weekend" },

  { day: 20, type: "weekend" },
  { day: 21, type: "school-event", label: "School Sports Day", tag: "SCHOOL EVENT" },
  { day: 22, type: "none" },
  { day: 23, type: "none" },
  { day: 24, type: "none" },
  { day: 25, type: "none" },
  { day: 26, type: "weekend" },
];

export const cellStyles: Record<HolidayCalendarType, string> = {
  "school-day": "bg-indigo-50",
  "national-holiday": "bg-amber-50",
  "public-holiday": "bg-red-50",
  "school-event": "bg-green-50",
  weekend: "bg-slate-50",
  none: "bg-white",
};

export const numStyles: Record<HolidayCalendarType, string> = {
  "school-day": "text-gray-800",
  "national-holiday": "text-amber-500",
  "public-holiday": "text-red-500",
  "school-event": "text-green-600",
  weekend: "text-gray-400",
  none: "text-gray-700",
};

export const tagStyles: Record<HolidayCalendarType, string> = {
  "school-day": "text-indigo-600",
  "national-holiday": "text-amber-600",
  "public-holiday": "text-red-500",
  "school-event": "text-green-600",
  weekend: "text-gray-400",
  none: "",
};

export const LEGEND = [
  { color: "bg-indigo-600", label: "SCHOOL DAY" },
  { color: "bg-amber-400", label: "NATIONAL HOLIDAY" },
  { color: "bg-red-400", label: "PUBLIC HOLIDAY" },
  { color: "bg-green-500", label: "SCHOOL EVENT" },
  { color: "bg-gray-300", label: "SUNDAY/WEEKEND" },
];
