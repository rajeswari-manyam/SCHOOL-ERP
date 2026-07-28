import { useState, useEffect, useCallback } from "react";
import {
  getUpcomingExams,
  getExamTimetableById,
  type UpcomingExamItem,
  type ExamTimetableDetail,
} from "../../../../services/examtimetable.api";
import {
  getMarksByStudentId,
  type Mark,
} from "../../../../services/marks.api";
import { getAllExams, type ExamRecord } from "../../../../services/exam.api";
import type { Exam, ExamResult, Result } from "../types/exams.types";

/* ─────────────────────────────────────────────
   Helper: map API ExamTimetable → local Exam
───────────────────────────────────────────── */
const mapTimetableToExam = (
  t: UpcomingExamItem | ExamTimetableDetail
): Exam => ({
  id: t.id,
  subject: (
    (t as UpcomingExamItem).subject?.subject_name ??
    (t as ExamTimetableDetail).subject_id
  ) as Exam["subject"],
  date: t.exam_date,
  startTime: t.start_time,
  endTime: t.end_time,
  venue: t.room_no ?? "",
  syllabus: t.syllabus ?? undefined,
});

/* ─────────────────────────────────────────────
   Helper: map Mark → Result
   subject_name is null from backend — use subject_id as fallback
   but label it clearly so it's obvious if it's still a UUID
───────────────────────────────────────────── */
const mapMarkToResult = (m: Mark, subjectLabel?: string): Result => ({
  subject: (
    subjectLabel ??
    (m.subject_name && m.subject_name.trim() !== "" ? m.subject_name : m.subject_id)
  ) as Result["subject"],
  marks: m.marks_obtained,
  total: m.max_marks,
  grade: m.grade,
  status: m.is_absent
    ? "fail"
    : m.marks_obtained >= m.max_marks * 0.35
    ? "pass"
    : "fail",
});

/* ─────────────────────────────────────────────
   Helper: build ExamResult summary from marks
───────────────────────────────────────────── */
const buildExamResult = (marks: Mark[], examName: string): ExamResult => {
  const results = marks.map((m) => mapMarkToResult(m));
  const obtainedMarks = marks.reduce((sum, m) => sum + m.marks_obtained, 0);
  const totalMarks = marks.reduce((sum, m) => sum + m.max_marks, 0);
  const percentage =
    totalMarks > 0
      ? parseFloat(((obtainedMarks / totalMarks) * 100).toFixed(1))
      : 0;

  return {
    examName,
    examDate: marks[0]?.academic_year ?? "",
    totalMarks,
    obtainedMarks,
    percentage,
    grade:
      percentage >= 90 ? "A+" :
      percentage >= 75 ? "A"  :
      percentage >= 60 ? "B+" :
      percentage >= 50 ? "B"  : "C",
    rank: "N/A",
    status: percentage >= 35 ? "pass" : "fail",
    results,
  };
};

