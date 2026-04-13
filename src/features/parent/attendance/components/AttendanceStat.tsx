interface StatCardProps {
  label: string
  value: string
  unit?: string
  percent?: string
  danger?: boolean
  onClick?: () => void
}

interface AttendanceStatsProps {
  onAbsentCardClick: () => void
}

export default function AttendanceStats({ onAbsentCardClick }: AttendanceStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <StatCard label="THIS MONTH"       value="22 / 24"   unit="days" percent="91.7%" />
      <StatCard label="THIS YEAR"        value="182 / 198" unit="days" percent="91.9%" />
      <StatCard
        label="ABSENT THIS MONTH"
        value="2 days"
        danger
        onClick={onAbsentCardClick}
      />
    </div>
  )
}

function StatCard({ label, value, unit, percent, danger, onClick }: StatCardProps) {
  const isClickable = !!onClick

  return (
    <div
      onClick={onClick}
      className={`
        bg-white border rounded-xl p-4 transition-all duration-150
${danger 
  ? "border-[#BA1A1A] hover:border-[#BA1A1A]" 
  : "border-gray-200 hover:border-[#3525CD]"
}
        hover:shadow-md
        ${isClickable ? "cursor-pointer active:scale-[0.98]" : ""}
      `}
    >
      <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-2">
        {label}
      </p>
      <div className="flex items-end gap-2 flex-wrap">
        <span className={`text-2xl font-bold leading-none ${danger ? "text-[#BA1A1A]" : "text-gray-900"}`}>
          {value}
        </span>
        {unit && <span className="text-xs text-gray-400 mb-0.5">{unit}</span>}
        {percent && (
          <span className="ml-auto text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2 py-0.5">
            {percent}
          </span>
        )}
        {danger && isClickable && (
          <span className="ml-auto text-[10px] text-[#BA1A1A] font-medium">View details →</span>
        )}
      </div>
    </div>
  )
}