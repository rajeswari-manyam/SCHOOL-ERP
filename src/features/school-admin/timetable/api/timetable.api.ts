import api from "@/config/axios";
import {
  mockTimetablePageResponse,
  mockClass10Timetable,
  mockExamTimetable,
  mockSubjectOptions,
  mockTeacherOptions,
} from "../store";
import type {
  TimetablePageResponse, ClassTimetable, ExamTimetable, EditPeriodPayload,
  ExamEntry, SubjectOption, TeacherOption, CreateTimetablePayload,
  CreateTimetableResponse, CreateExamTimetablePayload, CreateExamTimetableResponse,
  GetAllExamsTimetableRawItem, GetAllExamsTimetableResponse,
  GetAllTimetableRawItem, GetAllTimetableResponse,
  DayOfWeek, TimetableSlot, PeriodCell,
} from "../types/timetable.types";

const SCHOOL_CODE = import.meta.env.VITE_SCHOOL_CODE ?? localStorage.getItem("schoolcode") ?? "";

const DAY_MAP: Record<string, DayOfWeek> = {
  monday: "MON", tuesday: "TUE", wednesday: "WED",
  thursday: "THU", friday: "FRI", saturday: "SAT",
  sunday: "MON",
};

function extractArray(raw: unknown): GetAllTimetableRawItem[] {
  if (!raw || typeof raw !== "object") return [];
  const obj = raw as Record<string, unknown>;
  for (const key of ["data", "timetables", "result", "entries", "records", "items", "list"]) {
    const val = obj[key];
    if (Array.isArray(val)) return val as GetAllTimetableRawItem[];
    if (val && typeof val === "object" && !Array.isArray(val)) {
      const nested = extractArray(val);
      if (nested.length > 0) return nested;
    }
  }
  for (const v of Object.values(obj)) {
    if (Array.isArray(v)) return v as GetAllTimetableRawItem[];
  }
  return [];
}

function mapRawToTimetablePage(
  items: GetAllTimetableRawItem[],
  className?: string,
  sectionName?: string,
  academicYear?: string,
): TimetablePageResponse {
  if (!items.length) return { ...mockTimetablePageResponse };

  const cleanItems = items.filter(i => i.period_no && i.day_of_week);
  if (!cleanItems.length) return { ...mockTimetablePageResponse };

  const activeClass = className ?? cleanItems[0]?.className ?? "10";
  const activeSection = sectionName ?? cleanItems[0]?.sectionName ?? "A";
  const year = academicYear ?? cleanItems[0]?.academic_year ?? "2026";
  const lunchStart = cleanItems[0]?.lunch_start ?? "12:30:00";
  const lunchEnd = cleanItems[0]?.lunch_end ?? "13:00:00";

  // Build class tabs from unique className values
  const classSet = new Set<string>();
  cleanItems.forEach(i => { if (i.className) classSet.add(i.className); });
  const classTabs = Array.from(classSet).map(c => ({
    id: `class-${c}`,
    label: `Class ${c}`,
  }));
  if (!classTabs.length) {
    classTabs.push({ id: `class-${activeClass}`, label: `Class ${activeClass}` });
  }

  // Group by period_no and sort
  const periodMap = new Map<string, GetAllTimetableRawItem[]>();
  cleanItems.forEach(i => {
    const p = i.period_no ?? "0";
    if (!periodMap.has(p)) periodMap.set(p, []);
    periodMap.get(p)!.push(i);
  });
  const sortedPeriods = Array.from(periodMap.entries()).sort(
    (a, b) => Number(a[0]) - Number(b[0])
  );

  const slots: TimetableSlot[] = [];
  let lunchInserted = false;

  for (const [periodNo, periodItems] of sortedPeriods) {
    const first = periodItems[0];
    const pStart = first?.start_time ?? "";
    const pEnd = first?.end_time ?? "";

    // Insert lunch slot before the first period that starts at or after lunch
    if (!lunchInserted && pStart && pStart >= lunchStart) {
      slots.push({
        kind: "LUNCH",
        startTime: lunchStart.slice(0, 5),
        endTime: lunchEnd.slice(0, 5),
        label: `LUNCH ${lunchStart.slice(0, 5)} - ${lunchEnd.slice(0, 5)}`,
      });
      lunchInserted = true;
    }

    const cells: Partial<Record<DayOfWeek, PeriodCell>> = {};
    periodItems.forEach(i => {
      const dayKey = DAY_MAP[i.day_of_week?.toLowerCase() ?? ""];
      if (dayKey) {
        cells[dayKey] = {
          subject: i.subjectname ?? "",
          teacherName: i.teachername ?? "",
          room: i.room_no,
        };
      }
    });

    slots.push({
      kind: "PERIOD",
      periodNo: Number(periodNo),
      startTime: pStart.slice(0, 5),
      endTime: pEnd.slice(0, 5),
      cells,
    });
  }

  if (!lunchInserted) {
    slots.push({
      kind: "LUNCH",
      startTime: lunchStart.slice(0, 5),
      endTime: lunchEnd.slice(0, 5),
      label: `LUNCH ${lunchStart.slice(0, 5)} - ${lunchEnd.slice(0, 5)}`,
    });
  }

  return {
    classTabs,
    selectedClassId: `class-${activeClass}`,
    classTimetable: {
      classId: `class-${activeClass}`,
      classLabel: `Class ${activeClass}`,
      section: activeSection,
      classTeacher: "",
      academicYear: year,
      slots,
      resourceLoad: 0,
      substitutionCount: 0,
      conflicts: [],
    },
    examTimetable: mockExamTimetable,
  };
}

