export type HomeworkTab = "week" | "all" | "materials";
export type HomeworkStatus = "PENDING" | "SUBMITTED" | "NOT TRACKED";
export type MaterialType = "pdf" | "jpg" | "link" | "doc";

export interface Homework {
  id: string;
  subject: string;
  subjectColor: string;
  title: string;
  description: string;
  due: string;
  dueLabel?: string;
  teacher: string;
  teacherInitials: string;
  day: number;
  submissionDate?: Date;   // full Date for accurate day-filter matching
  status: HomeworkStatus;
  attachment?: { name: string; url?: string };
  whatsappNotified?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  class: string;
  uploaded: string;
  type: MaterialType;
  isLink?: boolean;
}

export type StudyMaterialType = "pdf" | "jpg" | "doc" | "link";

export type ResourceType = "download" | "link";

export interface RecommendedResource {
  id: string;
  title: string;
  subtitle: string;
  type: ResourceType;
}
