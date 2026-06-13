export type Subject = string; // open — API can return any subject name
export type DueUrgency = "urgent" | "medium" | "normal";
export type ActiveTab = "week" | "all" | "materials";
export type MaterialType = "pdf" | "doc" | "image" | "link";

export interface Homework {
  id: string;
  title: string;
  subject: Subject;
  description: string;
  dueDate: string;
  dueUrgency: DueUrgency;
  assignedBy: string;
  submitted: boolean;
  attachment?: string;
  attachments: string[];
  className: string;
  sectionName: string;
  subjectId: string;
  classId: string;
  sectionId: string;
  isPublished: boolean;
  weekDay?: string;
  weekDate?: number;
  submissionDate?: Date;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  subjectName?: string;
  className?: string;
  section?: string;
  type: MaterialType;
  uploadedDate: string;
  url?: string;
  pdf?: string | null;
  open_link?: string;
  download?: number;
  description?: string;
}
