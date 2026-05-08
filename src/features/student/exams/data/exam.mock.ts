// mocks/exams.mock.ts
import type {
  Exam,
  Result,
  ReportCard,
  Syllabus,
  ExamResult,
  UnitSyllabus,
  Deadline,
} from "../types/exams.types";

export const examsMock: Exam[] = [
  {
    id: "1",
    subject: "English",
    date: "15 Apr 2025",
    startTime: "09:00 AM",
    endTime: "12:00 PM",
    venue: "Hall A",
  },
  {
    id: "2",
    subject: "Mathematics",
    date: "17 Apr 2025",
    startTime: "09:00 AM",
    endTime: "12:00 PM",
    venue: "Hall A",
  },
  {
    id: "3",
    subject: "Science",
    date: "19 Apr 2025",
    startTime: "09:00 AM",
    endTime: "12:00 PM",
    venue: "Lab 1",
  },
  {
    id: "4",
    subject: "Social Studies",
    date: "21 Apr 2025",
    startTime: "09:00 AM",
    endTime: "12:00 PM",
    venue: "Hall B",
  },
  {
    id: "5",
    subject: "Hindi",
    date: "23 Apr 2025",
    startTime: "09:00 AM",
    endTime: "12:00 PM",
    venue: "Hall A",
  },
];

export const resultsMock: Result[] = [
  { subject: "English", marks: 40, total: 50, grade: "B+", status: "pass" },
  { subject: "Mathematics", marks: 45, total: 50, grade: "A", status: "pass" },
  { subject: "Science", marks: 38, total: 50, grade: "B", status: "pass" },
  { subject: "Social Studies", marks: 42, total: 50, grade: "A", status: "pass" },
  { subject: "Hindi", marks: 35, total: 50, grade: "B", status: "pass" },
];

export const examResultMock: ExamResult = {
  examName: "Unit Test 1 — January 2025",
  examDate: "15 Jan 2025",
  totalMarks: 500,
  obtainedMarks: 387,
  percentage: 77.4,
  grade: "B+",
  rank: "12/33",
  status: "pass",
  results: resultsMock,
};

export const reportMock: ReportCard = {
  percentage: 82.4,
  rank: 4,
  attendance: 94,
  results: [
    { subject: "English", marks: 40, total: 50, grade: "B+", status: "pass", scores: { ut1: 40, ut2: 42, midterm: 85, ut3: null, final: null } },
    { subject: "Mathematics", marks: 45, total: 50, grade: "A", status: "pass", scores: { ut1: 45, ut2: 48, midterm: 92, ut3: null, final: null } },
    { subject: "Science", marks: 38, total: 50, grade: "B", status: "pass", scores: { ut1: 38, ut2: 40, midterm: 78, ut3: null, final: null } },
    { subject: "Social Studies", marks: 42, total: 50, grade: "A", status: "pass", scores: { ut1: 42, ut2: 44, midterm: 88, ut3: null, final: null } },
    { subject: "Hindi", marks: 35, total: 50, grade: "B", status: "pass", scores: { ut1: 35, ut2: 38, midterm: 72, ut3: null, final: null } },
  ],
};

export const syllabusMock: Syllabus[] = [
  {
    subject: "English",
    fileName: "English_Syllabus_2024-25.pdf",
    fileUrl: "#",
    uploadedBy: "Priya Reddy",
    uploadDate: "5 Jun 2024",
  },
  {
    subject: "Mathematics",
    fileName: "Maths_Syllabus_2024-25.pdf",
    fileUrl: "#",
    uploadedBy: "Kiran Kumar",
    uploadDate: "5 Jun 2024",
  },
  {
    subject: "Science",
    fileName: "Science_Syllabus_2024-25.pdf",
    fileUrl: "#",
    uploadedBy: "Venkat R",
    uploadDate: "6 Jun 2024",
  },
  {
    subject: "Social Studies",
    fileName: "SST_Syllabus_2024-25.pdf",
    fileUrl: "#",
    uploadedBy: "Raju T",
    uploadDate: "6 Jun 2024",
  },
  {
    subject: "Hindi",
    fileName: "Hindi_Syllabus_2024-25.pdf",
    fileUrl: "#",
    uploadedBy: "Meena Devi",
    uploadDate: "7 Jun 2024",
  },
];

export const unitTestSyllabusMock: UnitSyllabus[] = [
  {
    subject: "English",
    chapters: "Chapters 1-4",
    topics: "Prose, Poetry, Grammar — Tenses, Articles",
  },
  {
    subject: "Mathematics",
    chapters: "Chapters 1-3",
    topics: "Real Numbers, Polynomials, Quadratic Equations",
  },
  {
    subject: "Science",
    chapters: "Chapters 1-3",
    topics: "Chemical Reactions, Acids-Bases, Metals",
  },
  {
    subject: "Social Studies",
    chapters: "History Ch 1-2 | Geography Ch 1",
    topics: "Political Science Ch 1",
  },
  {
    subject: "Hindi",
    chapters: "Chapters 1-3",
    topics: "Gadya, Padya...",
  },
];

export const deadlinesMock: Deadline[] = [
  {
    title: "Science Project Submission",
    dueText: "Due in 2 days",
  },
  {
    title: "Hindi Viva Exam",
    dueText: "April 12, 2025",
  },
];