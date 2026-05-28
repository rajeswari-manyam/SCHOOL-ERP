// hooks/useExamData.ts
import { useState, useEffect, useCallback } from "react";
import {
  getAllExamTimetable,
  getExamTimetableById,
  type ExamTimetable,
} from "../../../../services/examtimetable.api";
import {
  getAllResults,
  getResultById,
  getStudentResults,
  type Result as ApiResult,
} from "../../../../services/results.api";
import type { Exam, ExamResult, Result } from "../types/exams.types";
import {
  reportMock,
  syllabusMock,
  unitTestSyllabusMock,
  deadlinesMock,
} from "../data/exam.mock";

/* ─────────────────────────────────────────────
   Helper: map API ExamTimetable → local Exam
───────────────────────────────────────────── */
const mapTimetableToExam = (t: ExamTimetable): Exam => ({
  id: t.id,
  subject: t.subjectname as Exam["subject"],
  date: t.exam_date,
  startTime: t.start_time,
  endTime: t.end_time,
  venue: t.room_no,
});

/* ─────────────────────────────────────────────
   Helper: map API Result → local Result
───────────────────────────────────────────── */
const TOTAL_MARKS_PER_SUBJECT = 100;

const mapApiResult = (r: ApiResult): Result => ({
  subject: (r.subjectName ?? "Unknown") as Result["subject"],
  marks: r.marks,
  total: TOTAL_MARKS_PER_SUBJECT,
  grade: r.grade,
  status: r.absent ? "fail" : r.marks >= TOTAL_MARKS_PER_SUBJECT * 0.35 ? "pass" : "fail",
});

/* ─────────────────────────────────────────────
   Helper: build ExamResult summary from list
───────────────────────────────────────────── */
const buildExamResult = (results: ApiResult[]): ExamResult => {
  const mapped = results.map(mapApiResult);
  const obtainedMarks = mapped.reduce((sum, r) => sum + r.marks, 0);
  const totalMarks = mapped.length * TOTAL_MARKS_PER_SUBJECT;
  const percentage = totalMarks > 0 ? parseFloat(((obtainedMarks / totalMarks) * 100).toFixed(1)) : 0;

  const firstResult = results[0];
  return {
    examName: firstResult?.examName ?? firstResult?.exam_type ?? "Exam",
    examDate: firstResult ? new Date(firstResult.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "",
    totalMarks,
    obtainedMarks,
    percentage,
    grade: percentage >= 90 ? "A+" : percentage >= 75 ? "A" : percentage >= 60 ? "B+" : percentage >= 50 ? "B" : "C",
    rank: "N/A",
    status: percentage >= 35 ? "pass" : "fail",
    results: mapped,
  };
};

/* ─────────────────────────────────────────────
   Hook
───────────────────────────────────────────── */
export const useExamData = (
  classname: string,
  sectionname: string,
  studentId: string,
  examType: string,
  academicYear: string
) => {
  const [activeTab, setActiveTab] = useState<
    "upcoming" | "results" | "report" | "syllabus"
  >("upcoming");

  // ── Exam list state ──
  const [exams, setExams] = useState<Exam[]>([]);
  const [examsLoading, setExamsLoading] = useState(false);
  const [examsError, setExamsError] = useState<string | null>(null);

  // ── Single exam state ──
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedExamLoading, setSelectedExamLoading] = useState(false);
  const [selectedExamError, setSelectedExamError] = useState<string | null>(null);

  // ── Results state ──
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState<string | null>(null);

  // ── Single result state ──
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [selectedResultLoading, setSelectedResultLoading] = useState(false);
  const [selectedResultError, setSelectedResultError] = useState<string | null>(null);

  /* ── Fetch all exams ── */
  const fetchAllExams = useCallback(async () => {
    if (!classname || !sectionname) return;
    setExamsLoading(true);
    setExamsError(null);
    try {
      const response = await getAllExamTimetable(classname, sectionname);
      if (response.status) {
        setExams(response.data.map(mapTimetableToExam));
      } else {
        setExamsError("Failed to fetch exam timetable.");
      }
    } catch (err) {
      setExamsError("Something went wrong while fetching exams.");
      console.error(err);
    } finally {
      setExamsLoading(false);
    }
  }, [classname, sectionname]);

  /* ── Fetch single exam by ID ── */
  const fetchExamById = useCallback(async (id: string) => {
    setSelectedExamLoading(true);
    setSelectedExamError(null);
    try {
      const response = await getExamTimetableById(id);
      if (response.status) {
        setSelectedExam(mapTimetableToExam(response.data));
      } else {
        setSelectedExamError("Failed to fetch exam details.");
      }
    } catch (err) {
      setSelectedExamError("Something went wrong while fetching exam details.");
      console.error(err);
    } finally {
      setSelectedExamLoading(false);
    }
  }, []);

  /* ── Fetch student results (filtered) ── */
  const fetchStudentResults = useCallback(async () => {
    if (!studentId || !examType || !academicYear) return;
    setResultsLoading(true);
    setResultsError(null);
    try {
      const response = await getStudentResults(studentId, examType, academicYear);
      if (response.status) {
        setExamResult(buildExamResult(response.data));
      } else {
        setResultsError("Failed to fetch results.");
      }
    } catch (err) {
      setResultsError("Something went wrong while fetching results.");
      console.error(err);
    } finally {
      setResultsLoading(false);
    }
  }, [studentId, examType, academicYear]);

  /* ── Fetch all results (no filter) ── */
  const fetchAllResults = useCallback(async () => {
    setResultsLoading(true);
    setResultsError(null);
    try {
      const response = await getAllResults();
      if (response.status) {
        setExamResult(buildExamResult(response.data));
      } else {
        setResultsError("Failed to fetch results.");
      }
    } catch (err) {
      setResultsError("Something went wrong while fetching results.");
      console.error(err);
    } finally {
      setResultsLoading(false);
    }
  }, []);

  /* ── Fetch single result by ID ── */
  const fetchResultById = useCallback(async (id: string) => {
    setSelectedResultLoading(true);
    setSelectedResultError(null);
    try {
      const response = await getResultById(id);
      if (response.status) {
        setSelectedResult(mapApiResult(response.data));
      } else {
        setSelectedResultError("Failed to fetch result details.");
      }
    } catch (err) {
      setSelectedResultError("Something went wrong while fetching result details.");
      console.error(err);
    } finally {
      setSelectedResultLoading(false);
    }
  }, []);

  /* ── Auto-fetch on mount / param change ── */
  useEffect(() => { fetchAllExams(); }, [fetchAllExams]);

  useEffect(() => {
    // Use student-specific results if params available, else fall back to all results
    if (studentId && examType && academicYear) {
      fetchStudentResults();
    } else {
      fetchAllResults();
    }
  }, [studentId, examType, academicYear, fetchStudentResults, fetchAllResults]);

  return {
    // Tab
    activeTab,
    setActiveTab,

    // Exam timetable (live)
    exams,
    examsLoading,
    examsError,
    refetchExams: fetchAllExams,

    // Single exam (live)
    selectedExam,
    selectedExamLoading,
    selectedExamError,
    fetchExamById,

    // Results (live)
    examResult,
    resultsLoading,
    resultsError,
    refetchResults: studentId ? fetchStudentResults : fetchAllResults,

    // Single result (live)
    selectedResult,
    selectedResultLoading,
    selectedResultError,
    fetchResultById,

    // Still mock (no GET APIs for these)
    report: reportMock,
    syllabus: syllabusMock,
    unitTestSyllabus: unitTestSyllabusMock,
    deadlines: deadlinesMock,
  };
};