import type { StudentStatus, DocumentCategory } from "../types/profile.types";

// ─── Date helpers ───────────────────────────────────────────────────────────────
export const formatDOB = (isoDate: string): string => {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// ─── Status styles ──────────────────────────────────────────────────────────────
export const STATUS_STYLES: Record<StudentStatus, { badge: string; label: string }> = {
  ACTIVE:      { badge: "bg-green-100 text-green-700 border border-green-200", label: "ACTIVE" },
  INACTIVE:    { badge: "bg-gray-100 text-gray-500 border border-gray-200",   label: "INACTIVE" },
  TRANSFERRED: { badge: "bg-orange-100 text-orange-600 border border-orange-200", label: "TRANSFERRED" },
};

// ─── Document category icons ────────────────────────────────────────────────────
export const DOC_CATEGORY_CONFIG: Record<
  DocumentCategory,
  { icon: string; label: string; iconBg: string }
> = {
  ACADEMIC:  { icon: "📄", label: "ACADEMIC DOCUMENT",  iconBg: "bg-red-50" },
  IDENTITY:  { icon: "🪪", label: "IDENTITY DOCUMENT",  iconBg: "bg-blue-50" },
  FINANCIAL: { icon: "💰", label: "FINANCIAL DOCUMENT", iconBg: "bg-green-50" },
  MEDICAL:   { icon: "🏥", label: "MEDICAL DOCUMENT",   iconBg: "bg-pink-50" },
  OTHER:     { icon: "📎", label: "DOCUMENT",            iconBg: "bg-gray-50" },
};

// ─── Personal info field labels ─────────────────────────────────────────────────
export const PERSONAL_INFO_FIELDS = [
  { key: "dateOfBirth",  label: "DATE OF BIRTH",  span: 1 },
  { key: "gender",       label: "GENDER",         span: 1 },
  { key: "bloodGroup",   label: "BLOOD GROUP",    span: 1 },
  { key: "age",          label: "AGE",            span: 1 },
  { key: "fatherName",   label: "FATHER'S NAME",  span: 1 },
  { key: "fatherPhone",  label: "FATHER'S PHONE", span: 1 },
  { key: "motherName",   label: "MOTHER'S NAME",  span: 1 },
  { key: "motherPhone",  label: "MOTHER'S PHONE", span: 1 },
  { key: "fullAddress",  label: "FULL ADDRESS",   span: 2 },
] as const;

// ─── Academic info field labels ─────────────────────────────────────────────────
export const ACADEMIC_INFO_FIELDS = [
  { key: "academicYear", label: "ACADEMIC YEAR" },
  { key: "board",        label: "BOARD" },
  { key: "section",      label: "SECTION" },
  { key: "classRoom",    label: "CLASS ROOM" },
] as const;