export interface TimetableEntry {
  id: string;
  day: string; // e.g., Monday
  period: string; // e.g., 1st, 2nd
  subject: string;
  className: string;
  startTime: string;
  endTime: string;
}

export interface CreateTimetableEntryInput {
  day: string;
  period: string;
  subject: string;
  className: string;
  startTime: string;
  endTime: string;
}

export interface UpdateTimetableEntryInput extends Partial<CreateTimetableEntryInput> {}
