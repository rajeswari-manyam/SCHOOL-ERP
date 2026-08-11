import { create } from "zustand"
import type {
  AttendanceRecord as ApiRecord,
 
} from "../../../../services/attendance.api";

// ─── Shape of one calendar day entry ──────────────────────
export interface DayEntry {
  id: string
  date: string           // "YYYY-MM-DD"
  status: "present" | "absent" | "late" | "holiday"
  reason?: string | null
}

// ─── Monthly summary numbers ───────────────────────────────
export interface MonthSummary {
  present: number
  absent: number
  late: number
  total: number
}

// ─── Yearly summary ────────────────────────────────────────
export interface YearlySummary {
  present: number
  total: number
  monthlyTrend: { month: string; attendance: number }[]
}

// ─── Store ─────────────────────────────────────────────────
interface AttendanceState {
  // navigation
  currentDate: Date

  // data
  monthlyDays: DayEntry[]
  monthSummary: MonthSummary
  yearlySummary: YearlySummary | null
  selectedRecord: ApiRecord | null   // loaded by getAttendanceById

  // loading flags
  isLoadingMonthly: boolean
  isLoadingYearly: boolean
  isLoadingRecord: boolean

  // errors
  monthlyError: string | null
  yearlyError: string | null
  recordError: string | null

  // actions
  setCurrentDate: (d: Date) => void
  setMonthlyDays: (days: DayEntry[], summary: MonthSummary) => void
  setYearlySummary: (s: YearlySummary) => void
  setSelectedRecord: (r: ApiRecord | null) => void
  setLoadingMonthly: (v: boolean) => void
  setLoadingYearly: (v: boolean) => void
  setLoadingRecord: (v: boolean) => void
  setMonthlyError: (e: string | null) => void
  setYearlyError: (e: string | null) => void
  setRecordError: (e: string | null) => void
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  currentDate: new Date(),

  monthlyDays: [],
  monthSummary: { present: 0, absent: 0, late: 0, total: 0 },
  yearlySummary: null,
  selectedRecord: null,

  isLoadingMonthly: false,
  isLoadingYearly: false,
  isLoadingRecord: false,

  monthlyError: null,
  yearlyError: null,
  recordError: null,

  setCurrentDate: (d) => set({ currentDate: d }),
  setMonthlyDays: (days, summary) => set({ monthlyDays: days, monthSummary: summary }),
  setYearlySummary: (s) => set({ yearlySummary: s }),
  setSelectedRecord: (r) => set({ selectedRecord: r }),
  setLoadingMonthly: (v) => set({ isLoadingMonthly: v }),
  setLoadingYearly: (v) => set({ isLoadingYearly: v }),
  setLoadingRecord: (v) => set({ isLoadingRecord: v }),
  setMonthlyError: (e) => set({ monthlyError: e }),
  setYearlyError: (e) => set({ yearlyError: e }),
  setRecordError: (e) => set({ recordError: e }),
}))