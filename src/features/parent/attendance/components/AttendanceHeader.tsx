import { ChevronLeft, ChevronRight } from "lucide-react"
import type { AttendanceHeaderProps } from "../types/attendance.types"

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]

export default function AttendanceHeader({ currentDate, onPrev, onNext, child }: AttendanceHeaderProps) {
  const label = `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`

  return (
    <div className="flex items-center justify-between">
      <div>
   <h1 className="text-xl font-bold text-gray-900">
  Attendance — {child.name}
</h1>
<p className="text-xs text-gray-400 mt-0.5">
  Class {child.class} | Academic Year 2024–25
</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          className="w-7 h-7 border border-gray-200 bg-white rounded-md flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all active:scale-95"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="text-sm font-medium text-gray-700 min-w-[110px] text-center">{label}</span>
        <button
          onClick={onNext}
          className="w-7 h-7 border border-gray-200 bg-white rounded-md flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all active:scale-95"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}