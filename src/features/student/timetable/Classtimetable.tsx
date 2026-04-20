import {
  useClassTimetable,
  useUpcomingExaminations,
} from "./hooks/Useclasstimetable";
import TimetableGrid from "./components/Timetablegrid";
import SubjectLegend from "./components/Subjectlegend";
import ExaminationTable from "./components/Examinationtable";
import { classTimetableApi } from "./api/Classtimetable.api";

const ClassTimetable = () => {
  const { data: timetable, isLoading } = useClassTimetable();
  const { data: examinations } = useUpcomingExaminations();

  if (isLoading || !timetable) {
    return (
      <div className="p-6 text-sm text-gray-500">Loading timetable...</div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <TimetableGrid
        rows={timetable.rows}
        todayDay={timetable.todayDay}
        onPrint={classTimetableApi.printTimetable}
      />

      <SubjectLegend subjects={timetable.subjects} />

      {examinations && (
        <ExaminationTable
          examinations={examinations}
          onAddToCalendar={() =>
            classTimetableApi.addExamsToCalendar(
              examinations.exams.map((e) => e.id)
            )
          }
        />
      )}
    </div>
  );
};

export default ClassTimetable;