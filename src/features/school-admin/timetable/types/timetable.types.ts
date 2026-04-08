export interface TimetableEntry {
  id: string;
  class: string;
  section: string;
  subject: string;
  teacher: string;
  day: string; // e.g., Monday, Tuesday
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface TimetableCreateInput {
  class: string;
  section: string;
  subject: string;
  teacher: string;
  day: string;
  startTime: string;
  endTime: string;
}

export interface TimetableUpdateInput extends Partial<TimetableCreateInput> {}
