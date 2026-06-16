import { useState, useCallback, useMemo } from "react";
import type {
  ExamSelector,
  StudentMarkEntry,
  ExamSummary,
  SubmittedExam,
  PublishedResult,
  Grade,
  GetAllMarksQuery,
} from "../types/exam-marks.types";
import { examMarksApi } from "@/services/teacher-exam-marks.api";
import { mapToStudentMarkEntriesFromSubject } from "./useStudentsBySubject";
import { useAllMarks, marksToSubmittedExam } from "./useAllMarks";
import type { SubmittedFilter } from "../components/SubmittedMarksFilter";

const isDev = import.meta.env.DEV;
function logger(level: "log" | "warn" | "error", ...args: unknown[]) { if (isDev) console[level]("[useExamMarks]", ...args); }

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

const EMPTY_FILTER: SubmittedFilter = {
  class_id: "",
  section_id: "",
  subject_id: "",
  exam_id: "",
};

export const useExamMarks = () => {
  const [activeTab, setActiveTab] = useState<ExamTab>("enter");

  // Exam selector (Enter Marks tab)
  const [selector, setSelector] = useState<ExamSelector>({
    examType: "", className: "", subject: "", academicYear: "",
  });

  // ── Submitted Marks tab filter ─────────────────────────────────────────
  // Separate from `selector` so the two tabs are independent.
  const [submittedFilter, setSubmittedFilter] = useState<SubmittedFilter>(EMPTY_FILTER);
  // `activeFilter` is what was last searched — only updates when "Search" is clicked.
  const [activeFilter, setActiveFilter] = useState<SubmittedFilter>(EMPTY_FILTER);

  const handleFilterSearch = useCallback(() => {
    setActiveFilter({ ...submittedFilter });
  }, [submittedFilter]);

  // Mark entries
  const [entries, setEntries] = useState<StudentMarkEntry[]>([]);
  const [studentsLoaded, setStudentsLoaded] = useState(false);

  // Modals / toasts
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [draftMsg, setDraftMsg] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [dlMsg, setDlMsg] = useState(false);

  // ── /tenant/getallmarks — driven by the filter's activeFilter ─────────
  const marksQuery = useMemo((): GetAllMarksQuery => ({
    class_id:   activeFilter.class_id,
    section_id: activeFilter.section_id,
    subject_id: activeFilter.subject_id,
    ...(activeFilter.exam_id ? { exam_id: activeFilter.exam_id } : {}),
  }), [activeFilter]);

  // Only fetch when on the submitted tab AND at minimum class+section+subject are set
  const marksEnabled =
    activeTab === "submitted" &&
    Boolean(activeFilter.class_id && activeFilter.section_id && activeFilter.subject_id);

  const {
    data: marksRecords,
    isLoading: marksLoading,
    isError: marksError,
    refetch: refetchMarks,
  } = useAllMarks(marksQuery, marksEnabled);

  const submittedExams: SubmittedExam[] = useMemo(
    () =>
      marksRecords
        ? marksToSubmittedExam(
            marksRecords,
            activeFilter.className ?? selector.className,
            activeFilter.subjectName ?? selector.subject,
           (activeFilter.examName ?? selector.examType) || undefined
          )
        : [],
    [marksRecords, activeFilter, selector.className, selector.subject, selector.examType],
  );

  // ── /tenant/studentsbysubject — on-demand fetch ────────────────────────
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);

  const handleLoadStudents = useCallback(async () => {
    const q = {
      class_id:       selector.classId       ?? "",
      section_id:     selector.sectionId     ?? "",
      subject_id:     selector.subjectId     ?? "",
      academicYearId: selector.academicYearId ?? "",
      exam_id:        selector.examId        ?? "",
    };

    if (!q.class_id || !q.section_id || !q.subject_id || !q.academicYearId || !q.exam_id) {
      setStudentsError("All selector fields must be filled before loading students.");
      return;
    }

    setStudentsLoading(true);
    setStudentsError(null);
    setEntries([]);
    setStudentsLoaded(false);

    try {
      const items = await examMarksApi.getStudentsBySubject(q);
      if (items.length === 0) {
        setStudentsError("No students returned for the selected criteria.");
        setEntries([]);
        setStudentsLoaded(true);
      } else {
        setEntries(mapToStudentMarkEntriesFromSubject(items));
        setStudentsLoaded(true);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load students.";
      logger("error", "handleLoadStudents failed", { message, query: q });
      setStudentsError(message);
      setEntries([]);
    } finally {
      setStudentsLoading(false);
    }
  }, [selector.classId, selector.sectionId, selector.subjectId, selector.academicYearId, selector.examId]);

  // Update a single entry field
  const updateEntry = useCallback(
    (studentId: string, field: keyof StudentMarkEntry, value: unknown) => {
      setEntries((prev) =>
        prev.map((e) => {
          if (e.studentId !== studentId) return e;
          const updated = { ...e, [field]: value };
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

  const selectorLabel = [selector.examType, selector.className, selector.subject]
    .filter(Boolean)
    .join(" · ");

  const handleSaveDraft = () => {
    setDraftMsg(true);
    setTimeout(() => setDraftMsg(false), 3000);
  };

  const handleOpenSubmit = () => {
    setConfirmChecked(false);
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = useCallback(async () => {
    setShowSubmitModal(false);
    setSubmitError(null);

    try {
      setSubmitting(true);
      const res = await examMarksApi.submitMarksBulk(entries, selector);
      logger("log", `Bulk submit result`, res);

      setSubmitMsg(true);
      setTimeout(() => setSubmitMsg(false), 3000);

      // Switch to Submitted tab; pre-populate filter from selector and trigger search
      setActiveTab("submitted");
      const newFilter: SubmittedFilter = {
        class_id:    selector.classId    ?? "",
        section_id:  selector.sectionId  ?? "",
        subject_id:  selector.subjectId  ?? "",
        exam_id:     selector.examId     ?? "",
        className:   selector.className,
        sectionName: "",
        subjectName: selector.subject,
        examName:    selector.examType,
      };
      setSubmittedFilter(newFilter);
      setActiveFilter(newFilter);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit results";
      logger("error", "Submit failed", { message });
      setSubmitError(message);
      setTimeout(() => setSubmitError(null), 10000);
    } finally {
      setSubmitting(false);
    }
  }, [entries, selector]);

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
    submitting, submitError,
    submittedExams,
    marksLoading, marksError,
    refetchMarks,
    publishedResults: MOCK_PUBLISHED,
    studentsLoading, studentsError,
    // Submitted tab filter
    submittedFilter, setSubmittedFilter,
    activeFilter,
    handleFilterSearch,
    marksEnabled,
  };
};
