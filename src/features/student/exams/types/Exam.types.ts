export interface Exam {
  id: string;
  subject: string;
  date: string;
  time: string;
  venue: string;
  icon?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface ExamResult {
  subject: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  status: "pass" | "fail";
}

export interface ExamResultSummary {
  examId: string;
  examName: string;
  totalObtained: number;
  totalMax: number;
  percentage: number;
  grade: string;
  status: "PASS" | "FAIL";
  rank: number;
  totalStudents: number;
  publishedDate: string;
  subjects: ExamResult[];
}

export interface ReportCardRow {
  subject: string;
  ut1: number | null;
  ut2: number | null;
  midterm: number | null;
  ut3: number | null;
  final: number | null;
}

export interface ReportCard {
  overallPercentage: number;
  percentageChange: number;
  currentRank: number;
  totalStudents: number;
  attendance: number;
  attendanceLabel: string;
  lastUpdated: string;
  status: string;
  subjects: ReportCardRow[];
}

export interface SyllabusFile {
  subject: string;
  fileName: string;
  uploadedBy: string;
  uploadDate: string;
}

export interface UnitTestSyllabus {
  subject: string;
  tag: string;
  tagColor: string;
  chapters: string;
}

export type TabId = "upcoming" | "results" | "reportcard" | "syllabus";