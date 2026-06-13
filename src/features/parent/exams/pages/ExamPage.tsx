// ExamPage.tsx
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { BookOpen, CalendarDays, FileText, AlertCircle, Mail, Loader2 } from "lucide-react";
import { useExamsStore } from "../store/useExam.store";
import { reportCard } from "../data/data";
import { ExamBanner } from "../components/ExamBanner";
import { ExamTable } from "../components/ExamTable";
import { ResultSummaryCard } from "../components/ResultSummaryCard";
import { ResultsTable } from "../components/ResultTable";
import { ReportCardTable } from "../components/ReportCardTable";
import { Card, CardContent } from "@/components/ui/card";
import { getAllExamTimetables } from "../../../../services/examtimetable.api";
import type { ExamTimetableListItem } from "../../../../services/examtimetable.api";
import { getMarksByStudentId } from "../../../../services/marks.api";
import type { Mark } from "../../../../services/marks.api";
import { getAllExams } from "../../../../services/exam.api";
import type { ExamRecord } from "../../../../services/exam.api";
import type { Exam, ExamResult, ResultSummary, ExamBannerProps } from "../types/exam.types";
import { useStudentById } from "../../dashboard/hooks/useStudent";
import { getAcademicYearById } from "../../../../services/academicYear.api";
import type { AcademicYearById } from "../../../../services/academicYear.api";
import dayjs from "dayjs";

type ParentLayoutContext = {
  activeChild: {
    id: number;
    name: string;
    class: string;
    school: string;
    avatar: string;
    studentId?: string;
    classDetail?: { id: string; className: string } | null;
    sectionDetail?: { id: string; sectionName: string } | null;
  };
};

const TABS = [
  { id: "upcoming" as const, label: "Upcoming Exams" },
  { id: "results" as const, label: "Results" },
  { id: "reportcard" as const, label: "Report Card" },
];

const CURRENT_ACADEMIC_YEAR = "2024-25";

const LoadingState = () => (
  <div className="flex items-center justify-center py-16">
    <Loader2 size={28} className="animate-spin text-[#3525CD]" />
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="bg-white rounded-2xl border border-red-100 px-5 py-8 flex flex-col items-center gap-2 text-center">
    <AlertCircle size={24} className="text-red-400" />
    <p className="text-[13px] text-red-500">{message}</p>
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="bg-white rounded-2xl border border-[#E8EBF2] px-5 py-10 text-center">
    <p className="text-[13px] text-gray-400">{message}</p>
  </div>
);

function mapApiExam(e: ExamTimetableListItem): Exam {
  const dateObj = dayjs(e.exam_date);
  return {
    id: e.id,
    subject: e.subject.subject_name,
    date: dateObj.isValid() ? dateObj.format("DD MMM YYYY") : e.exam_date,
    day: dateObj.isValid() ? dateObj.format("dddd") : "",
    time: `${e.start_time} – ${e.end_time}`,
    venue: `Room ${e.room_no}`,
    examName: e.exam.exam_name,
  };
}

function buildBannerProps(e: ExamTimetableListItem): ExamBannerProps {
  const examDate = dayjs(e.exam_date);
  const today = dayjs().startOf("day");
  const daysLeft = examDate.isValid() ? Math.max(0, examDate.diff(today, "day")) : 0;
  const hoursLeft =
    daysLeft === 0
      ? Math.max(0, dayjs(`${e.exam_date} ${e.start_time}`).diff(dayjs(), "hour"))
      : 0;
  return {
    name: `${e.exam.exam_name} — ${e.subject.subject_name}`,
    date: examDate.isValid() ? examDate.format("DD MMMM YYYY") : e.exam_date,
    time: e.start_time,
    venue: `Room ${e.room_no}`,
    daysLeft,
    hoursLeft,
  };
}

