import api from "@/config/axios";
import type {
  TeacherTimetableQuery,
  TeacherTimetableData,
  TimetablePeriod,
  ApiTimetableResponse,
  ApiTimetableSlot,
  ApiDayOfWeek,
  ApiPeriodCell,
  TimetableCell,
  ClassColorKey,
  UpcomingExam,
  ExamsTimetableQuery,
  ApiExamTimetableRawEntry,
} from "../types/timetable.types";

// ── Colour assignment ──────────────────────────────────────────────────────

const CLASS_COLORS: ClassColorKey[] = [
  "indigo", "violet", "sky", "emerald", "amber", "rose",
];

const colorIndex = new Map<string, ClassColorKey>();
let colorCursor = 0;

const getColorKey = (classLabel: string): ClassColorKey => {
  if (!colorIndex.has(classLabel)) {
    colorIndex.set(classLabel, CLASS_COLORS[colorCursor % CLASS_COLORS.length]);
    colorCursor++;
  }
  return colorIndex.get(classLabel)!;
};

// ── Day name mapping ───────────────────────────────────────────────────────

const API_DAYS: ApiDayOfWeek[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];
const UI_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const toUiDay = (apiDay: ApiDayOfWeek): string =>
  UI_DAYS[API_DAYS.indexOf(apiDay)] ?? apiDay.charAt(0) + apiDay.slice(1).toLowerCase();

// ── Time formatting ────────────────────────────────────────────────────────

