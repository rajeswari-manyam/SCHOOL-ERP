import { Printer, RefreshCw, AlertCircle, Calendar, GraduationCap, User, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useTimetable } from "./hooks/useTimetable";
import TimetableGrid from "./components/TimetableGrid";
import TimetableSummaryCards from "./components/TimetableSummaryCards";
import UpcomingExamsTable from "./components/UpcomingExamsTable";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const TimetableSkeleton = () => (
  <div className="flex flex-col gap-6 min-h-full animate-pulse">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="space-y-2">
        <div className="h-7 w-32 bg-gray-200 rounded-lg" />
        <div className="h-4 w-56 bg-gray-100 rounded" />
      </div>
      <div className="h-10 w-36 bg-gray-200 rounded-xl" />
    </div>
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
      <div className="p-5">
        <div className="flex gap-2 mb-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-8 w-8 bg-gray-200 rounded-lg" />)}
        </div>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-2">
              <div className="h-14 w-24 bg-gray-100 rounded-lg shrink-0" />
              {[...Array(6)].map((_, j) => (
                <div key={j} className="h-14 w-[108px] bg-gray-50 rounded-lg" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 bg-gray-100 rounded-2xl" />
      ))}
    </div>
    <div className="h-48 bg-gray-100 rounded-2xl" />
  </div>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center">
      <AlertCircle size={28} className="text-red-500" strokeWidth={1.5} />
    </div>
    <div className="text-center max-w-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Failed to load timetable</h2>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
    <Button onClick={onRetry} className="gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm">
      <RefreshCw size={15} strokeWidth={2} />
      Try Again
    </Button>
  </div>
);

interface EmptyStateProps {
  teacherName?: string;
}

const EmptyState = ({ teacherName }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className="h-14 w-14 rounded-full bg-gray-50 flex items-center justify-center">
      <Calendar size={28} className="text-gray-300" strokeWidth={1.5} />
    </div>
    <div className="text-center max-w-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-1">No timetable found</h2>
      <p className="text-sm text-gray-500">
        {teacherName
          ? `Hi ${teacherName}, your timetable has not been configured yet. Please check back later or contact your school administrator.`
          : "Your timetable has not been configured yet. Please check back later or contact your school administrator."}
      </p>
    </div>
  </div>
);



const TimetablePage = () => {
  const user = useAuthStore((s) => s.user);
  const teacherName = user?.name ?? "";

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

  if (isError) {
    return <ErrorState message={error?.message ?? "An unexpected error occurred"} onRetry={refetch} />;
  }

  const hasGrid = Object.keys(grid).length > 0;

  if (!hasGrid) return <EmptyState teacherName={teacherName} />;

  return (
    <div className="flex flex-col gap-6 min-h-full">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight truncate">
              {classLabel ? `${classLabel}${section ? `-${section}` : ""}` : "My Timetable"}
            </h1>
            {teacherName && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-bold">
                <User size={11} strokeWidth={2.5} />
                {teacherName.split(" ")[0]}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-0.5 flex flex-wrap items-center gap-x-2">
            <School size={13} className="text-gray-300" />
            <span>Weekly schedule</span>
            <span className="hidden sm:inline">&middot;</span>
            <span>AY {academicYear}</span>
            {classTeacher && (
              <>
                <span className="hidden sm:inline">&middot;</span>
                <span className="inline-flex items-center gap-1">
                  <GraduationCap size={12} className="text-gray-300" />
                  {classTeacher}
                </span>
              </>
            )}
          </p>
        </div>
        <Button
          onClick={handlePrint}
          className="gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold shadow-sm self-start sm:self-auto"
        >
         <Printer size={15} className="text-current" strokeWidth={2} />
          Print Timetable
        </Button>
      </div>

      {/* Weekly grid */}
      <div ref={timetableRef}>
        <TimetableGrid
          grid={grid}
          periods={periods}
          weekOffset={weekOffset}
          onPrevWeek={() => setWeekOffset(w => w - 1)}
          onNextWeek={() => setWeekOffset(w => w + 1)}
          onResetWeek={() => setWeekOffset(0)}
          weekLabel={weekLabel}
          weekSubLabel={weekSubLabel}
          todayName={todayName}
          currentPeriodId={currentPeriodId}
        />
      </div>

      {/* Summary cards */}
      {summary.totalPeriods > 0 && <TimetableSummaryCards summary={summary} />}

      {/* Upcoming exams */}
      {isExamsLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-56 bg-gray-100 rounded mt-2 animate-pulse" />
          </div>
          <div className="p-5 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-50 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      ) : isExamsError ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-extrabold text-gray-900">Upcoming Examinations</h3>
            <p className="text-xs text-gray-400 mt-0.5">Could not load exam data</p>
          </div>
          <div className="py-8 text-center">
            <p className="text-xs text-gray-400">Exams are unavailable right now. The timetable data may still contain exam info.</p>
          </div>
        </div>
      ) : (
        <UpcomingExamsTable exams={exams} />
      )}
    </div>
  );
};

export default TimetablePage;
