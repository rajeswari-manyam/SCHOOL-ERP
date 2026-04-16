// ─── Subject ────────────────────────────────────────────────────────────────────
export type SubjectName =
  | "English"
  | "Maths"
  | "Physics"
  | "Chemistry"
  | "Biology"
  | "Social Studies"
  | "Hindi"
  | "FREE";

// ─── Timetable Cell ─────────────────────────────────────────────────────────────
export interface TimetableCell {
  subject: SubjectName | string;
  teacher?: string;
  note?: string;         // e.g. "Library", "Common Room"
  isActive?: boolean;    // currently ongoing
}

export type DayName = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

// ─── Period Row ─────────────────────────────────────────────────────────────────
export interface PeriodRow {
  kind: "period";
  periodNumber: number;  // 1, 2, 3, 4 …
  startTime: string;     // "08:30"
  endTime: string;       // "09:20"
  days: Record<DayName, TimetableCell>;
}

export interface BreakRow {
  kind: "break";
  label: string;         // "SHORT BREAK" | "LUNCH BREAK"
  startTime: string;
  endTime: string;
}

export type TimetableRow = PeriodRow | BreakRow;

// ─── Full Timetable ─────────────────────────────────────────────────────────────
export interface ClassTimetable {
  className: string;     // "Class 10A"
  academicYear: string;  // "2024-25"
  todayDay: DayName;
  rows: TimetableRow[];
  subjects: SubjectLegendItem[];
}

export interface SubjectLegendItem {
  name: SubjectName | string;
  color: string;         // tailwind bg class e.g. "bg-blue-100"
  dotColor: string;      // tailwind text/bg dot color
}

// ─── Examination ─────────────────────────────────────────────────────────────────
export interface ExamEntry {
  id: string;
  subject: string;
  date: string;          // "Oct 14, 2024"
  day: string;           // "Monday"
  timeFrom: string;      // "09:00"
  timeTo: string;        // "11:30 AM"
  venue: string;
}

export interface UpcomingExaminations {
  title: string;         // "Unit Test 1"
  exams: ExamEntry[];
}