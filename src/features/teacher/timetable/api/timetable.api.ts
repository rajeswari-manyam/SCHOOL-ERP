import type { WeeklyGrid, UpcomingExam, TimetablePeriod } from "../types/timetable.types";

// In a real app these would be axios/fetch calls to your backend.
export const timetableApi = {
  /** Fetch the teacher's weekly timetable grid */
  getWeeklyGrid: async (_weekOffset: number): Promise<WeeklyGrid> => {
    // const res = await axios.get(`/api/teacher/timetable?weekOffset=${weekOffset}`);
    // return res.data;
    return Promise.resolve({});
  },

  /** Fetch period definitions for the school */
  getPeriods: async (): Promise<TimetablePeriod[]> => {
    return Promise.resolve([]);
  },

  /** Fetch upcoming examinations for teacher's classes */
  getUpcomingExams: async (): Promise<UpcomingExam[]> => {
    return Promise.resolve([]);
  },
};
