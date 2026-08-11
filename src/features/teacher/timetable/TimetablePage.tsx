import { useRef, useState } from "react";
import { Printer, Download, Loader2, RefreshCw, AlertCircle, Calendar, GraduationCap, User, School, BookOpen } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useTimetable, type DayName } from "./hooks/useTimetable";
import { TimetableErrorBoundary } from "./components/ErrorBoundary";
import TimetableGrid from "./components/TimetableGrid";
import TimetableSummaryCards from "./components/TimetableSummaryCards";
import { useReactToPrint } from "react-to-print";
import { downloadTeacherTimetable } from "@/services/timetable.api";

const formatAcademicYear = (raw: string): string => {
  if (/^[0-9a-f-]{20,}$/i.test(raw)) return "";
  if (/^\d{4}[-–]\d{2,4}$/.test(raw)) return raw;
  if (/^\d{4}$/.test(raw)) { const y = parseInt(raw, 10); return `${y}–${y + 1}`; }
  return raw;
};

const TimetableSkeleton = () => (
  <div className="flex flex-col gap-6 min-h-full animate-pulse p-6">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="space-y-2">
        <div className="h-8 w-44 bg-gray-200 rounded-lg" />
        <div className="h-4 w-64 bg-gray-100 rounded" />
      </div>
      <div className="h-10 w-40 bg-gray-200 rounded-xl" />
    </div>
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="p-5 space-y-3">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex gap-2">
            <div className="h-14 w-24 bg-gray-100 rounded-lg shrink-0" />
            {[...Array(6)].map((_, j) => (
              <div key={j} className="h-14 flex-1 bg-gray-50 rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

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

const EmptyState = ({ teacherName }: { teacherName?: string }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-5">
    <div className="h-14 w-14 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
      <BookOpen size={24} className="text-gray-300" strokeWidth={1.5} />
    </div>
    <div className="text-center max-w-sm">
      <h2 className="text-lg font-medium text-gray-900 mb-1">No timetable configured</h2>
      <p className="text-sm text-gray-500">
        {teacherName
          ? `Hi ${teacherName.split(" ")[0]}, your timetable hasn't been set up yet. Contact your administrator.`
          : "Your timetable hasn't been set up yet. Contact your administrator."}
      </p>
    </div>
  </div>
);

const TimetablePage = () => {
  const user = useAuthStore((s) => s.user);
  const teacherName = user?.name ?? "";
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!user?.id) return;
    setDownloading(true);
    try {
      await downloadTeacherTimetable(user.id);
    } catch (err) {
      console.error("Failed to download timetable", err);
    } finally {
      setDownloading(false);
    }
  };

  const {
    weekOffset, setWeekOffset,
    grid, periods,
    summary,
    classLabel, section, classTeacher, academicYear,
    todayName, currentPeriodId,
    weekLabel, weekSubLabel,
    isLoading, isError, error, refetch,
  } = useTimetable();

  const timetableRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef: timetableRef, documentTitle: "Timetable" });

  if (isLoading) return <TimetableSkeleton />;
  if (isError) return <ErrorState message={error?.message ?? "An unexpected error occurred"} onRetry={refetch} />;

  const hasGrid  = Object.keys(grid).length > 0;
  const ayDisplay = formatAcademicYear(academicYear);

  return (
    <TimetableErrorBoundary>
      <div className="flex flex-col gap-4 min-h-full px-3 sm:px-5 pt-3 pb-5" data-testid="teacher-timetable-page">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <h1 className="text-sm font-semibold text-[#111827]">
                {classLabel ? `Class ${classLabel}${section ? `‑${section}` : ""}` : "My Timetable"}
              </h1>
              {teacherName && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-[#5B5CEB] text-[10px] font-medium">
                  <User size={9} strokeWidth={2.5} />
                  {teacherName.split(" ")[0]}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-[#6B7280]">
              <span className="flex items-center gap-1"><School size={10} className="text-gray-400" /> Weekly schedule</span>
              {ayDisplay && <><span className="text-gray-300">·</span><span className="flex items-center gap-1"><Calendar size={10} className="text-gray-400" /> AY {ayDisplay}</span></>}
              {classTeacher && <><span className="text-gray-300">·</span><span className="flex items-center gap-1"><GraduationCap size={10} className="text-gray-400" /> {classTeacher}</span></>}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E5E7EB] bg-white hover:bg-gray-50 text-[#374151] text-xs font-medium transition-colors"
              style={{ borderRadius: 10 }}
            >
              <Printer size={12} className="text-gray-500" strokeWidth={2} />
              Print Timetable
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E5E7EB] bg-white hover:bg-gray-50 text-[#374151] text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderRadius: 10 }}
            >
              {downloading ? (
                <Loader2 size={12} className="text-gray-500 animate-spin" />
              ) : (
                <Download size={12} className="text-gray-500" strokeWidth={2} />
              )}
              {downloading ? "Downloading…" : "Download Timetable"}
            </button>
          </div>
        </div>

        {!hasGrid ? (
          <EmptyState teacherName={teacherName} />
        ) : (
          <>
            {summary.totalPeriods > 0 && <TimetableSummaryCards summary={summary} />}
            <div ref={timetableRef}>
              <TimetableGrid
                grid={grid}
                periods={periods}
                weekOffset={weekOffset}
                onPrevWeek={() => setWeekOffset((w) => w - 1)}
                onNextWeek={() => setWeekOffset((w) => w + 1)}
                onResetWeek={() => setWeekOffset(0)}
                weekLabel={weekLabel}
                weekSubLabel={weekSubLabel}
                todayName={todayName as DayName | null}
                currentPeriodId={currentPeriodId}
              />
            </div>
          </>
        )}
      </div>
    </TimetableErrorBoundary>
  );
};

export default TimetablePage;
