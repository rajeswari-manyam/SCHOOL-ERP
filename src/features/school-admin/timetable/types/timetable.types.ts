// ─── Enums / Unions ─────────────────────────────────────────────────────────────
export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";

export type SlotKind = "PERIOD" | "BREAK" | "LUNCH" | "FREE";

export type ConflictSeverity = "ERROR" | "WARNING" | "INFO";

export type ExamNotifyStatus = "SENT" | "PENDING" | "FAILED";

// ─── Core Period ────────────────────────────────────────────────────────────────
export interface PeriodCell {
  subject: string;
  teacherName: string;
  room?: string;
  isConflict?: boolean;
}

export interface TimetableSlot {
  kind: SlotKind;
  periodNo?: number;        // e.g. 1 → "P1"
  startTime: string;        // "08:30"
  endTime: string;          // "09:15"
  label?: string;           // for BREAK / LUNCH rows e.g. "BREAK 10:45–11:00"
  // keyed by DayOfWeek for PERIOD rows
  cells?: Partial<Record<DayOfWeek, PeriodCell>>;
}

// ─── Class Timetable ────────────────────────────────────────────────────────────
export interface ClassTimetable {
  classId: string;          // "class-10"
  classLabel: string;       // "Class 10"
  section: string;          // "A"
  classTeacher: string;     // "Venkat R"
  academicYear: string;     // "2024-25"
  currentPeriodLabel?: string; // "CURRENT: PERIOD 4 (SOCIAL)"
  slots: TimetableSlot[];
  resourceLoad: number;     // percentage 0–100
  substitutionCount: number;
  conflicts: TimetableConflict[];
}

// ─── Conflict ───────────────────────────────────────────────────────────────────
export interface TimetableConflict {
  id: string;
  severity: ConflictSeverity;
  message: string;          // "Physics Lab conflict on Thursday"
  day?: DayOfWeek;
  periodNo?: number;
}

// ─── Edit Period Modal ───────────────────────────────────────────────────────────
export interface EditPeriodPayload {
  classId: string;
  day: DayOfWeek;
  periodNo: number;
  subject: string;
  teacherName: string;
  room: string;
  applyToAllWeeks: boolean;
}

// ─── Exam Timetable ─────────────────────────────────────────────────────────────
export interface ExamEntry {
  id: string;
  subject: string;
  className: string;        // "10A"
  date: string;             // ISO date string
  startTime: string;        // "09:00"
  endTime: string;          // "12:00"
  venue: string;            // "Room 10A"
  notifyStatus: ExamNotifyStatus;
}

export interface ExamTimetable {
  title: string;            // "Exam Timetable — April 2025"
  subtitle: string;         // "Final Assessment Schedule"
  notifyParentsEnabled: boolean;
  lastNotificationSentAt?: string; // ISO date
  notificationRecipientsCount?: number;
  entries: ExamEntry[];
}

// ─── Full page response ─────────────────────────────────────────────────────────
export interface TimetablePageResponse {
  classTabs: { id: string; label: string }[];
  selectedClassId: string;
  classTimetable: ClassTimetable;
  examTimetable: ExamTimetable;
}

// ─── Available subjects & teachers (for dropdowns) ──────────────────────────────
export interface SubjectOption {
  value: string;
  label: string;
}

export interface TeacherOption {
  value: string;
  label: string;
  conflictWarning?: string; // "Venkat R is assigned to Class 9A on Monday Period 1."
}