// Page
export { default as ClassTimetablePage } from "./components/Classtimetablepage";

// Components
export { default as TimetableGrid } from "./components/Timetablegrid";
export { default as SubjectLegend } from "./components/Subjectlegend";
export { default as ExaminationTable } from "./components/Examinationtable";

// Hooks
export {
  useClassTimetable,
  useUpcomingExaminations,
  useAddExamsToCalendar,
  TIMETABLE_KEYS,
} from "./hooks/Useclasstimetable";

// API
export { classTimetableApi } from "./api/Classtimetable.api";

// Types
export type {
  SubjectName,
  DayName,
  TimetableCell,
  PeriodRow,
  BreakRow,
  TimetableRow,
  ClassTimetable as ClassTimetableData,
  SubjectLegendItem,
  ExamEntry,
  UpcomingExaminations,
} from "./types/Classtimetable.types";

// Utils
export {
  WEEK_DAYS,
  getTodayDay,
  SUBJECT_CELL_COLORS,
  SUBJECT_BG_COLORS,
  SUBJECT_DOT_COLORS,
  formatTimeRange,
  isPeriodNow,
} from "./utils/Classtimetable.utils";