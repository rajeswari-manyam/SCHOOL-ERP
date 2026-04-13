

import { useState } from "react"

import AttendanceHeader from "../components/AttendanceHeader"
import AttendanceStats from "../components/AttendanceStat"
import AttendanceCalendar from "../components/AttendanceCalendar"
import AbsentList from "../components/AbsentList"
import AbsentModal from "../components/AbsentModal"

import typography from "../../../../styles/typography";
import { combineTypography } from "../../../../styles/typography";
import { useOutletContext } from "react-router-dom"
type ParentLayoutContext = {
  activeChild: {
    id: number
    name: string
    class: string
    school: string
    avatar: string
  }
}
export default function AttendancePage() {
    // Single source of truth for current month — shared by header, calendar, absent list
    const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 1)) // April 2025
    const [selectedDay, setSelectedDay] = useState<any>(null)
const { activeChild } = useOutletContext<ParentLayoutContext>() || {};
    const isModalOpen = !!selectedDay

    function goToPrevMonth() {
        setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
    }

    function goToNextMonth() {
        setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
    }

    // Absent stat card opens first absent day of current month (if any)
    function handleAbsentStatClick() {
        const key = getMonthKey(currentDate)
        const ABSENT_DATA: Record<string, { day: number; label: string; time: string }> = {
            "2025-04": { day: 5, label: "April 5, 2025 (Saturday)", time: "9:12 AM" },
            "2025-03": { day: 3, label: "March 3, 2025 (Monday)", time: "8:47 AM" },
            "2025-05": { day: 8, label: "May 8, 2025 (Thursday)", time: "8:55 AM" },
        }
        const day = ABSENT_DATA[key]
        if (day) setSelectedDay(day)
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA]">

            {/* Page wrapper — blurs when modal is open */}
            <div className={`transition-[filter] duration-200 ${isModalOpen ? "blur-sm pointer-events-none" : ""}`}>



                {/* Page Content */}
                <main className="max-w-[1280px] mx-auto pt-8 pr-8 pb-12 pl-8 space-y-6">
 <p className={combineTypography(typography.body.xs, "text-gray-400")}>
  {activeChild?.name || "Student"} › 
  <span className="text-gray-600 font-medium"> Attendance</span>
</p>

                    {/* Header with month navigation — controls currentDate */}
                    <AttendanceHeader
                        currentDate={currentDate}
                        onPrev={goToPrevMonth}
                        onNext={goToNextMonth}
                        child={activeChild}
                    />

                    {/* Stats */}
                    <AttendanceStats onAbsentCardClick={handleAbsentStatClick} />

                    {/* Calendar + Sidebar — both receive currentDate */}
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

            

            </div>{/* end blur wrapper */}

            {/* Modal renders OUTSIDE blur wrapper so it stays sharp */}
            {isModalOpen && (
                <AbsentModal data={selectedDay} onClose={() => setSelectedDay(null)} />
            )}
        </div>
    )
}

function getMonthKey(date: Date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    return `${y}-${m}`
}