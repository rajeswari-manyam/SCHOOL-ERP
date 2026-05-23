export function AttendanceLegend() {
  return (
    <div className="flex gap-4 text-sm">
      <Legend color="bg-[#00714D]" label="Present" />
      <Legend color="bg-[#BA1A1A]" label="Absent" />
      <Legend color="bg-[#808080]" label="Holiday" />
    </div>
  )
}

function Legend({ color, label }: any) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  )
}