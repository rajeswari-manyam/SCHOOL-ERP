import { useState, useMemo, useCallback } from "react";
import type {
  ExamSelector,
  StudentMarkEntry,
  ExamSummary,
  SubmittedExam,
  PublishedResult,
  Grade,
} from "../types/exam-marks.types";
import { EXAM_TYPE_LABELS } from "../types/exam-marks.types";

// ── Grade calculation ─────────────────────────────────────────────────────
export const calcGrade = (marks: number, maxMarks: number): Grade => {
  const pct = (marks / maxMarks) * 100;
  if (pct >= 91) return "A+";
  if (pct >= 81) return "A";
  if (pct >= 71) return "B+";
  if (pct >= 61) return "B";
  if (pct >= 51) return "C";
  if (pct >= 40) return "D";
  return "F";
};

export const GRADE_CONFIG: Record<Grade, { classes: string; bg: string }> = {
  "A+": { classes: "bg-emerald-50 text-emerald-700 border-emerald-200", bg: "bg-emerald-500" },
  "A":  { classes: "bg-emerald-50 text-emerald-600 border-emerald-200", bg: "bg-emerald-400" },
  "B+": { classes: "bg-blue-50 text-blue-700 border-blue-200",          bg: "bg-blue-500"   },
  "B":  { classes: "bg-blue-50 text-blue-600 border-blue-200",          bg: "bg-blue-400"   },
  "C":  { classes: "bg-amber-50 text-amber-700 border-amber-200",       bg: "bg-amber-400"  },
  "D":  { classes: "bg-orange-50 text-orange-700 border-orange-200",    bg: "bg-orange-400" },
  "F":  { classes: "bg-red-50 text-red-700 border-red-200",             bg: "bg-red-500"    },
};

// ── Mock students (8-A roster) ────────────────────────────────────────────
const BASE_STUDENTS: Omit<StudentMarkEntry, "marks" | "grade" | "remarks" | "isAbsent">[] = [
  { studentId: "s1", rollNo: "01", name: "Arjun Reddy",   maxMarks: 100 },
  { studentId: "s2", rollNo: "02", name: "Priya Sharma",  maxMarks: 100 },
  { studentId: "s3", rollNo: "03", name: "Ravi Teja",     maxMarks: 100 },
  { studentId: "s4", rollNo: "04", name: "Sneha Patel",   maxMarks: 100 },
  { studentId: "s5", rollNo: "05", name: "Meena Kumari",  maxMarks: 100 },
  { studentId: "s6", rollNo: "06", name: "Rohan Mehta",   maxMarks: 100 },
  { studentId: "s7", rollNo: "07", name: "Ananya Singh",  maxMarks: 100 },
  { studentId: "s8", rollNo: "08", name: "Karthik Naidu", maxMarks: 100 },
];

const freshStudents = (): StudentMarkEntry[] =>
  BASE_STUDENTS.map((s) => ({ ...s, marks: "", grade: null, remarks: "", isAbsent: false }));

// ── Mock submitted exams ──────────────────────────────────────────────────
export const MOCK_SUBMITTED: SubmittedExam[] = [
  {
    id: "sub-1", examType: "UNIT_TEST_1", examLabel: "Unit Test 1",
    className: "Class 8-A", subject: "Mathematics", academicYear: "2024-25",
    submittedOn: "2025-02-10", status: "APPROVED",
    totalStudents: 8, appeared: 8, average: 74.5, passRate: 87.5,
  },
  {
    id: "sub-2", examType: "MID_TERM", examLabel: "Mid Term",
    className: "Class 8-A", subject: "Mathematics", academicYear: "2024-25",
    submittedOn: "2025-03-22", status: "PUBLISHED",
    totalStudents: 8, appeared: 7, average: 68.3, passRate: 85.7,
  },
  {
    id: "sub-3", examType: "UNIT_TEST_2", examLabel: "Unit Test 2",
    className: "Class 8-A", subject: "Mathematics", academicYear: "2024-25",
    submittedOn: "2025-04-10", status: "SUBMITTED",
    totalStudents: 8, appeared: 8, average: 71.0, passRate: 100,
  },
  {
    id: "sub-4", examType: "UNIT_TEST_1", examLabel: "Unit Test 1",
    className: "Class 8-A", subject: "Science", academicYear: "2024-25",
    submittedOn: "2025-02-12", status: "APPROVED",
    totalStudents: 8, appeared: 7, average: 66.1, passRate: 71.4,
  },
];

