import type { LucideIcon } from "lucide-react"

// ─── Status ───────────────────────────────────────────────
export type AttendanceStatus = "present" | "absent" | "late" | "holiday"

// ─── Child / Header ───────────────────────────────────────
export interface ChildInfo {
  id: number
  name: string
  class: string
  section?: string
}

export interface AttendanceHeaderProps {
  currentDate: Date
  onPrev: () => void
  onNext: () => void
  child: ChildInfo
}

// ─── Stats ────────────────────────────────────────────────
export interface AttendanceStats {
  present: number
  absent: number
  late: number
}

// ─── Calendar ─────────────────────────────────────────────
export interface AttendanceRecord {
  absent: number[]
  present: number[]
  holidays?: number[]
}

export interface AttendanceDayEntry {
  date: string
  status: AttendanceStatus
}

export interface AttendanceCalendarProps {
  currentDate: Date
  onAbsentClick: (data: AbsentDayData) => void
}

// ─── Absent list / sidebar ────────────────────────────────
export interface AbsentDay {
  day: number
  label: string
  time: string
}

export interface AbsentMeta {
  label: string
  time: string
}

export interface AbsentDayData {
  day: number
  label: string
  time: string
}

export interface AbsentListProps {
  currentDate: Date
  onSelect: (data: AbsentDay) => void
}

// ─── Modal ────────────────────────────────────────────────
export interface AbsentData {
  day: number
  label: string
  time: string
}

export interface TimelineItem {
  time: string
  detail: string
  iconBg: string
  iconColor: string
  icon: LucideIcon
  isDelivered?: boolean
}

export interface SimpleTimelineItem {
  title: string
  time: string
}

export interface AbsentModalProps {
  data: AbsentData
  onClose: () => void
}

// ─── Trend chart ──────────────────────────────────────────
export interface TrendDataPoint {
  month: string
  attendance: number
}