const mapExamEntry = (item: GetAllExamsTimetableRawItem): ExamEntry => ({
  id: item?.exam_id ?? item?.id ?? item?._id ?? "",
  subject: item?.subject_name ?? item?.subjectname ?? item?.subject ?? item?.subjectName ?? "",
  className: item?.class_name ?? item?.classname ?? item?.className ?? "",
  date: item?.exam_date ?? item?.date ?? "",
  startTime: item?.start_time ?? item?.startTime ?? "",
  endTime: item?.end_time ?? item?.endTime ?? "",
  venue: item?.room_no ?? item?.room ?? item?.venue ?? "",
  notifyStatus: (item?.notify_status ?? item?.notifyStatus ?? "PENDING").toUpperCase() as ExamEntry["notifyStatus"],
});

const extractExamEntries = (raw: unknown): GetAllExamsTimetableRawItem[] => {
  if (!raw || typeof raw !== "object") return [];
  const obj = raw as Record<string, unknown>;

  const directKeys = ["entries", "exams", "data", "result", "records", "items", "list"];
  for (const key of directKeys) {
    const val = obj[key];
    if (Array.isArray(val)) return val as GetAllExamsTimetableRawItem[];
    if (val && typeof val === "object" && !Array.isArray(val)) {
      const nested = extractExamEntries(val);
      if (nested.length > 0) return nested;
    }
  }

  for (const v of Object.values(obj)) {
    if (Array.isArray(v)) return v as GetAllExamsTimetableRawItem[];
  }

  return [];
};

