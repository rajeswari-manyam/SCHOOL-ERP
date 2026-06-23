import { useRef, useState } from "react";
import { Printer, RefreshCw, AlertCircle, Calendar, GraduationCap, User, School, BookOpen, GraduationCap as ExamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useTimetable, type DayName } from "./hooks/useTimetable";
import { TimetableErrorBoundary } from "./components/ErrorBoundary";
import TimetableGrid from "./components/TimetableGrid";
import TimetableSummaryCards from "./components/TimetableSummaryCards";
import UpcomingExamsTable from "./components/UpcomingExamsTable";
import { useReactToPrint } from "react-to-print";

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

type Tab = "timetable" | "exams";

const TimetablePage = () => {
  const user = useAuthStore((s) => s.user);
  const teacherName = user?.name ?? "";
  const [activeTab, setActiveTab] = useState<Tab>("timetable");

  const {
    weekOffset, setWeekOffset,
    grid, periods, exams,
    isExamsLoading, isExamsError,
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

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "timetable", label: "Timetable",      icon: <Calendar size={14} /> },
    { id: "exams",     label: "Exam Timetable", icon: <ExamIcon  size={14} /> },
  ];

  return (
    <TimetableErrorBoundary>
      <div className="flex flex-col gap-6 min-h-full p-6" data-testid="teacher-timetable-page">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-semibold text-gray-900">
                {classLabel ? `Class ${classLabel}${section ? `‑${section}` : ""}` : "My Timetable"}
              </h1>
              {teacherName && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-medium">
                  <User size={10} strokeWidth={2.5} />
                  {teacherName.split(" ")[0]}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
              <span className="flex items-center gap-1"><School size={12} className="text-gray-400" /> Weekly schedule</span>
              {ayDisplay && <><span className="text-gray-300">·</span><span className="flex items-center gap-1"><Calendar size={12} className="text-gray-400" /> AY {ayDisplay}</span></>}
              {classTeacher && <><span className="text-gray-300">·</span><span className="flex items-center gap-1"><GraduationCap size={12} className="text-gray-400" /> {classTeacher}</span></>}
            </div>
          </div>
          {activeTab === "timetable" && (
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium self-start"
            >
              <Printer size={14} className="text-gray-500" strokeWidth={2} />
              Print Timetable
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === t.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Timetable tab */}
        {activeTab === "timetable" && (
          <>
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
          </>
        )}

        {/* Exam tab */}
        {activeTab === "exams" && (
          <div>
            {isExamsLoading ? (
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
        )}
      </div>
    </TimetableErrorBoundary>
  );
};

export default TimetablePage;
