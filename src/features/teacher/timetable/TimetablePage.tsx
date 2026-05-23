import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTimetable } from "./hooks/useTimetable";
import TimetableGrid from "./components/TimetableGrid";
import TimetableSummaryCards from "./components/TimetableSummaryCards";
import UpcomingExamsTable from "./components/UpcomingExamsTable";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const TimetablePage = () => {
  const {
    weekOffset, setWeekOffset,
    grid, periods, exams,
    summary,
    todayName, currentPeriodId,
    weekLabel, weekSubLabel,
  } = useTimetable();

  const timetableRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: timetableRef,
    documentTitle: "Timetable",
  });

  return (
    <div className="flex flex-col gap-6 min-h-full">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Timetable</h1>
          <p className="text-sm text-gray-400 mt-0.5">Weekly schedule · AY 2025–26</p>
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
      <TimetableSummaryCards summary={summary} />

      {/* Upcoming exams */}
      <UpcomingExamsTable exams={exams} />
    </div>
  );
};

export default TimetablePage;
