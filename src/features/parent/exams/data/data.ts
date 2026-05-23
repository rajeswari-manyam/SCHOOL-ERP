import type { Exam, ResultSummary, ReportCard } from "../types/exam.types";

export const upcomingExams: Exam[] = [
  { id: "1", subject: "English",       date: "15 Apr 2025", day: "Tuesday",   time: "9:00 AM – 11:00 AM", venue: "Room 102", examName: "Unit Test 1" },
  { id: "2", subject: "Mathematics",   date: "16 Apr 2025", day: "Wednesday", time: "9:00 AM – 11:00 AM", venue: "Room 201", examName: "Unit Test 1" },
  { id: "3", subject: "Science",       date: "17 Apr 2025", day: "Thursday",  time: "9:00 AM – 11:00 AM", venue: "Room 301", examName: "Unit Test 1" },
  { id: "4", subject: "Social Studies",date: "18 Apr 2025", day: "Friday",    time: "9:00 AM – 11:00 AM", venue: "Room 102", examName: "Unit Test 1" },
  { id: "5", subject: "Hindi",         date: "19 Apr 2025", day: "Saturday",  time: "9:00 AM – 11:00 AM", venue: "Room 102", examName: "Unit Test 1" },
];

export const nextExam = {
  name: "Unit Test 1 — English",
  date: "15 April 2025",
  time: "9:00 AM",
  venue: "Room 102",
  daysLeft: 4,
  hoursLeft: 9,
};

export const resultSummaries: ResultSummary[] = [
  {
    id: "ut1-jan-2025",
    examName: "Unit Test 1 — January 2025",
    totalObtained: 387,
    totalMarks: 500,
    percentage: 77.4,
    grade: "B+",
    rank: "12 / 33",
    strongestSubjects: ["Mathematics", "Science", "English"],
    analyticsNote: "Ravi has shown consistent growth in Mathematics and Sciences. Keep up the momentum for the finals.",
    results: [
      { subject: "English",       marksObtained: 40, totalMarks: 50, percentage: 80, grade: "B+", status: "Pass" },
      { subject: "Mathematics",   marksObtained: 45, totalMarks: 50, percentage: 90, grade: "A",  status: "Pass" },
      { subject: "Science",       marksObtained: 38, totalMarks: 50, percentage: 76, grade: "B",  status: "Pass" },
      { subject: "Social Studies",marksObtained: 42, totalMarks: 50, percentage: 84, grade: "A",  status: "Pass" },
      { subject: "Hindi",         marksObtained: 35, totalMarks: 50, percentage: 70, grade: "B",  status: "Pass" },
    ],
  },
];

export const reportCard: ReportCard = {
  academicYear: "2024-25",
  classPercentile: 84,
  strongestSubject: "Mathematics",
  attentionSubject: "Hindi",
  attentionNote: "Score dropped by 4% since UT1. Consider additional practice.",
  entries: [
    { subject: "English",        ut1: 40, ut2: 38, midterm: 72,  ut3: null, final: null },
    { subject: "Mathematics",    ut1: 45, ut2: 42, midterm: 78,  ut3: null, final: null },
    { subject: "Science",        ut1: 38, ut2: 40, midterm: 69,  ut3: null, final: null },
    { subject: "Social Studies", ut1: 42, ut2: 38, midterm: 74,  ut3: null, final: null },
    { subject: "Hindi",          ut1: 35, ut2: 36, midterm: 65,  ut3: null, final: null },
  ],
};