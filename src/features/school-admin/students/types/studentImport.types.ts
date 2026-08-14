// Source of truth: the backend's addStudents controller (resolveAcademicContext)
// accepts plain-text class_name / section_name / academic_year on BOTH the
// JSON path and the Excel-file path, resolving them to real IDs server-side.
// The frontend uses these text columns instead of raw class_id/sectionId/
// academicYearId so users can type readable values like "10", "A",
// "2025-2026" instead of hunting down UUIDs.
export const STUDENT_IMPORT_COLUMNS = [
  "first_name",
  "last_name",
  "gender",
  "date_of_birth",
  "blood_group",
  "address",
  "class_name",
  "section_name",
  "academic_year",
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
  status: "Imported" | "Failed" | "Skipped";
  message?: string;
}

/** The real backend import response shape — populate only from an actual API call. */
export interface StudentImportResponse {
  totalRecords: number;
  successCount: number;
  failedCount: number;
  /** Rows the backend counted as skipped (e.g. duplicates) rather than a hard validation failure. */
  skippedCount?: number;
  rows: StudentImportRowResult[];
}

/**
 * Raw shape of POST /tenant/students/bulk's response, confirmed via Postman
 * (2026-08-13) — single request, `file` field, whole sheet parsed server-side:
 *   { status, message, inserted, skipped, invalid: [...], data: [...] }
 * `data` holds the fully-created student records (confirmed shape below).
 * `invalid`'s exact per-entry shape is unconfirmed — no failing-row example
 * has been seen yet — so it's typed loosely and read defensively in
 * useStudentImport rather than assumed.
 */
export interface BulkImportCreatedStudent {
  id: string;
  first_name: string;
  last_name: string;
  admission_number: string;
  [key: string]: unknown;
}

export interface BulkImportApiResponse {
  status: boolean;
  message?: string;
  inserted: number;
  skipped: number;
  invalid: unknown[];
  data: BulkImportCreatedStudent[];
}