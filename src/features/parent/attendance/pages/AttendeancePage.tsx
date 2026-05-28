import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"

import AttendanceHeader   from "../components/AttendanceHeader"
import AttendanceStats    from "../components/AttendanceStat"
import AttendanceCalendar from "../components/AttendanceCalendar"
import AbsentList         from "../components/AbsentList"
import AbsentModal        from "../components/AbsentModal"

import typography, { combineTypography } from "../../../../styles/typography"
import { useAttendance } from "../hooks/useattedance";
import { useAttendanceStore } from "../store/attedance.store"
import type { AbsentData } from "../types/attendance.types"

// ─── Layout context ───────────────────────────────────────
type ParentLayoutContext = {
  activeChild: {
    id: number
    name: string
    class: string
    school: string
    avatar: string
    section?: string
    studentId?: string   // preferred ID for API calls
  }
}

// ─────────────────────────────────────────────────────────
export default function AttendancePage() {
  const { activeChild } = useOutletContext<ParentLayoutContext>() || {}

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

  // Read raw days from store to compute "first absent day" for stat card click
  const monthlyDays = useAttendanceStore((s) => s.monthlyDays)

  const [selectedDay, setSelectedDay] = useState<AbsentData | null>(null)
  const isModalOpen = !!selectedDay

  // Derive the student ID — fall back to id cast to string
  const studentId = String(activeChild?.studentId ?? activeChild?.id ?? "")

  // ─── Initial data fetch ───────────────────────────────
  useEffect(() => {
    if (!studentId) return
    const month = currentDate.getMonth() + 1
    const year  = currentDate.getFullYear()
    fetchMonthly(studentId, month, year)
    fetchYearly(studentId, year)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId])

  // ─── Helpers ─────────────────────────────────────────
  function openModal(id: string, day: number, label: string, time = "") {
    setSelectedDay({ id, day, label, time })
    fetchRecord(id)
  }

  function closeModal() {
    setSelectedDay(null)
    setSelectedRecord(null)
  }

  // Absent stat card → open the first absent day of the month
  function handleAbsentStatClick() {
    const first = [...monthlyDays]
      .filter((d) => d.status === "absent")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
    if (!first) return
    const d = new Date(first.date)
    openModal(first.id, d.getDate(), first.date)
  }

  // Calendar day click
  function handleCalendarAbsentClick(id: string, day: number, label: string) {
    openModal(id, day, label)
  }

  // Absent list item click
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
              id:      activeChild?.id      ?? 0,
              name:    activeChild?.name    ?? "",
              class:   activeChild?.class   ?? "",
              section: activeChild?.section ?? "A",
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