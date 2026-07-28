export type SubjectName =
  | "English"
  | "Maths"
  | "Physics"
  | "Chemistry"
  | "Biology"
  | "Social Studies"
  | "Hindi"
  | "FREE";

export interface TimetableCell {
  subject: SubjectName | string;
  teacher?: string;
  note?: string;
  isActive?: boolean;
}

export type DayName =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export interface PeriodRow {
  kind: "period";
  periodNumber: number;
  startTime: string;
  endTime: string;
  days: Record<DayName, TimetableCell>;
}

export interface BreakRow {
  kind: "break";
  label: string;
  startTime: string;
  endTime: string;
}

export type TimetableRow = PeriodRow | BreakRow;

export interface SubjectLegendItem {
  name: SubjectName | string;
  color: string;
  dotColor: string;
}

export interface ClassTimetable {
  className: string;
  academicYear: string;
  todayDay: DayName;
  rows: TimetableRow[];
  subjects: SubjectLegendItem[];
}

export interface ExamEntry {
  id: string;
  subject: string;
  date: string;
  day: string;
  timeFrom: string;
  timeTo: string;
  venue: string;
  syllabus?: string;
}

export interface UpcomingExaminations {
  title: string;
  exams: ExamEntry[];
}