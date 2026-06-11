import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/config/axios";
import { createTimetable as createServiceSlot, getTimetableById, getAllTimetable } from "@/services/timetable.api";
import type { TimetablePayload, TimetableSlot as ServiceTimetableSlot } from "@/services/timetable.api";
import { getAllClasses, getSectionsByClassId } from "@/services/class.api";
import type { ClassRecord } from "@/services/class.api";
import {
  getAllExamTimetables as getAllExamTimetable,
  createExamTimetable as createExamSlot,
  deleteExamTimetable,
} from "@/services/examtimetable.api";
import { getAllSubjects } from "@/services/subject.api";
import type {
  EditPeriodPayload,
  ExamEntry,
  DayOfWeek,
  CreateTimetablePayload,
  CreateExamTimetablePayload,
  TimetablePageResponse,
  ExamTimetable,
  SubjectOption,
  TeacherOption,
  GetAllTimetableRawItem,
  TimetableSlot,
} from "../types/timetable.types";


export const TIMETABLE_KEYS = {
  all:          ["timetable"] as const,
  page:         (className: string, sectionName: string, academicYear: string) =>
    [...TIMETABLE_KEYS.all, "page", className, sectionName, academicYear] as const,
  classTt:      (classId: string) => [...TIMETABLE_KEYS.all, "class", classId] as const,
  exam:         () => [...TIMETABLE_KEYS.all, "exam"] as const,
  subjects:     () => [...TIMETABLE_KEYS.all, "subjects"] as const,
  teachers:     () => [...TIMETABLE_KEYS.all, "teachers"] as const,
  classes:      () => [...TIMETABLE_KEYS.all, "classes"] as const,
  sections:     (classId: string) => [...TIMETABLE_KEYS.all, "sections", classId] as const,
};

// ─── Day normaliser ──────────────────────────────────────────────────────────────
// The API may return full names ("MONDAY", "monday"), 3-letter ("MON"), or mixed-case ("Monday").
// Normalise all of them to the 3-letter DayOfWeek used by the grid.
const DAY_NAME_MAP: Record<string, DayOfWeek> = {
  MONDAY: "MON", MON: "MON", monday: "MON",
  TUESDAY: "TUE", TUE: "TUE", tuesday: "TUE",
  WEDNESDAY: "WED", WED: "WED", wednesday: "WED",
  THURSDAY: "THU", THU: "THU", thursday: "THU",
  FRIDAY: "FRI", FRI: "FRI", friday: "FRI",
  SATURDAY: "SAT", SAT: "SAT", saturday: "SAT",
};

const normDay = (raw: string | undefined): DayOfWeek | null => {
  if (!raw) return null;
  return DAY_NAME_MAP[raw.toUpperCase().trim()] ?? DAY_NAME_MAP[raw.trim()] ?? null;
};

// ─── Grid builder ────────────────────────────────────────────────────────────────
// Groups flat API rows (one row per period+day) into TimetableSlot objects
// where each slot has ALL day-cells populated.
const buildSlotsFromRaw = (rawList: GetAllTimetableRawItem[]): TimetableSlot[] => {
  // Time slot map for getting start/end times by period number
  const TIME_SLOT_MAP: Record<number, { start_time: string; end_time: string }> = {
    1: { start_time: "09:00", end_time: "09:45" },
    2: { start_time: "09:45", end_time: "10:30" },
    3: { start_time: "10:30", end_time: "11:15" },
    4: { start_time: "11:15", end_time: "12:00" },
    5: { start_time: "12:00", end_time: "12:45" },
    6: { start_time: "13:30", end_time: "14:15" },
    7: { start_time: "14:15", end_time: "15:00" },
    8: { start_time: "15:00", end_time: "15:45" },
  };

  // Map: periodNo → slot
  const slotMap = new Map<
    number,
    {
      periodNo: number;
      startTime: string;
      endTime: string;
      cells: Partial<Record<DayOfWeek, { subject: string; teacherName: string; room?: string }>>;
    }
  >();

  for (const r of rawList) {
    const periodNo = Number(r.period_no);
    if (isNaN(periodNo) || periodNo <= 0) continue;

    const day = normDay(r.day_of_week);
    if (!day) continue;

    // Extract nested object values with fallback to flat fields
    const subjectName = r.subject?.subject_name ?? r.subjectname ?? "";
    const teacherName = r.teacher?.name ?? r.teachername ?? "";
    const roomNo = r.room_no ?? "";

    if (!slotMap.has(periodNo)) {
      const timeSlot = TIME_SLOT_MAP[periodNo] ?? { start_time: "", end_time: "" };
      slotMap.set(periodNo, {
        periodNo,
        startTime: timeSlot.start_time,
        endTime: timeSlot.end_time,
        cells: {},
      });
    }

    const slot = slotMap.get(periodNo)!;
    slot.cells[day] = {
      subject: subjectName,
      teacherName: teacherName,
      room: roomNo,
    };
  }

  // Sort by periodNo and convert to TimetableSlot[]
  return Array.from(slotMap.values())
    .sort((a, b) => a.periodNo - b.periodNo)
    .map((s) => ({
      kind: "PERIOD" as const,
      periodNo: s.periodNo,
      startTime: s.startTime,
      endTime: s.endTime,
      cells: s.cells,
    }));
};