const formatTime = (t: string): string => {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m ?? "00"} ${ampm}`;
};

const formatTimeRange = (start: string, end: string): string => {
  const s = formatTime(start);
  const e = formatTime(end);
  return s ? `${s} – ${e}` : `${start} – ${end}`;
};

// ── Response extractors ────────────────────────────────────────────────────

const extractApiError = (raw: unknown): string | null => {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;

  if (obj?.status === false) {
    return (obj?.message as string) ?? null;
  }

  const inner = obj?.data && typeof obj.data === "object"
    ? obj.data as Record<string, unknown>
    : null;

  if (inner?.status === false) {
    return (inner?.message as string) ?? null;
  }

  return null;
};

const extractInnerData = (raw: unknown): ApiTimetableResponse["data"] => {
  if (!raw || typeof raw !== "object") return undefined;
  const obj = raw as Record<string, unknown>;

  if (obj?.data && typeof obj.data === "object") {
    return obj.data as ApiTimetableResponse["data"];
  }

  if ("classTimetable" in obj || "examTimetable" in obj) {
    return obj as unknown as ApiTimetableResponse["data"];
  }

  return undefined;
};

const getMinutesBetween = (start: string, end: string): number => {
  const toMins = (t: string) => {
    const [h, m] = t.split(":");
    return parseInt(h, 10) * 60 + parseInt(m ?? "0", 10);
  };
  const diff = toMins(end) - toMins(start);
  return diff > 0 ? diff : 0;
};

const buildPeriodsAndGrid = (slots: ApiTimetableSlot[], classLabel: string) => {
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
        time: formatTimeRange(slot.startTime, slot.endTime),
        kind: "PERIOD",
      });

      totalTeachingMinutes += getMinutesBetween(slot.startTime, slot.endTime);

      grid[pid] = {};

      if (slot.cells) {
        for (const [apiDay, cell] of Object.entries(slot.cells)) {
          const uiDay = toUiDay(apiDay as ApiDayOfWeek);
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
        time: formatTimeRange(slot.startTime, slot.endTime),
        kind: slot.kind,
      });
    }
  }

  return { periods, grid, totalTeachingMinutes };
};

// ── Main transformer ───────────────────────────────────────────────────────

export const transformApiResponse = (
  apiData: ApiTimetableResponse["data"]
): TeacherTimetableData | null => {
  if (!apiData) return null;

  const ct = apiData.classTimetable;
  const et = apiData.examTimetable;

  if (!ct || !ct.slots) return null;

  const classLabel = ct.classLabel && ct.section
    ? `${ct.classLabel}-${ct.section}`
    : ct.classLabel || "My Schedule";

  const { periods, grid, totalTeachingMinutes } = buildPeriodsAndGrid(ct.slots, classLabel);

  // Build summary
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

  // Build exams
  const exams: UpcomingExam[] = (et?.entries ?? []).map((e) => ({
    id: e.id,
    exam: et?.title ?? defaultTitle,
    subject: e.subject,
    class: e.className,
    date: e.date,
    time: `${formatTime(e.startTime)} – ${formatTime(e.endTime)}`,
    venue: e.venue,
  }));

  return {
    grid,
    periods,
    exams,
    summary,
    classLabel: ct.classLabel ?? "",
    section: ct.section ?? "",
    classTeacher: ct.classTeacher ?? "",
    academicYear: ct.academicYear ?? `${new Date().getFullYear()}`,
    currentPeriodLabel: ct.currentPeriodLabel ?? null,
  };
};

// ── Mock fallback data (used when API is unreachable) ─────────────────────

const MOCK_PERIODS: TimetablePeriod[] = [
  { id: "p1", label: "P1",     time: "8:00 AM – 8:45 AM",    kind: "PERIOD" },
  { id: "b1", label: "Break",  time: "8:45 AM – 9:00 AM",    kind: "BREAK"  },
  { id: "p2", label: "P2",     time: "9:00 AM – 9:45 AM",    kind: "PERIOD" },
  { id: "p3", label: "P3",     time: "9:45 AM – 10:30 AM",   kind: "PERIOD" },
  { id: "p4", label: "P4",     time: "10:30 AM – 11:15 AM",  kind: "PERIOD" },
  { id: "b2", label: "Break",  time: "11:15 AM – 11:30 AM",  kind: "BREAK"  },
  { id: "p5", label: "P5",     time: "11:30 AM – 12:15 PM",  kind: "PERIOD" },
  { id: "l1", label: "Lunch",  time: "12:15 PM – 1:15 PM",   kind: "LUNCH"  },
  { id: "p6", label: "P6",     time: "1:15 PM – 2:00 PM",    kind: "PERIOD" },
  { id: "p7", label: "P7",     time: "2:00 PM – 2:45 PM",    kind: "PERIOD" },
  { id: "p8", label: "P8",     time: "2:45 PM – 3:30 PM",    kind: "PERIOD" },
];

const MOCK_GRID: Record<string, Record<string, TimetableCell | null>> = {
  p1: {
    Mon: { subject: "Mathematics", class: "Class 8-A", room: "Room 12", colorKey: "indigo" },
    Tue: { subject: "Mathematics", class: "Class 9-B", room: "Room 7",  colorKey: "violet" },
    Wed: { subject: "Mathematics", class: "Class 7-C", room: "Room 3",  colorKey: "sky"    },
    Thu: { subject: "Mathematics", class: "Class 8-A", room: "Room 12", colorKey: "indigo" },
    Fri: { subject: "Mathematics", class: "Class 9-B", room: "Room 7",  colorKey: "violet" },
    Sat: null,
  },
  p2: {
    Mon: { subject: "Mathematics", class: "Class 9-B", room: "Room 7",  colorKey: "violet"  },
    Tue: { subject: "Mathematics", class: "Class 8-B", room: "Room 11", colorKey: "emerald" },
    Wed: { subject: "Free Period", class: "Staff Room", room: "—",      colorKey: "slate", isFree: true },
    Thu: { subject: "Mathematics", class: "Class 7-C", room: "Room 3",  colorKey: "sky"    },
    Fri: { subject: "Mathematics", class: "Class 8-A", room: "Room 12", colorKey: "indigo" },
    Sat: { subject: "Mathematics", class: "Class 7-C", room: "Room 3",  colorKey: "sky"    },
  },
  p3: {
    Mon: { subject: "Mathematics", class: "Class 7-C", room: "Room 3",  colorKey: "sky"   },
    Tue: { subject: "Free Period", class: "Staff Room", room: "—",      colorKey: "slate", isFree: true },
    Wed: { subject: "Mathematics", class: "Class 9-B", room: "Room 7",  colorKey: "violet" },
    Thu: { subject: "Mathematics", class: "Class 8-B", room: "Room 11", colorKey: "emerald" },
    Fri: { subject: "Free Period", class: "Staff Room", room: "—",      colorKey: "slate", isFree: true },
    Sat: { subject: "Mathematics", class: "Class 8-B", room: "Room 11", colorKey: "emerald" },
  },
  p4: {
    Mon: { subject: "Mathematics", class: "Class 8-B", room: "Room 11", colorKey: "emerald" },
    Tue: { subject: "Mathematics", class: "Class 7-C", room: "Room 3",  colorKey: "sky"    },
    Wed: { subject: "Mathematics", class: "Class 8-A", room: "Room 12", colorKey: "indigo" },
    Thu: { subject: "Free Period", class: "Staff Room", room: "—",      colorKey: "slate", isFree: true },
    Fri: { subject: "Mathematics", class: "Class 8-B", room: "Room 11", colorKey: "emerald" },
    Sat: null,
  },
  p5: {
    Mon: { subject: "Free Period", class: "Staff Room", room: "—",      colorKey: "slate", isFree: true },
    Tue: { subject: "Mathematics", class: "Class 9-B", room: "Room 7",  colorKey: "violet"  },
    Wed: { subject: "Mathematics", class: "Class 8-B", room: "Room 11", colorKey: "emerald" },
    Thu: { subject: "Mathematics", class: "Class 8-A", room: "Room 12", colorKey: "indigo"  },
    Fri: { subject: "Mathematics", class: "Class 7-C", room: "Room 3",  colorKey: "sky"     },
    Sat: { subject: "Mathematics", class: "Class 9-B", room: "Room 7",  colorKey: "violet"  },
  },
  p6: {
    Mon: { subject: "Mathematics", class: "Class 8-A", room: "Room 12", colorKey: "indigo" },
    Tue: { subject: "Mathematics", class: "Class 8-A", room: "Room 12", colorKey: "indigo" },
    Wed: { subject: "Mathematics", class: "Class 9-B", room: "Room 7",  colorKey: "violet" },
    Thu: { subject: "Mathematics", class: "Class 7-C", room: "Room 3",  colorKey: "sky"    },
    Fri: null,
    Sat: null,
  },
  p7: {
    Mon: { subject: "Mathematics", class: "Class 9-B", room: "Room 7",  colorKey: "violet"  },
    Tue: null,
    Wed: { subject: "Free Period", class: "Staff Room", room: "—",      colorKey: "slate", isFree: true },
    Thu: { subject: "Mathematics", class: "Class 8-B", room: "Room 11", colorKey: "emerald" },
    Fri: { subject: "Mathematics", class: "Class 8-A", room: "Room 12", colorKey: "indigo"  },
    Sat: null,
  },
  p8: {
    Mon: null,
    Tue: { subject: "Mathematics", class: "Class 7-C", room: "Room 3",  colorKey: "sky"    },
    Wed: { subject: "Mathematics", class: "Class 8-A", room: "Room 12", colorKey: "indigo" },
    Thu: null,
    Fri: { subject: "Free Period", class: "Staff Room", room: "—",      colorKey: "slate", isFree: true },
    Sat: { subject: "Mathematics", class: "Class 8-A", room: "Room 12", colorKey: "indigo" },
  },
};

const MOCK_EXAMS: UpcomingExam[] = [
  { id: "mock-e1", exam: "Unit Test – I",    subject: "Mathematics", class: "10", date: "2026-06-15", time: "10:00 AM – 12:00 PM", venue: "Exam Hall A" },
  { id: "mock-e2", exam: "Unit Test – I",    subject: "Mathematics", class: "9",  date: "2026-06-16", time: "10:00 AM – 12:00 PM", venue: "Exam Hall B" },
  { id: "mock-e3", exam: "Half Yearly Exam", subject: "Mathematics", class: "8",  date: "2026-07-20", time: "9:00 AM – 12:00 PM",  venue: "Main Hall" },
  { id: "mock-e4", exam: "Half Yearly Exam", subject: "Mathematics", class: "7",  date: "2026-07-21", time: "9:00 AM – 12:00 PM",  venue: "Main Hall" },
];

const MOCK_TIMETABLE_DATA: TeacherTimetableData = {
  grid: MOCK_GRID,
  periods: MOCK_PERIODS,
  exams: MOCK_EXAMS,
  summary: { totalPeriods: 34, teachingHours: 24, freePeriods: 6, classesTaught: 4 },
  classLabel: "Class 10",
  section: "A",
  classTeacher: "Venkat R",
  academicYear: `${new Date().getFullYear()}`,
  currentPeriodLabel: null,
};

// ── API service ────────────────────────────────────────────────────────────

export const timetableApi = {
  getTeacherTimetable: async (
    params: TeacherTimetableQuery
  ): Promise<TeacherTimetableData> => {
    console.log("📥 Fetching teacher timetable", { params });
    try {
      const { data: raw } = await api.get<ApiTimetableResponse>("/tenant/getalltimetable", {
        params,
      });

      console.log("📥 Raw timetable response:", JSON.stringify(raw, null, 2));

      const apiError = extractApiError(raw);
      if (apiError) {
        console.warn("⚠️ API returned error status", { message: apiError });
        throw new Error(apiError);
      }

      const inner = extractInnerData(raw);
      if (!inner) {
        console.warn("⚠️ Unexpected response structure, falling back to mock data", raw);
        return MOCK_TIMETABLE_DATA;
      }

      const result = transformApiResponse(inner);
      if (result) {
        console.log("✅ Timetable transformed successfully", {
          periods: result.periods.length,
          gridKeys: Object.keys(result.grid),
          exams: result.exams.length,
        });
        return result;
      }

      console.warn("⚠️ Incomplete data from server, falling back to mock data", { inner });
      return MOCK_TIMETABLE_DATA;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const ctx = error?.response?.data ?? error?.message;
      const statusCode = (error as Record<string, unknown>)?.response
        ? ((error as Record<string, unknown>)?.response as Record<string, unknown>)?.status
        : null;

      const isServerError = statusCode === 404 || statusCode === 500;
      const isNetworkError = !statusCode && error?.message === "Network Error";

      if (isServerError || isNetworkError) {
        console.warn("⚠️ getTeacherTimetable failed, falling back to mock data", {
          url: "/tenant/getalltimetable",
          params,
          statusCode,
          response: ctx,
        });
        return MOCK_TIMETABLE_DATA;
      }

      const message =
        error?.response?.data?.message ??
        (typeof ctx === "string" ? ctx : undefined) ??
        error?.message ??
        "Failed to fetch teacher timetable";
      console.error("❌ getTeacherTimetable error:", message);
      throw new Error(message);
    }
  },

  // ── Dedicated exams timetable endpoint ──────────────────────────────────────

  getExamsTimetable: async (
    params: ExamsTimetableQuery
  ): Promise<UpcomingExam[]> => {
    console.log("📥 Fetching exams timetable", { params });
    try {
      const { data: raw } = await api.get<unknown>("/tenant/getallexams-timetable", {
        params,
      });

      console.log("📥 Raw exams timetable response:", JSON.stringify(raw, null, 2));

      // Check for explicit error status
      const apiError = extractApiError(raw);
      if (apiError) {
        console.warn("⚠️ Exams API returned error status", { message: apiError });
        throw new Error(apiError);
      }

      // Extract the raw entries array from any wrapper shape.
      const rawEntries = extractExamsArray(raw);

      if (!rawEntries || rawEntries.length === 0) {
        console.log("📭 No exams returned from API, using mock fallback");
        return getMockExams();
      }

      const exams: UpcomingExam[] = rawEntries.map(transformExamEntry).filter(Boolean) as UpcomingExam[];

      console.log("✅ Exams timetable transformed successfully", {
        count: exams.length,
      });

      return exams;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const ctx = error?.response?.data ?? error?.message;
      const statusCode = (error as Record<string, unknown>)?.response
        ? ((error as Record<string, unknown>)?.response as Record<string, unknown>)?.status
        : null;

      const isServerError = statusCode === 404 || statusCode === 500;
      const isNetworkError = !statusCode && error?.message === "Network Error";

      if (isServerError || isNetworkError) {
        console.warn("⚠️ getExamsTimetable failed, falling back to mock data", {
          url: "/tenant/getallexams-timetable",
          params,
          statusCode,
          response: ctx,
        });
        return getMockExams();
      }

      const message =
        error?.response?.data?.message ??
        (typeof ctx === "string" ? ctx : undefined) ??
        error?.message ??
        "Failed to fetch exams timetable";
      console.error("❌ getExamsTimetable error:", message);
      throw new Error(message);
    }
  },
};

// ── Exams response extractors ────────────────────────────────────────────────

/** Drill into any wrapper to find a candidate array or inner object. */
function extractExamsArray(raw: unknown): ApiExamTimetableRawEntry[] | null {
  if (!raw || typeof raw !== "object") return null;

  const obj = raw as Record<string, unknown>;

  // ── 1. Already an array ────────────────────────────────────────────────
  if (Array.isArray(obj)) return obj as ApiExamTimetableRawEntry[];

  // ── 2. Check known wrapper fields at the top level ─────────────────────
  const wrapperKeys = ["data", "response", "result", "exams", "entries", "records", "list"] as const;
  for (const key of wrapperKeys) {
    const val = obj[key];
    if (Array.isArray(val)) return val as ApiExamTimetableRawEntry[];
  }

  // ── 3. { data/response: { exams/entries/data/records/list: [...] } } ──
  for (const outerKey of ["data", "response", "result"] as const) {
    const outer = obj[outerKey];
    if (outer && typeof outer === "object" && !Array.isArray(outer)) {
      const inner = outer as Record<string, unknown>;
      for (const innerKey of ["exams", "entries", "data", "records", "list"] as const) {
        if (Array.isArray(inner[innerKey])) return inner[innerKey] as ApiExamTimetableRawEntry[];
      }
      // Single object inside — wrap it.
      const hasId = "id" in inner || "_id" in inner || "examId" in inner || "exam_id" in inner;
      if (hasId) return [inner] as ApiExamTimetableRawEntry[];
    }
  }

  // ── 4. Single object at the top level with an ID — wrap it. ──────────
  const hasId = "id" in obj || "_id" in obj || "examId" in obj || "exam_id" in obj;
  if (hasId) return [obj] as ApiExamTimetableRawEntry[];

  return null;
}

/** Return the first truthy value from a list of optional fields. */
function firstOf<T>(obj: Record<string, unknown>, ...keys: string[]): T | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (v != null && v !== "") return v as T;
  }
  return undefined;
}

function transformExamEntry(e: ApiExamTimetableRawEntry): UpcomingExam | null {
  const rec = e as Record<string, unknown>;

  const resolvedId = firstOf<string>(rec, "id", "_id", "examId", "exam_id");
  if (!resolvedId) return null;

  const subject     = firstOf<string>(rec, "subject", "subjectName", "subject_name") ?? "";
  const cls         = firstOf<string>(rec, "className", "class", "class_name") ?? "";
  const date        = firstOf<string>(rec, "date", "examDate", "exam_date") ?? "";
  const startTime   = firstOf<string>(rec, "startTime", "start_time") ?? "";
  const endTime     = firstOf<string>(rec, "endTime", "end_time") ?? "";
  const venue       = firstOf<string>(rec, "venue", "room", "room_number") ?? "";
  const examName    = firstOf<string>(rec, "exam", "examName", "exam_name", "exam_title", "title", "name") ?? "Examination";
  const hallTicket  = firstOf<string>(rec, "hallTicketUrl", "hall_ticket_url", "hallTicket") ?? undefined;

  const time = startTime
    ? endTime
      ? `${formatTime(startTime)} – ${formatTime(endTime)}`
      : formatTime(startTime)
    : "";

  return {
    id: resolvedId,
    exam: examName,
    subject,
    class: cls,
    date,
    time,
    venue,
    hallTicketUrl: hallTicket,
  };
}

function getMockExams(): UpcomingExam[] {
  return MOCK_EXAMS;
}
