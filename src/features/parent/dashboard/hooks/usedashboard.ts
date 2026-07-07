import { useCallback } from "react"
import { useDashboardStore } from "../store/uistore"

import {
  getStudentTodayAttendance,
  getWeeklyAttendance,
  getMonthlyAttendance,
} from "../../../../services/attendance.api";

import { getHomeworkThisWeek } from "../../../../services/homework.api";

import { getUpcomingExams } from "../../../../services/examtimetable.api";

import { getAnnouncementsByType } from "../../../../services/announcements.api";

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
  // ✅ FIX: Select each action individually so they have stable references.
  // Previously `const store = useDashboardStore()` returned a new object every
  // render, causing all useCallbacks to re-create → fetchAll changed → the
  // useEffect in DashboardPage re-fired → infinite API loop → browser freeze.
  const setLoadingAttendance  = useDashboardStore((s) => s.setLoadingAttendance)
  const setLoadingHomework    = useDashboardStore((s) => s.setLoadingHomework)
  const setLoadingExams       = useDashboardStore((s) => s.setLoadingExams)
  const setLoadingAnnouncements = useDashboardStore((s) => s.setLoadingAnnouncements)
  const setWeekDays           = useDashboardStore((s) => s.setWeekDays)
  const setMonthlyPct         = useDashboardStore((s) => s.setMonthlyPct)
  const setTodayStatus        = useDashboardStore((s) => s.setTodayStatus)
  const setHomework           = useDashboardStore((s) => s.setHomework)
  const setExams              = useDashboardStore((s) => s.setExams)
  const setAnnouncements      = useDashboardStore((s) => s.setAnnouncements)

  // Read-only state (used by consumers via spread)
  const weekDays              = useDashboardStore((s) => s.weekDays)
  const weeklyPct             = useDashboardStore((s) => s.weeklyPct)
  const monthlyPct            = useDashboardStore((s) => s.monthlyPct)
  const todayStatus           = useDashboardStore((s) => s.todayStatus)
  const homework              = useDashboardStore((s) => s.homework)
  const exams                 = useDashboardStore((s) => s.exams)
  const announcements         = useDashboardStore((s) => s.announcements)
  const isLoadingAttendance   = useDashboardStore((s) => s.isLoadingAttendance)
  const isLoadingHomework     = useDashboardStore((s) => s.isLoadingHomework)
  const isLoadingExams        = useDashboardStore((s) => s.isLoadingExams)
  const isLoadingAnnouncements = useDashboardStore((s) => s.isLoadingAnnouncements)

  // ─────────────────────────────────────────────
  // 📅 Weekly Attendance
  // ─────────────────────────────────────────────
  const fetchWeeklyAttendance = useCallback(
    async (studentId: string) => {
      setLoadingAttendance(true)

      try {
        const res = await getWeeklyAttendance({
          studentId,
          start_date: isoDate(-6),
          end_date: isoDate(0),
        })

        console.log("Weekly API:", res)

        const records: any[] = res?.records ?? []

        const days = records.map((r) => {
          const d = new Date(r?.date)
          const isValid = !isNaN(d.getTime())
          const statusLower = getStatus(r?.status)
          return {
            label: isValid ? SHORT_DAYS[d.getDay()] : "",
            present: statusLower === "present" || statusLower === "late",
          }
        })

        const summary = res?.summary
        const total = summary?.total ?? records.length
        const present = summary?.present ?? records.filter((r) => {
          const s = getStatus(r?.status)
          return s === "present" || s === "late"
        }).length
        const pct = total > 0 ? Math.round((present / total) * 100) : 0

        setWeekDays(days, pct)
      } catch (err) {
        console.error("fetchWeeklyAttendance:", err)
      } finally {
        setLoadingAttendance(false)
      }
    },
    [setLoadingAttendance, setWeekDays]
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

        const summary = res?.summary
        const totalDays = summary?.total ?? 0

        const pct =
          totalDays > 0
            ? Math.round((summary.present / totalDays) * 100)
            : 0

        setMonthlyPct(pct)
      } catch (err) {
        console.error("fetchMonthlyAttendance:", err)
      }
    },
    [setMonthlyPct]
  )

  // ─────────────────────────────────────────────
  // ✅ Today Attendance (stat card)
  // ─────────────────────────────────────────────
  const fetchTodayAttendance = useCallback(
    async (studentId: string) => {
      setLoadingAttendance(true)

      try {
        const res = await getStudentTodayAttendance(studentId)

        console.log("Today Attendance API:", res)

        const todayStatus: "present" | "absent" | "not_marked" =
          res?.records?.[0]
            ? getStatus(res.records[0].status) === "present" ||
              getStatus(res.records[0].status) === "late"
              ? "present"
              : "absent"
            : "not_marked"

        setTodayStatus(todayStatus)
      } catch (err) {
        console.error("fetchTodayAttendance:", err)
        setTodayStatus("not_marked")
      } finally {
        setLoadingAttendance(false)
      }
    },
    [setLoadingAttendance, setTodayStatus]
  )

  // ─────────────────────────────────────────────
  // 📚 Homework
  // ─────────────────────────────────────────────
  const fetchHomework = useCallback(
    async (classId: string, sectionId?: string) => {
      if (!classId) return
      setLoadingHomework(true)

      try {
        const res = await getHomeworkThisWeek({ class_id: classId, section_id: sectionId })

        console.log("Homework API:", res)

        const hw = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : []

        setHomework(hw)
      } catch (err) {
        console.error("fetchHomework:", err)
      } finally {
        setLoadingHomework(false)
      }
    },
    [setLoadingHomework, setHomework]
  )

  // ─────────────────────────────────────────────
  // 📝 Exams
  // ─────────────────────────────────────────────
  const fetchExams = useCallback(
    async (classId: string, sectionId?: string) => {
      if (!classId) return
      setLoadingExams(true)

      try {
        const res = await getUpcomingExams({
          class_id: classId,
          section_id: sectionId,
        })

        console.log("Exams API:", res)

        const exams = res.status && Array.isArray(res.data) ? res.data : []
        setExams(exams)
      } catch (err) {
        console.error("fetchExams:", err)
      } finally {
        setLoadingExams(false)
      }
    },
    [setLoadingExams, setExams]
  )

  // ─────────────────────────────────────────────
  // 📢 Announcements
  // ─────────────────────────────────────────────
  const fetchAnnouncements = useCallback(async () => {
    setLoadingAnnouncements(true)

    try {
      const res = await getAnnouncementsByType("All")

      console.log("Announcements API:", res)

      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : []

      setAnnouncements(list)
    } catch (err) {
      console.error("fetchAnnouncements:", err)
    } finally {
      setLoadingAnnouncements(false)
    }
  }, [setLoadingAnnouncements, setAnnouncements])

  // ─────────────────────────────────────────────
  // 🚀 Fetch All
  // ─────────────────────────────────────────────
  const fetchAll = useCallback(
    async (params: {
      studentId: string
      classId: string
      sectionId?: string
      academicYear?: string
    }) => {
      useDashboardStore.getState().reset()
      try {
        await Promise.all([
          fetchTodayAttendance(params.studentId),
          fetchWeeklyAttendance(params.studentId),
          fetchMonthlyAttendance(params.studentId),
          fetchHomework(params.classId, params.sectionId),
          fetchExams(params.classId, params.sectionId),
          fetchAnnouncements(),
        ])
      } catch (err) {
        console.error("fetchAll error:", err)
      }
    },
    [
      fetchTodayAttendance,
      fetchWeeklyAttendance,
      fetchMonthlyAttendance,
      fetchHomework,
      fetchExams,
      fetchAnnouncements,
    ]
  )

  return {
    weekDays,
    weeklyPct,
    monthlyPct,
    todayStatus,
    homework,
    exams,
    announcements,
    isLoadingAttendance,
    isLoadingHomework,
    isLoadingExams,
    isLoadingAnnouncements,
    fetchAll,
    fetchTodayAttendance,
    fetchWeeklyAttendance,
    fetchMonthlyAttendance,
    fetchHomework,
    fetchExams,
    fetchAnnouncements,
  }
}