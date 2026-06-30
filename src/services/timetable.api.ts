/**
 * src/services/timetable.api.ts
 */

import api from "@/config/axios";
import { getAllExamTimetables, getExamTimetableByTeacherId } from "./examtimetable.api";

export interface TimetableSlot {
  id: string;
  class_id: string;
  section_id: string;
  subject_id: string;
  teacher_id: string;
  period_no: number;
  time_sloat: string;
  day_of_week: string;
  room_no: string;
  academicYearId: string;
  break_start: string;
  break_end: string;
  lunch_start: string;
  lunch_end: string;
  start_time: string;
  end_time: string;
  subjectname: string;
  teachername: string;
  createdAt: string;
  updatedAt: string;
  /** Nested objects returned by the API when populated */
  class?: { id: string; class_name: string };
  section?: { id: string; sectionName: string };
  subject?: { id: string; subject_name: string };
  teacher?: { id: string; name: string };
}

export interface TimetablePayload {
  class_id: string;
  section_id: string;
  subject_id: string;
  teacher_id: string;
  period_no: number;
  time_sloat: string;
  day_of_week: string;
  room_no: string;
  academicYearId: string;
  break_start: string;
  break_end: string;
  lunch_start: string;
  lunch_end: string;
  schoolWorkingDayId?: string;
}

export type CreateTimetablePayload = TimetablePayload;

export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";
export type ExamNotifyStatus = "SENT" | "PENDING" | "FAILED";

export interface ExamEntry {
  id: string;
  subject: string;
  className: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  notifyStatus: ExamNotifyStatus;
}

export interface EditPeriodPayload {
  classId: string;
  day: DayOfWeek;
  periodNo: number;
  subject: string;
  teacherName: string;
  room: string;
  applyToAllWeeks: boolean;
}

export interface CreateExamTimetablePayload {
  subjectname: string;
  classname: string;
  sectionname: string;
  exam_name: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  room_no: string;
  academic_year: string;
  school_code: string;
}

export interface GetAllTimetableResponse {
  status: boolean;
  count: number;
  data: TimetableSlot[];
}

export interface GetTimetableByIdResponse {
  status: boolean;
  data: TimetableSlot;
}

export interface CreateUpdateTimetableResponse {
  status: boolean;
  message: string;
  data: TimetableSlot;
}

export interface DeleteTimetableResponse {
  status: boolean;
  message: string;
}

