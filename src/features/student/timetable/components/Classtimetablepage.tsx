import { useClassTimetable } from "../hooks/Useclasstimetable";
import { useUpcomingExaminations } from "../hooks/Useclasstimetable";
import { useAddExamsToCalendar } from "../hooks/Useclasstimetable";
import TimetableGrid from "./Timetablegrid";
import SubjectLegend from "./Subjectlegend";
import ExaminationTable from "./Examinationtable";
import { classTimetableApi } from "../api/Classtimetable.api";

const ClassTimetablePage = () => {
  const { data: timetable, isLoading, isError } = useClassTimetable();
  const { data: examinations } = useUpcomingExaminations();
  const { addAll, } = useAddExamsToCalendar();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (isError || !timetable) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-3 text-gray-500">
        <span className="text-4xl">⚠️</span>
        <p className="font-semibold">Failed to load timetable. Please refresh.</p>
      </div>
    );
  }

  const handleAddToCalendar = () => {
    if (examinations) {
      addAll(examinations.exams.map((e) => e.id));
    }
  };

  return (
    <div className="flex flex-col gap-6 min-h-full">
      {/* Class banner */}
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          My Class Timetable &mdash; {timetable.className}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Academic Year {timetable.academicYear}
        </p>
      </div>

      {/* Timetable grid */}
      <TimetableGrid
        rows={timetable.rows}
        todayDay={timetable.todayDay}
        onPrint={classTimetableApi.printTimetable}
      />

      {/* Subject legend */}
      <SubjectLegend subjects={timetable.subjects} />

      {/* Examinations */}
      {examinations && (
        <ExaminationTable
          examinations={examinations}
          onAddToCalendar={handleAddToCalendar}
        />
      )}
    </div>
  );
};

export default ClassTimetablePage;