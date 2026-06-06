export type ClassColorKey = "indigo" | "violet" | "sky" | "emerald" | "amber" | "rose" | "slate";

export interface TimetableCell {
  subject: string;
  class: string;
  room: string;
  colorKey: ClassColorKey;
  isFree?: boolean;
}

export type TimetableSlotKind = "PERIOD" | "BREAK" | "LUNCH" | "FREE";

export interface TimetablePeriod {
  id: string;
  label: string;
  time: string;
  kind: TimetableSlotKind;
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

// ─── API response types for /tenant/getalltimetable ──────────────────────────

export interface TeacherTimetableQuery {
  teacher_id: string;
  academic_year: string;
  className?: string;
  sectionName?: string;
}

// ─── API response types for /tenant/getallexams-timetable ────────────────────

export interface ExamsTimetableQuery {
  teacher_id: string;
  academic_year?: string;
}

export interface ApiExamTimetableRawEntry {
  id?: string;
  _id?: string;
  examId?: string;
  exam_id?: string;
  subject?: string;
  subjectName?: string;
  subject_name?: string;
  className?: string;
  class?: string;
  class_name?: string;
  date?: string;
  examDate?: string;
  exam_date?: string;
  startTime?: string;
  start_time?: string;
  endTime?: string;
  end_time?: string;
  venue?: string;
  room?: string;
  room_number?: string;
  examName?: string;
  exam?: string;
  exam_title?: string;
  exam_name?: string;
  title?: string;
  name?: string;
  hallTicketUrl?: string;
  hall_ticket_url?: string;
  hallTicket?: string;
  status?: string;
}

export type ApiDayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";

export interface ApiPeriodCell {
  subject: string;
  teacherName: string;
  room?: string;
  isConflict?: boolean;
}

export interface ApiTimetableSlot {
  kind: "PERIOD" | "BREAK" | "LUNCH" | "FREE";
  periodNo?: number;
  startTime: string;
  endTime: string;
  label?: string;
  cells?: Partial<Record<ApiDayOfWeek, ApiPeriodCell>>;
}

interface ApiClassTimetable {
  classId: string;
  classLabel: string;
  section: string;
  classTeacher: string;
  academicYear: string;
  currentPeriodLabel?: string;
  slots: ApiTimetableSlot[];
}

interface ApiExamEntry {
  id: string;
  subject: string;
  className: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
}

interface ApiExamTimetable {
  title: string;
  subtitle: string;
  entries: ApiExamEntry[];
}

interface ApiTimetablePageData {
  classTabs: { id: string; label: string }[];
  selectedClassId: string;
  classTimetable: ApiClassTimetable;
  examTimetable: ApiExamTimetable;
}

export interface ApiTimetableResponse {
  status?: boolean;
  message?: string;
  data?: ApiTimetablePageData;
  classTimetable?: ApiClassTimetable;
  examTimetable?: ApiExamTimetable;
}

// ─── Hook return type ────────────────────────────────────────────────────────

export interface TeacherTimetableData {
  grid: WeeklyGrid;
  periods: TimetablePeriod[];
  exams: UpcomingExam[];
  summary: TimetableSummary;
  classLabel: string;
  section: string;
  classTeacher: string;
  academicYear: string;
  currentPeriodLabel: string | null;
}

export interface TeacherTimetableState {
  weekOffset: number;
  setWeekOffset: (offset: number | ((prev: number) => number)) => void;
  data: TeacherTimetableData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  grid: WeeklyGrid;
  periods: TimetablePeriod[];
  exams: UpcomingExam[];
  isExamsLoading: boolean;
  isExamsError: boolean;
  summary: TimetableSummary;
  classLabel: string;
  section: string;
  classTeacher: string;
  academicYear: string;
  currentPeriodLabel: string | null;
  todayName: string | null;
  currentPeriodId: string | null;
  weekLabel: string;
  weekSubLabel: string;
}
