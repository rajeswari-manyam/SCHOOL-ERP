import api from "@/config/axios";
import {
  mockTimetablePageResponse,
  mockClass10Timetable,
  mockSubjectOptions,
  mockTeacherOptions,
} from "../store";
import type {
  TimetablePageResponse, ClassTimetable, ExamTimetable, EditPeriodPayload,
  ExamEntry, SubjectOption, TeacherOption, CreateTimetablePayload,
  CreateTimetableResponse, CreateExamTimetablePayload, CreateExamTimetableResponse,
  GetAllExamsTimetableRawItem, GetAllExamsTimetableResponse,
} from "../types/timetable.types";

const SCHOOL_CODE = import.meta.env.VITE_SCHOOL_CODE ?? localStorage.getItem("schoolcode") ?? "";

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
  /** Get all timetables */
  getTimetablePage: async (classId = "class-10"): Promise<TimetablePageResponse> => {
    try {
      const { data } = await api.get("/tenant/getalltimetable", { params: { classId } });
      const inner = (data as any)?.data ?? data;
      const page = inner && typeof inner === "object" && "classTimetable" in inner ? inner : mockTimetablePageResponse;
      return { ...mockTimetablePageResponse, ...page, selectedClassId: classId };
    } catch {
      return { ...mockTimetablePageResponse, selectedClassId: classId };
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
      return data;
    } catch (err: any) {
      console.error("createTimetable failed", { url: "/tenant/createtimetable", payload, response: err?.response?.data ?? err?.message });
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
      const { data } = await api.get<TeacherOption[]>("/tenant/getallstaff");
      return data;
    } catch {
      return mockTeacherOptions;
    }
  },
};