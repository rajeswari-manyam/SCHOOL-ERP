import axios from "@/config/axios";
import type {
  WeeklyTimetable,
  ExamScheduleEntry,
  EditPeriodPayload,
  AddExamPayload,
  TimetableConflict,
  TeacherOption,
  SubjectOption,
} from "../types/timetable.types";

export const timetableApi = {
  getTimetable: async (classId: string): Promise<WeeklyTimetable> => {
    const { data } = await axios.get(`/school-admin/timetable/${classId}`);
    return data;
  },

  getExamSchedule: async (classId: string): Promise<ExamScheduleEntry[]> => {
    const { data } = await axios.get(`/school-admin/timetable/${classId}/exams`);
    return data;
  },

  checkConflicts: async (
    payload: Omit<EditPeriodPayload, "applyToAllWeeks">
  ): Promise<TimetableConflict[]> => {
    const { data } = await axios.post(
      "/school-admin/timetable/check-conflicts",
      payload
    );
    return data;
  },

  updatePeriod: async (payload: EditPeriodPayload): Promise<WeeklyTimetable> => {
    const { data } = await axios.patch(
      `/school-admin/timetable/${payload.classId}/period`,
      payload
    );
    return data;
  },

  addExam: async (payload: AddExamPayload): Promise<ExamScheduleEntry> => {
    const { data } = await axios.post("/school-admin/timetable/exams", payload);
    return data;
  },

  updateExam: async (
    id: string,
    payload: Partial<AddExamPayload>
  ): Promise<ExamScheduleEntry> => {
    const { data } = await axios.patch(`/school-admin/timetable/exams/${id}`, payload);
    return data;
  },

  deleteExam: async (id: string): Promise<void> => {
    await axios.delete(`/school-admin/timetable/exams/${id}`);
  },

  resendNotification: async (classId: string): Promise<{ sentTo: number }> => {
    const { data } = await axios.post(
      `/school-admin/timetable/${classId}/exams/notify`
    );
    return data;
  },

  getTeachers: async (): Promise<TeacherOption[]> => {
    const { data } = await axios.get("/school-admin/teachers");
    return data;
  },

  getSubjects: async (): Promise<SubjectOption[]> => {
    const { data } = await axios.get("/school-admin/subjects");
    return data;
  },
};