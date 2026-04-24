import type {
  TimetablePageResponse,
  ClassTimetable,
  ExamTimetable,
  SubjectOption,
  TeacherOption,
} from "../types/timetable.types";

// ─── Class tabs ─────────────────────────────────────────────────────────────────
export const mockClassTabs = [
  { id: "class-6",  label: "Class 6" },
  { id: "class-7",  label: "Class 7" },
  { id: "class-8",  label: "Class 8" },
  { id: "class-9",  label: "Class 9" },
  { id: "class-10", label: "Class 10" },
];

// ─── Class 10A timetable ────────────────────────────────────────────────────────
export const mockClass10Timetable: ClassTimetable = {
  classId: "class-10",
  classLabel: "Class 10",
  section: "A",
  classTeacher: "Venkat R",
  academicYear: "2024-25",
  currentPeriodLabel: "CURRENT: PERIOD 4 (SOCIAL)",
  resourceLoad: 88,
  substitutionCount: 2,
  conflicts: [
    {
      id: "C001",
      severity: "WARNING",
      message: "Physics Lab conflict on Thursday",
      day: "THU",
      periodNo: 1,
    },
  ],
  slots: [
    {
      kind: "PERIOD",
      periodNo: 1,
      startTime: "08:30",
      endTime: "09:15",
      cells: {
        MON: { subject: "Physics",   teacherName: "Venkat" },
        TUE: { subject: "Chemistry", teacherName: "Padma" },
        WED: { subject: "Maths",     teacherName: "Kiran" },
        THU: { subject: "English",   teacherName: "Priya" },
        FRI: { subject: "Hindi",     teacherName: "Meena" },
        SAT: { subject: "Biology",   teacherName: "Padma" },
      },
    },
    {
      kind: "PERIOD",
      periodNo: 2,
      startTime: "09:15",
      endTime: "10:00",
      cells: {
        MON: { subject: "Maths",     teacherName: "Kiran" },
        TUE: { subject: "Physics",   teacherName: "Venkat" },
        WED: { subject: "Chemistry", teacherName: "Padma" },
        THU: { subject: "Social",    teacherName: "Raju" },
        FRI: { subject: "English",   teacherName: "Priya" },
        SAT: { subject: "Maths",     teacherName: "Kiran" },
      },
    },
    {
      kind: "PERIOD",
      periodNo: 3,
      startTime: "10:00",
      endTime: "10:45",
      cells: {
        MON: { subject: "English",   teacherName: "Priya" },
        TUE: { subject: "Hindi",     teacherName: "Meena" },
        WED: { subject: "Physics",   teacherName: "Venkat" },
        THU: { subject: "Chemistry", teacherName: "Padma" },
        FRI: { subject: "Maths",     teacherName: "Kiran" },
        SAT: { subject: "PT",        teacherName: "-" },
      },
    },
    {
      kind: "BREAK",
      startTime: "10:45",
      endTime: "11:00",
      label: "BREAK 10:45 - 11:00",
    },
    {
      kind: "PERIOD",
      periodNo: 4,
      startTime: "11:00",
      endTime: "11:45",
      cells: {
        MON: { subject: "Social",    teacherName: "Raju" },
        TUE: { subject: "Maths",     teacherName: "Kiran" },
        WED: { subject: "English",   teacherName: "Priya" },
        THU: { subject: "Hindi",     teacherName: "Meena" },
        FRI: { subject: "Physics",   teacherName: "Venkat" },
        SAT: { subject: "Art",       teacherName: "Meena" },
      },
    },
    {
      kind: "PERIOD",
      periodNo: 5,
      startTime: "11:45",
      endTime: "12:30",
      cells: {
        MON: { subject: "Biology",   teacherName: "Padma" },
        TUE: { subject: "Social",    teacherName: "Raju" },
        WED: { subject: "Hindi",     teacherName: "Meena" },
        THU: { subject: "Maths",     teacherName: "Kiran" },
        FRI: { subject: "Chemistry", teacherName: "Padma" },
        SAT: { subject: "Library",   teacherName: "-" },
      },
    },
    {
      kind: "LUNCH",
      startTime: "12:30",
      endTime: "13:00",
      label: "LUNCH 12:30 - 1:00",
    },
    {
      kind: "PERIOD",
      periodNo: 6,
      startTime: "14:00",
      endTime: "14:45",
      cells: {
        MON: { subject: "Chemistry", teacherName: "Padma" },
        TUE: { subject: "Biology",   teacherName: "Padma" },
        WED: { subject: "Social",    teacherName: "Raju" },
        THU: { subject: "Physics",   teacherName: "Venkat" },
        FRI: { subject: "Social",    teacherName: "Raju" },
        SAT: { subject: "Free Period", teacherName: "-" },
      },
    },
    {
      kind: "PERIOD",
      periodNo: 7,
      startTime: "14:45",
      endTime: "15:30",
      cells: {
        MON: { subject: "Hindi",     teacherName: "Meena" },
        TUE: { subject: "English",   teacherName: "Priya" },
        WED: { subject: "Biology",   teacherName: "Padma" },
        THU: { subject: "Biology",   teacherName: "Padma" },
        FRI: { subject: "Hindi",     teacherName: "Meena" },
        SAT: { subject: "Free Period", teacherName: "-" },
      },
    },
  ],
};

