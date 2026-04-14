import { useTimetable } from "./hooks/useTimetable";
import TimetableGrid from "./components/TimetableGrid";
import TimetableSummaryCards from "./components/TimetableSummaryCards";
import UpcomingExamsTable from "./components/UpcomingExamsTable";

const PrintIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"/>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
    <rect x="6" y="14" width="12" height="8"/>
  </svg>
);

const TimetablePage = () => {
  const {
    weekOffset, setWeekOffset,
    grid, periods, exams,
    summary,
    todayName, currentPeriodId,
    weekLabel, weekSubLabel,
  } = useTimetable();

  return (
    <div className="flex flex-col gap-6 min-h-full">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Timetable</h1>
          <p className="text-sm text-gray-400 mt-0.5">Weekly schedule · AY 2025–26</p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold transition-colors shadow-sm self-start sm:self-auto"
        >
          <PrintIcon />
          Print Timetable
        </button>
      </div>

      {/* Weekly grid */}
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

      {/* Summary cards */}
      <TimetableSummaryCards summary={summary} />

      {/* Upcoming exams */}
      <UpcomingExamsTable exams={exams} />
    </div>
  );
};

export default TimetablePage;
