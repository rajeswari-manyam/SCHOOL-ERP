import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"

import AttendanceHeader from "../components/AttendanceHeader"
import AttendanceStats from "../components/AttendanceStat"
import AttendanceCalendar from "../components/AttendanceCalendar"
import AbsentList from "../components/AbsentList"
import AbsentModal from "../components/AbsentModal"

import typography, { combineTypography } from "../../../../styles/typography"
import { useAttendance } from "../hooks/useattedance"
import { useAttendanceStore } from "../store/attedance.store"
import type { AbsentData } from "../types/attendance.types"
import { useStudentById } from "../../dashboard/hooks/useStudent"
import { getAcademicYearById } from "../../../../services/academicYear.api"
import type { AcademicYearById } from "../../../../services/academicYear.api"

// ─── Layout context ───────────────────────────────────────
type ParentLayoutContext = {
  activeChild: {
    id: number
    name: string
    class: string
    school: string
    avatar: string
    section?: string
    studentId?: string
    classDetail?: { id: string; className: string } | null
    sectionDetail?: { id: string; sectionName: string } | null
  }
}

// ─────────────────────────────────────────────────────────
export default function AttendancePage() {
  const { activeChild } = useOutletContext<ParentLayoutContext>() || {}

  // ✅ Resolve real class + section UUIDs from student detail
  const studentId = String(activeChild?.studentId ?? activeChild?.id ?? "")
  const { student } = useStudentById(studentId)

  // Use context data immediately (already fetched by ParentLayout), fall back to API
  const classId         = activeChild?.classDetail?.id   ?? student?.classDetail?.id ?? ""
  const sectionId       = activeChild?.sectionDetail?.id ?? student?.sectionDetail?.id ?? ""
  const academicYearId  = (activeChild as any)?.academicYearId ?? student?.academicYearId ?? ""

  const displayClass   = student?.classDetail?.class_name ?? activeChild?.classDetail?.className ?? activeChild?.class ?? ""
  const displaySection = student?.sectionDetail?.sectionName ?? activeChild?.sectionDetail?.sectionName ?? activeChild?.section ?? ""

  // ✅ Academic year display name
  const [academicYear, setAcademicYear] = useState<AcademicYearById | null>(null)

  useEffect(() => {
    if (!academicYearId) return
    getAcademicYearById(academicYearId).then(setAcademicYear)
  }, [academicYearId])

  const {
    currentDate,
    monthSummary,
    yearlySummary,
    isLoadingMonthly,
    isLoadingYearly,
    fetchMonthly,
    fetchYearly,
    fetchRecord,
    goToPrevMonth,
    goToNextMonth,
    setSelectedRecord,
  } = useAttendance()

  const monthlyDays = useAttendanceStore((s) => s.monthlyDays)

  const [selectedDay, setSelectedDay] = useState<AbsentData | null>(null)
  const isModalOpen = !!selectedDay

  // ─── Initial data fetch ───────────────────────────────
  // Waits for student UUIDs to resolve before calling yearly API
  useEffect(() => {
    if (!studentId) return

    const month = currentDate.getMonth() + 1
    const year  = currentDate.getFullYear()

    // Monthly doesn't need extra params
    fetchMonthly(studentId, month, year)

    // ✅ Only call yearly once class/section/academicYear UUIDs are available
    if (!classId || !sectionId || !academicYearId) return

    fetchYearly({
      studentId,
      year,
      class_id: classId,
      section_id: sectionId,
      academicYearId,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, classId, sectionId, academicYearId])

  // ─── Helpers ─────────────────────────────────────────
  function openModal(id: string, day: number, label: string, time = "") {
    setSelectedDay({ id, day, label, time })
    fetchRecord(id)
  }

  function closeModal() {
    setSelectedDay(null)
    setSelectedRecord(null)
  }

  function handleAbsentStatClick() {
    const first = [...monthlyDays]
      .filter((d) => d.status === "absent")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
    if (!first) return
    const d = new Date(first.date)
    openModal(first.id, d.getDate(), first.date)
  }

  function handleCalendarAbsentClick(id: string, day: number, label: string) {
    openModal(id, day, label)
  }

  function handleListSelect(item: { id: string; day: number; label: string; time: string }) {
    openModal(item.id, item.day, item.label, item.time)
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div
        className={`transition-[filter] duration-200 ${
          isModalOpen ? "blur-sm pointer-events-none" : ""
        }`}
      >
        <main className="max-w-[1280px] mx-auto pt-8 pr-8 pb-12 pl-8 space-y-6">

          {/* Breadcrumb */}
          <p className={combineTypography(typography.body.xs, "text-gray-400")}>
            {activeChild?.name || "Student"} ›{" "}
            <span className="text-gray-600 font-medium">Attendance</span>
          </p>

          {/* Header with month nav */}
          <AttendanceHeader
            currentDate={currentDate}
            onPrev={() => goToPrevMonth(studentId)}
            onNext={() => goToNextMonth(studentId)}
            isLoading={isLoadingMonthly}
            child={{
              id: activeChild?.id ?? 0,
              name: activeChild?.name ?? "",
              class: displayClass,
              section: displaySection,
              academicYear: academicYear?.yearName ?? "",
            }}
          />

          {/* Stats row */}
          <AttendanceStats
            onAbsentCardClick={handleAbsentStatClick}
            monthSummary={monthSummary}
            yearlySummary={yearlySummary}
            isLoadingMonthly={isLoadingMonthly}
            isLoadingYearly={isLoadingYearly}
          />

          {/* Calendar + sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
            <AttendanceCalendar
              currentDate={currentDate}
              onAbsentClick={handleCalendarAbsentClick}
              isLoading={isLoadingMonthly}
            />
            <AbsentList
              currentDate={currentDate}
              onSelect={handleListSelect}
              isLoading={isLoadingMonthly}
            />
          </div>

        </main>
      </div>

      {/* Modal – outside blur wrapper so it stays sharp */}
      {isModalOpen && selectedDay && (
        <AbsentModal data={selectedDay} onClose={closeModal} />
      )}
    </div>
  )
}