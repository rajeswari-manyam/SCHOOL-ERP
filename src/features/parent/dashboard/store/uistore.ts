import { create } from "zustand"
import type { Fee } from "../../../../services/fee.api";
import type { Homework } from "../../../../services/homework.api";
import type { ExamTimetable } from "../../../../services/examtimetable.api";
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

 
  fees: Fee[]
  isPaid: boolean

  homework: Homework[]

  // Exams
  exams: ExamTimetable[]

  // Announcements
  announcements: Announcement[]

  // Loading flags
  isLoadingAttendance: boolean
  isLoadingFees: boolean
  isLoadingHomework: boolean
  isLoadingExams: boolean
  isLoadingAnnouncements: boolean

  // Setters
  setWeekDays: (days: WeekDay[], pct: number) => void
  setMonthlyPct: (pct: number) => void
  setFees: (fees: Fee[]) => void
  setHomework: (hw: Homework[]) => void
  setExams: (exams: ExamTimetable[]) => void
  setAnnouncements: (a: Announcement[]) => void
  setLoadingAttendance: (v: boolean) => void
  setLoadingFees: (v: boolean) => void
  setLoadingHomework: (v: boolean) => void
  setLoadingExams: (v: boolean) => void
  setLoadingAnnouncements: (v: boolean) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  weekDays: [],
  weeklyPct: 0,
  monthlyPct: 0,

  fees: [],
  isPaid: false,

  homework: [],
  exams: [],
  announcements: [],

  isLoadingAttendance: false,
  isLoadingFees: false,
  isLoadingHomework: false,
  isLoadingExams: false,
  isLoadingAnnouncements: false,

  setWeekDays: (days, pct) => set({ weekDays: days, weeklyPct: pct }),
  setMonthlyPct: (pct) => set({ monthlyPct: pct }),
  setFees: (fees) => set({
    fees,
    isPaid: fees.length > 0 && fees.every((f) => f.status === "paid"),
  }),
  setHomework: (hw) => set({ homework: hw }),
  setExams: (exams) => set({ exams }),
  setAnnouncements: (a) => set({ announcements: a }),
  setLoadingAttendance: (v) => set({ isLoadingAttendance: v }),
  setLoadingFees: (v) => set({ isLoadingFees: v }),
  setLoadingHomework: (v) => set({ isLoadingHomework: v }),
  setLoadingExams: (v) => set({ isLoadingExams: v }),
  setLoadingAnnouncements: (v) => set({ isLoadingAnnouncements: v }),
}))