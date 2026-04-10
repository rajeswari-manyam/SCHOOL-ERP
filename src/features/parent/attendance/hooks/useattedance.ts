import { useAttendanceStore } from "../store/attedance.store";

export function useAttendance() {
  const {
    month,
    child,
    stats,
    days,
    absents,
    setMonth,
  } = useAttendanceStore()

  const nextMonth = () => {
    setMonth("April 2025")
  }

  const prevMonth = () => {
    setMonth("February 2025")
  }

  return {
    month,
    child,
    stats,
    days,
    absents,
    nextMonth,
    prevMonth,
  }
}