export interface ExamTimetableSlot {
  id: string;
  subjectname: string;
  classname: string;
  sectionname: string;
  exam_name: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  room_no: string;
  academic_year: string;
  school_code: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllExamTimetableResponse {
  status: boolean;
  count: number;
  data: ExamTimetableSlot[];
}

/* =========================
   API FUNCTIONS
========================= */

// ─── Bulk Create Timetable ──────────────────────────────────────────────────────
export interface BulkCreateTimetablePayload {
  timetables: TimetablePayload[];
}

export interface BulkCreateTimetableResponse {
  status: boolean;
  message: string;
  inserted: number;
  failed: number;
  skipped: number;
  errors: Array<{ row: number; day: string; message: string }>;
  data: TimetableSlot[];
}

export const bulkCreateTimetable = async (
  payload: BulkCreateTimetablePayload,
): Promise<BulkCreateTimetableResponse> => {
  const { data } = await api.post<BulkCreateTimetableResponse>(
    "/tenant/timetable/bulk",
    payload,
  );
  return data;
};

// POST /tenant/createtimetable
export const createTimetable = async (
  payload: TimetablePayload,
): Promise<CreateUpdateTimetableResponse> => {
  const { data } = await api.post<CreateUpdateTimetableResponse>(
    "/tenant/createtimetable",
    payload,
  );
  return data;
};

// GET /tenant/getalltimetable?class_id=<UUID>&section_id=<UUID>
export const getAllTimetable = async (
  class_id: string,
  section_id: string,
  teacher_id?: string,
): Promise<GetAllTimetableResponse> => {
  const params: Record<string, string> = { class_id, section_id };
  if (teacher_id) params.teacher_id = teacher_id;
  const { data } = await api.get<GetAllTimetableResponse>("/tenant/getalltimetable", { params });
  return data;
};

// GET /tenant/gettimetableById/:id
export const getTimetableById = async (
  id: string,
): Promise<GetTimetableByIdResponse> => {
  const { data } = await api.get<GetTimetableByIdResponse>(
    `/tenant/gettimetableById/${id}`,
  );
  return data;
};

// PUT /tenant/updatetimetableById/:id
export const updateTimetableById = async (
  id: string,
  payload: TimetablePayload,
): Promise<CreateUpdateTimetableResponse> => {
  const { data } = await api.put<CreateUpdateTimetableResponse>(
    `/tenant/updatetimetableById/${id}`,
    payload,
  );
  return data;
};

// DELETE /tenant/deletetimetableById/:id
export const deleteTimetableById = async (
  id: string,
): Promise<DeleteTimetableResponse> => {
  const { data } = await api.delete<DeleteTimetableResponse>(
    `/tenant/deletetimetableById/${id}`,
  );
  return data;
};

/* =========================
   TEACHER TIMETABLE
========================= */

const API_DAY_TO_GRID: Record<string, string> = {
  monday: "Mon", tuesday: "Tue", wednesday: "Wed",
  thursday: "Thu", friday: "Fri", saturday: "Sat",
  mon: "Mon", tue: "Tue", wed: "Wed",
  thu: "Thu", fri: "Fri", sat: "Sat",
};

const CLASS_COLORS = [
  "indigo", "violet", "sky", "emerald", "amber", "rose", "slate",
] as const;

const classColorMap = new Map<string, string>();

const getColorForClass = (className: string): string => {
  if (!classColorMap.has(className)) {
    classColorMap.set(className, CLASS_COLORS[classColorMap.size % CLASS_COLORS.length]);
  }
  return classColorMap.get(className)!;
};

export interface TeacherTimetableQuery {
  teacher_id: string;
  academic_year: string;
}

export const getTeacherTimetable = async (params: TeacherTimetableQuery) => {
  const { data: res } = await api.get<GetAllTimetableResponse>(
    "/tenant/getalltimetable",
    { params: { teacher_id: params.teacher_id } },
  );

  const rawSlots: TimetableSlot[] = Array.isArray(res.data) ? res.data : [];

  // Gather unique period numbers and build slots
  const periodMap = new Map<
    number,
    {
      id: string;
      label: string;
      time: string;
      cells: Record<string, TimetableCell>;
    }
  >();
  let className = "";
  let sectionName = "";
  let classTeacher = "";
  let academicYear = "";
  let breakStart = "";
  let breakEnd = "";
  let lunchStart = "";
  let lunchEnd = "";

  for (const slot of rawSlots) {
    const pno = slot.period_no;
    if (!periodMap.has(pno)) {
      periodMap.set(pno, {
        id: `p${pno}`,
        label: `P${pno}`,
        time: slot.time_sloat ?? "",
        cells: {},
      });
    }

    if (slot.class?.class_name) className = slot.class.class_name;
    if (slot.section?.sectionName) sectionName = slot.section.sectionName;
    if (slot.teacher?.name) classTeacher = slot.teacher.name;
    if (slot.academicYearId) academicYear = slot.academicYearId;
    if (slot.break_start) breakStart = slot.break_start;
    if (slot.break_end) breakEnd = slot.break_end;
    if (slot.lunch_start) lunchStart = slot.lunch_start;
    if (slot.lunch_end) lunchEnd = slot.lunch_end;

    const gridDay = API_DAY_TO_GRID[slot.day_of_week?.toLowerCase()];
    if (!gridDay) continue;

    const subject = slot.subject?.subject_name ?? slot.subjectname ?? "";
    const cellClass = slot.class?.class_name ?? "";
    const room = slot.room_no ?? "";
    const teacherName = slot.teacher?.name ?? slot.teachername ?? "";

    periodMap.get(pno)!.cells[gridDay] = {
      subject,
      class: cellClass,
      room,
      teacherName,
      colorKey: getColorForClass(cellClass) as ClassColorKey,
    };
  }

  // Parse time string to minutes for ordering
  const parseTimeToMins = (t: string): number | null => {
    const m = t.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?/i);
    if (!m) return null;
    let h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    if (m[4]?.toUpperCase() === "PM" && h !== 12) h += 12;
    if (m[4]?.toUpperCase() === "AM" && h === 12) h = 0;
    return h * 60 + min;
  };

