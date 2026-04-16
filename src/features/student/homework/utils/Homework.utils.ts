import type { SubjectTag, HomeworkStatus, MaterialType, Assignment } from "../types/Homework.types";

// ─── Date helpers ───────────────────────────────────────────────────────────────
export const formatDueDate = (isoDate: string): string => {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const getDueBadgeLabel = (isoDate: string): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(isoDate);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000);

  if (diffDays < 0) return "OVERDUE";
  if (diffDays === 0) return "DUE: TODAY";
  if (diffDays === 1) return "DUE: TOMORROW";
  return `DUE: IN ${diffDays} DAYS`;
};

export const isUrgent = (isoDate: string): boolean => {
  const today = new Date();
  const due = new Date(isoDate);
  return (due.getTime() - today.getTime()) / 86_400_000 <= 2;
};

export const formatSubmittedAt = (isoDate: string): string => {
  const d = new Date(isoDate);
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ─── Subject styles ─────────────────────────────────────────────────────────────
export const SUBJECT_STYLES: Record<SubjectTag, { badge: string; border: string }> = {
  ENGLISH:          { badge: "bg-purple-100 text-purple-700",  border: "border-l-purple-500" },
  MATHEMATICS:      { badge: "bg-blue-100 text-blue-700",      border: "border-l-blue-500" },
  SCIENCE:          { badge: "bg-green-100 text-green-700",    border: "border-l-green-500" },
  SOCIAL_STUDIES:   { badge: "bg-orange-100 text-orange-700",  border: "border-l-orange-500" },
  HINDI:            { badge: "bg-yellow-100 text-yellow-700",  border: "border-l-yellow-500" },
  COMPUTER_SCIENCE: { badge: "bg-cyan-100 text-cyan-700",      border: "border-l-cyan-500" },
  PHYSICS:          { badge: "bg-indigo-100 text-indigo-700",  border: "border-l-indigo-500" },
  CHEMISTRY:        { badge: "bg-pink-100 text-pink-700",      border: "border-l-pink-500" },
  BIOLOGY:          { badge: "bg-teal-100 text-teal-700",      border: "border-l-teal-500" },
  OTHER:            { badge: "bg-gray-100 text-gray-600",      border: "border-l-gray-400" },
};

export const SUBJECT_LABELS: Record<SubjectTag, string> = {
  ENGLISH:          "ENGLISH",
  MATHEMATICS:      "MATHEMATICS",
  SCIENCE:          "SCIENCE",
  SOCIAL_STUDIES:   "SOCIAL STUDIES",
  HINDI:            "HINDI",
  COMPUTER_SCIENCE: "COMPUTER SCIENCE",
  PHYSICS:          "PHYSICS",
  CHEMISTRY:        "CHEMISTRY",
  BIOLOGY:          "BIOLOGY",
  OTHER:            "OTHER",
};

// ─── Status styles ──────────────────────────────────────────────────────────────
export const STATUS_STYLES: Record<HomeworkStatus, { text: string; color: string }> = {
  NOT_SUBMITTED: { text: "Not yet submitted", color: "text-orange-500" },
  SUBMITTED:     { text: "Submitted",         color: "text-green-600" },
  GRADED:        { text: "Graded",            color: "text-indigo-600" },
  LATE:          { text: "Late submission",   color: "text-red-500" },
};

// ─── Due badge styles ───────────────────────────────────────────────────────────
export const getDueBadgeStyle = (label: string): string => {
  if (label.includes("OVERDUE"))  return "bg-red-100 text-red-600";
  if (label.includes("TOMORROW")) return "bg-orange-100 text-orange-600";
  if (label.includes("TODAY"))    return "bg-red-100 text-red-600";
  return "bg-gray-100 text-gray-600";
};

// ─── Material type icons ────────────────────────────────────────────────────────
export const MATERIAL_TYPE_CONFIG: Record<MaterialType, { icon: string; color: string; label: string }> = {
  PDF:      { icon: "📄", color: "text-red-500",    label: "PDF" },
  DOCX:     { icon: "📝", color: "text-blue-500",   label: "DOCX" },
  JPG:      { icon: "🖼️",  color: "text-green-500",  label: "JPG" },
  PNG:      { icon: "🖼️",  color: "text-green-500",  label: "PNG" },
  EXTERNAL: { icon: "🔗", color: "text-purple-500", label: "EXTERNAL" },
};

// ─── Filters & sorting ──────────────────────────────────────────────────────────
export const filterAssignmentsByDate = (
  assignments: Assignment[],
  dateIso: string
): Assignment[] =>
  assignments.filter((a) => {
    const due = new Date(a.dueDate);
    const sel = new Date(dateIso);
    return due.toDateString() === sel.toDateString();
  });

export const sortByDueDate = (assignments: Assignment[]): Assignment[] =>
  [...assignments].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

export const getPendingCount = (assignments: Assignment[]): number =>
  assignments.filter((a) => a.status === "NOT_SUBMITTED" || a.status === "LATE").length;

export const getSubmittedCount = (assignments: Assignment[]): number =>
  assignments.filter((a) => a.status === "SUBMITTED" || a.status === "GRADED").length;