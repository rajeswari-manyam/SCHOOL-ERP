// ─── Enums / Unions ─────────────────────────────────────────────────────────────
export type HomeworkStatus = "NOT_SUBMITTED" | "SUBMITTED" | "GRADED" | "LATE";

export type SubjectTag =
  | "ENGLISH"
  | "MATHEMATICS"
  | "SCIENCE"
  | "SOCIAL_STUDIES"
  | "HINDI"
  | "COMPUTER_SCIENCE"
  | "PHYSICS"
  | "CHEMISTRY"
  | "BIOLOGY"
  | "OTHER";

export type MaterialType = "PDF" | "DOCX" | "JPG" | "PNG" | "EXTERNAL";

// ─── Core Entities ──────────────────────────────────────────────────────────────
export interface AttachedFile {
  name: string;
  url: string;
  type: MaterialType;
}

export interface Assignment {
  id: string;
  subject: SubjectTag;
  title: string;
  description: string;
  assignedBy: string; // teacher name
  dueDate: string;    // ISO date string
  status: HomeworkStatus;
  attachments?: AttachedFile[];
  submittedAt?: string; // ISO date string, present when status === "SUBMITTED" | "GRADED"
  grade?: string;       // e.g. "A+", "85/100"
}

// ─── Daily View ─────────────────────────────────────────────────────────────────
export interface DayTab {
  label: string;     // "Monday 7", "Tuesday 8"
  dateIso: string;   // ISO date string
  hasDue: boolean;   // dot indicator
}

export interface WeekView {
  days: DayTab[];
  selectedDate: string; // ISO date
}

// ─── Study Material ─────────────────────────────────────────────────────────────
export interface StudyMaterial {
  id: string;
  title: string;
  subject: SubjectTag;
  className: string;
  type: MaterialType;
  uploadedAt: string;  // ISO date string
  url: string;
  isExternal?: boolean;
  externalLabel?: string; // e.g. "Khan Academy — English Videos"
}

// ─── Submission ─────────────────────────────────────────────────────────────────
export interface SubmitPayload {
  assignmentId: string;
  file?: File;
  textResponse?: string;
  notesToTeacher?: string;
}

export interface SubmitResult {
  success: boolean;
  submittedAt: string;
  message: string;
}

// ─── Page-level state ───────────────────────────────────────────────────────────
export interface HomeworkPageState {
  activeTab: "THIS_WEEK" | "ALL_HOMEWORK" | "STUDY_MATERIALS";
  selectedDate: string;
  pendingCount: number;
  submittingId: string | null;
  submitModalOpen: boolean;
  selectedAssignment: Assignment | null;
}

// ─── API response wrappers ─────────────────────────────────────────────────────
export interface HomeworkResponse {
  className: string;
  academicYear: string;
  weekView: WeekView;
  assignments: Assignment[];
  pendingCount: number;
  urgentCount: number; // due in next 48 hours
}

export interface StudyMaterialsResponse {
  materials: StudyMaterial[];
  total: number;
}