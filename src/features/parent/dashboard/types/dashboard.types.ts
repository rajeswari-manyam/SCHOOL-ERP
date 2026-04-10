export type Status= "success" | "warning" | "error";

export interface Stat {
  title: string;
  value: string;
  status?: Status; // ✅ important
}

export interface AttendanceData {
  date: string;
  attendance: number;
}

export interface FeeData {
  month: string;
  fees: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface Assignment {
  title: string;
  subject: string;
}

export interface Exam {
  subject: string;
  date: string;
  time: string;
}