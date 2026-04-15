export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";

export interface Period {
  periodNumber: number;
  startTime: string; // "8:30 AM"
  endTime: string;   // "9:15 AM"
  subject: string;
  teacher: string;
  room?: string;
}

export interface TimetableCell {
  subject: string;
  teacher: string;
  room?: string;
  isFree?: boolean;
}

export interface WeeklyTimetable {
  classId: string;
  className: string;  // "10A"
  classTeacher: string;
  currentPeriod?: string; // "Period 4 (Social)"
  periods: PeriodRow[];
  breaks: BreakRow[];
  resourceLoad?: number;    // percentage
  substitutions?: number;
  overlapWarning?: string;
}

export interface PeriodRow {
  periodNumber: number;
  label: string;   // "P1"
  startTime: string;
  endTime: string;
  days: Partial<Record<DayOfWeek, TimetableCell>>;
}

export interface BreakRow {
  type: "BREAK" | "LUNCH";
  label: string;   // "BREAK (10:45–11:00)"
  afterPeriod: number;
}

export interface ExamScheduleEntry {
  id: string;
  subject: string;
  classId: string;
  className: string;
  date: string;   // "10 Apr, 2025"
  day: string;    // "Thursday"
  startTime: string;
  endTime: string;
  venue: string;
  notified: boolean;
}

export interface EditPeriodPayload {
  classId: string;
  periodNumber: number;
  day: DayOfWeek;
  subject: string;
  teacherId: string;
  room?: string;
  applyToAllWeeks: boolean;
}

export interface TimetableFilters {
  classId: string;
}

export interface TimetableConflict {
  type: "TEACHER_OVERLAP" | "ROOM_OVERLAP";
  message: string;
  teacherName?: string;
  conflictingClass?: string;
  conflictingPeriod?: number;
  conflictingDay?: DayOfWeek;
}

export interface TeacherOption {
  id: string;
  name: string;
}

export interface SubjectOption {
  id: string;
  name: string;
}

export interface AddExamPayload {
  subject: string;
  classId: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  notifyParents: boolean;
}

export interface TimetableCreateInput {
  classId: string;
  periods: PeriodCreateInput[];
  breaks: BreakCreateInput[];
}

export interface PeriodCreateInput {
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  room?: string;
}

export interface BreakCreateInput {
  type: "BREAK" | "LUNCH";
  afterPeriod: number;
}