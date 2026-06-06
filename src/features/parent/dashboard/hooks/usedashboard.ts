import { useCallback } from "react"
import { useDashboardStore } from "../store/uistore"

import {
  getWeeklyAttendance,
  getMonthlyAttendance,
} from "../../../../services/attendance.api"

import { getHomeworkByClass } from "../../../../services/homework.api"
import { getAllExamTimetable } from "../../../../services/examtimetable.api"
import { getAnnouncementsByType } from "../../../../services/announcements.api"

const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// ✅ Safe ISO date
function isoDate(offsetDays = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().split("T")[0]
}

// ✅ Safe status helper
const getStatus = (status: any) => (status ?? "").toLowerCase()

export function useDashboard() {
  const store = useDashboardStore()

  // ─────────────────────────────────────────────
  // 📅 Weekly Attendance
  // ─────────────────────────────────────────────
  const fetchWeeklyAttendance = useCallback(
    async (studentId: string) => {
      store.setLoadingAttendance(true)

      try {
        const res = await getWeeklyAttendance({
          studentId,
          start_date: isoDate(-6),
          end_date: isoDate(0),
        })

        console.log("Weekly API:", res)

        const records: any[] = Array.isArray(res?.records)
          ? res.records
          : Array.isArray(res)
          ? res
          : []

        const days = records.map((r) => {
          const d = new Date(r?.date)
          const isValid = !isNaN(d.getTime())

          const statusLower = getStatus(r?.status)

          return {
            label: isValid ? SHORT_DAYS[d.getDay()] : "",
            present: statusLower === "present" || statusLower === "late",
          }
        })

        const present = records.filter((r) => {
          const s = getStatus(r?.status)
          return s === "present" || s === "late"
        }).length

        const total = records.length
        const pct = total > 0 ? Math.round((present / total) * 100) : 0

        const todayISO = isoDate(0)

        const todayRecord = records.find(
          (r) => r?.date === todayISO
        )

        const todayStatus: "present" | "absent" | "not_marked" =
          todayRecord
            ? getStatus(todayRecord?.status) === "present" ||
              getStatus(todayRecord?.status) === "late"
              ? "present"
              : "absent"
            : "not_marked"

        store.setWeekDays(days, pct)
        store.setTodayStatus(todayStatus)
      } catch (err) {
        console.error("fetchWeeklyAttendance:", err)
      } finally {
        store.setLoadingAttendance(false)
      }
    },
    [store]
  )

  // ─────────────────────────────────────────────
  // 📅 Monthly Attendance
  // ─────────────────────────────────────────────
  const fetchMonthlyAttendance = useCallback(
    async (studentId: string) => {
      try {
        const now = new Date()

        const res = await getMonthlyAttendance({
          studentId,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        })

        console.log("Monthly API:", res)

        const records: any[] = Array.isArray(res?.records)
          ? res.records
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : []

        const present = records.filter((r) => {
          const s = getStatus(r?.status)
          return s === "present" || s === "late"
        }).length

        const pct =
          records.length > 0
            ? Math.round((present / records.length) * 100)
            : 0

        store.setMonthlyPct(pct)
      } catch (err) {
        console.error("fetchMonthlyAttendance:", err)
      }
    },
    [store]
  )

  // ─────────────────────────────────────────────
  // 📚 Homework
  // ─────────────────────────────────────────────
  const fetchHomework = useCallback(
    async (className: string) => {
      store.setLoadingHomework(true)

      try {
        const numericClass = className.replace(/[^0-9]/g, "")
        const finalClass = numericClass || className

        const res = await getHomeworkByClass(finalClass)

        console.log("Homework API:", res)

        const hw = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : []

        store.setHomework(hw)
      } catch (err) {
        console.error("fetchHomework:", err)
      } finally {
        store.setLoadingHomework(false)
      }
    },
    [store]
  )

  // ─────────────────────────────────────────────
  // 📝 Exams
  // ─────────────────────────────────────────────
  const fetchExams = useCallback(
    async (className: string, sectionName: string) => {
      store.setLoadingExams(true)

      try {
        const res = await getAllExamTimetable(
          className,
          sectionName
        )

        console.log("Exams API:", res)

        const exams = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : []

        store.setExams(exams)
      } catch (err) {
        console.error("fetchExams:", err)
      } finally {
        store.setLoadingExams(false)
      }
    },
    [store]
  )

  // ─────────────────────────────────────────────
  // 📢 Announcements
  // ─────────────────────────────────────────────
  const fetchAnnouncements = useCallback(async () => {
    store.setLoadingAnnouncements(true)

    try {
      const res = await getAnnouncementsByType("All")

      console.log("Announcements API:", res)

      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : []

      store.setAnnouncements(list)
    } catch (err) {
      console.error("fetchAnnouncements:", err)
    } finally {
      store.setLoadingAnnouncements(false)
    }
  }, [store])

  // ─────────────────────────────────────────────
  // 🚀 Fetch All
  // ─────────────────────────────────────────────
  const fetchAll = useCallback(
    async (params: {
      studentId: string
      className: string
      sectionName: string
      academicYear?: string
    }) => {
      try {
        await Promise.all([
          fetchWeeklyAttendance(params.studentId),
          fetchMonthlyAttendance(params.studentId),
          fetchHomework(params.className),
          fetchExams(params.className, params.sectionName),
          fetchAnnouncements(),
        ])
      } catch (err) {
        console.error("fetchAll error:", err)
      }
    },
    [
      fetchWeeklyAttendance,
      fetchMonthlyAttendance,
      fetchHomework,
      fetchExams,
      fetchAnnouncements,
    ]
  )

  return {
    ...store,
    fetchAll,
    fetchWeeklyAttendance,
    fetchMonthlyAttendance,
    fetchHomework,
    fetchExams,
    fetchAnnouncements,
  }
}