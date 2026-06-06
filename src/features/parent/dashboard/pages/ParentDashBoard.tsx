import { useEffect } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"

import { StatCard }           from "../../../../components/ui/statcard"
import { AttendanceWidget }   from "../components/AttendanceWidge"
import { HomeworkCard }       from "../components/HomeWorkCard"
import { AnnouncementCard }   from "../components/AnnouncamentsCard"
import { UpcomingExamsTable } from "../components/UpCommingExampleTimeTable"

import { useDashboard }       from "../hooks/usedashboard"
import { useStudentById }     from "../hooks/useStudent"

type ParentLayoutContext = {
  activeChild: {
    id: number
    name: string
    class: string
    school: string
    avatar: string
    section?: string
    studentId?: string
    parentName?: string
    parentId?: string
  }
}

const DashboardPage = () => {
  const { activeChild } = useOutletContext<ParentLayoutContext>()
  const navigate = useNavigate()

  const studentId   = String(activeChild?.studentId ?? activeChild?.id ?? "")
  const className   = activeChild?.class   ?? ""
  const sectionName = activeChild?.section ?? "A"

  const { student } = useStudentById(studentId)

  const {
    homework,
    exams,
    todayStatus,
    isLoadingAttendance,
    isLoadingHomework,
    isLoadingExams,
    fetchAll,
  } = useDashboard()

  const parentName = activeChild?.parentName ?? ""

  // ── Fetch all dashboard data when student / class / section changes ───────
  useEffect(() => {
    if (!studentId) return
    fetchAll({
      studentId,
      className,
      sectionName,
      academicYear: "2025-2026",
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, className, sectionName])

  // ── Map real API fields → display values ──────────────────────────────────
  const studentName = student
    ? `${student.first_name} ${student.last_name}`.trim()
    : (activeChild?.name ?? "")

  const displayClass   = student?.class   ?? className
  const displaySection = student?.section ?? sectionName
  const schoolName     = activeChild?.school ?? ""

  // ── Stat calculations ─────────────────────────────────────────────────────
  const pendingHwCount = homework.length

  const now      = new Date().setHours(0, 0, 0, 0)
  const nextExam = [...exams]
    .filter((e) => new Date(e.exam_date).getTime() >= now)
    .sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime())[0]

  const daysToExam = nextExam
    ? Math.ceil((new Date(nextExam.exam_date).getTime() - now) / (1000 * 60 * 60 * 24))
    : null

  const stats = [
    {
      label: "Today's Attendance",
      badge: {
        text: isLoadingAttendance
          ? "Loading…"
          : todayStatus === "present"
          ? "Present"
          : todayStatus === "absent"
          ? "Absent"
          : "Not Marked",
        variant: (
          isLoadingAttendance || todayStatus === "not_marked"
            ? "red"
            : todayStatus === "present"
            ? "green"
            : "red"
        ) as "green" | "red",
      },
      sub: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      path: "/parent/attendance",
    },
    {
      label: "Homework Due",
      value: isLoadingHomework
        ? undefined
        : `${pendingHwCount} assignment${pendingHwCount !== 1 ? "s" : ""}`,
      badge: {
        text: pendingHwCount > 0 ? "Pending" : "All done",
        variant: (pendingHwCount > 0 ? "amber" : "green") as "amber" | "green",
      },
      path: "/parent/homework",
    },
    {
      label: "Next Exam",
      value: isLoadingExams
        ? undefined
        : daysToExam !== null
        ? `${daysToExam} day${daysToExam !== 1 ? "s" : ""}`
        : "None scheduled",
      badge: nextExam
        ? { text: nextExam.subjectname, variant: "blue" as const }
        : undefined,
      sub: nextExam?.exam_name ?? undefined,
      path: "/parent/exams",
    },
  ]

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">

      {/* ── Welcome banner ──────────────────────────────────────────────────── */}
      <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-bold text-white leading-tight">
            Welcome, {parentName || "…"}
          </h1>
          <p className="text-white/75 text-[13px] mt-1">
            {studentName
              ? `${studentName} · Class ${displayClass}${displaySection ? ` ${displaySection}` : ""}${schoolName ? ` · ${schoolName}` : ""}`
              : "Loading…"}
          </p>
        </div>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((item, i) => (
          <div
            key={i}
            onClick={() => navigate(item.path)}
            className="cursor-pointer hover:scale-[1.02] transition"
          >
            <StatCard {...item} />
          </div>
        ))}
      </div>

      {/* ── Main grid ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <AttendanceWidget />
          <HomeworkCard variant="card" />
        </div>
        <div className="flex flex-col gap-4">
          <AnnouncementCard variant="announcements" />
        </div>
      </div>

      {/* ── Exam timetable ──────────────────────────────────────────────────── */}
      <div className="w-full overflow-x-auto">
        <UpcomingExamsTable />
      </div>

    </div>
  )
}

export default DashboardPage