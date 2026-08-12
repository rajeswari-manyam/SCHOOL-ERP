// No backend-provided sample file exists for this one (unlike the Student
// Excel import) — these columns mirror the existing Add Holiday / Bulk Add
// Holidays forms' fields 1:1 (see AddHolidayPage.tsx / the old
// BulkAddHolidayModal), using the exact field names CreateHolidayPayload
// expects. school_code / academicYearId are deliberately NOT columns here —
// both existing holiday forms derive them from the logged-in admin's session
// rather than asking the user to type them, and this mirrors that.
export const HOLIDAY_IMPORT_COLUMNS = [
  "holidayname",
  "from_date",
  "to_date",
  "type",
  "note",
] as const;

export type HolidayImportColumn = (typeof HOLIDAY_IMPORT_COLUMNS)[number];

export type HolidayImportRow = Record<HolidayImportColumn, string>;

export interface HolidayImportPreviewRow {
  /** 1-based row number as it appears in the Excel sheet (header is row 1). */
  rowNumber: number;
  data: HolidayImportRow;
  /** Frontend-only validation issues — never a stand-in for backend/DB validation. */
  errors: string[];
}

/** One row of the real backend import response — never fabricate this client-side. */
export interface HolidayImportRowResult {
  row: number;
  holidayName: string;
  status: "Imported" | "Failed";
  message?: string;
}

/** The real backend import response shape — populate only from an actual API call. */
export interface HolidayImportResponse {
  totalRecords: number;
  successCount: number;
  failedCount: number;
  rows: HolidayImportRowResult[];
}
