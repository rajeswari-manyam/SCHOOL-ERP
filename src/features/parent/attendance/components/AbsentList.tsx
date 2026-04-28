import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import type { AbsentListProps, AbsentDay } from "../types/attendance.types";
import { ABSENT_BY_MONTH, TREND_DATA } from "../data/attendance.data";
import {
  getMonthKey,
  getYear,
  getMonth,
  MONTH_NAMES,
} from "../../../../utils/date";



const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-lg px-3 py-2 shadow-sm text-[12px]">
      <p className="font-semibold text-gray-800">{label}</p>
      <p className="text-[#1D9E75]">
        {payload[0].value}% attendance
      </p>
    </div>
  );
};


export default function AbsentList({
  currentDate,
  onSelect,
}: AbsentListProps) {
  const monthKey = getMonthKey(currentDate);

  const absentDays: AbsentDay[] =
    ABSENT_BY_MONTH[monthKey] ?? [];

  const monthLabel = `${MONTH_NAMES[getMonth(currentDate)]} ${getYear(
    currentDate
  )}`;

  return (
    <div className="space-y-4">

    
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#3525CD] hover:shadow-md transition">

        <p className="text-[13px] font-semibold text-gray-800 mb-3">
          Absent Days — {monthLabel}
        </p>

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

              <p className="text-[13px] font-medium text-[#006C49]">
                No absences
              </p>

              <p className="text-[11px] text-gray-400 mt-1">
                Full attendance this month!
              </p>
            </motion.div>

          ) : (
            <motion.div key="list" className="space-y-2">
              {absentDays.map((item, i) => (
                <motion.div
                  key={`${item.day}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: i * 0.07 }}
                  onClick={() => onSelect(item)}
                  className="bg-red-50 border border-red-100 rounded-lg p-3 cursor-pointer hover:shadow-sm transition"
                >
                  <div className="flex items-center gap-3">

                    {/* Day Circle */}
                    <div className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center text-white font-bold text-[13px]">
                      {item.day}
                    </div>

             
                    <div>
                      <p className="text-[13px] font-semibold text-gray-800">
                        {item.label}
                      </p>
                      <p className="text-[11px] text-[#006C49] font-medium mt-1">
                        Alert sent at {item.time}
                      </p>
                    </div>

                    <AlertCircle
                      size={14}
                      className="ml-auto text-red-400 shrink-0"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#3525CD] hover:shadow-md transition">

        <div className="flex justify-between items-center mb-4">
          <p className="text-[15px] font-bold text-gray-900">
            Attendance Trend
          </p>

          <span className="text-[11px] text-gray-400 uppercase tracking-wide">
            Last 6 Months
          </span>
        </div>

        <ResponsiveContainer width="100%" height={160}>
          <AreaChart
            data={TREND_DATA}
            margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="attendanceGrad"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#1D9E75" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#1D9E75" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={[80, 100]}
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

      </div>
    </div>
  );
}