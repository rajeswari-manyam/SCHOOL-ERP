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
  class_id?: string;
  subject_id?: string;
  section_id?: string;
  examnameid?: string;
  teacher_id?: string;
  academicYearId?: string;
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

// ─── GET /tenant/getallexams-timetable?school_code=... ────────────────────────
export interface GetAllExamsTimetableRawItem {
  exam_id?: string;
  id?: string;
  _id?: string;
  class_id?: string;
  subject_id?: string;
  section_id?: string;
  examnameid?: string;
  teacher_id?: string;
  academicYearId?: string;
  subject_name?: string;
  subjectname?: string;
  subject?: string;
  subjectName?: string;
  class_name?: string;
  classname?: string;
  className?: string;
  section_name?: string;
  sectionname?: string;
  exam_date?: string;
  date?: string;
  start_time?: string;
  startTime?: string;
  end_time?: string;
  endTime?: string;
  room_no?: string;
  room?: string;
  venue?: string;
  notify_status?: string;
  notifyStatus?: string;
}

export interface GetAllExamsTimetableResponse {
  status?: boolean;
  message?: string;
  data?: GetAllExamsTimetableRawItem[] | { entries?: GetAllExamsTimetableRawItem[]; exams?: GetAllExamsTimetableRawItem[] };
  entries?: GetAllExamsTimetableRawItem[];
  exams?: GetAllExamsTimetableRawItem[];
  result?: GetAllExamsTimetableRawItem[];
}

// ─── Create Exam Timetable (POST /tenant/createexams-timetable) ──────────────
export interface CreateExamTimetablePayload {
  class_id: string;
  subject_id: string;
  section_id: string;
  examnameid: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  room_no: string;
  academicYearId: string;
  teacher_id: string;
}

export interface CreateExamTimetableResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    class_id: string;
    subject_id: string;
    section_id: string;
    examnameid: string;
    exam_date: string;
    start_time: string;
    end_time: string;
    room_no: string;
    academicYearId: string;
    teacher_id: string;
  };
}

// ─── GET /tenant/getalltimetable?className=...&sectionName=...&academic_year=... ─
export interface GetAllTimetableRawItem {
  // Response fields from actual API
  id?: string;
  period_no?: number | string;
  day_of_week?: string;
  room_no?: string;
  class?: {
    id: string;
    class_name: string;
  };
  section?: {
    id: string;
    sectionName: string;
  };
  subject?: {
    id: string;
    subject_name: string;
  };
  teacher?: {
    id: string;
    name: string;
  };
  
  // Legacy flat fields (for backward compatibility)
  className?: string;
  sectionName?: string;
  subjectname?: string;
  teacher_id?: string;
  teachername?: string;
  time_sloat?: string;
  start_time?: string;
  end_time?: string;
  lunch_start?: string;
  lunch_end?: string;
  academic_year?: string;
  school_code?: string;
  _id?: string;
}

export interface GetAllTimetableResponse {
  status?: boolean;
  message?: string;
  data?: GetAllTimetableRawItem[] | GetAllTimetableRawItem;
  timetables?: GetAllTimetableRawItem[];
  result?: GetAllTimetableRawItem[];
  entries?: GetAllTimetableRawItem[];
}

// ─── Create Timetable Period (POST /tenant/createtimetable) ────────────────────
export interface CreateTimetablePayload {
  // IDs (from API-driven dropdowns)
  class_id: string;
  section_id: string;
  subject_id: string;
  // Display names (kept for backward compat / timetable grid display)
  className: string;
  sectionName: string;
  subjectname: string;
  teacher_id: string;
  teachername: string;
  period_no: string;
  time_sloat: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  room_no: string;
  lunch_start: string;
  lunch_end: string;
  break_start: string;
  break_end: string;
  academic_year: string;
  school_code: string;
}

export interface CreateTimetableResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    className: string;
    sectionName: string;
    subjectname: string;
    teachername: string;
    period_no: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    room_no: string;
  };
}