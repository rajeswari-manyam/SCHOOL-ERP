import { useCallback } from "react"
import { useAttendanceStore } from "../store/attedance.store"
import {
  getMonthlyAttendance,
  getYearlyAttendance,
  getAttendanceById,
} from "../../../../services/attendance.api";
import type { DayEntry, MonthSummary, YearlySummary } from "../store/attedance.store"

const SHORT_MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
]

export function useAttendance() {
  const store = useAttendanceStore()

  // ─── Fetch monthly attendance ────────────────────────────
  const fetchMonthly = useCallback(
    async (studentId: string, month: number, year: number) => {
      store.setLoadingMonthly(true)
      store.setMonthlyError(null)
      try {
        const res = await getMonthlyAttendance({ studentId, month, year })

        // Normalise: API may return { records: [...] }, { data: [...] } or bare array
        const records: any[] = Array.isArray(res)
          ? res
          : Array.isArray(res?.records)
          ? res.records
          : Array.isArray(res?.data)
          ? res.data
          : []

        const days: DayEntry[] = records.map((r: any) => ({
          id: r.id,
          date: r.date,
          status: (r.status as string).toLowerCase() as DayEntry["status"],
          reason: r.reason ?? null,
        }))

        const summary: MonthSummary = {
          present: days.filter((d) => d.status === "present").length,
          absent:  days.filter((d) => d.status === "absent").length,
          late:    days.filter((d) => d.status === "late").length,
          total:   days.length,
        }

        store.setMonthlyDays(days, summary)
      } catch (err: any) {
        store.setMonthlyError(err?.message ?? "Failed to load monthly attendance")
      } finally {
        store.setLoadingMonthly(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // ─── Fetch yearly attendance ─────────────────────────────
  const fetchYearly = useCallback(
    async (studentId: string, year: number) => {
      store.setLoadingYearly(true)
      store.setYearlyError(null)
      try {
        const res = await getYearlyAttendance({ studentId, year })

        // Normalise
        const records: any[] = Array.isArray(res)
          ? res
          : Array.isArray(res?.records)
          ? res.records
          : Array.isArray(res?.data)
          ? res.data
          : []

        // Build month-level trend buckets
        const buckets: Record<number, { present: number; total: number }> = {}
        for (let m = 1; m <= 12; m++) buckets[m] = { present: 0, total: 0 }

        records.forEach((r: any) => {
          const statusLower = (r.status as string).toLowerCase()
          const m = new Date(r.date).getMonth() + 1  // 1-based
          if (buckets[m]) {
            buckets[m].total++
            if (statusLower === "present" || statusLower === "late") buckets[m].present++
          }
        })

        const monthlyTrend = Object.entries(buckets)
          .filter(([, v]) => v.total > 0)
          .map(([month, v]) => ({
            month: SHORT_MONTHS[Number(month) - 1],
            attendance: Math.round((v.present / v.total) * 100),
          }))

        const totalPresent = records.filter(
          (r) => (r.status as string).toLowerCase() === "present" || (r.status as string).toLowerCase() === "late"
        ).length

        const yearly: YearlySummary = {
          present: totalPresent,
          total: records.length,
          monthlyTrend,
        }

        store.setYearlySummary(yearly)
      } catch (err: any) {
        store.setYearlyError(err?.message ?? "Failed to load yearly attendance")
      } finally {
        store.setLoadingYearly(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // ─── Fetch single record by ID ───────────────────────────
  const fetchRecord = useCallback(
    async (id: string) => {
      store.setLoadingRecord(true)
      store.setRecordError(null)
      try {
        const res = await getAttendanceById(id)
        store.setSelectedRecord(res.data)
      } catch (err: any) {
        store.setRecordError(err?.message ?? "Failed to load attendance record")
        store.setSelectedRecord(null)
      } finally {
        store.setLoadingRecord(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // ─── Month navigation helpers ────────────────────────────
  const goToPrevMonth = useCallback(
    (studentId: string) => {
      const d = store.currentDate
      const prev = new Date(d.getFullYear(), d.getMonth() - 1, 1)
      store.setCurrentDate(prev)
      fetchMonthly(studentId, prev.getMonth() + 1, prev.getFullYear())
    },
    [store, fetchMonthly]
  )

  const goToNextMonth = useCallback(
    (studentId: string) => {
      const d = store.currentDate
      const next = new Date(d.getFullYear(), d.getMonth() + 1, 1)
      store.setCurrentDate(next)
      fetchMonthly(studentId, next.getMonth() + 1, next.getFullYear())
    },
    [store, fetchMonthly]
  )

  return {
    ...store,
    fetchMonthly,
    fetchYearly,
    fetchRecord,
    goToPrevMonth,
    goToNextMonth,
  }
}