import { StatCard } from "../../../../components/ui/statcard"
import type { AttendanceStatsProps } from "../types/attendance.types"

function pct(num: number, den: number) {
  if (!den) return "—"
  return `${((num / den) * 100).toFixed(1)}%`
}

export default function AttendanceStats({
  onAbsentCardClick,
  monthSummary,
  yearlySummary,
  isLoadingMonthly,
  isLoadingYearly,
}: AttendanceStatsProps) {
  const monthValue = isLoadingMonthly
    ? "Loading…"
    : `${monthSummary.present} / ${monthSummary.total}`

  const monthBadge = isLoadingMonthly
    ? "—"
    : pct(monthSummary.present, monthSummary.total)

  const yearValue = isLoadingYearly
    ? "Loading…"
    : yearlySummary
    ? `${yearlySummary.present} / ${yearlySummary.total}`
    : "—"

  const yearBadge = isLoadingYearly
    ? "—"
    : yearlySummary
    ? pct(yearlySummary.present, yearlySummary.total)
    : "—"

  const absentValue = isLoadingMonthly ? "…" : String(monthSummary.absent)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* THIS MONTH */}
      <StatCard
        label="THIS MONTH"
        value={monthValue}
        suffixLabel="days"
        badge={{ text: monthBadge, variant: "green" }}
      />

      {/* THIS YEAR */}
      <StatCard
        label="THIS YEAR"
        value={yearValue}
        suffixLabel="days"
        badge={{ text: yearBadge, variant: "green" }}
      />

      {/* ABSENT */}
      <div onClick={onAbsentCardClick}>
        <StatCard
          label="ABSENT THIS MONTH"
          value={absentValue}
          suffixLabel="days"
          badge={{ text: "View details →", variant: "red" }}
          className="hover:border-[#BA1A1A]"
        />
      </div>
    </div>
  )
}