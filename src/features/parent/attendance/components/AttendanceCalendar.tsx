const ATTENDANCE_DATA: Record<string, { absent: number[]; present: number[] }> = {
    "2025-04": {
        absent: [5, 6],
        present: [1, 2, 3, 4, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 21, 22],
    },
    "2025-03": {
        absent: [3, 17],
        present: [4, 5, 6, 10, 11, 12, 13, 18, 19, 20, 24, 25, 26, 27],
    },
    "2025-05": {
        absent: [8],
        present: [1, 2, 5, 6, 7, 9, 12, 13, 14, 15, 16],
    },
}

const ABSENT_META: Record<string, Record<number, { label: string; time: string }>> = {
    "2025-04": {
        5: { label: "April 5, 2025 (Saturday)", time: "9:12 AM" },
        6: { label: "April 6, 2025 (Sunday)", time: "8:52 AM" },
    },
    "2025-03": {
        3: { label: "March 3, 2025 (Monday)", time: "8:47 AM" },
        17: { label: "March 17, 2025 (Monday)", time: "9:05 AM" },
    },
    "2025-05": {
        8: { label: "May 8, 2025 (Thursday)", time: "8:55 AM" },
    },
}

const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]

function getMonthKey(date: Date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    return `${y}-${m}`
}

function isWeekend(year: number, month: number, day: number) {
    const dow = new Date(year, month, day).getDay()
    return dow === 0 || dow === 6
}

interface AbsentDayData {
    day: number
    label: string
    time: string
}

interface Props {
    currentDate: Date
    onAbsentClick: (data: AbsentDayData) => void
}

export default function AttendanceCalendar({ currentDate, onAbsentClick }: Props) {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const key = getMonthKey(currentDate)

    const data = ATTENDANCE_DATA[key] ?? { absent: [], present: [] }
    const absentMeta = ABSENT_META[key] ?? {}

    const firstDow = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrev = new Date(year, month, 0).getDate()

    const today = new Date()
    const isThisMonth = today.getFullYear() === year && today.getMonth() === month
    const todayNum = isThisMonth ? today.getDate() : -1

    const cells: React.ReactNode[] = []

    // Leading prev-month cells
    for (let i = 0; i < firstDow; i++) {
        cells.push(
            <div key={`prev-${i}`} className="h-11 flex items-center justify-center text-[13px] text-gray-300">
                {daysInPrev - firstDow + 1 + i}
            </div>
        )
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
        const isAbsent = data.absent.includes(d)
        const isWknd = isWeekend(year, month, d)
        const isToday = d === todayNum
        const isPresent = data.present.includes(d)

        cells.push(
            <div
                key={d}
                className="h-11 flex items-center justify-center"
                onClick={() => {
                    if (isAbsent && absentMeta[d]) {
                        onAbsentClick({ day: d, ...absentMeta[d] })
                    }
                }}
            >
                {isToday ? (
                    // Today — filled blue circle, white text (same shape as present/absent)
                    <div className="w-8 h-8 rounded-full bg-[#3525CD] flex items-center justify-center text-[13px] font-semibold text-white ring-2 ring-offset-1 ring-[#3525CD] transition-all active:scale-95">
                        {d}
                    </div>
                ) : isAbsent ? (
                    // Absent — filled red circle, white text, clickable
                    <div
                        className="w-8 h-8 rounded-full bg-[#BA1A1A] flex items-center justify-center text-[13px] font-semibold text-white cursor-pointer hover:opacity-80 transition-all active:scale-95"
                    >
                        {d}
                    </div>
                ) : isPresent ? (
                    // Present — filled indigo circle, white text (same shape as absent)
                    <div className="w-8 h-8 rounded-full bg-[#3525CD] flex items-center justify-center text-[13px] font-semibold text-white hover:opacity-80 transition-all">
                        {d}
                    </div>
                ) : isWknd ? (
                    // Weekend — plain muted text
                    <span className="text-[13px] text-gray-400">{d}</span>
                ) : (
                    // Future / no data
                    <span className="text-[13px] text-gray-400 hover:text-gray-600 transition-colors">{d}</span>
                )}
            </div>
        )
    }

    // Trailing next-month cells
    const totalCells = firstDow + daysInMonth
    const trailing = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)
    for (let i = 1; i <= trailing; i++) {
        cells.push(
            <div key={`next-${i}`} className="h-11 flex items-center justify-center text-[13px] text-gray-300">
                {i}
            </div>
        )
    }

    const monthLabel = `Monthly Attendance Calendar — ${MONTH_NAMES[month]} ${year}`

    return (
       <div className="bg-white border border-gray-200 rounded-xl p-5 transition-all duration-200 hover:border-[#3525CD] hover:shadow-md">
            <p className="text-[13px] font-semibold text-gray-800 mb-4">{monthLabel}</p>

            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 mb-1">
                {DAYS_OF_WEEK.map((d) => (
                    <div key={d} className="text-[11px] text-gray-400 text-center py-1 font-medium">{d}</div>
                ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-0.5">{cells}</div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-gray-100">
                {[
                    { color: "bg-[#3525CD]", label: "Present" },
                    { color: "bg-[#BA1A1A]", label: "Absent" },
                    { color: "bg-[#E5EEFF]", label: "Holiday" },
                    { color: "bg-gray-300", label: "Weekend" },
                    { color: "bg-[#3525CD] ring-2 ring-offset-1 ring-[#3525CD]", label: "Today" },
                ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                        <div className={`w-3 h-3 rounded-full ${color}`} />
                        {label}
                    </div>
                ))}
            </div>
        </div>
    )
}