export type Subject = "English" | "Mathematics" | "Science" | "SST" | "Hindi";
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
  weekDay?: string; // "MON" | "TUE" etc.
  weekDate?: number;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: Subject;
  type: MaterialType;
  uploadedDate: string;
  url?: string;
}