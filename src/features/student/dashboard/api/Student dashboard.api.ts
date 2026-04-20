import {
  mockStudentDashboard,
  mockSchedule,
  mockHomework,
  mockResults,
  mockAnnouncements,
  mockAttendance,
} from "../store";
import type {
  StudentDashboardResponse,
  AttendanceMonth,
  TodaySchedule,
  HomeworkWeek,
  ExamResult,
  Announcement,
  DashboardStatCards,
} from "../types/Student dashboard.types";

// Simulated delay for testing
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const studentDashboardApi = {
  /** Full dashboard payload (stats + schedule + homework + results + announcements) */
  getDashboard: async (): Promise<StudentDashboardResponse> => {
    await delay(500);
    return {
      student: mockStudentDashboard.student,
      stats: mockStudentDashboard.stats as DashboardStatCards,
      todaySchedule: mockSchedule as TodaySchedule,
      homeworkWeek: mockHomework as HomeworkWeek,
      recentResults: mockResults as ExamResult[],
      latestAnnouncements: mockAnnouncements as Announcement[],
    };
  },

  /** Attendance calendar for a specific month (1-based) */
  getAttendance: async (): Promise<AttendanceMonth> => {
    await delay(400);
    return mockAttendance as AttendanceMonth;
  },

  /** Today's timetable */
  getTodaySchedule: async (): Promise<TodaySchedule> => {
    await delay(400);
    return mockSchedule as TodaySchedule;
  },

  /** Homework due this week */
  getHomeworkWeek: async (): Promise<HomeworkWeek> => {
    await delay(400);
    return mockHomework as HomeworkWeek;
  },

  /** Download homework brief as a blob */
  downloadHomeworkBrief: async (homeworkId: string): Promise<Blob> => {
    await delay(800);
    const text = `Homework Brief for ID: ${homeworkId}`;
    return new Blob([text], { type: "application/pdf" });
  },

  /** Recent exam results */
  getRecentResults: async (limit = 5): Promise<ExamResult[]> => {
    await delay(400);
    return mockResults.slice(0, limit) as ExamResult[];
  },

  /** Latest announcements */
  getAnnouncements: async (limit = 5): Promise<Announcement[]> => {
    await delay(400);
    return mockAnnouncements.slice(0, limit) as Announcement[];
  },
};