// ── Mock published results ────────────────────────────────────────────────
export const MOCK_PUBLISHED: PublishedResult[] = [
  {
    id: "pub-1",
    examLabel: "Mid Term Examination",
    className: "Class 8-A",
    academicYear: "2024-25",
    publishedOn: "2025-04-01",
    classAverage: 70.4,
    overallPassRate: 87.5,
    topStudents: [
      { rank: 1, name: "Sneha Patel",   rollNo: "04", marks: 94, maxMarks: 100, grade: "A+" },
      { rank: 2, name: "Arjun Reddy",   rollNo: "01", marks: 88, maxMarks: 100, grade: "A"  },
      { rank: 3, name: "Karthik Naidu", rollNo: "08", marks: 81, maxMarks: 100, grade: "A"  },
    ],
    subjectPerformance: [
      { subject: "Mathematics",    average: 74.5, passRate: 87.5, highest: 94 },
      { subject: "Science",        average: 68.3, passRate: 85.7, highest: 91 },
      { subject: "English",        average: 72.1, passRate: 100,  highest: 89 },
      { subject: "Social Studies", average: 66.8, passRate: 75.0, highest: 87 },
    ],
  },
];

// ── Hook ──────────────────────────────────────────────────────────────────
export type ExamTab = "enter" | "submitted" | "published";

export const useExamMarks = () => {
  const [activeTab, setActiveTab] = useState<ExamTab>("enter");

  // Exam selector
  const [selector, setSelector] = useState<ExamSelector>({
    examType: "", className: "", subject: "", academicYear: "",
  });

  // Mark entries
  const [entries, setEntries] = useState<StudentMarkEntry[]>([]);
  const [studentsLoaded, setStudentsLoaded] = useState(false);

  // Modals / toasts
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [draftMsg, setDraftMsg] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(false);
  const [dlMsg, setDlMsg] = useState(false);

  // Load students handler
  const handleLoadStudents = useCallback(() => {
    setEntries(freshStudents());
    setStudentsLoaded(true);
  }, []);

  // Update a single entry field
  const updateEntry = useCallback(
    (studentId: string, field: keyof StudentMarkEntry, value: unknown) => {
      setEntries((prev) =>
        prev.map((e) => {
          if (e.studentId !== studentId) return e;
          const updated = { ...e, [field]: value };
          // Recalc grade when marks or absent changes
          if (field === "marks" && typeof value === "number" && !updated.isAbsent) {
            updated.grade = calcGrade(value, e.maxMarks);
          }
          if (field === "isAbsent" && value === true) {
            updated.marks = "";
            updated.grade = null;
          }
          if (field === "isAbsent" && value === false && typeof updated.marks === "number") {
            updated.grade = calcGrade(updated.marks as number, e.maxMarks);
          }
          return updated;
        })
      );
    },
    []
  );

  // Summary
  const summary = useMemo((): ExamSummary => {
    const appeared = entries.filter((e) => !e.isAbsent && e.marks !== "");
    const marksArr = appeared.map((e) => e.marks as number);
    const passArr  = marksArr.filter((m) => m >= 40);
    return {
      total:    entries.length,
      appeared: appeared.length,
      absent:   entries.filter((e) => e.isAbsent).length,
      highest:  marksArr.length ? Math.max(...marksArr) : 0,
      lowest:   marksArr.length ? Math.min(...marksArr) : 0,
      average:  marksArr.length
        ? Math.round((marksArr.reduce((a, b) => a + b, 0) / marksArr.length) * 10) / 10
        : 0,
      passRate: marksArr.length
        ? Math.round((passArr.length / marksArr.length) * 100)
        : 0,
      failCount: marksArr.length - passArr.length,
    };
  }, [entries]);

  const selectorLabel = selector.examType
    ? `${EXAM_TYPE_LABELS[selector.examType]} · ${selector.className} · ${selector.subject}`
    : "";

  const handleSaveDraft = () => {
    setDraftMsg(true);
    setTimeout(() => setDraftMsg(false), 3000);
  };

  const handleOpenSubmit = () => {
    setConfirmChecked(false);
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowSubmitModal(false);
    setSubmitMsg(true);
    setTimeout(() => setSubmitMsg(false), 3000);
  };

  const handleDownloadReport = () => {
    setDlMsg(true);
    setTimeout(() => setDlMsg(false), 3000);
  };

  return {
    activeTab, setActiveTab,
    selector, setSelector,
    entries, studentsLoaded,
    handleLoadStudents, updateEntry,
    summary, selectorLabel,
    showSubmitModal, setShowSubmitModal,
    confirmChecked, setConfirmChecked,
    draftMsg, submitMsg, dlMsg,
    handleSaveDraft, handleOpenSubmit, handleConfirmSubmit,
    handleDownloadReport,
    submittedExams: MOCK_SUBMITTED,
    publishedResults: MOCK_PUBLISHED,
  };
};