  // Build periods array in order
  const sortedPnos = [...periodMap.keys()].sort((a, b) => a - b);
  const periods: TimetablePeriod[] = sortedPnos.map((pno) => {
    const entry = periodMap.get(pno)!;
    return { id: entry.id, label: entry.label, time: entry.time, kind: "PERIOD" as const };
  });

  // Insert BREAK / LUNCH at the correct time position
  const insertBreakOrLunch = (start: string, end: string, id: string, label: string, kind: "BREAK" | "LUNCH") => {
    const breakMins = parseTimeToMins(start);
    if (breakMins === null) { periods.push({ id, label, time: `${start.slice(0, 5)}–${end.slice(0, 5)}`, kind }); return; }

    const timeStr = `${start.slice(0, 5)}–${end.slice(0, 5)}`;
    let insertIdx = periods.length;
    for (let i = 0; i < periods.length; i++) {
      const p = periods[i];
      if (p.kind !== "PERIOD") continue;
      const parts = p.time.split(/\s*[–-]\s*/);
      const endTime = parts.length > 1 ? parts[parts.length - 1] : "";
      const endMins = parseTimeToMins(endTime);
      if (endMins !== null && endMins >= breakMins) {
        insertIdx = endMins === breakMins ? i + 1 : i;
        break;
      }
    }
    periods.splice(insertIdx, 0, { id, label, time: timeStr, kind });
  };

  if (breakStart && breakEnd) {
    insertBreakOrLunch(breakStart, breakEnd, "break", "Break", "BREAK");
  }
  if (lunchStart && lunchEnd) {
    insertBreakOrLunch(lunchStart, lunchEnd, "lunch", "Lunch", "LUNCH");
  }

  // Build grid: Record<periodId, Record<dayName, TimetableCell | null>>
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const grid: Record<string, Record<string, TimetableCell | null>> = {};
  for (const pno of sortedPnos) {
    const entry = periodMap.get(pno)!;
    const dayMap: Record<string, TimetableCell | null> = {};
    for (const d of days) {
      dayMap[d] = entry.cells[d] ?? null;
    }
    grid[entry.id] = dayMap;
  }

  return {
    grid,
    periods,
    exams: [],
    // summary intentionally omitted — useTimetable fetches it via getTeacherStats
    classLabel: className ? `Class ${className}` : "",
    section: sectionName,
    classTeacher,
    academicYear,
    currentPeriodLabel: null,
  };
};

// ─── Helpers for the teacher timetable (types shared with the feature) ─────────

export interface TimetableCell {
  subject: string;
  class: string;
  room: string;
  colorKey: string;
  isFree?: boolean;
  teacherName?: string;
}

export interface TimetablePeriod {
  id: string;
  label: string;
  time: string;
  kind: "PERIOD" | "BREAK" | "LUNCH" | "FREE";
}

export interface TimetableSummary {
  totalPeriods: number;
  teachingHours: number;
  freePeriods: number;
  classesTaught: number;
}

type ClassColorKey = "indigo" | "violet" | "sky" | "emerald" | "amber" | "rose" | "slate";

export interface UpcomingExam {
  id: string;
  exam: string;
  subject: string;
  class: string;
  date: string;
  time: string;
  venue: string;
  hallTicketUrl?: string;
}

const fmtTime = (t: string) => {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hh = parseInt(h, 10);
  return `${hh % 12 || 12}:${m} ${hh >= 12 ? "PM" : "AM"}`;
};

export const getExamsTimetable = async (params: { teacher_id: string; academic_year?: string }): Promise<UpcomingExam[]> => {
  try {
    const res = await getExamTimetableByTeacherId(params.teacher_id);
    if (res?.status && Array.isArray(res.data)) {
      return res.data.map((item) => ({
        id: item.id,
        exam: item.exam?.name ?? item.examnameid ?? "",
        subject: item.subject?.name ?? item.subject_id ?? "",
        class: [item.class?.name, item.section?.name].filter(Boolean).join(" "),
        date: item.exam_date ?? "",
        time: `${fmtTime(item.start_time ?? "")} – ${fmtTime(item.end_time ?? "")}`,
        venue: item.room_no ?? "",
      }));
    }
  } catch {
    // fallback to generic endpoint
  }

  try {
    const list = await getAllExamTimetables({ academicYearId: params.academic_year });
    return (list ?? []).map((item) => ({
      id: item.id,
      exam: item.exam?.exam_name ?? "",
      subject: item.subject?.subject_name ?? "",
      class: item.class?.class_name ?? "",
      date: item.exam_date ?? "",
      time: `${fmtTime(item.start_time ?? "")} – ${fmtTime(item.end_time ?? "")}`,
      venue: item.room_no ?? "",
    }));
  } catch {
    return [];
  }
};