export const timetableApi = {
  /** Get all timetables for a class */
  getTimetablePage: async (
    params: { className: string; sectionName: string; academicYear: string }
  ): Promise<TimetablePageResponse> => {
    const { className, sectionName, academicYear } = params;
    try {
      const { data } = await api.get<GetAllTimetableResponse>("/tenant/getalltimetable", {
        params: { className, sectionName, academic_year: academicYear },
      });
      console.log("📥 getalltimetable response:", JSON.stringify(data, null, 2));

      const rawItems = extractArray(data);
      console.log(`📊 Parsed ${rawItems.length} timetable entries`);

      const mapped = mapRawToTimetablePage(rawItems, className, sectionName, academicYear);
      return mapped;
    } catch (err: any) {
      console.error("❌ getTimetablePage failed", {
        params, response: err?.response?.data ?? err?.message,
      });
      return { ...mockTimetablePageResponse, selectedClassId: `class-${className}` };
    }
  },

  /** Get all exams timetables */
  getExamTimetable: async (schoolCode?: string): Promise<ExamTimetable> => {
    try {
      const code = schoolCode ?? SCHOOL_CODE;
      const { data } = await api.get<GetAllExamsTimetableResponse>("/tenant/getallexams-timetable", {
        params: { school_code: code },
      });

      const rawItems = extractExamEntries(data);
      const entries = rawItems.length > 0 ? rawItems.map(mapExamEntry) : [];

      return {
        title: "Exam Timetable",
        subtitle: "Final Assessment Schedule",
        notifyParentsEnabled: true,
        entries,
      };
    } catch (err: any) {
      const ctx = err?.response?.data ?? err?.message;
      console.error("getExamTimetable failed", { url: "/tenant/getallexams-timetable", response: ctx });
      const message = ctx?.message ?? ctx?.error ?? "Failed to fetch exam timetable";
      throw new Error(message);
    }
  },

  /** Get timetable by class ID */
  getClassTimetable: async (id?: string): Promise<ClassTimetable> => {
    try {
      const { data } = await api.get<ClassTimetable>(`/tenant/gettimetableById/${id}`);
      return data;
    } catch {
      return mockClass10Timetable;
    }
  },

  /** Update timetable by ID */
  savePeriod: async (payload: EditPeriodPayload): Promise<{ success: boolean }> => {
    const { data } = await api.put<{ success: boolean }>("/tenant/updatetimetableById", payload);
    return data;
  },

  /** Create a new timetable period */
  createTimetable: async (payload: CreateTimetablePayload): Promise<CreateTimetableResponse> => {
    try {
      const { data } = await api.post<CreateTimetableResponse>("/tenant/createtimetable", payload);
      console.log("📤 createTimetable payload:", JSON.stringify(payload, null, 2));
      console.log("✅ createTimetable response:", JSON.stringify(data, null, 2));
      return data;
    } catch (err: any) {
      console.error("❌ createTimetable failed", { url: "/tenant/createtimetable", payload, response: err?.response?.data ?? err?.message });
      const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to create timetable period";
      throw new Error(message);
    }
  },

  /** Create an exam timetable entry */
  createExamTimetable: async (payload: CreateExamTimetablePayload): Promise<CreateExamTimetableResponse> => {
    try {
      const { data } = await api.post<CreateExamTimetableResponse>("/tenant/createexams-timetable", payload);
      return data;
    } catch (err: any) {
      console.error("createExamTimetable failed", { url: "/tenant/createexams-timetable", payload, response: err?.response?.data ?? err?.message });
      const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to create exam timetable entry";
      throw new Error(message);
    }
  },

  /** Add an exam entry (maps to createexams-timetable) */
  addExam: async (entry: Omit<ExamEntry, "id" | "notifyStatus">): Promise<ExamEntry> => {
    try {
      const { data } = await api.post<ExamEntry>("/tenant/createexams-timetable", entry);
      return data;
    } catch (err: any) {
      console.error("addExam failed", { entry, response: err?.response?.data ?? err?.message });
      const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to add exam";
      throw new Error(message);
    }
  },

  /** Delete an exams-timetable entry */
  deleteExam: async (examId: string): Promise<{ success: boolean }> => {
    const { data } = await api.delete<{ success: boolean }>(`/tenant/deleteexams-timetableById/${examId}`);
    return data;
  },

  /** Get all subjects */
  getSubjectOptions: async (): Promise<SubjectOption[]> => {
    try {
      const { data } = await api.get<SubjectOption[]>("/tenant/getallsubjects");
      return data;
    } catch {
      return mockSubjectOptions;
    }
  },

  /** Get all staff (teachers) */
  getTeacherOptions: async (): Promise<TeacherOption[]> => {
    try {
      const { data } = await api.get("/tenant/getallstaff");
      let list: any[] = [];
      if (Array.isArray(data)) list = data;
      else if (data?.staff && Array.isArray(data.staff)) list = data.staff;
      else if (data?.data && Array.isArray(data.data)) list = data.data;
      return list.map((s: any) => ({
        value: s.id ?? s._id ?? s.employeeId ?? s.emp_number ?? "",
        label: s.name ?? s.teachername ?? s.teacher_name ?? "",
        conflictWarning: undefined,
      })).filter((t: TeacherOption) => t.value && t.label);
    } catch {
      return mockTeacherOptions;
    }
  },
};