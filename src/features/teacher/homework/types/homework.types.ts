export type HomeworkStatus = "ACTIVE" | "PAST";
export type WANotifyStatus = "SENT" | "NOT_SENT" | "SENDING";
export type MaterialType = "FILE" | "LINK";
export type MaterialFileType = "PDF" | "DOC" | "PPT" | "IMAGE" | "LINK";

export interface HomeworkItem {
  id: string;
  title: string;
  subject: string;
  className: string;
  section: string;
  dueDate: string;           // YYYY-MM-DD
  description: string;
  attachmentName?: string;
  attachmentUrl?: string;
  submittedCount: number;
  totalCount: number;
  waNotifyStatus: WANotifyStatus;
  waNotifiedAt?: string;
  status: HomeworkStatus;
  createdAt: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  className: string;
  section: string;
  type: MaterialType;
  fileType: MaterialFileType;
  url?: string;
  fileName?: string;
  description?: string;
  uploadedAt: string;
  size?: string;
}

// ── Form schemas (for react-hook-form / zod) ─────────────────────────────
export interface AssignHomeworkFormValues {
  className: string;
  section: string;
  subject: string;
  title: string;
  dueDate: string;
  description: string;
  attachment?: FileList;
  trackSubmissions: boolean;
  notifyWhatsApp: boolean;
}

export interface UploadMaterialFormValues {
  className: string;
  section: string;
  subject: string;
  title: string;
  materialType: MaterialType;
  file?: FileList;
  url?: string;
  description?: string;
}
