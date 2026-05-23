export type BadgeVariant = "green" | "red" | "blue" | "amber" | "purple";

export type StatType = "attendance" | "fees" | "default";

export interface StatItem {
  title: string;
  value: string;
  extra?: string;
  type?: StatType;
  badge?: {
    text: string;
    variant: BadgeVariant;
  };
  suffixLabel?: string;
  iconType: "attendance" | "percent" | "homework" | "exam";
}

export interface ScheduleItem {
  period: string;
  time: string;
  subject: string;
  teacher: string;
  isBreak?: boolean;
  breakLabel?: string;
}

export interface HomeworkItem {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  colorType: "blue" | "green" | "amber";
}

export interface AttendanceDay {
  day: number;
  status: "present" | "absent" | "holiday" | "empty";
}

export interface RecentResult {
  testName: string;
  date: string;
  score: number;
  total: number;
  passed: boolean;
  rank: number;
}

export interface Announcement {
  id: string;
  title: string;
  timeAgo: string;
  type: "info" | "alert";
}