const toExamEntry = (r: unknown): ExamEntry => {
  // Accepts both ExamTimetableListItem (nested objects) and GetAllExamsTimetableRawItem (flat)
  const raw = r as Record<string, unknown>;
  const classObj   = raw["class"]   as { id?: string; class_name?: string }   | undefined;
  const subjectObj = raw["subject"] as { id?: string; subject_name?: string } | undefined;
  const sectionObj = raw["section"] as { id?: string; sectionName?: string }  | undefined;
  const examObj    = raw["exam"]    as { id?: string; exam_name?: string }     | undefined;
  const teacherObj = raw["teacher"] as { id?: string; name?: string }          | undefined;

  return {
    id:            (raw["exam_id"] ?? raw["id"] ?? raw["_id"] ?? "") as string,
    subject:       subjectObj?.subject_name ?? (raw["subject_name"] ?? raw["subjectname"] ?? raw["subjectName"] ?? "") as string,
    className:     classObj?.class_name     ?? (raw["class_name"]   ?? raw["classname"]   ?? raw["className"]   ?? "") as string,
    date:          (raw["exam_date"]  ?? raw["date"]      ?? "") as string,
    startTime:     (raw["start_time"] ?? raw["startTime"] ?? "") as string,
    endTime:       (raw["end_time"]   ?? raw["endTime"]   ?? "") as string,
    venue:         (raw["room_no"]    ?? raw["room"]      ?? raw["venue"] ?? "") as string,
    notifyStatus:  (raw["notify_status"] ?? raw["notifyStatus"] ?? "PENDING") as ExamEntry["notifyStatus"],
    // FK ids preserved so edit modal can pre-fill dropdowns
    class_id:      (classObj?.id    ?? raw["class_id"])   as string | undefined,
    subject_id:    (subjectObj?.id  ?? raw["subject_id"]) as string | undefined,
    section_id:    (sectionObj?.id  ?? raw["section_id"]) as string | undefined,
    examnameid:    (examObj?.id     ?? raw["examnameid"])  as string | undefined,
    teacher_id:    (teacherObj?.id  ?? raw["teacher_id"]) as string | undefined,
    academicYearId: raw["academicYearId"] as string | undefined,
  };
};

const extractArray = <T>(res: unknown, ...keys: string[]): T[] => {
  const r = res as Record<string, unknown>;
  for (const k of keys) {
    if (Array.isArray(r[k])) return r[k] as T[];
  }
  return [];
};

// ─── Class list ─────────────────────────────────────────────────────────────────
export const useClassList = () =>
  useQuery({
    queryKey: TIMETABLE_KEYS.classes(),
    queryFn: async (): Promise<{ id: string; label: string }[]> => {
      const res = await getAllClasses();
      const list = Array.isArray(res.data) ? res.data : [];
      return list.map((c: ClassRecord) => ({
        id: c.id ?? (c as any)._id ?? `class-${c.class_name}`,   // real UUID for API calls
        label: `Class ${c.class_name}`,
      }));
    },
    staleTime: 1000 * 60 * 5,
  });

// ─── Sections by class UUID ──────────────────────────────────────────────────
export const useSectionsByClass = (classId: string) =>
  useQuery({
    queryKey: TIMETABLE_KEYS.sections(classId),
    queryFn: async (): Promise<{ id: string; label: string }[]> => {
      const res = await getSectionsByClassId(classId);
      const list = Array.isArray(res.data) ? res.data : [];
      // Client-side filter as safety net — only return sections for this class
      return list
        .filter((s: any) => !s.classId || s.classId === classId)
        .map((s: any) => ({
          id: s.id ?? "",
          label: s.sectionName ?? s.section_name ?? "",
        }));
    },
    enabled: !!classId,
    staleTime: 0,           // always fresh when class changes
    gcTime: 0,
  });


