import React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { AttendanceCalendarProps } from "../types/attendance.types"
import {
  getMonthKey,
  isWeekend,
  getMonthMeta,
  DAYS_OF_WEEK,
  MONTH_NAMES,
} from "../../../../utils/date"
import { ATTENDANCE_DATA, ABSENT_META } from "../data/attendance.data"

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

const DAY_BASE = "w-[34px] h-[34px] rounded-full flex items-center justify-center text-[13px] font-medium"

export default function AttendanceCalendar({
  currentDate,
  onAbsentClick,
}: AttendanceCalendarProps) {
  const { year, month, firstDow, daysInMonth, daysInPrev } =
    getMonthMeta(currentDate)

  const key = getMonthKey(currentDate)
  const data = ATTENDANCE_DATA[key] ?? { absent: [], present: [], holidays: [] }
  const absentMeta = ABSENT_META[key] ?? {}

  const today = new Date()
  const isThisMonth =
    today.getFullYear() === year && today.getMonth() === month
  const todayNum = isThisMonth ? today.getDate() : -1

  const cells: React.ReactNode[] = []


  for (let i = 0; i < firstDow; i++) {
    cells.push(
      <div
        key={`prev-${i}`}
        className="h-11 flex items-center justify-center text-[13px] text-gray-300"
      >
        {daysInPrev - firstDow + 1 + i}
      </div>
    )
  }

 
  for (let d = 1; d <= daysInMonth; d++) {
    const isAbsent  = data.absent.includes(d)
    const isPresent = data.present.includes(d)
    const isHoliday = data.holidays?.includes(d) ?? false
    const isWknd    = isWeekend(year, month, d)
    const isToday   = d === todayNum

    const handleClick = () => {
      if (isAbsent && absentMeta[d]) {
        onAbsentClick({ day: d, ...absentMeta[d] })
      }
    }

    let dayNode: React.ReactNode

    if (isToday) {
      dayNode = (
        <div className={cn(DAY_BASE, "bg-sky-500 text-white")}>
          {d}
        </div>
      )
    } else if (isAbsent) {
      dayNode = (
        <div
          className={cn(DAY_BASE, "bg-red-500 text-white cursor-pointer")}
          onClick={handleClick}
        >
          {d}
        </div>
      )
    } else if (isHoliday) {
      dayNode = (
        <div className={cn(DAY_BASE, "bg-gray-200 text-gray-500 text-[12px]")}>
          H
        </div>
      )
    } else if (isPresent) {
      dayNode = (
        <div className={cn(DAY_BASE, "bg-indigo-600 text-white")}>
          {d}
        </div>
      )
    } else {
      dayNode = (
        <span
          className={cn(
            "text-[13px]",
            isWknd
              ? "text-gray-400"
              : "text-gray-400 hover:text-gray-600 transition-colors"
          )}
        >
          {d}
        </span>
      )
    }

    cells.push(
      <div key={d} className="h-11 flex items-center justify-center">
        {dayNode}
      </div>
    )
  }

  const totalCells = firstDow + daysInMonth
  const trailing = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)
  for (let i = 1; i <= trailing; i++) {
    cells.push(
      <div
        key={`next-${i}`}
        className="h-11 flex items-center justify-center text-[13px] text-gray-300"
      >
        {i}
      </div>
    )
  }


  const legend = [
    { dot: "bg-indigo-600",              label: "Present" },
    { dot: "bg-red-500",                 label: "Absent"  },
    { dot: "bg-gray-300",                label: "Holiday" },
    { dot: "bg-gray-300 opacity-40",     label: "Weekend" },
    { dot: "bg-sky-500",                 label: "Today"   },
  ]

 
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">

  
      <p className="text-[15px] font-semibold text-gray-900 mb-5">
        Monthly Attendance Calendar — {MONTH_NAMES[month]} {year}
      </p>

      <div className="grid grid-cols-7 mb-1">
        {DAYS_OF_WEEK.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] font-medium text-gray-400 pb-2.5 tracking-widest"
          >
            {d}
          </div>
        ))}
      </div>


      <div className="grid grid-cols-7 gap-y-0.5">
        {cells}
      </div>

    
      <div className="flex items-center gap-5 flex-wrap mt-5 pt-4 border-t border-gray-100">
        {legend.map(({ dot, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", dot)} />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>

    </div>
  )
}