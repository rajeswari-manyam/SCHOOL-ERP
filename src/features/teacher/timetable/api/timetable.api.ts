import api from "@/config/axios";
import type { WeeklyGrid, UpcomingExam, TimetablePeriod } from "../types/timetable.types";

export const timetableApi = {
  getWeeklyGrid: async (_weekOffset: number): Promise<WeeklyGrid> => {
    try {
      const { data } = await api.get<WeeklyGrid>("/tenant/teacher/timetable", { params: { weekOffset: _weekOffset } });
      return data;
    } catch {
      return {};
    }
  },

  getPeriods: async (): Promise<TimetablePeriod[]> => {
    try {
      const { data } = await api.get<TimetablePeriod[]>("/tenant/teacher/timetable/periods");
      return data;
    } catch {
      return [];
    }
  },

  getUpcomingExams: async (): Promise<UpcomingExam[]> => {
    try {
      const { data } = await api.get<UpcomingExam[]>("/tenant/teacher/timetable/exams");
      return data;
    } catch {
      return [];
    }
  },
};
