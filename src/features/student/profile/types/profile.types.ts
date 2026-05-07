// ─── Student & Profile Types ────────────────────────────────────────────────

export interface Student {
  id: string;
  admissionNo: string;
  rollNo: string;
  name: string;
  avatarInitials: string;
  avatarColor: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  class: string;
  section: string;
  classTeacher: Teacher;
  academic: AcademicInfo;
  personal: PersonalInfo;
  quickDownloads: QuickDownload[];
}

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
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  age: number;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  fullAddress: string;
}

export interface QuickDownload {
  id: string;
  title: string;
  subtitle: string;
  type: 'ACADEMIC' | 'IDENTITY' | 'FINANCIAL';
  fileSize: string;
  documentCode?: string;
}

// ─── Navigation Types ────────────────────────────────────────────────────────

export type NavItem = {
  id: string;
  label: string;
  path: string;
  icon?: string;
};

// ─── UI Component Types ──────────────────────────────────────────────────────

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export type DocumentType = 'ACADEMIC' | 'IDENTITY' | 'FINANCIAL';

export interface InfoFieldProps {
  label: string;
  value: string;
  fullWidth?: boolean;
}

export interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}