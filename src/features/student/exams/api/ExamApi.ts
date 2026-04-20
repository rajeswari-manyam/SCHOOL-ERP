import type {
  Exam, ChecklistItem, ExamResultSummary,
  ReportCard, SyllabusFile, UnitTestSyllabus,
} from "../types/Exam.types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchUpcomingExams(): Promise<Exam[]> {
  await delay(300);
  return [
    { id: "1", subject: "English", date: "15 Apr 2025", time: "9:00 AM - 12:00 PM", venue: "Hall A" },
    { id: "2", subject: "Mathematics", date: "17 Apr 2025", time: "9:00 AM - 12:00 PM", venue: "Hall A" },
    { id: "3", subject: "Science", date: "19 Apr 2025", time: "9:00 AM - 12:00 PM", venue: "Lab 1" },
    { id: "4", subject: "Social Studies", date: "21 Apr 2025", time: "9:00 AM - 12:00 PM", venue: "Hall B" },
    { id: "5", subject: "Hindi", date: "23 Apr 2025", time: "9:00 AM - 12:00 PM", venue: "Hall A" },
  ];
}

export async function fetchChecklist(): Promise<ChecklistItem[]> {
  await delay(200);
  return [
    { id: "1", label: "Download English Syllabus", completed: true },
    { id: "2", label: "Review Previous Year Papers", completed: false },
    { id: "3", label: "Collect Admit Card", completed: false },
  ];
}

export async function fetchExamResults(): Promise<ExamResultSummary[]> {
  await delay(300);
  return [
    {
      examId: "ut1-jan-2025",
      examName: "Unit Test 1 — January 2025",
      totalObtained: 387,
      totalMax: 500,
      percentage: 77.4,
      grade: "B+",
      status: "PASS",
      rank: 12,
      totalStudents: 33,
      publishedDate: "05 Feb 2025",
      subjects: [
        { subject: "English", marksObtained: 40, totalMarks: 50, grade: "B+", status: "pass" },
        { subject: "Mathematics", marksObtained: 45, totalMarks: 50, grade: "A", status: "pass" },
        { subject: "Science", marksObtained: 38, totalMarks: 50, grade: "B", status: "pass" },
        { subject: "Social Studies", marksObtained: 42, totalMarks: 50, grade: "A", status: "pass" },
        { subject: "Hindi", marksObtained: 35, totalMarks: 50, grade: "B", status: "pass" },
      ],
    },
  ];
}

export async function fetchReportCard(): Promise<ReportCard> {
  await delay(300);
  return {
    overallPercentage: 82.4,
    percentageChange: 2.1,
    currentRank: 4,
    totalStudents: 42,
    attendance: 94,
    attendanceLabel: "Excellent",
    lastUpdated: "15 Oct 2024",
    status: "MIDTERM COMPLETED",
    subjects: [
      { subject: "English", ut1: 40, ut2: 42, midterm: 85, ut3: null, final: null },
      { subject: "Mathematics", ut1: 45, ut2: 48, midterm: 92, ut3: null, final: null },
      { subject: "Science", ut1: 38, ut2: 40, midterm: 78, ut3: null, final: null },
      { subject: "Social Studies", ut1: 42, ut2: 44, midterm: 88, ut3: null, final: null },
      { subject: "Hindi", ut1: 35, ut2: 38, midterm: 72, ut3: null, final: null },
    ],
  };
}

export async function fetchSyllabusFiles(): Promise<SyllabusFile[]> {
  await delay(200);
  return [
    { subject: "English", fileName: "English_Syllabus_2024-25.pdf", uploadedBy: "Priya Reddy", uploadDate: "5 Jun 2024" },
    { subject: "Mathematics", fileName: "Maths_Syllabus_2024-25.pdf", uploadedBy: "Kiran Kumar", uploadDate: "5 Jun 2024" },
    { subject: "Science", fileName: "Science_Syllabus_2024-25.pdf", uploadedBy: "Venkat R", uploadDate: "6 Jun 2024" },
    { subject: "Social Studies", fileName: "SSi_Syllabus_2024-25.pdf", uploadedBy: "Raju T", uploadDate: "6 Jun 2024" },
    { subject: "Hindi", fileName: "Hindi_Syllabus_2024-25.pdf", uploadedBy: "Meena Devi", uploadDate: "7 Jun 2024" },
  ];
}

export async function fetchUnitTestSyllabus(): Promise<UnitTestSyllabus[]> {
  await delay(200);
  return [
    { subject: "English", tag: "ACTIVE", tagColor: "blue", chapters: "Chapters 1-4 | Prose, Poetry, Grammar — Tenses, Articles" },
    { subject: "Mathematics", tag: "CORE", tagColor: "purple", chapters: "Chapters 1-3 | Real Numbers, Polynomials, Quadratic Equations" },
    { subject: "Science", tag: "PRACTICAL", tagColor: "green", chapters: "Chapters 1-3 | Chemical Reactions, Acids-Bases, Metals" },
    { subject: "Social Studies", tag: "THEORY", tagColor: "orange", chapters: "History Ch 1-2 | Geography Ch 1 | Political Science Ch 1" },
    { subject: "Hindi", tag: "LANGUAGE", tagColor: "teal", chapters: "Chapters 1-3 | Gadya, Padya, Vyakaran" },
  ];
}