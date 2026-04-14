export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "holiday"

export interface AttendanceDay {
  date: string
  status: AttendanceStatus
}

export interface AttendanceStats {
  present: number
  absent: number
  late: number
}

export interface TimelineItem {
  title: string
  time: string
}

export interface AbsentRecord {
  date: string
  reason: string
  timeline: TimelineItem[]
}

export interface ChildInfo {
  id: string
  name: string
  className: string
  section: string
}