import type { DayOfWeek, SlotKind, TimetableSlot, ExamEntry } from "../types/timetable.types";

// ─── Day labels ─────────────────────────────────────────────────────────────────
export const DAY_LABELS: Record<DayOfWeek, string> = {
  MON: "MON",
  TUE: "TUE",
  WED: "WED",
  THU: "THU",
  FRI: "FRI",
  SAT: "SAT",
};

export const DAY_ORDER: DayOfWeek[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];

// ─── Period label ───────────────────────────────────────────────────────────────
export const getPeriodLabel = (slot: TimetableSlot): string => {
  if (slot.kind !== "PERIOD" || slot.periodNo == null) return "";
  return `P${slot.periodNo}`;
};

export const getTimeRange = (slot: TimetableSlot): string =>
  `${slot.startTime}–${slot.endTime}`;

// ─── Slot kind styles ───────────────────────────────────────────────────────────
export const SLOT_KIND_STYLES: Record<SlotKind, string> = {
  PERIOD: "",
  BREAK:  "bg-gray-50 text-gray-400 text-xs tracking-[0.2em] font-medium",
  LUNCH:  "bg-amber-50 text-amber-500 text-xs tracking-[0.2em] font-medium",
  FREE:   "bg-gray-50 text-gray-300 italic text-sm",
};

// ─── Subject color chips (consistent per subject) ───────────────────────────────
const SUBJECT_COLOR_MAP: Record<string, string> = {
  Physics:          "text-indigo-700",
  Chemistry:        "text-pink-700",
  Maths:            "text-blue-700",
  Mathematics:      "text-blue-700",
  English:          "text-purple-700",
  Hindi:            "text-orange-700",
  Social:           "text-teal-700",
  "Social Studies": "text-teal-700",
  Biology:          "text-green-700",
  "Computer Science": "text-cyan-700",
  Art:              "text-rose-700",
  PT:               "text-yellow-700",
  Library:          "text-gray-500",
  "Free Period":    "text-gray-400",
};

export const getSubjectColor = (subject: string): string =>
  SUBJECT_COLOR_MAP[subject] ?? "text-gray-700";

// ─── Date/time helpers ──────────────────────────────────────────────────────────
export const formatExamDate = (isoDate: string): string => {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export const formatExamDay = (isoDate: string): string =>
  new Date(isoDate).toLocaleDateString("en-IN", { weekday: "long" });

export const formatTimeSlot = (start: string, end: string): string =>
  `${to12Hr(start)} – ${to12Hr(end)}`;

const to12Hr = (time: string): string => {
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const m = mStr ?? "00";
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${suffix}`;
};

export const formatNotificationDate = (isoDate?: string): string => {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

// ─── Conflict badge ─────────────────────────────────────────────────────────────
export const CONFLICT_SEVERITY_STYLES = {
  ERROR:   "bg-red-50 border-red-200 text-red-700",
  WARNING: "bg-orange-50 border-orange-200 text-orange-700",
  INFO:    "bg-blue-50 border-blue-200 text-blue-700",
};

// ─── Resource load bar color ─────────────────────────────────────────────────────
export const getLoadBarColor = (pct: number): string => {
  if (pct >= 90) return "bg-red-500";
  if (pct >= 75) return "bg-indigo-600";
  return "bg-green-500";
};

// ─── Exam notify status ─────────────────────────────────────────────────────────
export const NOTIFY_STATUS_ICON: Record<ExamEntry["notifyStatus"], string> = {
  SENT:    "✅",
  PENDING: "🕐",
  FAILED:  "❌",
};