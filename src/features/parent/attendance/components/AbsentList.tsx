import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, AlertCircle } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

import type { AbsentListProps, AbsentDay } from "../types/attendance.types"
import { useAttendanceStore } from "../store/attendance.store"
import { MONTH_NAMES } from "../../../../utils/date"

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-lg px-3 py-2 shadow-sm text-[12px]">
      <p className="font-semibold text-gray-800">{label}</p>
      <p className="text-[#1D9E75]">{payload[0].value}% attendance</p>
    </div>
  )
}

function AbsentListSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2].map((i) => (
        <div key={i} className="h-14 rounded-lg bg-gray-100 animate-pulse" />
      ))}
    </div>
  )
}

export default function AbsentList({
  currentDate,
  onSelect,
  isLoading,
}: AbsentListProps) {
  const monthlyDays    = useAttendanceStore((s) => s.monthlyDays)
  const yearlySummary  = useAttendanceStore((s) => s.yearlySummary)

  const year  = currentDate.getFullYear()
  const month = currentDate.getMonth()   // 0-based, matches MONTH_NAMES index
  const monthLabel = `${MONTH_NAMES[month]} ${year}`

  // Build absent days for this month from live store data
  const absentDays: AbsentDay[] = monthlyDays
    .filter((entry) => {
      const d = new Date(entry.date)
      return (
        entry.status === "absent" &&
        d.getFullYear() === year &&
        d.getMonth() === month
      )
    })
    .map((entry) => {
      const d = new Date(entry.date)
      const dayNum = d.getDate()
      return {
        id: entry.id,
        day: dayNum,
        label: `${MONTH_NAMES[month]} ${dayNum}, ${year}`,
        time: new Date(entry.date).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
    })
    .sort((a, b) => a.day - b.day)

  // Trend data from yearly summary (or empty)
  const trendData = yearlySummary?.monthlyTrend ?? []

  return (
    <div className="space-y-4">
      {/* Absent Days card */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#3525CD] hover:shadow-md transition">
        <p className="text-[13px] font-semibold text-gray-800 mb-3">
          Absent Days — {monthLabel}
        </p>

        {isLoading ? (
          <AbsentListSkeleton />
        ) : (
          <AnimatePresence mode="wait">
            {absentDays.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center justify-center py-6 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-[#E1F5EE] flex items-center justify-center mb-2">
                  <CheckCircle2 size={20} className="text-[#006C49]" />
                </div>
                <p className="text-[13px] font-medium text-[#006C49]">No absences</p>
                <p className="text-[11px] text-gray-400 mt-1">Full attendance this month!</p>
              </motion.div>
            ) : (
              <motion.div key="list" className="space-y-2">
                {absentDays.map((item, i) => (
                  <motion.div
                    key={`${item.id}-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: i * 0.07 }}
                    onClick={() => onSelect(item)}
                    className="bg-red-50 border border-red-100 rounded-lg p-3 cursor-pointer hover:shadow-sm transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center text-white font-bold text-[13px]">
                        {item.day}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-gray-800">{item.label}</p>
                        <p className="text-[11px] text-[#006C49] font-medium mt-1">
                          Tap to view details
                        </p>
                      </div>
                      <AlertCircle size={14} className="ml-auto text-red-400 shrink-0" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Attendance Trend card */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#3525CD] hover:shadow-md transition">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[15px] font-bold text-gray-900">Attendance Trend</p>
          <span className="text-[11px] text-gray-400 uppercase tracking-wide">
            This Year
          </span>
        </div>

        {trendData.length === 0 ? (
          <div className="h-[160px] flex items-center justify-center">
            <p className="text-[12px] text-gray-400">No trend data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={trendData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1D9E75" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#1D9E75" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[70, 100]}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="attendance"
                stroke="#1D9E75"
                strokeWidth={2}
                fill="url(#attendanceGrad)"
                dot={{ r: 3, fill: "#1D9E75", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#1D9E75", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}