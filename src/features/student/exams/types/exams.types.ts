// types/exams.types.ts
export type Subject =
  | "English"
  | "Mathematics"
  | "Science"
  | "Social Studies"
  | "Hindi"
  | (string & {}); // allow any subject_name from API

export type ExamType = "ut1" | "ut2" | "midterm" | "ut3" | "final";
export type Venue = "Hall A" | "Hall B" | "Lab 1";

export interface Exam {
  id: string;
  subject: Subject;
  date: string;
  startTime: string;
  endTime: string;
  venue: Venue | string;
  syllabus?: string;
}

export interface Result {
  subject: Subject;
  marks: number;
  total: number;
  grade: string;
  status: "pass" | "fail";
  scores?: Record<ExamType, number | null>;
}

export interface ExamResult {
  examName: string;
  examDate: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  rank: string;
  status: "pass" | "fail";
  results: Result[];
}

export interface ReportCard {
  percentage: number;
  rank: number;
  attendance: number;
  results: Result[];
}

export interface Syllabus {
  subject: Subject;
  fileName: string;
  fileUrl: string;
  uploadedBy: string;
  uploadDate: string;
}

export interface CheckItem {
  label: string;
  checked: boolean;
  disabled?: boolean;
}

export interface UnitSyllabus {
  subject: string;
  chapters: string;
  topics: string;
}

export interface Deadline {
  title: string;
  dueText: string;
  date?: string;
}