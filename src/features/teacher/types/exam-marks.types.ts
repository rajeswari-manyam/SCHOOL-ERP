export interface ExamSelector {
  examType?: string;
  examId?: string;
  classId?: string;
  sectionId?: string;
  subjectId?: string;
  academicYearId?: string;
}

export interface StudentMarkEntry {
  studentId: string;
  rollNo: string;
  studentName: string;
  marks: number | "";
  maxMarks: number;
  grade?: string;
  isAbsent: boolean;
  remarks?: string;
}

export interface SubmittedExam {
  id: string;
  examName: string;
  className: string;
  sectionName: string;
  subjectName: string;
  examDate: string;
  status: string;
}

export interface PublishedResult {
  id: string;
  examName: string;
  className: string;
  sectionName: string;
  publishedAt: string;
  status: string;
}

export interface StudentsBySubjectQuery {
  class_id: string;
  section_id: string;
  subject_id: string;
  academicYearId?: string;
}

export interface StudentsBySubjectItem {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  className: string;
  sectionName: string;
  subjectName: string;
}

export interface ClassStudentResultsQuery {
  class_id: string;
  section_id: string;
  academicYearId?: string;
  exam_id?: string;
}

export interface ClassStudentResultsResponse {
  status: boolean;
  count?: number;
  data: StudentResultItem[];
}

export interface StudentResultItem {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  marks?: number;
  maxMarks?: number;
  grade: string;
  isAbsent: boolean;
  remarks: string;
  subjectName: string;
  examType: string;
  className: string;
  sectionName: string;
}

export interface BulkMarksPayload {
  school_code: string;
  marks: Array<{
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
    remarks?: string;
    is_absent: boolean;
  }>;
}

export interface BulkMarksResponse {
  status: boolean;
  message: string;
  count?: number;
  errors?: unknown[];
}

export interface GetAllMarksQuery {
  class_id: string;
  section_id: string;
  subject_id: string;
  exam_id?: string;
}

export interface MarksRecordItem {
  id: string;
  examName: string;
  academicYear: string;
  className: string;
  subjectName: string;
  examDate: string;
  marksEntered?: number;
  totalStudents?: number;
  averageMarks?: number;
  completionPercentage?: number;
  status: string;
}
