export interface MarkEntry {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  exam: string;
  marks: number;
  maxMarks: number;
  remarks?: string;
}

export interface CreateMarkEntryInput {
  studentId: string;
  subject: string;
  exam: string;
  marks: number;
  maxMarks: number;
  remarks?: string;
}

export interface UpdateMarkEntryInput extends Partial<CreateMarkEntryInput> {}
