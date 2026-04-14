export type ExamType =
  | "UNIT_TEST_1"
  | "UNIT_TEST_2"
  | "MID_TERM"
  | "PRE_FINAL"
  | "FINAL";

export type ExamStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "PUBLISHED";

export type Grade = "A+" | "A" | "B+" | "B" | "C" | "D" | "F";

export interface ExamSelector {
  examType: ExamType | "";
  className: string;
  subject: string;
  academicYear: string;
}

export interface StudentMarkEntry {
  studentId: string;
  rollNo: string;
  name: string;
  marks: number | "";
  maxMarks: number;
  grade: Grade | null;
  remarks: string;
  isAbsent: boolean;
}

export interface ExamSummary {
  total: number;
  appeared: number;
  absent: number;
  highest: number;
  lowest: number;
  average: number;
  passRate: number;
  failCount: number;
}

export interface SubmittedExam {
  id: string;
  examType: ExamType;
  examLabel: string;
  className: string;
  subject: string;
  academicYear: string;
  submittedOn: string;
  status: ExamStatus;
  totalStudents: number;
  appeared: number;
  average: number;
  passRate: number;
}

export interface TopStudent {
  rank: number;
  name: string;
  rollNo: string;
  marks: number;
  maxMarks: number;
  grade: Grade;
}

export interface SubjectPerformance {
  subject: string;
  average: number;
  passRate: number;
  highest: number;
}

export interface PublishedResult {
  id: string;
  examLabel: string;
  className: string;
  academicYear: string;
  publishedOn: string;
  topStudents: TopStudent[];
  subjectPerformance: SubjectPerformance[];
  classAverage: number;
  overallPassRate: number;
}

export const EXAM_TYPE_LABELS: Record<ExamType, string> = {
  UNIT_TEST_1: "Unit Test 1",
  UNIT_TEST_2: "Unit Test 2",
  MID_TERM:    "Mid Term",
  PRE_FINAL:   "Pre-Final",
  FINAL:       "Final Exam",
};

export const CLASS_OPTIONS = ["Class 8-A", "Class 8-B", "Class 9-A", "Class 9-B"];
export const SUBJECT_OPTIONS = ["Mathematics", "Science", "English", "Hindi", "Social Studies", "Computer Science"];
export const ACADEMIC_YEAR_OPTIONS = ["2024-25", "2023-24", "2022-23"];
