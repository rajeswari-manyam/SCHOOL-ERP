import { useAuthStore } from "@/store/authStore";
import { useTimetable } from "./hooks/useTimetable";
import { TimetableErrorBoundary } from "./components/ErrorBoundary";
import UpcomingExamsTable from "./components/UpcomingExamsTable";
import { Calendar, GraduationCap, School, User, AlertCircle, RefreshCw } from "lucide-react";

const formatAcademicYear = (raw: string): string => {
  if (/^[0-9a-f-]{20,}$/i.test(raw)) return "";
  if (/^\d{4}[-–]\d{2,4}$/.test(raw)) return raw;
  if (/^\d{4}$/.test(raw)) { const y = parseInt(raw, 10); return `${y}–${y + 1}`; }
  return raw;
};

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div role="alert" className="flex flex-col items-center justify-center py-24 gap-5 p-6">
    <div className="h-14 w-14 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
      <AlertCircle size={28} className="text-red-400" strokeWidth={1.5} />
    </div>
    <div className="text-center max-w-sm">
      <h2 className="text-lg font-medium text-gray-900 mb-1">Failed to load timetable</h2>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
    <button
      onClick={onRetry}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
    >
      <RefreshCw size={14} strokeWidth={2} />
      Try again
    </button>
  </div>
);

const ExamTimetablePage = () => {
  const user = useAuthStore((s) => s.user);
  const teacherName = user?.name ?? "";

  const {
    exams, isExamsLoading, isExamsError,
    classLabel, section, classTeacher, academicYear,
    isLoading, isError, error, refetch,
  } = useTimetable();

  if (isError) return <ErrorState message={error?.message ?? "An unexpected error occurred"} onRetry={refetch} />;

  const ayDisplay = formatAcademicYear(academicYear);

  return (
    <TimetableErrorBoundary>
      <div className="flex flex-col gap-4 min-h-full px-3 sm:px-5 pt-3 pb-5" data-testid="teacher-exam-timetable-page">

        {/* Page header */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <h1 className="text-sm font-semibold text-[#111827]">
              {classLabel ? `Class ${classLabel}${section ? `‑${section}` : ""}` : "Exam Timetable"}
            </h1>
            {teacherName && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-[#5B5CEB] text-[10px] font-medium">
                <User size={9} strokeWidth={2.5} />
                {teacherName.split(" ")[0]}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-[#6B7280]">
            <span className="flex items-center gap-1"><School size={10} className="text-gray-400" /> Exam schedule</span>
            {ayDisplay && <><span className="text-gray-300">·</span><span className="flex items-center gap-1"><Calendar size={10} className="text-gray-400" /> AY {ayDisplay}</span></>}
            {classTeacher && <><span className="text-gray-300">·</span><span className="flex items-center gap-1"><GraduationCap size={10} className="text-gray-400" /> {classTeacher}</span></>}
          </div>
        </div>

        {isLoading || isExamsLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="h-4 w-44 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-60 bg-gray-100 rounded mt-2 animate-pulse" />
            </div>
            <div className="p-5 space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)}
            </div>
          </div>
        ) : isExamsError ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-900">Upcoming Examinations</h3>
              <p className="text-xs text-gray-500 mt-0.5">Could not load exam data</p>
            </div>
            <div className="py-10 text-center">
              <p className="text-sm text-gray-500">Exams are unavailable right now.</p>
            </div>
          </div>
        ) : (
          <UpcomingExamsTable exams={exams} />
        )}
      </div>
    </TimetableErrorBoundary>
  );
};

export default ExamTimetablePage;
