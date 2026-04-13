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