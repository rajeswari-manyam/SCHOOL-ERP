// Source of truth: the backend-provided student_bulk_upload_sample(2).xlsx —
// sheet "Students", these exact 20 columns in this exact order. Do not rename
// or reorder — sectionId / academicYearId / class_id must stay camelCase /
// snake_case exactly as shown here, matching CreateStudentPayload.
export const STUDENT_IMPORT_COLUMNS = [
  "first_name",
  "last_name",
  "gender",
  "date_of_birth",
  "blood_group",
  "address",
  "class_id",
  "sectionId",
  "academicYearId",
  "roll_number",
  "admission_number",
  "school_code",
  "father_name",
  "mother_name",
  "father_email",
  "mother_email",
  "father_phone",
  "mother_phone",
  "father_occupation",
  "mother_occupation",
] as const;

export type StudentImportColumn = (typeof STUDENT_IMPORT_COLUMNS)[number];

export type StudentImportRow = Record<StudentImportColumn, string>;

export interface StudentImportPreviewRow {
  /** 1-based row number as it appears in the Excel sheet (header is row 1). */
  rowNumber: number;
  data: StudentImportRow;
  /** Frontend-only validation issues — never a stand-in for backend/DB validation. */
  errors: string[];
}

/** One row of the real backend import response — never fabricate this client-side. */
export interface StudentImportRowResult {
  row: number;
  student: string;
  status: "Imported" | "Failed";
  message?: string;
}

/** The real backend import response shape — populate only from an actual API call. */
export interface StudentImportResponse {
  totalRecords: number;
  successCount: number;
  failedCount: number;
  rows: StudentImportRowResult[];
}