function mapApiMarks(
  marks: Mark[],
  examName: string,
  studentName: string
): ResultSummary {
  const examResults: ExamResult[] = marks.map((m) => {
    const percentage = Math.round((m.marks_obtained / m.max_marks) * 100);
    return {
      subject: m.subject_name ?? m.subject_id,
      marksObtained: m.marks_obtained,
      totalMarks: m.max_marks,
      percentage,
      grade: m.grade,
      status: m.is_absent ? "Fail" : m.marks_obtained >= 35 ? "Pass" : "Fail",
    };
  });
  const totalObtained = examResults.reduce((sum, r) => sum + r.marksObtained, 0);
  const totalMarks = examResults.reduce((sum, r) => sum + r.totalMarks, 0);
  const percentage =
    totalMarks > 0 ? Math.round((totalObtained / totalMarks) * 100 * 10) / 10 : 0;
  const overallGrade = marks[0]?.grade ?? "N/A";
  const strongest = [...examResults]
    .sort((a, b) => b.marksObtained - a.marksObtained)
    .slice(0, 3)
    .map((r) => r.subject);
  const analyticsNote =
    percentage >= 75
      ? `${studentName} has shown strong performance in ${examName}. Keep up the momentum!`
      : percentage >= 50
        ? `${studentName} performed well in ${examName}. Focus on weaker subjects to improve further.`
        : `${studentName} needs extra attention in some subjects. Consider additional practice sessions.`;
  return {
    id: examName,
    examName,
    totalObtained,
    totalMarks,
    percentage,
    grade: overallGrade,
    rank: "—",
    strongestSubjects: strongest,
    analyticsNote,
    results: examResults,
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ExamsPage() {
  const { activeChild } = useOutletContext<ParentLayoutContext>();

  // ✅ Resolve student detail → get real UUIDs for class & section
  // Context already has classDetail/sectionDetail from ParentLayout's useParentChildren;
  // useStudentById is only for supplementary display fields (first_name, last_name).
  const studentId = String(activeChild?.studentId ?? activeChild?.id ?? "");
  const { student } = useStudentById(studentId);

  // Use context data immediately (already fetched by ParentLayout), fall back to API
  const classId   = activeChild?.classDetail?.id   ?? student?.classDetail?.id;
  const sectionId = activeChild?.sectionDetail?.id ?? student?.sectionDetail?.id;

  const displayClass = student?.classDetail?.class_name ?? activeChild?.classDetail?.className ?? activeChild?.class ?? "";
  const displaySection = student?.sectionDetail?.sectionName ?? activeChild?.sectionDetail?.sectionName ?? "";

  const [academicYear, setAcademicYear] = useState<AcademicYearById | null>(null);

  const academicYearId = (activeChild as any)?.academicYearId ?? student?.academicYearId;

  useEffect(() => {
    if (!academicYearId) return;
    getAcademicYearById(academicYearId).then(setAcademicYear);
  }, [academicYearId]);

  const displayAcademicYear = academicYear?.yearName ?? CURRENT_ACADEMIC_YEAR;

  // Exam list + selected exam ID for the results tab (uses marks API like student portal)
  const [examList, setExamList] = useState<ExamRecord[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [examListLoading, setExamListLoading] = useState(false);

  const {
    tab, setTab,
    upcomingExams, upcomingLoading, upcomingError,
    setUpcomingExams, setUpcomingLoading, setUpcomingError,
    results, resultsLoading, resultsError,
    setResults, setResultsLoading, setResultsError,
  } = useExamsStore();

  // ── Fetch: Upcoming exams ─────────────────────────────────────────────────
  useEffect(() => {
    if (tab !== "upcoming") return;

    // classId is available immediately from activeChild context (ParentLayout already fetched it)
    if (!classId) return;

    let cancelled = false;
    setUpcomingLoading(true);
    setUpcomingError(null);

    getAllExamTimetables({
      class_id: classId,
      section_id: sectionId,
    })
      .then((res: ExamTimetableListItem[]) => {
        if (cancelled) return;
        if (Array.isArray(res)) setUpcomingExams(res);
        else setUpcomingError("Failed to load exam timetable.");
      })
      .catch((err: Error) => {
        if (!cancelled) setUpcomingError(err?.message ?? "Something went wrong.");
      })
      .finally(() => {
        if (!cancelled) setUpcomingLoading(false);
      });

    return () => { cancelled = true; };
  }, [tab, classId, sectionId]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  // ── Fetch: exam list for results tab ──────────────────────────────────────
  useEffect(() => {
    if (tab !== "results") return;
    let cancelled = false;
    setExamListLoading(true);
    getAllExams()
      .then((list) => {
        if (cancelled) return;
        setExamList(list);
        if (list.length > 0) setSelectedExamId((prev) => prev || list[0].id);
      })
      .catch(() => { if (!cancelled) setResultsError("Failed to load exam list."); })
      .finally(() => { if (!cancelled) setExamListLoading(false); });
    return () => { cancelled = true; };
  }, [tab]);

  // ── Fetch: Results (uses marks API like student portal) ───────────────────
  useEffect(() => {
    if (tab !== "results" || !selectedExamId) return;
    let cancelled = false;
    setResultsLoading(true);
    setResultsError(null);
    getMarksByStudentId(studentId, selectedExamId)
      .then((res) => {
        if (cancelled) return;
        if (res.status && Array.isArray(res.data)) setResults(res.data);
        else setResultsError("Failed to load marks.");
      })
      .catch((err) => {
        if (!cancelled) setResultsError(err?.message ?? "Something went wrong.");
      })
      .finally(() => {
        if (!cancelled) setResultsLoading(false);
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, studentId, selectedExamId]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const mappedExams = upcomingExams.map(mapApiExam);
  const sortedRaw = [...upcomingExams].sort(
    (a, b) => dayjs(a.exam_date).valueOf() - dayjs(b.exam_date).valueOf()
  );
  const bannerProps = sortedRaw.length > 0 ? buildBannerProps(sortedRaw[0]) : null;
  const groupLabel =
    sortedRaw.length > 0
      ? `${sortedRaw[0].exam.exam_name} — ${dayjs(sortedRaw[0].exam_date).format("MMMM YYYY")}`
      : "Upcoming Exams";
  const selectedExamName =
    examList.find((e) => e.id === selectedExamId)?.exam_name ?? "";
  const resultSummary =
    results.length > 0
      ? mapApiMarks(results as Mark[], selectedExamName || "Exam", activeChild.name)
      : null;

  return (
    <div className="w-full max-w-[1200px] mx-auto pt-8 px-4 sm:px-6 lg:px-10 pb-16 bg-[#F4F6FB] min-h-screen">

      {/* BREADCRUMB */}
      <p className="text-[12px] text-gray-400 mb-4">
        {activeChild.name} ›
        <span className="text-gray-600 font-medium"> Exams &amp; Results</span>
      </p>

      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#0B1C30]">
          Exams &amp; Results — {activeChild.name}
        </h1>
        <p className="text-[13px] text-gray-400 mt-1">
          {displayClass && `Class ${displayClass}`}
          {displaySection && ` · ${displaySection}`}
          {displayAcademicYear && ` · Academic Year ${displayAcademicYear}`}
        </p>
      </div>

      {/* TAB BAR */}
      <div className="flex border-b border-[#E8EBF2] mb-7 overflow-x-auto flex-nowrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 text-[13px] font-semibold border-b-2 -mb-px transition-colors ${tab === t.id
                ? "border-[#3525CD] text-[#3525CD]"
                : "border-transparent text-gray-400 hover:text-[#0B1C30]"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── UPCOMING TAB ── */}
      {tab === "upcoming" && (
        !classId ? (
          <ErrorState message="Class information not available. Please select a child." />
        ) : upcomingLoading ? (
          <LoadingState />
        ) : upcomingError ? (
          <ErrorState message={upcomingError} />
        ) : upcomingExams.length === 0 ? (
          <EmptyState message="No upcoming exams scheduled for this class." />
        ) : (
          <div>
            {bannerProps && (
              <div className="mb-6">
                <ExamBanner {...bannerProps} />
              </div>
            )}

            <Card className="rounded-2xl shadow-sm overflow-hidden border-0 mb-6">
              <CardContent className="p-0">
                <div className="px-5 pt-5 flex items-center justify-between">
                  <p className="text-[14px] font-semibold text-[#0B1C30]">{groupLabel}</p>
                  <button className="flex items-center gap-1.5 text-[12px] font-semibold text-[#3525CD] hover:underline rounded-full bg-[#F4F6FB] px-2 py-1">
                    <BookOpen size={13} />
                    View Syllabus
                  </button>
                </div>
                <div className="px-5 pt-4">
                  <ExamTable exams={mappedExams} />
                </div>
                <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between px-5 py-4 border-t border-[#EEF2F7]">
                  <p className="text-[12px] text-gray-400">
                    Sync your exam schedule with Google Calendar
                  </p>
                  <button className="bg-[#006C49] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#00563a] transition-all flex items-center gap-2">
                    <CalendarDays size={14} />
                    Add all to Google Calendar
                  </button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#EFF4FF] rounded-2xl p-5 flex gap-3 border border-[#E8EBF2] hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-[#EEEDFE] flex items-center justify-center flex-shrink-0">
                  <FileText size={18} color="#3525CD" strokeWidth={1.3} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#0B1C30] mb-1">
                    Preparation Guide
                  </p>
                  <p className="text-[12px] text-gray-400 leading-relaxed mb-2">
                    Download the detailed syllabus and reference material for all subjects.
                  </p>
                  <button className="text-[12px] font-semibold text-[#3525CD] hover:underline">
                    VIEW RESOURCES →
                  </button>
                </div>
              </div>
              <div className="bg-[#FFDDB8] rounded-2xl p-5 flex gap-3 border border-[#E8EBF2] hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-[#FFF4ED] flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={18} color="#F97316" strokeWidth={1.3} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#0B1C30] mb-1">
                    Need Assistance?
                  </p>
                  <p className="text-[12px] text-gray-400 leading-relaxed mb-2">
                    Questions regarding the exam schedule or venues? Contact the administration desk.
                  </p>
                  <button className="flex items-center gap-1 text-[12px] font-semibold text-[#3525CD] hover:underline">
                    CONTACT ADMIN <Mail size={12} className="ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* ── RESULTS TAB ── */}
      {tab === "results" && (
        <div>
          <div className="mb-5">
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              disabled={examListLoading}
              className="border border-[#E8EBF2] rounded-xl px-4 py-2 text-[13px] text-[#0B1C30] bg-white cursor-pointer"
            >
              {examListLoading && <option>Loading exams…</option>}
              {!examListLoading && examList.length === 0 && (
                <option value="">No exams available</option>
              )}
              {examList.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.exam_name}
                </option>
              ))}
            </select>
          </div>
          {resultsLoading ? (
            <LoadingState />
          ) : resultsError ? (
            <ErrorState message={resultsError} />
          ) : !resultSummary ? (
            <EmptyState message="No results found for this exam." />
          ) : (
            <>
              <ResultSummaryCard summary={resultSummary} />
              <ResultsTable results={resultSummary.results} />
            </>
          )}
        </div>
      )}

      {/* ── REPORT CARD TAB ── */}
      {tab === "reportcard" && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <span className="text-[15px] font-semibold text-[#0B1C30]">
              Annual Report Card — {reportCard.academicYear}
            </span>
            <select className="border border-[#E8EBF2] rounded-xl px-4 py-2 text-[13px] text-[#0B1C30] bg-white cursor-pointer">
              <option>2024-25</option>
              <option>2023-24</option>
            </select>
          </div>
          <ReportCardTable data={reportCard} />
        </div>
      )}

    </div>
  );
}