// classId   : real UUID e.g. "9dbb305a-c83e-4da5-84fb-150edcd1a86e"
// sectionId : real UUID e.g. "8a084324-fd68-41da-9342-2c14f6674291"
export const useTimetablePage = (classId: string, classLabel: string, sectionId: string, sectionLabel: string, academicYear: string) =>
  useQuery({
    queryKey: TIMETABLE_KEYS.page(classId, sectionId, academicYear),
    queryFn: async (): Promise<TimetablePageResponse> => {
      let rawList: GetAllTimetableRawItem[] = [];
      try {
        // API: GET /tenant/getalltimetable?class_id=<UUID>&section_id=<UUID>
        const res = await getAllTimetable(classId, sectionId);
        rawList = extractArray(res, "data", "timetables", "result", "entries");
      } catch {
        // fallback to empty grid on error
      }

      const slots = buildSlotsFromRaw(rawList);

      const classTeacher =
        rawList.find((r) => r.teacher?.name)?.teacher?.name ??
        rawList.find((r) => r.teachername)?.teachername ??
        "";

      return {
        classTabs: [{ id: classId, label: classLabel }],
        selectedClassId: classId,
        classTimetable: {
          classId,
          classLabel,
          section: sectionLabel,
          classTeacher,
          academicYear,
          slots,
          resourceLoad: 0,
          substitutionCount: 0,
          conflicts: [],
        },
        examTimetable: {
          title: "Exam Timetable",
          subtitle: "Scheduled Examinations",
          notifyParentsEnabled: true,
          entries: [],
        },
      };
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!classId && !!sectionId,
  });

// ─── Exam timetable ─────────────────────────────────────────────────────────────
export const useExamTimetable = () =>
  useQuery({
    queryKey: TIMETABLE_KEYS.exam(),
    queryFn: async (): Promise<ExamTimetable> => {
      try {
        const res = await getAllExamTimetable({});
        // getAllExamTimetable returns ExamTimetableListItem[] directly,
        // but guard against wrapped shapes just in case.
        // Cast through unknown[] so toExamEntry (which handles both shapes) does the work.
        const rawList: unknown[] = Array.isArray(res)
          ? res
          : extractArray(res, "data", "entries", "exams", "result");
        return {
          title: "Exam Timetable",
          subtitle: "Scheduled Examinations",
          notifyParentsEnabled: true,
          entries: rawList.map(toExamEntry),
        };
      } catch {
        return { title: "Exam Timetable", subtitle: "Scheduled Examinations", notifyParentsEnabled: true, entries: [] };
      }
    },
    staleTime: 1000 * 60 * 5,
  });

// ─── Subject options ────────────────────────────────────────────────────────────
export const useSubjectOptions = () =>
  useQuery({
    queryKey: TIMETABLE_KEYS.subjects(),
    queryFn: async (): Promise<SubjectOption[]> => {
      try {
        const res = await getAllSubjects();
        const list = Array.isArray(res.data) ? res.data : [];
        return list.map((s) => ({ value: s.subject_name, label: s.subject_name }));
      } catch {
        return [];
      }
    },
    staleTime: Infinity,
  });

// ─── Teacher options ────────────────────────────────────────────────────────────
export const useTeacherOptions = () =>
  useQuery({
    queryKey: TIMETABLE_KEYS.teachers(),
    queryFn: async (): Promise<TeacherOption[]> => {
      try {
        const { data } = await api.get("/tenant/getallstaff");
        const list = Array.isArray(data) ? data : data?.staff ?? data?.data ?? [];
        return list.map((s: any) => ({
          value: s._id ?? s.id ?? s.teacher_id ?? "",
          label: s.teacher_name ?? s.teachername ?? s.name ?? s.fullName ?? s.firstName ?? "",
        }));
      } catch {
        return [];
      }
    },
    staleTime: Infinity,
  });

// ─── Exam name options ──────────────────────────────────────────────────────────
export interface ExamNameOption {
  value: string;
  label: string;
}

export const useExamNameOptions = () =>
  useQuery({
    queryKey: [...TIMETABLE_KEYS.all, "exam-names"],
    queryFn: async (): Promise<ExamNameOption[]> => {
      try {
        // Import dynamically to avoid circular deps — uses the same EP constant as exam.api
        const { getAllExams } = await import("@/services/exam.api");
        const list = await getAllExams();
        return list.map((e) => ({
          value: e.id ?? "",
          label: e.exam_name ?? "",
        }));
      } catch {
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

// ─── Save period ────────────────────────────────────────────────────────────────
export const useSavePeriod = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: EditPeriodPayload) => {
      await api.put("/tenant/updatetimetableById", payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TIMETABLE_KEYS.all });
      toast.success("Period updated successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

// ─── Create timetable period ────────────────────────────────────────────────────
export const useCreateTimetable = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateTimetablePayload) => {
      const servicePayload: TimetablePayload = {
        class_id:      payload.class_id ?? payload.className,
        section_id:    payload.section_id ?? payload.sectionName,
        subject_id:    payload.subject_id ?? payload.subjectname,
        teacher_id:    payload.teacher_id,
        period_no:     Number(payload.period_no),
        time_sloat:    payload.time_sloat,
        day_of_week:   payload.day_of_week,
        room_no:       payload.room_no,
        academicYearId: payload.academic_year,
        break_start:   payload.break_start,
        break_end:     payload.break_end,
        lunch_start:   payload.lunch_start,
        lunch_end:     payload.lunch_end,
      };
      return await createServiceSlot(servicePayload);
    },
    onSuccess: async (res, variables) => {
      const createdId = res?.data?.id;
      if (createdId) {
        try {
          const fetched = await getTimetableById(createdId);
          const raw = fetched.data as ServiceTimetableSlot | undefined;
          if (raw) {
            const day = normDay(raw.day_of_week);
            const featureSlot: TimetableSlot = {
              kind: "PERIOD",
              periodNo: raw.period_no,
              startTime: raw.start_time ?? "",
              endTime: raw.end_time ?? "",
              cells: day
                ? {
                    [day]: {
                      subject: raw.subjectname ?? "",
                      teacherName: raw.teachername ?? "",
                      room: raw.room_no,
                    },
                  }
                : {},
            };
            const qk = TIMETABLE_KEYS.page(
              variables.class_id,   // UUID — matches new useTimetablePage key
              variables.sectionName,
              variables.academic_year,
            );
            qc.setQueryData<TimetablePageResponse>(qk, (old) => {
              if (!old) return old;
              // Merge the new cell into the existing slot if period already exists
              const existingIdx = old.classTimetable.slots.findIndex(
                (s) => s.kind === "PERIOD" && s.periodNo === featureSlot.periodNo
              );
              let updatedSlots: TimetableSlot[];
              if (existingIdx >= 0 && day) {
                updatedSlots = old.classTimetable.slots.map((s, i) =>
                  i === existingIdx
                    ? { ...s, cells: { ...s.cells, [day]: featureSlot.cells![day]! } }
                    : s
                );
              } else {
                updatedSlots = [...old.classTimetable.slots, featureSlot];
              }
              return {
                ...old,
                classTimetable: { ...old.classTimetable, slots: updatedSlots },
              };
            });
          }
        } catch {
          // fallback below
        }
      }
      // Invalidate and immediately refetch the timetable page query
      qc.invalidateQueries({ 
        queryKey: TIMETABLE_KEYS.all,
        refetchType: 'active' // Refetch active queries immediately
      });
      toast.success("Timetable period created successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

// ─── Create exam timetable entry ────────────────────────────────────────────────
export const useCreateExamTimetable = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateExamTimetablePayload) => createExamSlot(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TIMETABLE_KEYS.exam() });
      toast.success("Exam timetable created successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

// ─── Update exam timetable entry ────────────────────────────────────────────────
export const useUpdateExamTimetable = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateExamTimetablePayload> }) =>
      api.put(`/tenant/updateexams-timetableById/${id}`, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TIMETABLE_KEYS.exam() });
      toast.success("Exam timetable updated successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

// ─── Add / delete exam ──────────────────────────────────────────────────────────
export const useAddExam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entry: Omit<ExamEntry, "id" | "notifyStatus">) => {
      await api.post("/tenant/addexam", entry);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TIMETABLE_KEYS.exam() });
      toast.success("Exam added successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useDeleteExam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (examId: string) => deleteExamTimetable(examId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TIMETABLE_KEYS.exam() });
      toast.success("Exam deleted successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

// ─── Edit period modal state ────────────────────────────────────────────────────
export interface EditPeriodState {
  open: boolean;
  classId: string;
  day: DayOfWeek | null;
  periodNo: number | null;
  subject: string;
  teacherName: string;
  room: string;
  applyToAllWeeks: boolean;
}

export const useEditPeriodState = () => {
  const initial: EditPeriodState = {
    open: false,
    classId: "class-10",
    day: null,
    periodNo: null,
    subject: "",
    teacherName: "",
    room: "Room 10A (default class room)",
    applyToAllWeeks: false,
  };

  const [state, setState] = useState<EditPeriodState>(initial);

  const openModal = useCallback(
    (classId: string, day: DayOfWeek, periodNo: number, subject: string, teacherName: string) =>
      setState((s) => ({ ...s, open: true, classId, day, periodNo, subject, teacherName })),
    []
  );

  const closeModal = useCallback(() => setState(initial), []);

  const setField = useCallback(
    <K extends keyof EditPeriodState>(key: K, value: EditPeriodState[K]) =>
      setState((s) => ({ ...s, [key]: value })),
    []
  );

  return { state, openModal, closeModal, setField };
};