import { create } from "zustand"
import type { Homework } from "../../../../services/homework.api";
import type { UpcomingExamItem } from "../../../../services/examtimetable.api";
import type { Announcement } from "../../../../services/announcements.api";



export interface WeekDay {
  label: string   // "Mon", "Tue", …
  present: boolean
}


interface DashboardState {
  // Attendance (weekly)
  weekDays: WeekDay[]
  weeklyPct: number
  monthlyPct: number
  todayStatus: "present" | "absent" | "not_marked"  // today's actual status

  homework: Homework[]

  // Exams
  exams: UpcomingExamItem[]

  // Announcements
  announcements: Announcement[]

  // Loading flags
  isLoadingAttendance: boolean
  isLoadingHomework: boolean
  isLoadingExams: boolean
  isLoadingAnnouncements: boolean

  // Setters
  setWeekDays: (days: WeekDay[], pct: number) => void
  setMonthlyPct: (pct: number) => void
  setTodayStatus: (s: "present" | "absent" | "not_marked") => void
  setHomework: (hw: Homework[]) => void
  setExams: (exams: UpcomingExamItem[]) => void
  setAnnouncements: (a: Announcement[]) => void
  setLoadingAttendance: (v: boolean) => void
  setLoadingHomework: (v: boolean) => void
  setLoadingExams: (v: boolean) => void
  setLoadingAnnouncements: (v: boolean) => void

  reset: () => void
}

const initialState = {
  weekDays: [],
  weeklyPct: 0,
  monthlyPct: 0,
  todayStatus: "not_marked" as const,

  homework: [],
  exams: [],
  announcements: [],

  isLoadingAttendance: false,
  isLoadingHomework: false,
  isLoadingExams: false,
  isLoadingAnnouncements: false,
}

export const useDashboardStore = create<DashboardState>((set) => ({
  ...initialState,

  setWeekDays: (days, pct) => set({ weekDays: days, weeklyPct: pct }),
  setMonthlyPct: (pct) => set({ monthlyPct: pct }),
  setTodayStatus: (s) => set({ todayStatus: s }),
  setHomework: (hw) => set({ homework: hw }),
  setExams: (exams) => set({ exams }),
  setAnnouncements: (a) => set({ announcements: a }),
  setLoadingAttendance: (v) => set({ isLoadingAttendance: v }),
  setLoadingHomework: (v) => set({ isLoadingHomework: v }),
  setLoadingExams: (v) => set({ isLoadingExams: v }),
  setLoadingAnnouncements: (v) => set({ isLoadingAnnouncements: v }),
  reset: () => set({ ...initialState }),
}))
