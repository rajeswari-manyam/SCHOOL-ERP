export type HolidayCalendarType =
  | "school-day"
  | "national-holiday"
  | "public-holiday"
  | "school-event"
  | "weekend"
  | "none";

export interface DayData {
  day: number | null;
  type: HolidayCalendarType;
  label?: string;
  tag?: string;
  isToday?: boolean;
  isSunday?: boolean;
}

export type ActiveTab = "Today" | "History" | "Holiday Calendar";
