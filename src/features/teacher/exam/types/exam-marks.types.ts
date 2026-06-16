export type ExamType =
  | "UNIT_TEST_1"
  | "UNIT_TEST_2"
  | "MID_TERM"
  | "PRE_FINAL"
  | "FINAL";

export type ExamStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "PUBLISHED";

export type Grade = "A+" | "A" | "B+" | "B" | "C" | "D" | "F";

export interface ExamSelector {
  examType: string;
  examId?: string;
  className: string;
  classId?: string;
  sectionId?: string;
  subject: string;
  subjectId?: string;
  academicYear: string;
  academicYearId?: string;
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
  examType: string;
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
  completionPercentage?: number;
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

// ── /tenant/studentsbysubject API types ─────────────────────────────────────

export interface StudentsBySubjectQuery {
  class_id: string;
  section_id: string;
  subject_id: string;
  academicYearId: string;
  exam_id: string;
}

export interface StudentsBySubjectItem {
  id: string;
  studentId?: string;
  studentName?: string;
  rollNo?: string;
  className?: string;
  sectionName?: string;
  subjectName?: string;
}

// ── /tenant/marks/bulk API types ───────────────────────────────────────────

export interface BulkMarkItem {
  student_id: string;
  exam_id: string;
  rollNumber: string;
  academicYearId: string;
  subject_id: string;
  class_id: string;
  section_id: string;
  marks_obtained: number;
  max_marks: number;
  grade: string;
  remarks: string;
  is_absent: boolean;
}

export interface BulkMarksPayload {
  school_code: string;
  marks: BulkMarkItem[];
}

export interface BulkMarksResponse {
  status: boolean;
  message?: string;
  count?: number;
  errors?: Array<{ student_id: string; error: string }>;
}

// ── /tenant/getallmarks API types ──────────────────────────────────────────

export interface GetAllMarksQuery {
  class_id: string;
  section_id: string;
  subject_id: string;
  exam_id?: string;  // optional — omit to fetch all exams for the class/section/subject
}

/**
 * Shape returned by /tenant/getallmarks — one record per exam (summary row).
 * e.g. { id, examName, academicYear, className, subjectName, examDate,
 *         marksEntered, totalStudents, averageMarks, completionPercentage, status }
 */
export interface MarksRecordItem {
  id: string;
  examName?: string;
  academicYear?: string;
  className?: string;
  subjectName?: string;
  examDate?: string;
  marksEntered?: number;
  totalStudents?: number;
  averageMarks?: number;
  completionPercentage?: number;
  status?: string;
}

export const CLASS_OPTIONS = ["Class 8-A", "Class 8-B", "Class 9-A", "Class 9-B","Class 10-A", "Class 10-B"];
export const SUBJECT_OPTIONS = ["Mathematics", "Science", "English", "Hindi", "Social Studies", "Computer Science","Max"];
export const ACADEMIC_YEAR_OPTIONS = ["2024-25", "2023-24", "2022-23","2025-2026"];

// ── /tenant/class-student-results API types ──────────────────────────────────

export interface ClassStudentResultsQuery {
  className: string;
  sectionName: string;
  subjectName: string;
  academicYear: string;
  exam_type: string;
}

export interface StudentResultItem {
  id: string;
  studentId?: string;
  studentName?: string;
  rollNo?: string;
  marks?: number;
  maxMarks?: number;
  grade?: string;
  isAbsent?: boolean;
  remarks?: string;
  subjectName?: string;
  examType?: string;
  className?: string;
  sectionName?: string;
}

export interface ClassStudentResultsResponse {
  status: boolean;
  count?: number;
  message?: string;
  data?: StudentResultItem[];
}
