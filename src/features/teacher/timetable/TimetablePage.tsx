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
  if (/^\d{4}$/.test(raw)) {
    const y = parseInt(raw, 10);
    return `${y}–${y + 1}`;
  }
  return raw;
};

const TimetableSkeleton = () => (
  <div className="flex flex-col gap-6 min-h-full animate-pulse">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="space-y-2">
        <div className="h-8 w-44 bg-gray-200 rounded-lg" />
        <div className="h-4 w-64 bg-gray-100 rounded" />
      </div>
      <div className="h-10 w-40 bg-gray-200 rounded-xl" />
    </div>
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-28 bg-gray-100 rounded-2xl" />
      ))}
    </div>
  </div>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div role="alert" className="flex flex-col items-center justify-center py-24 gap-5">
    <div className="h-16 w-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
      <AlertCircle size={30} className="text-red-400" strokeWidth={1.5} />
    </div>
    <div className="text-center max-w-sm">
      <h2 className="text-base font-bold text-gray-900 mb-1">Failed to load timetable</h2>
      <p className="text-sm text-gray-400">{message}</p>
    </div>
    <Button onClick={onRetry} className="gap-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold shadow-sm">
      <RefreshCw size={14} strokeWidth={2} />
      Try again
    </Button>
  </div>
);

const EmptyState = ({ teacherName }: { teacherName?: string }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-5">
    <div className="h-16 w-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
      <BookOpen size={28} className="text-gray-300" strokeWidth={1.5} />
    </div>
    <div className="text-center max-w-sm">
      <h2 className="text-base font-bold text-gray-900 mb-1">No timetable configured</h2>
      <p className="text-sm text-gray-400">
        {teacherName ? `Hi ${teacherName.split(" ")[0]}, your timetable hasn't been set up yet. Contact your administrator.` : "Your timetable hasn't been set up yet. Contact your administrator."}
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
  const handlePrint = useReactToPrint({
    contentRef: timetableRef,
    documentTitle: "Timetable",
  });

  if (isLoading) return <TimetableSkeleton />;
  if (isError) return <ErrorState message={error?.message ?? "An unexpected error occurred"} onRetry={refetch} />;

  const hasGrid = Object.keys(grid).length > 0;
  const ayDisplay = formatAcademicYear(academicYear);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "timetable", label: "Timetable", icon: <Calendar size={14} /> },
    { id: "exams", label: "Exam Timetable", icon: <ExamIcon size={14} /> },
  ];

  return (
    <TimetableErrorBoundary>
      <div className="flex flex-col gap-6 min-h-full" data-testid="teacher-timetable-page">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {classLabel ? `Class ${classLabel}${section ? `‑${section}` : ""}` : "My Timetable"}
              </h1>
              {teacherName && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-semibold">
                  <User size={10} strokeWidth={2.5} />
                  {teacherName.split(" ")[0]}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-gray-400">
              <span className="flex items-center gap-1">
                <School size={12} className="text-gray-300" />
                Weekly schedule
              </span>
              {ayDisplay && (
                <>
                  <span className="text-gray-200">·</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} className="text-gray-300" />
                    AY {ayDisplay}
                  </span>
                </>
              )}
              {classTeacher && (
                <>
                  <span className="text-gray-200">·</span>
                  <span className="flex items-center gap-1">
                    <GraduationCap size={12} className="text-gray-300" />
                    {classTeacher}
                  </span>
                </>
              )}
            </div>
          </div>

          {activeTab === "timetable" && (
            <Button
              onClick={handlePrint}
              variant="outline"
              className="gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium shadow-sm self-start sm:self-auto"
            >
              <Printer size={14} className="text-gray-500" strokeWidth={2} />
              Print Timetable
            </Button>
          )}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === t.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Timetable tab ── */}
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

        {/* ── Exam Timetable tab ── */}
        {activeTab === "exams" && (
          <div>
            {isExamsLoading ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="h-4 w-44 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-60 bg-gray-100 rounded mt-2 animate-pulse" />
                </div>
                <div className="p-5 space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />
                  ))}
                </div>
              </div>
            ) : isExamsError ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Upcoming Examinations</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Could not load exam data</p>
                </div>
                <div className="py-10 text-center">
                  <p className="text-sm text-gray-400">Exams are unavailable right now.</p>
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