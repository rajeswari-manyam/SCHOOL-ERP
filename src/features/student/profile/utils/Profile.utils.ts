import type { FieldConfig, StudentStatus, DocumentType } from "../types/profile.types";

// ─── Status badge styles ──────────────────────────────────────────────────────

export const STATUS_STYLES: Record<
  StudentStatus,
  { badge: string; dot: string; label: string }
> = {
  ACTIVE: {
    badge: "bg-green-50 text-green-700 border border-green-200",
    dot: "bg-green-500",
    label: "Active",
  },
  INACTIVE: {
    badge: "bg-slate-100 text-slate-500 border border-slate-200",
    dot: "bg-slate-400",
    label: "Inactive",
  },
  SUSPENDED: {
    badge: "bg-red-50 text-red-600 border border-red-200",
    dot: "bg-red-500",
    label: "Suspended",
  },
};

// ─── Document icon map ────────────────────────────────────────────────────────

export const DOCUMENT_ICON: Record<DocumentType, string> = {
  ACADEMIC: "ti-file-text",
  IDENTITY: "ti-id",
  FINANCIAL: "ti-receipt",
};

// ─── Academic field config ────────────────────────────────────────────────────

export const ACADEMIC_INFO_FIELDS: FieldConfig[] = [
  { key: "academicYear", label: "Academic Year" },
  { key: "board",        label: "Board" },
  { key: "section",      label: "Section" },
  { key: "classroom",    label: "Classroom" },
];

// ─── Personal field config ────────────────────────────────────────────────────

export const PERSONAL_INFO_FIELDS: FieldConfig[] = [
  { key: "dateOfBirth",  label: "Date of Birth",   span: 1 },
  { key: "gender",       label: "Gender",           span: 1 },
  { key: "bloodGroup",   label: "Blood Group",      span: 1 },
  { key: "age",          label: "Age",              span: 1 },
  { key: "fullAddress",  label: "Full Address",     span: 2 },
];

// ─── Formatters ───────────────────────────────────────────────────────────────

export function formatDOB(raw: string): string {
  return raw;
}

export function getAvatarBg(color: string): string {
  return color ?? "#4f46e5";
}