// ─── Exam timetable ─────────────────────────────────────────────────────────────
export const mockExamTimetable: ExamTimetable = {
  title: "Exam Timetable — April 2025",
  subtitle: "Final Assessment Schedule",
  notifyParentsEnabled: true,
  lastNotificationSentAt: "2025-04-05T10:00:00Z",
  notificationRecipientsCount: 66,
  entries: [
    { id: "E001", subject: "Mathematics",    className: "10A", date: "2025-04-10", startTime: "09:00", endTime: "12:00", venue: "Room 10A", notifyStatus: "SENT" },
    { id: "E002", subject: "Physics",        className: "10A", date: "2025-04-12", startTime: "09:00", endTime: "12:00", venue: "Room 10A", notifyStatus: "SENT" },
    { id: "E003", subject: "Chemistry",      className: "10A", date: "2025-04-15", startTime: "09:00", endTime: "12:00", venue: "Room 10A", notifyStatus: "SENT" },
    { id: "E004", subject: "Biology",        className: "10A", date: "2025-04-17", startTime: "09:00", endTime: "12:00", venue: "Room 10A", notifyStatus: "SENT" },
    { id: "E005", subject: "English",        className: "10A", date: "2025-04-19", startTime: "09:00", endTime: "12:00", venue: "Room 10A", notifyStatus: "SENT" },
    { id: "E006", subject: "Social Studies", className: "10A", date: "2025-04-22", startTime: "09:00", endTime: "12:00", venue: "Room 10A", notifyStatus: "SENT" },
  ],
};

// ─── Full page response ─────────────────────────────────────────────────────────
export const mockTimetablePageResponse: TimetablePageResponse = {
  classTabs: mockClassTabs,
  selectedClassId: "class-10",
  classTimetable: mockClass10Timetable,
  examTimetable: mockExamTimetable,
};

// ─── Dropdowns ──────────────────────────────────────────────────────────────────
export const mockSubjectOptions: SubjectOption[] = [
  { value: "Physics",        label: "Physics" },
  { value: "Chemistry",      label: "Chemistry" },
  { value: "Maths",          label: "Maths" },
  { value: "Biology",        label: "Biology" },
  { value: "English",        label: "English" },
  { value: "Hindi",          label: "Hindi" },
  { value: "Social",         label: "Social" },
  { value: "Computer Science", label: "Computer Science" },
  { value: "PT",             label: "PT" },
  { value: "Art",            label: "Art" },
  { value: "Library",        label: "Library" },
];

export const mockTeacherOptions: TeacherOption[] = [
  { value: "Venkat",  label: "Venkat R",  conflictWarning: "Venkat R is assigned to Class 9A on Monday Period 1. Saving this will override that." },
  { value: "Padma",   label: "Padma" },
  { value: "Kiran",   label: "Kiran" },
  { value: "Priya",   label: "Priya" },
  { value: "Meena",   label: "Meena" },
  { value: "Raju",    label: "Raju" },
];