export type ClassColorKey = "indigo" | "violet" | "sky" | "emerald" | "amber" | "rose" | "slate";

export interface TimetableCell {
  subject: string;
  class: string;
  room: string;
  colorKey: ClassColorKey;
  isFree?: boolean;
}

export interface TimetablePeriod {
  id: string;
  label: string;   // "P1"
  time: string;    // "8:00 – 8:45"
}

// [periodId][dayName] → cell or null
export type WeeklyGrid = Record<string, Record<string, TimetableCell | null>>;

export interface TimetableSummary {
  totalPeriods: number;
  teachingHours: number;
  freePeriods: number;
  classesTaught: number;
}

export interface UpcomingExam {
  id: string;
  exam: string;
  subject: string;
  class: string;
  date: string;       // ISO "YYYY-MM-DD"
  time: string;
  venue: string;
  hallTicketUrl?: string;
}
