export type ExamTab = "upcoming" | "results" | "reportcard";

export interface Exam {
  id: string;
  subject: string;
  date: string;
  day: string;
  time: string;
  venue: string;
  examName: string;
}

export interface ExamResult {
  subject: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  status: "Pass" | "Fail";
}

export interface ResultSummary {
  id: string;
  examName: string;
  totalObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  rank: string;
  strongestSubjects: string[];
  analyticsNote: string;
  results: ExamResult[];
}

export interface ReportCardEntry {
  subject: string;
  ut1: number | null;
  ut2: number | null;
  midterm: number | null;
  ut3: number | null;
  final: number | null;
}

export interface ReportCard {
  academicYear: string;
  entries: ReportCardEntry[];
  classPercentile: number;
  strongestSubject: string;
  attentionSubject: string;
  attentionNote: string;
}
export interface ExamBannerProps {
  name: string;
  date: string;
  time: string;
  venue: string;
  daysLeft: number;
  hoursLeft: number;
}