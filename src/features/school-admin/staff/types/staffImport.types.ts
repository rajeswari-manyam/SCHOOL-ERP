// No backend-provided sample file exists for this one — these columns
// mirror the existing Add Staff / Bulk Add Staff forms' fields 1:1 (see
// BulkAddStaffPage.tsx), using the same field names CreateStaffPayload
// expects. school_id / school_code are deliberately NOT columns — both
// existing staff forms derive them from the logged-in admin's session.
// department / academic_year are matched by NAME (not raw ID) against the
// tenant's existing records, same UX as the Add Subject form's
// department-matching.
export const STAFF_IMPORT_COLUMNS = [
  "name",
  "email",
  "phone",
  "role",
  "qualification",
  "date_of_birth",
  "date_of_join",
  "emp_number",
  "status",
  "department",
  "academic_year",
  "bank_account_name",
  "bank_account_number",
  "ifsc_code",
] as const;

export type StaffImportColumn = (typeof STAFF_IMPORT_COLUMNS)[number];

export type StaffImportRow = Record<StaffImportColumn, string>;

export interface StaffImportPreviewRow {
  /** 1-based row number as it appears in the Excel sheet (header is row 1). */
  rowNumber: number;
  data: StaffImportRow;
  /** Resolved from `data.department` / `data.academic_year` by name — undefined if blank or unmatched. */
  departmentId?: string;
  academicYearId?: string;
  /** Frontend-only validation issues — never a stand-in for backend/DB validation. */
  errors: string[];
}

/** One row of the real import outcome — populated from actual createStaff() results. */
export interface StaffImportRowResult {
  row: number;
  staffName: string;
  status: "Imported" | "Failed";
  message?: string;
}

export interface StaffImportResponse {
  totalRecords: number;
  successCount: number;
  failedCount: number;
  rows: StaffImportRowResult[];
}
