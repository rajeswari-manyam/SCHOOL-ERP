import {
  mockTimetablePageResponse,
  mockClass10Timetable,
  mockExamTimetable,
  mockSubjectOptions,
  mockTeacherOptions,
} from "../store";
import type {
  TimetablePageResponse,
  ClassTimetable,
  ExamTimetable,
  EditPeriodPayload,
  ExamEntry,
  SubjectOption,
  TeacherOption,
} from "../types/timetable.types";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const timetableApi = {
  /** Full timetable page payload */
  getTimetablePage: async (classId = "class-10"): Promise<TimetablePageResponse> => {
    await delay(500);
    return { ...mockTimetablePageResponse, selectedClassId: classId };
  },

  /** Weekly class timetable for a given class */
  getClassTimetable: async (): Promise<ClassTimetable> => {
    await delay(400);
    return mockClass10Timetable;
  },

  /** Exam timetable */
  getExamTimetable: async (): Promise<ExamTimetable> => {
    await delay(400);
    return mockExamTimetable;
  },

  /** Save an edited period */
  savePeriod: async (payload: EditPeriodPayload): Promise<{ success: boolean }> => {
    await delay(800);
    console.log("Saving period:", payload);
    return { success: true };
  },

  /** Add an exam entry */
  addExam: async (entry: Omit<ExamEntry, "id" | "notifyStatus">): Promise<ExamEntry> => {
    await delay(600);
    return { ...entry, id: `E${Date.now()}`, notifyStatus: "PENDING" };
  },

  /** Delete an exam entry */
  deleteExam: async (examId: string): Promise<{ success: boolean }> => {
    await delay(400);
    console.log("Deleted exam:", examId);
    return { success: true };
  },

  /** Toggle notify-parents for exam timetable */
  toggleNotifyParents: async (enabled: boolean): Promise<{ success: boolean }> => {
    await delay(300);
    console.log("Notify parents enabled:", enabled);
    return { success: true };
  },

  /** Resend exam notification */
  resendNotification: async (): Promise<{ success: boolean; sentCount: number }> => {
    await delay(700);
    return { success: true, sentCount: 66 };
  },

  /** Print timetable as PDF blob */
  printTimetable: async (classId: string): Promise<Blob> => {
    await delay(900);
    return new Blob([`Timetable PDF for ${classId}`], { type: "application/pdf" });
  },

  /** Subject dropdown options */
  getSubjectOptions: async (): Promise<SubjectOption[]> => {
    await delay(200);
    return mockSubjectOptions;
  },

  /** Teacher dropdown options */
  getTeacherOptions: async (): Promise<TeacherOption[]> => {
    await delay(200);
    return mockTeacherOptions;
  },
};