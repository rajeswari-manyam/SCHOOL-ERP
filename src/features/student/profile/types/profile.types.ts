// ─── Enums ────────────────────────────────────────────────────────────────────

export type StudentStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type DocumentType = "ACADEMIC" | "IDENTITY" | "FINANCIAL";
export type Gender = "Male" | "Female" | "Other";

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface Teacher {
  id: string;
  name: string;
  title: string;
  avatarInitials: string;
}

export interface AcademicInfo {
  academicYear: string;
  board: string;
  section: string;
  classroom: string;
}

export interface PersonalInfo {
  dateOfBirth: string;
  gender: Gender;
  bloodGroup: string;
  age: number;
  fullAddress: string;
}

export interface QuickDownload {
  id: string;
  title: string;
  subtitle: string;
  type: DocumentType;
  fileSize: string;
  documentCode?: string;
}

export interface Student {
  id: string;
  admissionNo: string;
  rollNo: string;
  name: string;
  avatarInitials: string;
  avatarColor: string;
  status: StudentStatus;
  className: string;
  section: string;
  classTeacher: Teacher;
  academic: AcademicInfo;
  personal: PersonalInfo;
  quickDownloads: QuickDownload[];
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

export interface NavItem {
  id: string;
  label: string;
  path: string;
}

export interface FieldConfig {
  key: string;
  label: string;
  span?: number;
}