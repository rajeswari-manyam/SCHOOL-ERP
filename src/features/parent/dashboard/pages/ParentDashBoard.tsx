import { useEffect, useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"

import { StatCard }            from "../../../../components/ui/statcard"
import { AttendanceWidget }    from "../components/AttendanceWidge"
import { HomeworkCard }        from "../components/HomeWorkCard"
import { FeeStatusCard }       from "../components/FeeStatusCard"
import { AnnouncementCard }    from "../components/AnnouncamentsCard"
import { UpcomingExamsTable }  from "../components/UpCommingExampleTimeTable"

import { useDashboard }        from "../hooks/useDashboard"
import { formatCurrency }      from "../utils/dashboard.utils"
import type { Student }        from "@/services/parent.api"
import { getParentById, getstudentsById } from "@/services/parent.api"

// ─── Layout context ───────────────────────────────────────────────────────────
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

  const [parentName, setParentName] = useState("")
  const [student, setStudent]       = useState<Student | null>(null)

  const {
    fetchAll,
    monthlyPct, fees, isPaid, homework, exams,
    isLoadingAttendance, isLoadingFees, isLoadingHomework, isLoadingExams,
  } = useDashboard()

  const studentId = String(activeChild?.studentId ?? activeChild?.id ?? "")

  // ── Map real API fields → display values ─────────────────────────────────
  // API returns: first_name, last_name, class, section, school_code
  const studentName = student
    ? `${student.first_name} ${student.last_name}`.trim()
    : (activeChild?.name ?? "")

  const className = student?.class     ?? activeChild?.class  ?? ""
  const section   = student?.section   ?? activeChild?.section ?? "A"
  const schoolName = activeChild?.school ?? ""   // API doesn't return school name; use context

  // ── 1. Parent name ────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeChild?.parentName) setParentName(activeChild.parentName)
    if (!activeChild?.parentId) return
    getParentById(activeChild.parentId)
      .then((p) => setParentName(p.parent_name))
      .catch((err) => console.error("Parent fetch failed", err))
  }, [activeChild?.parentId, activeChild?.parentName])

  // ── 2. Student details ────────────────────────────────────────────────────
  useEffect(() => {
    if (!studentId) return
    getstudentsById(studentId)
      .then(setStudent)
      .catch((err) => console.error("Student fetch failed", err))
  }, [studentId])

  // ── 3. Dashboard widgets ──────────────────────────────────────────────────
  // Use resolved class (API → context fallback) so fetchAll isn't blocked
  useEffect(() => {
    if (!studentId) return
    const resolvedClass   = student?.class   ?? activeChild?.class   ?? ""
    const resolvedSection = student?.section ?? activeChild?.section ?? "A"
    if (!resolvedClass) return
    fetchAll({ studentId, className: resolvedClass, sectionName: resolvedSection })
  }, [studentId, student])

  // ── Stat calculations ─────────────────────────────────────────────────────
  const totalPending = fees
    .filter((f) => f.status === "pending" || f.status === "due")
    .reduce((s, f) => s + (f.amount - f.amount_paid), 0)

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
        text: isLoadingAttendance ? "Loading…" : `${monthlyPct}%`,
        variant: (monthlyPct >= 75 ? "green" : "red") as "green" | "red",
      },
      sub: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      path: "/parent/attendance",
    },
    {
      label: "Fee Status",
      value: isLoadingFees ? undefined : isPaid ? undefined : formatCurrency(totalPending),
      badge: {
        text: isLoadingFees ? "Loading…" : isPaid ? "All Paid" : "Pending",
        variant: (isPaid ? "green" : "red") as "green" | "red",
      },
      sub: isPaid ? "No dues" : "Outstanding balance",
      path: "/parent/fees",
    },
    {
      label: "Homework Due",
      value: isLoadingHomework ? undefined : `${pendingHwCount} assignment${pendingHwCount !== 1 ? "s" : ""}`,
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
      badge: nextExam ? { text: nextExam.subjectname, variant: "blue" as const } : undefined,
      sub: nextExam?.exam_name ?? undefined,
      path: "/parent/exams",
    },
  ]

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">

      {/* ── Welcome banner ─────────────────────────────────────────────────── */}
      <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-bold text-white leading-tight">
            Welcome, {parentName || "…"}
          </h1>
          <p className="text-white/75 text-[13px] mt-1">
            {studentName
              ? `${studentName} · Class ${className}${section ? ` ${section}` : ""}${schoolName ? ` · ${schoolName}` : ""}`
              : "Loading…"}
          </p>
        </div>
      </div>

      {/* ── Stat cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, i) => (
          <div key={i} onClick={() => navigate(item.path)} className="cursor-pointer hover:scale-[1.02] transition">
            <StatCard {...item} />
          </div>
        ))}
      </div>

      {/* ── Main grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <AttendanceWidget />
          <HomeworkCard variant={isPaid ? "simple" : "card"} />
        </div>
        <div className="flex flex-col gap-4">
          <FeeStatusCard />
          <AnnouncementCard variant={isPaid ? "announcements" : "latest"} />
        </div>
      </div>

      {/* ── Exam timetable ─────────────────────────────────────────────────── */}
      <div className="w-full overflow-x-auto">
        <UpcomingExamsTable />
      </div>

    </div>
  )
}

export default DashboardPage