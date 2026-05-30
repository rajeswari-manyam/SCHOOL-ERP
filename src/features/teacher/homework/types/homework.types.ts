export type HomeworkStatus = "ACTIVE" | "PAST";
export type WANotifyStatus = "SENT" | "NOT_SENT" | "SENDING";
export type MaterialType = "FILE" | "LINK";
export type MaterialFileType = "PDF" | "DOC" | "PPT" | "IMAGE" | "LINK";

// ─── API request payloads ────────────────────────────────────────────────────

export interface CreateHomeworkPayload {
  className: string;
  sectionName: string;
  subjectName: string;
  teacher_id: string;
  title: string;
  description: string;
  submission_date: string;
  attachments: string[];
  // is_published: boolean;
  school_code: string;
}

export type UpdateHomeworkPayload = Partial<CreateHomeworkPayload>;

export interface HomeworkListQuery {
  teacher_id: string;
}

// ─── API response types ──────────────────────────────────────────────────────

export interface HomeworkApiItem {
  id: string;
  className: string;
  sectionName: string;
  subjectName: string;
  teacher_id: string;
  title: string;
  description: string;
  submission_date: string;
  attachments: string[];
  is_published: boolean;
  school_code: string;
  submittedCount: number;
  totalCount: number;
  createdAt: string;
  waNotifyStatus?: WANotifyStatus;
  waNotifiedAt?: string;
}

export interface HomeworkApiResponse {
  status: boolean;
  message?: string;
  data?: HomeworkApiItem | HomeworkApiItem[];
}

// ─── UI models (transformed) ─────────────────────────────────────────────────

export interface HomeworkItem {
  id: string;
  title: string;
  subject: string;
  className: string;
  section: string;
  dueDate: string;
  description: string;
  attachmentName?: string;
  attachmentUrl?: string;
  attachments: string[];
  submittedCount: number;
  totalCount: number;
  waNotifyStatus: WANotifyStatus;
  waNotifiedAt?: string;
  status: HomeworkStatus;
  createdAt: string;
  isPublished: boolean;
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
  download?: string;
  openLink?: string;
}

// ─── Study Material API payloads ──────────────────────────────────────────

export interface CreateStudyMaterialPayload {
  className: string;
  section: string;
  subjectName: string;
  upload_date: string;
  download?: string;
  downloadFile?: File;
  open_link?: string;
  school_code: string;
}

export interface MaterialApiItem {
  id: string;
  className: string;
  section: string;
  subjectName: string;
  title: string;
  description?: string;
  upload_date: string;
  download?: string;
  open_link?: string;
  fileType?: MaterialFileType;
  school_code: string;
  createdAt: string;
}

// ─── Form schemas (for react-hook-form / zod) ─────────────────────────────

export interface AssignHomeworkFormValues {
  className: string;
  sectionName: string;
  subjectName: string;
  title: string;
  submission_date: string;
  description: string;
  attachments: string[];
  is_published: boolean;
  attachmentFile?: FileList;
}

export interface UploadMaterialFormValues {
  className: string;
  section: string;
  subjectName: string;
  title: string;
  materialType: MaterialType;
  file?: FileList;
  url?: string;
  description?: string;
}

// ─── Hook state ──────────────────────────────────────────────────────────────

export interface HomeworkState {
  tab: "active" | "past" | "materials";
  setTab: (t: "active" | "past" | "materials") => void;

  teacherId: string;
  schoolCode: string;
  data: HomeworkItem[] | undefined;
  activeHomework: HomeworkItem[];
  pastHomework: HomeworkItem[];
  materials: StudyMaterial[];

  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;

  modal: ModalState;
  setModal: (m: ModalState) => void;

  reminderSent: Set<string>;
  sendReminder: (id: string) => void;

  createHomework: (payload: CreateHomeworkPayload) => Promise<void>;
  updateHomework: (id: string, payload: UpdateHomeworkPayload) => Promise<void>;
  deleteHomework: (id: string) => Promise<void>;
  uploadMaterial: (data: CreateStudyMaterialPayload) => Promise<void>;
  deleteMaterial: (id: string) => Promise<void>;

  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export type HomeworkTab = "active" | "past" | "materials";

export type ModalState =
  | { type: "none" }
  | { type: "assign" }
  | { type: "edit"; id: string }
  | { type: "confirmAssign"; data: Record<string, unknown> }
  | { type: "deleteHomework"; id: string }
  | { type: "uploadMaterial" }
  | { type: "deleteMaterial"; id: string };