/* =========================
   REMAINING PERIODS ENDPOINT
========================= */

export interface RemainingPeriodAssigned {
  period_no: number;
  subject_name: string;
  teacher_name: string;
  time_sloat: string;
}

export interface RemainingPeriodDaySummary {
  day_of_week: string;
  total_periods: number;
  assigned_periods: RemainingPeriodAssigned[];
  remaining_periods: number[];
  break: { start: string; end: string } | null;
  lunch: { start: string; end: string } | null;
}

export interface RemainingPeriodsResponse {
  status: boolean;
  message: string;
  class_id: string;
  section_id: string;
  week_summary: RemainingPeriodDaySummary[];
}

// GET /tenant/remaining-periods?class_id=<UUID>&section_id=<UUID>
export const getRemainingPeriods = async (
  class_id: string,
  section_id: string,
): Promise<RemainingPeriodsResponse> => {
  const { data } = await api.get<RemainingPeriodsResponse>(
    "/tenant/remaining-periods",
    { params: { class_id, section_id } },
  );
  return data;
};

/* =========================
   TEACHER STATS ENDPOINTS
========================= */

export interface TeacherFreePeriodsResponse {
  status: boolean;
  teacher_id: string;
  teacher_name: string;
  scheduled_periods: number;
  free_periods: number;
  max_periods_per_day: number;
  school_days_per_week: number;
  total_weekly_slots: number;
}

export interface TeacherTeachingHoursResponse {
  status: boolean;
  teacher_id: string;
  teacher_name: string;
  total_periods: number;
  total_teaching_hours: number;
  minutes_per_period: number;
  day_breakdown: { day: string; periods: number; hours: number }[];
}

export interface TeacherTotalPeriodsResponse {
  status: boolean;
  teacher_id: string;
  total_periods_per_week: number;
  day_breakdown: { day: string; periods: number }[];
  class_breakdown: { class: string; periods: number }[];
}

// GET /tenant/getfreeperiods?teacher_id=<UUID>
export const getTeacherFreePeriods = async (
  teacher_id: string,
): Promise<TeacherFreePeriodsResponse> => {
  const { data } = await api.get<TeacherFreePeriodsResponse>(
    "/tenant/getfreeperiods",
    { params: { teacher_id } },
  );
  return data;
};

// GET /tenant/getteachinghours?teacher_id=<UUID>
export const getTeacherTeachingHours = async (
  teacher_id: string,
): Promise<TeacherTeachingHoursResponse> => {
  const { data } = await api.get<TeacherTeachingHoursResponse>(
    "/tenant/getteachinghours",
    { params: { teacher_id } },
  );
  return data;
};

// GET /tenant/totalperiodsperweek?teacher_id=<UUID>
export const getTeacherTotalPeriods = async (
  teacher_id: string,
): Promise<TeacherTotalPeriodsResponse> => {
  const { data } = await api.get<TeacherTotalPeriodsResponse>(
    "/tenant/totalperiodsperweek",
    { params: { teacher_id } },
  );
  return data;
};

/**
 * Fires all 3 stat endpoints in parallel and returns a TimetableSummary
 * ready to feed directly into the summary cards.
 */
export const getTeacherStats = async (
  teacher_id: string,
): Promise<TimetableSummary> => {
  const [freePeriods, teachingHours, totalPeriods] = await Promise.all([
    getTeacherFreePeriods(teacher_id),
    getTeacherTeachingHours(teacher_id),
    getTeacherTotalPeriods(teacher_id),
  ]);

  return {
    totalPeriods: totalPeriods.total_periods_per_week,
    teachingHours: teachingHours.total_teaching_hours,
    freePeriods: freePeriods.free_periods,
    classesTaught: totalPeriods.class_breakdown?.length ?? 0,
  };
};

export const timetableService = {
  getTeacherTimetable,
  getExamsTimetable,
  getTeacherStats,
};