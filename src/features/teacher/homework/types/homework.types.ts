export type HomeworkStatus = "ACTIVE" | "PAST";
export type WANotifyStatus = "SENT" | "NOT_SENT" | "SENDING";
export type MaterialType = "FILE" | "LINK";
export type MaterialFileType = "PDF" | "DOC" | "PPT" | "IMAGE" | "LINK";

// ─── API request payloads ─────────────────────────────────────────────────────

export interface CreateHomeworkPayload {
  class_id: string;
  section_id: string;
  subject_id: string;
  teacher_id: string;
  title: string;
  description: string;
  submission_date: string;
  attachments: string[];
  is_published: boolean;
  academicYearId: string;
  submission_type?: "physical" | "online" | "both";
  files?: File[];
}

export type UpdateHomeworkPayload = Partial<{
  class_id: string;
  section_id: string;
  subject_id: string;
  title: string;
  description: string;
  submission_date: string;
  attachments: string[];
  is_published: boolean;
  submission_type: "physical" | "online" | "both";
}>;

// ─── API response shapes ──────────────────────────────────────────────────────

/** Matches the actual server response from /tenant/getallhomework & /tenant/gethomeworkById */
export interface HomeworkApiItem {
  id: string;
  class_id: string;
  section_id: string;
  subject_id: string;
  teacher_id: string;
  title: string;
  description: string;
  submission_date: string;
  attachments: string[];
  is_published: boolean;
  academicYearId: string;
  createdAt: string;
  updatedAt: string;
  // optional enrichment fields (may be added by server later)
  submittedCount?: number;
  totalCount?: number;
  waNotifyStatus?: WANotifyStatus;
  waNotifiedAt?: string;
}

export interface HomeworkApiResponse {
  status: boolean;
  message?: string;
  count?: number;
  data?: HomeworkApiItem | HomeworkApiItem[];
}

// ─── UI models (transformed) ──────────────────────────────────────────────────

export interface HomeworkItem {
  id: string;
  title: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  subject: string;        // display name
  className: string;      // display name
  section: string;        // display name
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
  academicYearId: string;
  teacher_id: string;
  submission_type?: "physical" | "online" | "both";
}

// ─── Study Material types ─────────────────────────────────────────────────────

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  subjectName?: string;
  className: string;
  section: string;
  type: MaterialType;
  fileType: MaterialFileType;
  url?: string;
  fileName?: string;
  description?: string;
  uploadedAt: string;
  size?: string;
  download?: number;
  openLink?: string;
  pdf?: string | null;
  open_link?: string;
  upload_type?: string;
  class?: { id: string; name: string };
  teacher?: { id: string; name: string };
  upload_date?: string;
}

export interface CreateStudyMaterialPayload {
  class_id: string;
  section_id: string;
  subject_id: string;
  teacher_id: string;
  title: string;
  description?: string;
  upload_date: string;
  upload_type: string;
  open_link?: string;
  pdf?: File | null;
}

// ─── Form schemas ─────────────────────────────────────────────────────────────

export interface AssignHomeworkFormValues {
  class_id: string;
  section_id: string;
  subject_id: string;
  academicYearId: string;
  title: string;
  submission_date: string;
  description: string;
  attachments: string[];
  is_published: boolean;
  attachmentFile?: File[];
  submission_type?: "physical" | "online" | "both";
}

export interface UploadMaterialFormValues {
  classId: string;
  sectionId: string;
  subjectId: string;
  title: string;
  materialType: MaterialType;
  file?: FileList;
  url?: string;
  description?: string;
}

// ─── Hook state ───────────────────────────────────────────────────────────────

export interface HomeworkState {
  tab: "active" | "past" | "materials";
  setTab: (t: "active" | "past" | "materials") => void;

  teacherId: string;
  schoolCode: string;
  data: HomeworkItem[] | undefined;
  activeHomework: HomeworkItem[];
  pastHomework: HomeworkItem[];
  materials: StudyMaterial[];
  isMaterialsError: boolean;
  refetchMaterials: () => void;

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
  updateMaterial: (id: string, data: CreateStudyMaterialPayload) => Promise<void>;
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
  | { type: "editMaterial"; id: string }
  | { type: "deleteMaterial"; id: string };