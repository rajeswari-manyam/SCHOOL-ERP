import { useCallback } from "react"
import { useAttendanceStore } from "../store/attendance.store"
import {
  getMonthlyAttendance,
  getYearlyAttendance,
  getAttendanceById,
} from "../../../../services/attendance.api";
import { getAllHolidays } from "../../../../services/holidays.api";
import { fetchAllWorkingDays } from "../../../../services/working-days.api";
import { isDayInSelectedDays } from "../../../school-admin/timetable/utils/Timetable.utils";
import type { DayEntry, MonthSummary, YearlySummary } from "../store/attendance.store"

const WEEKDAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

const SHORT_MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
]

export interface YearlyFetchParams {
  studentId: string
  year: number
  class_id: string
  section_id: string
  academicYearId: string
}

export function useAttendance() {
  // ✅ Select each piece individually so callbacks have stable references.
  // Previously `const store = useAttendanceStore()` returned a new object every
  // render, causing all useCallbacks to re-create → cascading re-renders → browser freeze.
  const currentDate       = useAttendanceStore((s) => s.currentDate)
  const monthlyDays       = useAttendanceStore((s) => s.monthlyDays)
  const monthSummary      = useAttendanceStore((s) => s.monthSummary)
  const yearlySummary     = useAttendanceStore((s) => s.yearlySummary)
  const selectedRecord    = useAttendanceStore((s) => s.selectedRecord)
  const isLoadingMonthly  = useAttendanceStore((s) => s.isLoadingMonthly)
  const isLoadingYearly   = useAttendanceStore((s) => s.isLoadingYearly)
  const isLoadingRecord   = useAttendanceStore((s) => s.isLoadingRecord)
  const monthlyError      = useAttendanceStore((s) => s.monthlyError)
  const yearlyError       = useAttendanceStore((s) => s.yearlyError)
  const recordError       = useAttendanceStore((s) => s.recordError)

  const setCurrentDate    = useAttendanceStore((s) => s.setCurrentDate)
  const setMonthlyDays    = useAttendanceStore((s) => s.setMonthlyDays)
  const setYearlySummary  = useAttendanceStore((s) => s.setYearlySummary)
  const setSelectedRecord = useAttendanceStore((s) => s.setSelectedRecord)
  const setLoadingMonthly = useAttendanceStore((s) => s.setLoadingMonthly)
  const setLoadingYearly  = useAttendanceStore((s) => s.setLoadingYearly)
  const setLoadingRecord  = useAttendanceStore((s) => s.setLoadingRecord)
  const setMonthlyError   = useAttendanceStore((s) => s.setMonthlyError)
  const setYearlyError    = useAttendanceStore((s) => s.setYearlyError)
  const setRecordError    = useAttendanceStore((s) => s.setRecordError)

  // ─── Fetch monthly attendance ────────────────────────────
  const fetchMonthly = useCallback(
    async (studentId: string, month: number, year: number, academicYearId?: string) => {
      setLoadingMonthly(true)
      setMonthlyError(null)
      try {
        const [attRes, holidaysRes, workingDays] = await Promise.all([
          getMonthlyAttendance({ studentId, month, year }),
          getAllHolidays(),
          fetchAllWorkingDays(),
        ]);

        const records: any[] = Array.isArray(attRes?.records)
          ? attRes.records
          : Array.isArray(attRes)
          ? attRes
          : []

        const days: DayEntry[] = records.map((r: any) => ({
          id: r.id,
          date: r.date,
          status: (r.status as string).toLowerCase() as DayEntry["status"],
          reason: r.reason ?? null,
        }))

        const existingDates = new Set(days.map((d) => d.date));
        const pad = (n: number) => String(n).padStart(2, "0");
        const monthStr = pad(month);
        const yearStr = String(year);

        const rawHolidays: any[] = Array.isArray(holidaysRes?.data)
          ? holidaysRes.data
          : Array.isArray(holidaysRes?.holidays)
          ? holidaysRes.holidays
          : (holidaysRes?.data && Array.isArray((holidaysRes.data as any).holidays))
          ? (holidaysRes.data as any).holidays
          : [];

        rawHolidays.forEach((h: any) => {
          const dateStr = h.date;
          if (
            dateStr &&
            dateStr.startsWith(`${yearStr}-${monthStr}`) &&
            !existingDates.has(dateStr)
          ) {
            days.push({
              id: h.id,
              date: dateStr,
              status: "holiday",
              reason: h.holidayname ?? h.name ?? "Holiday",
            });
            existingDates.add(dateStr);
          }
        });

        // Non-working weekdays (e.g. Sunday-only or Sat+Sun off) — from the
        // school's configured working days, not a hardcoded weekend assumption.
        const activeWD = workingDays.find((wd) => wd.academicYearId === academicYearId) ?? workingDays[0];
        const selectedDays = activeWD?.selected_days ?? [];

        if (selectedDays.length > 0) {
          const daysInMonth = new Date(year, month, 0).getDate();
          for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${yearStr}-${monthStr}-${pad(d)}`;
            if (existingDates.has(dateStr)) continue;
            const weekday = WEEKDAY_NAMES[new Date(year, month - 1, d).getDay()];
            if (!isDayInSelectedDays(selectedDays, weekday)) {
              days.push({
                id: `non-working-${dateStr}`,
                date: dateStr,
                status: "holiday",
                reason: "Non-working day",
              });
              existingDates.add(dateStr);
            }
          }
        }

        days.sort((a, b) => a.date.localeCompare(b.date));

        const summary: MonthSummary = {
          present: days.filter((d) => d.status === "present").length,
          absent:  days.filter((d) => d.status === "absent").length,
          late:    days.filter((d) => d.status === "late").length,
          total:   days.filter((d) => d.status !== "holiday").length,
        }

        setMonthlyDays(days, summary)
      } catch (err: any) {
        setMonthlyError(err?.message ?? "Failed to load monthly attendance")
      } finally {
        setLoadingMonthly(false)
      }
    },
    [setLoadingMonthly, setMonthlyError, setMonthlyDays]
  )

  // ─── Fetch yearly attendance ─────────────────────────────
  const fetchYearly = useCallback(
    async (params: YearlyFetchParams) => {
      const { studentId, year, class_id, section_id, academicYearId } = params
      setLoadingYearly(true)
      setYearlyError(null)
      try {
        const res = await getYearlyAttendance({
          studentId,
          year,
          class_id,
          section_id,
          academicYearId,
        })

        const records: any[] = Array.isArray(res?.records)
          ? res.records
          : Array.isArray(res)
          ? res
          : []

        const buckets: Record<number, { present: number; total: number }> = {}
        for (let m = 1; m <= 12; m++) buckets[m] = { present: 0, total: 0 }

        records.forEach((r: any) => {
          const statusLower = (r.status as string).toLowerCase()
          const m = new Date(r.date).getMonth() + 1
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

        const apiSummary = res?.summary
        const totalPresent = apiSummary?.present ?? records.filter(
          (r) => (r.status as string).toLowerCase() === "present" ||
                 (r.status as string).toLowerCase() === "late"
        ).length
        const totalRecords = apiSummary?.total ?? records.length

        const yearly: YearlySummary = {
          present: totalPresent,
          total: totalRecords,
          monthlyTrend,
        }

        setYearlySummary(yearly)
      } catch (err: any) {
        setYearlyError(err?.message ?? "Failed to load yearly attendance")
      } finally {
        setLoadingYearly(false)
      }
    },
    [setLoadingYearly, setYearlyError, setYearlySummary]
  )

  // ─── Fetch single record by ID ───────────────────────────
  const fetchRecord = useCallback(
    async (id: string) => {
      setLoadingRecord(true)
      setRecordError(null)
      try {
        const res = await getAttendanceById(id)
        setSelectedRecord(res.data)
      } catch (err: any) {
        setRecordError(err?.message ?? "Failed to load attendance record")
        setSelectedRecord(null)
      } finally {
        setLoadingRecord(false)
      }
    },
    [setLoadingRecord, setRecordError, setSelectedRecord]
  )

  // ─── Month navigation helpers ────────────────────────────
  const goToPrevMonth = useCallback(
    (studentId: string, academicYearId?: string) => {
      const prev = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      setCurrentDate(prev)
      fetchMonthly(studentId, prev.getMonth() + 1, prev.getFullYear(), academicYearId)
    },
    [currentDate, setCurrentDate, fetchMonthly]
  )

  const goToNextMonth = useCallback(
    (studentId: string, academicYearId?: string) => {
      const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      setCurrentDate(next)
      fetchMonthly(studentId, next.getMonth() + 1, next.getFullYear(), academicYearId)
    },
    [currentDate, setCurrentDate, fetchMonthly]
  )

  return {
    currentDate,
    monthlyDays,
    monthSummary,
    yearlySummary,
    selectedRecord,
    isLoadingMonthly,
    isLoadingYearly,
    isLoadingRecord,
    monthlyError,
    yearlyError,
    recordError,
    setSelectedRecord,
    fetchMonthly,
    fetchYearly,
    fetchRecord,
    goToPrevMonth,
    goToNextMonth,
  }
}