/* ─────────────────────────────────────────────
   Hook
───────────────────────────────────────────── */
export const useExamData = (
  classId: string,
  sectionId: string,
  studentId: string,
  _examName: string,
  academicYearId: string,
) => {
  const [activeTab, setActiveTab] = useState<
    "upcoming" | "results" | "report" | "syllabus"
  >("upcoming");

  // ── Upcoming timetable ──
  const [exams, setExams] = useState<Exam[]>([]);
  const [examsLoading, setExamsLoading] = useState(false);
  const [examsError, setExamsError] = useState<string | null>(null);

  // ── Single exam detail ──
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedExamLoading, setSelectedExamLoading] = useState(false);
  const [selectedExamError, setSelectedExamError] = useState<string | null>(null);

  // ── Exam name dropdown list ──
  const [examList, setExamList] = useState<ExamRecord[]>([]);
  const [examListLoading, setExamListLoading] = useState(false);

  // ── Selected exam for results ──
  const [selectedResultExamId, setSelectedResultExamId] = useState<string>("");

  // ── Results state ──
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState<string | null>(null);

  /* ── Fetch upcoming timetable ── */
  const fetchAllExams = useCallback(async () => {
    if (!classId) return;
    setExamsLoading(true);
    setExamsError(null);
    try {
      const res = await getUpcomingExams({
        class_id: classId,
        section_id: sectionId || undefined,
      });
      if (res.status && Array.isArray(res.data)) {
        setExams(res.data.map(mapTimetableToExam));
      } else {
        setExamsError("Failed to fetch exam timetable.");
      }
    } catch (err) {
      setExamsError("Something went wrong while fetching exams.");
      console.error(err);
    } finally {
      setExamsLoading(false);
    }
  }, [classId, sectionId]);

  /* ── Fetch exam name list for dropdown ── */
  const fetchExamList = useCallback(async () => {
    setExamListLoading(true);
    try {
      const data = await getAllExams();
      const filtered = academicYearId
        ? data.filter((e) => e.academicYearId === academicYearId)
        : data;
      setExamList(filtered);
      // auto-select first — triggers fetchMarksByExam via useEffect below
      if (filtered.length > 0) {
        setSelectedResultExamId(filtered[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch exam list", err);
    } finally {
      setExamListLoading(false);
    }
  }, [academicYearId]);

  /* ── Fetch marks for student + specific exam from the API ──
     The backend supports ?student_id=&exam_id= — pass both so the
     join is done server-side and subject_name / exam_name come back populated.
  ── */
  const fetchMarksByExam = useCallback(async (examId: string) => {
  console.log("Selected Exam ID:", examId);   // ✅ ADD HERE
  console.log("Exam List:", examList);        // ✅ ADD HERE
  console.log("Student ID:", studentId);      // ✅ ADD (extra helpful)

  if (!studentId || !examId) return;

  setResultsLoading(true);
  setResultsError(null);

  try {
    const response = await getMarksByStudentId(studentId, examId);

    console.log("API RESPONSE:", response);   // ✅ VERY IMPORTANT

    const examName =
      examList.find((e) => e.id === examId)?.exam_name ?? "Exam";

  if (response.status && response.data.length > 0) {
  setExamResult(buildExamResult(response.data, examName));
} else {
  setExamResult({
    examName,
    examDate: "",
    totalMarks: 0,
    obtainedMarks: 0,
    percentage: 0,
    grade: "N/A",
    rank: "N/A",
    status: "fail",
    results: [],
  });
}
  } catch (err) {
    console.error(err);
    setResultsError("Something went wrong while fetching marks.");
  } finally {
    setResultsLoading(false);
  }
}, [studentId, examList]);
  /* ── Single exam detail ── */
  const fetchExamById = useCallback(async (id: string) => {
    setSelectedExamLoading(true);
    setSelectedExamError(null);
    try {
      const data = await getExamTimetableById(id);
      if (data) setSelectedExam(mapTimetableToExam(data));
      else setSelectedExamError("Failed to fetch exam details.");
    } catch (err) {
      setSelectedExamError("Something went wrong while fetching exam details.");
      console.error(err);
    } finally {
      setSelectedExamLoading(false);
    }
  }, []);

  /* ── Re-fetch marks whenever selected exam changes ── */
  useEffect(() => {
    if (selectedResultExamId) {
      fetchMarksByExam(selectedResultExamId);
    }
  }, [selectedResultExamId, fetchMarksByExam]);

  /* ── Auto-fetch on mount / param change ── */
  useEffect(() => { fetchAllExams(); }, [fetchAllExams]);
  useEffect(() => { fetchExamList(); }, [fetchExamList]);
const refetchResults = useCallback(() => {
  if (selectedResultExamId) {
    fetchMarksByExam(selectedResultExamId);
  }
}, [selectedResultExamId, fetchMarksByExam]);
  return {
    activeTab,
    setActiveTab,

    exams,
    examsLoading,
    examsError,
    refetchExams: fetchAllExams,

    selectedExam,
    selectedExamLoading,
    selectedExamError,
    fetchExamById,
refetchResults,
    examList,
    examListLoading,
    selectedResultExamId,
    setSelectedResultExamId,

    examResult,
    resultsLoading,
    resultsError,
    

    report: null,
    syllabus: [],
    unitTestSyllabus: [],
    deadlines: [],
  };
};
