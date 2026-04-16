import { mockTimetable, mockExaminations } from "../store";
import type {
  ClassTimetable,
  UpcomingExaminations,
} from "../types/Classtimetable.types";

// Simulated delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const classTimetableApi = {
  /** Full weekly timetable for the class */
  getTimetable: async (): Promise<ClassTimetable> => {
    await delay(400);
    return mockTimetable;
  },

  /** Upcoming examinations list */
  getUpcomingExaminations: async (): Promise<UpcomingExaminations> => {
    await delay(300);
    return mockExaminations;
  },

  /** Trigger a browser print for the timetable page */
  printTimetable: () => {
    window.print();
  },

  /** Simulate adding exams to calendar (returns true on success) */
  addExamsToCalendar: async (examIds: string[]): Promise<boolean> => {
    await delay(600);
    console.log("Adding to calendar:", examIds);
    return true;
  },
};