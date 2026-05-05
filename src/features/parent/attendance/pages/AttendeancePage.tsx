import { useState } from "react"
import { useOutletContext } from "react-router-dom"

import AttendanceHeader from "../components/AttendanceHeader"
import AttendanceStats from "../components/AttendanceStat"
import AttendanceCalendar from "../components/AttendanceCalendar"
import AbsentList from "../components/AbsentList"
import AbsentModal from "../components/AbsentModal"

import typography, { combineTypography } from "../../../../styles/typography"
import { getMonthKey } from "../../../../utils/date";
import { ABSENT_BY_MONTH } from "../data/attendance.data"
import type { AbsentDay } from "../types/attendance.types"

// ─── Layout context ───────────────────────────────────────
type ParentLayoutContext = {
  activeChild: {
    id: number
    name: string
    class: string
    school: string
    avatar: string
  }
}

// ─────────────────────────────────────────────────────────
export default function AttendancePage() {
  const { activeChild } = useOutletContext<ParentLayoutContext>() || {}

  const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 1))
  const [selectedDay, setSelectedDay] = useState<AbsentDay | null>(null)

  const isModalOpen = !!selectedDay

  function goToPrevMonth() {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }

  function goToNextMonth() {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }

  /** Opens the modal for the first absent day of the current month. */
  function handleAbsentStatClick() {
    const key = getMonthKey(currentDate)
    const days = ABSENT_BY_MONTH[key]
    if (days?.length) setSelectedDay(days[0])
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">

      {/* Blurs content behind modal */}
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

          {/* Header */}
          <AttendanceHeader
            currentDate={currentDate}
            onPrev={goToPrevMonth}
            onNext={goToNextMonth}
            child={{
              id: activeChild?.id ?? 0,
              name: activeChild?.name ?? "",
              class: activeChild?.class ?? "",
              section: "A",
            }}
          />

          {/* Stats */}
          <AttendanceStats onAbsentCardClick={handleAbsentStatClick} />

          {/* Calendar + Absent sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
            <AttendanceCalendar
              currentDate={currentDate}
              onAbsentClick={setSelectedDay}
            />
            <AbsentList
              currentDate={currentDate}
              onSelect={setSelectedDay}
            />
          </div>

        </main>
      </div>

      {/* Modal — outside blur wrapper so it stays sharp */}
      {isModalOpen && selectedDay && (
        <AbsentModal data={selectedDay} onClose={() => setSelectedDay(null)} />
      )}

    </div>
  )
}