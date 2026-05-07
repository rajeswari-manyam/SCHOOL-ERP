import {
  useClassTimetable,
  useUpcomingExaminations,
  useAddExamsToCalendar,
} from "../hooks/Useclasstimetable";

import TimetableGrid from "../components/Timetablegrid";
import SubjectLegend from "../components/Subjectlegend";
import ExaminationTable from "../components/Examinationtable";

const ClassTimetablePage = () => {
  const { data: timetable, isLoading, isError } = useClassTimetable();

  const { data: examinations } = useUpcomingExaminations();

  const { addAll } = useAddExamsToCalendar();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (isError || !timetable) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-6 text-gray-500">
        <span className="text-4xl">⚠️</span>

        <p className="text-sm sm:text-base font-semibold">
          Failed to load timetable. Please refresh.
        </p>
      </div>
    );
  }

  const handleAddToCalendar = () => {
    if (examinations) {
      addAll(examinations.exams.map((e) => e.id));
    }
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-6 min-h-full px-3 sm:px-5 lg:px-6 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
          My Class Timetable
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <p className="text-sm font-semibold text-indigo-600">
            {timetable.className}
          </p>

          <span className="hidden sm:block text-gray-300">•</span>

          <p className="text-xs sm:text-sm text-gray-400">
            Academic Year {timetable.academicYear}
          </p>
        </div>
      </div>

      {/* Timetable */}
      <div className="w-full overflow-hidden">
        <TimetableGrid
          rows={timetable.rows}
          todayDay={timetable.todayDay}
          onPrint={() => window.print()}
        />
      </div>

      {/* Subject Legend */}
      <div className="w-full overflow-hidden">
        <SubjectLegend subjects={timetable.subjects} />
      </div>

      {/* Exams */}
      {examinations && (
        <div className="w-full overflow-hidden">
          <ExaminationTable
            examinations={examinations}
            onAddToCalendar={handleAddToCalendar}
          />
        </div>
      )}
    </div>
  );
};

export default ClassTimetablePage;