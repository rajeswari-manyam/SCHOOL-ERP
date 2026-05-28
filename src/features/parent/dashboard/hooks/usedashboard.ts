import { useCallback } from "react"
import { useDashboardStore } from "../store/uistore"
import { getWeeklyAttendance, getMonthlyAttendance } from "../../../../services/attendance.api";
import { getAllFees } from "../../../../services/fee.api";
import { getHomeworkByClass } from "../../../../services/homework.api";
import { getAllExamTimetable } from "../../../../services/examtimetable.api";
import { getAnnouncementsByType } from "../../../../services/announcements.api";

const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]


function isoDate(offsetDays = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().split("T")[0]
}

export function useDashboard() {
  const store = useDashboardStore()

 
  const fetchWeeklyAttendance = useCallback(
    async (studentId: string) => {
      store.setLoadingAttendance(true)
      try {
        const res = await getWeeklyAttendance({
          studentId,
          start_date: isoDate(-6),
          end_date: isoDate(0),
        })

        const records = res.records ?? []

        const days = records.map((r) => {
          const d = new Date(r.date)
          return {
            label: SHORT_DAYS[d.getDay()],
            present: r.status === "present" || r.status === "late",
          }
        })

        const { present = 0, total = 0 } = res.summary ?? {}
        const pct = total > 0 ? Math.round((present / total) * 100) : 0

        store.setWeekDays(days, pct)
      } catch (err) {
        console.error("fetchWeeklyAttendance:", err)
      } finally {
        store.setLoadingAttendance(false)
      }
    },
  
    []
  )


  const fetchMonthlyAttendance = useCallback(
    async (studentId: string) => {
      try {
        const now = new Date()
        const res = await getMonthlyAttendance({
          studentId,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        })
        const records: any[] = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : []

        const present = records.filter(
          (r) => r.status === "present" || r.status === "late"
        ).length
        const pct =
          records.length > 0
            ? Math.round((present / records.length) * 100)
            : 0
        store.setMonthlyPct(pct)
      } catch (err) {
        console.error("fetchMonthlyAttendance:", err)
      }
    },

    []
  )


 const fetchFees = useCallback(
  async (studentId: string, academicYear?: string) => {
    store.setLoadingFees(true)
    try {

     
      console.log("Fees Params:", {
        student_id: studentId,
        fee_type: "Tuition",
        status: "pending",
        academic_year: academicYear,
      });

      const res = await getAllFees({
        student_id: studentId,
        fee_type: "Tuition",
        status: "pending",
        academic_year: academicYear || "2025-2026",
      })

      const fees = Array.isArray(res?.data) ? res.data : []
      store.setFees(fees)
       console.log("Student ID:", studentId);
      } catch (err) {
        console.error("fetchFees:", err)
      } finally {
        store.setLoadingFees(false)
      }
    },
   
    []
  )


  const fetchHomework = useCallback(
    async (className: string) => {
      store.setLoadingHomework(true)
      try {
       const res = await getHomeworkByClass(className.replace(/[A-Z]/g, "")) 
        const hw = Array.isArray(res?.data) ? res.data : []
        store.setHomework(hw)
      } catch (err) {
        console.error("fetchHomework:", err)
      } finally {
        store.setLoadingHomework(false)
      }
    },
  
    []
  )

  const fetchExams = useCallback(
    async (className: string, sectionName: string) => {
      store.setLoadingExams(true)
      try {
        const res = await getAllExamTimetable(className, sectionName)
        const exams = Array.isArray(res?.data) ? res.data : []
        store.setExams(exams)
      } catch (err) {
        console.error("fetchExams:", err)
      } finally {
        store.setLoadingExams(false)
      }
    },

    []
  )

 
  const fetchAnnouncements = useCallback(async () => {
    store.setLoadingAnnouncements(true)
    try {
      const res = await getAnnouncementsByType("All")
      const list = Array.isArray(res?.data) ? res.data : []
      store.setAnnouncements(list)
    } catch (err) {
      console.error("fetchAnnouncements:", err)
    } finally {
      store.setLoadingAnnouncements(false)
    }

  }, [])


  const fetchAll = useCallback(
    (params: {
      studentId: string
      className: string
      sectionName: string
      academicYear?: string
    }) => {
      fetchWeeklyAttendance(params.studentId)
      fetchMonthlyAttendance(params.studentId)
      fetchFees(params.studentId, params.academicYear)
      fetchHomework(params.className)
      fetchExams(params.className, params.sectionName)
      fetchAnnouncements()
    },
    [
      fetchWeeklyAttendance,
      fetchMonthlyAttendance,
      fetchFees,
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
    fetchFees,
    fetchHomework,
    fetchExams,
    fetchAnnouncements,
  }
}