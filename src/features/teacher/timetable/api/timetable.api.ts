import api from "@/config/axios";
import type {
  TeacherTimetableQuery,
  TeacherTimetableData,
  TimetablePeriod,
  TimetableCell,
  ClassColorKey,
  UpcomingExam,
  ExamsTimetableQuery,
} from "../types/timetable.types";

const isDev = import.meta.env.DEV;

type LoggerFn = typeof console.log;

function logger(level: "log" | "warn" | "error", ...args: unknown[]) {
  if (!isDev) return;
  const fn: LoggerFn = console[level];
  fn(`[timetable-api]`, ...args);
}

function formatTime(t: string): string {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m ?? "00"} ${ampm}`;
}

function getMinutesBetween(start: string, end: string): number {
  const toMins = (s: string) => {
    const [h, m] = s.split(":");
    return parseInt(h, 10) * 60 + parseInt(m ?? "0", 10);
  };
  const diff = toMins(end) - toMins(start);
  return diff > 0 ? diff : 0;
}

const CLASS_COLORS: ClassColorKey[] = [
  "indigo", "violet", "sky", "emerald", "amber", "rose",
];

const colorIndex = new Map<string, ClassColorKey>();
let colorCursor = 0;

function getColorKey(classLabel: string): ClassColorKey {
  if (!colorIndex.has(classLabel)) {
    colorIndex.set(classLabel, CLASS_COLORS[colorCursor % CLASS_COLORS.length]);
    colorCursor++;
  }
  return colorIndex.get(classLabel)!;
}

const API_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;
const UI_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toUiDay(apiDay: string): string {
  const idx = API_DAYS.indexOf(apiDay as typeof API_DAYS[number]);
  return idx >= 0 ? UI_DAYS[idx] : apiDay.charAt(0) + apiDay.slice(1).toLowerCase();
}

// ── Response extraction helpers ─────────────────────────────────────────────

function extractNestedArray(raw: unknown): unknown[] | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;

  if (Array.isArray(obj)) return obj;

  const wrappers = ["data", "response", "result", "exams", "entries", "records", "list"] as const;
  for (const key of wrappers) {
    const val = obj[key];
    if (Array.isArray(val)) return val;
    if (val && typeof val === "object" && !Array.isArray(val)) {
      const nested = extractNestedArray(val);
      if (nested) return nested;
    }
  }
  return null;
}

function extractFlatArray(raw: unknown): Record<string, unknown>[] | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;

  const arr = obj?.data;
  if (Array.isArray(arr)) return arr as Record<string, unknown>[];

  return null;
}

function hasApiError(raw: unknown): string | null {
  const check = (obj: Record<string, unknown>): string | null => {
    if (obj?.status === false) return (obj?.message as string) ?? "Unknown API error";
    return null;
  };

  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;

  const top = check(obj);
  if (top) return top;

  if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
    return check(obj.data as Record<string, unknown>);
  }
  return null;
}

// ── Slot parsing ────────────────────────────────────────────────────────────

interface RawPeriodCell {
  subject?: string;
  teacherName?: string;
  room?: string;
  isConflict?: boolean;
}

interface RawSlot {
  kind: "PERIOD" | "BREAK" | "LUNCH" | "FREE";
  periodNo?: number;
  startTime: string;
  endTime: string;
  label?: string;
  cells?: Partial<Record<string, RawPeriodCell>>;
}

function parseSlotTimeRange(start: string, end: string): string {
  const s = formatTime(start);
  const e = formatTime(end);
  return s ? `${s} – ${e}` : `${start} – ${end}`;
}

function buildPeriodsAndGrid(slots: RawSlot[], classLabel: string) {
  const periods: TimetablePeriod[] = [];
  const grid: Record<string, Record<string, TimetableCell | null>> = {};
  let totalTeachingMinutes = 0;

  for (const slot of slots) {
    const periodNo = slot.periodNo ?? periods.length + 1;

    if (slot.kind === "PERIOD") {
      const pid = `p${periodNo}`;
      periods.push({
        id: pid,
        label: `P${periodNo}`,
        time: parseSlotTimeRange(slot.startTime, slot.endTime),
        kind: "PERIOD",
      });

      totalTeachingMinutes += getMinutesBetween(slot.startTime, slot.endTime);
      grid[pid] = {};

      if (slot.cells) {
        for (const [apiDay, cell] of Object.entries(slot.cells)) {
          const uiDay = toUiDay(apiDay);
          if (!cell) {
            grid[pid][uiDay] = null;
            continue;
          }

          const subject = (cell as ApiPeriodCell).subject?.trim();
          if (!subject || subject.toLowerCase() === "free" || subject.toLowerCase() === "free period") {
            grid[pid][uiDay] = {
              subject: "Free Period",
              class: "Staff Room",
              room: "—",
              colorKey: "slate",
              isFree: true,
            };
            continue;
          }

          grid[pid][uiDay] = {
            subject,
            class: classLabel,
            room: (cell as ApiPeriodCell).room ?? "—",
            colorKey: getColorKey(classLabel),
          };
        }
      }

      for (const d of UI_DAYS) {
        if (!(d in grid[pid])) {
          grid[pid][d] = null;
        }
      }
    } else {
      const pid = `bl${periodNo}`;
      periods.push({
        id: pid,
        label: slot.label ?? (slot.kind === "BREAK" ? "Break" : "Lunch"),
        time: parseSlotTimeRange(slot.startTime, slot.endTime),
        kind: slot.kind,
      });
    }
  }

  return { periods, grid, totalTeachingMinutes };
}

// ── Flat array format ──────────────────────────────────────────────────────
// Actual API returns { status: true, count: N, data: [...] } where each item
// has: className, sectionName, subjectname, teachername, teacher_id,
// period_no, day_of_week (lowercase), start_time, end_time, room_no,
// lunch_start, lunch_end, academic_year, school_code.

const DAY_MAP: Record<string, string> = {
  monday: "Mon", tuesday: "Tue", wednesday: "Wed",
  thursday: "Thu", friday: "Fri", saturday: "Sat",
  sunday: "Mon",
};

interface FlatSlot {
  className: string;
  sectionName: string;
  subjectname: string;
  teachername: string;
  period_no: number | string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  room_no: string;
  lunch_start: string;
  lunch_end: string;
  academic_year: string;
}

function transformFlatSlots(items: Record<string, unknown>[]): TeacherTimetableData | null {
  if (!items.length) return null;

  const clean = items.filter(i => i.period_no != null && i.day_of_week);
  if (!clean.length) return null;

  const first = clean[0];

  // Determine class label from all unique class-section combos
  const classSections = new Set<string>();
  clean.forEach(i => {
    const c = (i.className as string) ?? "";
    const s = (i.sectionName as string) ?? "";
    classSections.add(c && s ? `${c}-${s}` : c || "Unknown");
  });
  const classLabelVal = Array.from(classSections).join(", ") || "My Classes";
  const sectionVal = (first.sectionName as string) ?? "";

  const lunchStart = (first.lunch_start as string) ?? "12:30:00";
  const lunchEnd = (first.lunch_end as string) ?? "13:00:00";

  // Group by period_no, sorted
  const periodMap = new Map<number, Record<string, unknown>[]>();
  clean.forEach(i => {
    const p = Number(i.period_no);
    if (!periodMap.has(p)) periodMap.set(p, []);
    periodMap.get(p)!.push(i);
  });
  const sortedPeriods = Array.from(periodMap.entries()).sort((a, b) => a[0] - b[0]);

  const allPeriodNos = sortedPeriods.map(([p]) => p);
  const maxPeriod = allPeriodNos.length > 0 ? Math.max(...allPeriodNos) : 0;

  // Insert break slots between non-consecutive periods
  const rawSlots: RawSlot[] = [];
  let prevP = 0;
  let insertedLunch = false;

  for (const [periodNo, periodItems] of sortedPeriods) {
    // Insert break if gap
    if (periodNo > prevP + 1) {
      rawSlots.push({
        kind: "BREAK",
        periodNo: prevP + 0.5,
        startTime: periodItems[0]?.start_time as string ?? "00:00",
        endTime: periodItems[0]?.start_time as string ?? "00:00",
        label: "Break",
      });
    }

    // Insert lunch before this period if its start >= lunch start
    const pStart = (periodItems[0]?.start_time as string) ?? "";
    if (!insertedLunch && pStart && pStart >= lunchStart) {
      rawSlots.push({
        kind: "LUNCH",
        periodNo: periodNo - 0.5,
        startTime: lunchStart.slice(0, 5),
        endTime: lunchEnd.slice(0, 5),
        label: `Lunch ${lunchStart.slice(0, 5)} - ${lunchEnd.slice(0, 5)}`,
      });
      insertedLunch = true;
    }

    const cells: Record<string, RawPeriodCell> = {};
    periodItems.forEach(i => {
      const dayKey = DAY_MAP[(i.day_of_week as string)?.toLowerCase()] ?? "";
      if (dayKey) {
        cells[dayKey] = {
          subject: (i.subjectname as string) ?? "",
          teacherName: (i.teachername as string) ?? "",
          room: (i.room_no as string) ?? "",
        };
      }
    });

    const start = (periodItems[0]?.start_time as string) ?? "";
    const end = (periodItems[0]?.end_time as string) ?? "";

    rawSlots.push({
      kind: "PERIOD",
      periodNo,
      startTime: start.slice(0, 5),
      endTime: end.slice(0, 5),
      cells,
    });

    prevP = periodNo;
  }

  if (!insertedLunch) {
    rawSlots.push({
      kind: "LUNCH",
      periodNo: maxPeriod + 0.5,
      startTime: lunchStart.slice(0, 5),
      endTime: lunchEnd.slice(0, 5),
      label: `Lunch ${lunchStart.slice(0, 5)} - ${lunchEnd.slice(0, 5)}`,
    });
  }

  const classDisplay = Array.from(classSections).join(", ");
  const { periods, grid, totalTeachingMinutes } = buildPeriodsAndGrid(rawSlots, classDisplay);

  let totalPeriods = 0;
  let freePeriods = 0;
  const classSet = new Set<string>();

  for (const pid of Object.keys(grid)) {
    for (const day of UI_DAYS) {
      const cell = grid[pid]?.[day];
      if (cell) {
        totalPeriods++;
        if (cell.isFree) freePeriods++;
        else classSet.add(cell.class);
      }
    }
  }

  const summary = {
    totalPeriods,
    teachingHours: parseFloat((totalTeachingMinutes / 60).toFixed(1)),
    freePeriods,
    classesTaught: classSet.size,
  };

  const academicYearVal = (first.academic_year as string) ?? `${new Date().getFullYear()}`;

  return {
    grid,
    periods,
    exams: [],
    summary,
    classLabel: classLabelVal,
    section: sectionVal,
    classTeacher: "",
    academicYear: academicYearVal,
    currentPeriodLabel: null,
  };
}

// ── Nested format ───────────────────────────────────────────────────────────
// Alternative response shape: { data: { classTimetable: {...}, examTimetable: {...} } }

function transformNestedTimetable(data: Record<string, unknown>): TeacherTimetableData | null {
  const ct = data?.classTimetable as Record<string, unknown> | undefined;
  const et = data?.examTimetable as Record<string, unknown> | undefined;

  if (!ct || !Array.isArray(ct.slots)) return null;

  const classLabelVal = (ct.classLabel as string) ?? "";
  const sectionVal = (ct.section as string) ?? "";

  const classLabel = classLabelVal && sectionVal
    ? `${classLabelVal}-${sectionVal}`
    : classLabelVal || "My Schedule";

  const { periods, grid, totalTeachingMinutes } = buildPeriodsAndGrid(
    ct.slots as RawSlot[],
    classLabel,
  );

  let totalPeriods = 0;
  let freePeriods = 0;
  const classSet = new Set<string>();

  for (const pid of Object.keys(grid)) {
    for (const day of UI_DAYS) {
      const cell = grid[pid]?.[day];
      if (cell) {
        totalPeriods++;
        if (cell.isFree) freePeriods++;
        else classSet.add(cell.class);
      }
    }
  }

  const summary = {
    totalPeriods,
    teachingHours: parseFloat((totalTeachingMinutes / 60).toFixed(1)),
    freePeriods,
    classesTaught: classSet.size,
  };

  const currentYear = new Date().getFullYear();
  const defaultTitle = `Examination ${currentYear}`;

  const exams: UpcomingExam[] = ((et?.entries as unknown[]) ?? []).map((e) => {
    const entry = e as Record<string, unknown>;
    return {
      id: (entry.id as string) ?? "",
      exam: (et?.title as string) ?? defaultTitle,
      subject: (entry.subject as string) ?? "",
      class: (entry.className as string) ?? "",
      date: (entry.date as string) ?? "",
      time: `${formatTime(entry.startTime as string)} – ${formatTime(entry.endTime as string)}`,
      venue: (entry.venue as string) ?? "",
    };
  });

  return {
    grid,
    periods,
    exams,
    summary,
    classLabel: classLabelVal,
    section: sectionVal,
    classTeacher: (ct.classTeacher as string) ?? "",
    academicYear: (ct.academicYear as string) ?? `${currentYear}`,
    currentPeriodLabel: (ct.currentPeriodLabel as string) ?? null,
  };
}

function transformExamEntry(e: Record<string, unknown>): UpcomingExam | null {
  const resolvedId = (e.id ?? e._id ?? e.examId ?? e.exam_id ?? "") as string;

  // Actual API uses snake_case: subjectname, classname, exam_name, exam_date
  const subject = (e.subjectname ?? e.subject ?? e.subjectName ?? e.subject_name ?? "") as string;
  const cls = (e.classname ?? e.className ?? e.class ?? e.class_name ?? "") as string;
  const date = (e.exam_date ?? e.date ?? e.examDate ?? e.exam_date ?? "") as string;
  const startTime = (e.start_time ?? e.startTime ?? e.start_time ?? "") as string;
  const endTime = (e.end_time ?? e.endTime ?? e.end_time ?? "") as string;
  const venue = (e.room_no ?? e.venue ?? e.room ?? e.room_number ?? "") as string;
  const examName = (e.exam_name ?? e.exam ?? e.examName ?? e.exam_title ?? e.title ?? e.name ?? "Examination") as string;
  const hallTicket = (e.hallTicketUrl ?? e.hall_ticket_url ?? e.hallTicket ?? undefined) as string | undefined;

  const time = startTime
    ? endTime
      ? `${formatTime(startTime)} – ${formatTime(endTime)}`
      : formatTime(startTime)
    : "";

  return {
    id: resolvedId || `exam-${date}-${subject}-${Math.random().toString(36).slice(2, 8)}`,
    exam: examName,
    subject,
    class: cls,
    date,
    time,
    venue,
    hallTicketUrl: hallTicket,
  };
}

// ── API service ────────────────────────────────────────────────────────────

export class TimetableApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly endpoint?: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "TimetableApiError";
  }
}

export const timetableApi = {
  async getTeacherTimetable(params: TeacherTimetableQuery): Promise<TeacherTimetableData> {
    logger("log", "Fetching teacher timetable", params);

    const { data: raw } = await api.get<unknown>("/tenant/getalltimetable", { params });

    const apiError = hasApiError(raw);
    if (apiError) {
      logger("warn", "API returned error status", { message: apiError });
      throw new TimetableApiError(apiError, undefined, "/tenant/getalltimetable");
    }

    // Try nested format first: { data: { classTimetable: {...} } }
    if (raw && typeof raw === "object") {
      const obj = raw as Record<string, unknown>;
      const nestedData = obj?.data && typeof obj.data === "object" && !Array.isArray(obj.data)
        ? obj.data as Record<string, unknown>
        : null;

      if (nestedData && ("classTimetable" in nestedData || "examTimetable" in nestedData)) {
        const nestedResult = transformNestedTimetable(nestedData);
        if (nestedResult) return nestedResult;
      }

      // Also check if raw itself has classTimetable/examTimetable at top level
      if ("classTimetable" in obj || "examTimetable" in obj) {
        const nestedResult = transformNestedTimetable(obj);
        if (nestedResult) return nestedResult;
      }
    }

    // Flat array format: { status: true, count: N, data: [...] }
    const flatItems = extractFlatArray(raw);
    if (flatItems) {
      const flatResult = transformFlatSlots(flatItems);
      if (flatResult) return flatResult;
      // Empty array is valid — return empty data
      return {
        grid: {},
        periods: [],
        exams: [],
        summary: { totalPeriods: 0, teachingHours: 0, freePeriods: 0, classesTaught: 0 },
        classLabel: "",
        section: "",
        classTeacher: "",
        academicYear: params.academic_year,
        currentPeriodLabel: null,
      };
    }

    // Both formats exhausted — error
    logger("error", "Unrecognized response structure", raw);
    throw new TimetableApiError(
      "Unrecognized timetable API response structure",
      undefined,
      "/tenant/getalltimetable",
      raw,
    );
  },

  async getExamsTimetable(params: ExamsTimetableQuery): Promise<UpcomingExam[]> {
    logger("log", "Fetching exams timetable", params);

    const { data: raw } = await api.get<unknown>("/tenant/getallexams-timetable", { params });

    const apiError = hasApiError(raw);
    if (apiError) {
      logger("warn", "Exams API returned error", { message: apiError });
      throw new TimetableApiError(apiError, undefined, "/tenant/getallexams-timetable");
    }

    // Flat format: { status: true, count: N, data: [...] }
    const flatItems = extractFlatArray(raw);
    if (flatItems) {
      if (flatItems.length === 0) {
        logger("log", "No exams returned from API");
        return [];
      }
      return flatItems
        .map((e) => transformExamEntry(e))
        .filter(Boolean) as UpcomingExam[];
    }

    // Nested format fallback: drill into wrapper objects
    const rawEntries = extractNestedArray(raw);
    if (!rawEntries || rawEntries.length === 0) {
      logger("log", "No exams returned from API");
      return [];
    }

    return rawEntries
      .map((e) => transformExamEntry(e as Record<string, unknown>))
      .filter(Boolean) as UpcomingExam[];
  },
};


