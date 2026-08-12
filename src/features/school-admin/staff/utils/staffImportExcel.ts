import * as XLSX from "xlsx";
import type { Department } from "@/features/school-admin/settings/types/settings.types";
import type { AcademicYearRecord } from "@/services/academicYear.api";
import {
  STAFF_IMPORT_COLUMNS,
  type StaffImportColumn,
  type StaffImportPreviewRow,
  type StaffImportRow,
  type StaffImportResponse,
} from "../types/staffImport.types";

// Matches what the current Bulk Add Staff form actually blocks submission on.
const REQUIRED_COLUMNS: StaffImportColumn[] = ["name", "email", "phone", "role"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const VALID_STATUS = new Set(["active", "inactive"]);

export interface ParsedStaffExcel {
  sheetName: string;
  missingColumns: StaffImportColumn[];
  rows: StaffImportPreviewRow[];
}

export async function parseStaffExcelFile(
  file: File,
  departments: Department[],
  academicYears: AcademicYearRecord[],
): Promise<ParsedStaffExcel> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames.includes("Staff") ? "Staff" : workbook.SheetNames[0];
  if (!sheetName) throw new Error("This Excel file has no sheets.");
  const sheet = workbook.Sheets[sheetName];

  // Raw header row (row 1) — checked independently of data rows so a file
  // with the right headers but zero staff still reports correctly.
  const headerRow = (XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false })[0] ?? []) as unknown[];
  const headers = headerRow.map((h) => String(h ?? "").trim());
  const missingColumns = STAFF_IMPORT_COLUMNS.filter((c) => !headers.includes(c));

  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
  const seenKeys = new Set<string>();

  const rows: StaffImportPreviewRow[] = raw.map((record, idx) => {
    const data = STAFF_IMPORT_COLUMNS.reduce((acc, col) => {
      const value = record[col];
      acc[col] = value === undefined || value === null ? "" : String(value).trim();
      return acc;
    }, {} as StaffImportRow);

    const errors: string[] = [];
    for (const col of REQUIRED_COLUMNS) {
      if (!data[col]) errors.push(`${col} is required`);
    }
    if (data.email && !EMAIL_RE.test(data.email)) errors.push("email is not a valid email");
    if (data.date_of_birth && !DATE_RE.test(data.date_of_birth)) {
      errors.push("date_of_birth must be in YYYY-MM-DD format");
    }
    if (data.date_of_join && !DATE_RE.test(data.date_of_join)) {
      errors.push("date_of_join must be in YYYY-MM-DD format");
    }
    if (data.status && !VALID_STATUS.has(data.status.toLowerCase())) {
      errors.push('status must be "active" or "inactive"');
    }

    let departmentId: string | undefined;
    if (data.department) {
      const matched = departments.find((d) => d.departmentName.toLowerCase() === data.department.toLowerCase());
      if (matched) departmentId = matched.id;
      else errors.push(`No department named "${data.department}"`);
    }

    let academicYearId: string | undefined;
    if (data.academic_year) {
      const matched = academicYears.find((y) => y.yearName.toLowerCase() === data.academic_year.toLowerCase());
      if (matched) academicYearId = matched.id;
      else errors.push(`No academic year named "${data.academic_year}"`);
    }

    // Duplicate-within-file check — same email (the field the backend treats as unique).
    const key = data.email.toLowerCase();
    if (key) {
      if (seenKeys.has(key)) errors.push("Duplicate row within this file (same email)");
      else seenKeys.add(key);
    }

    return { rowNumber: idx + 2, data, departmentId, academicYearId, errors }; // +2: header is row 1, data starts row 2
  });

  return { sheetName, missingColumns, rows };
}

const TEMPLATE_SAMPLE_ROWS: StaffImportRow[] = [
  {
    name: "Charitha", email: "charitha@example.com", phone: "9030983803", role: "Teacher",
    qualification: "M.A. Telugu", date_of_birth: "1990-05-12", date_of_join: "2024-06-01",
    emp_number: "", status: "active", department: "Telugu", academic_year: "",
    bank_account_name: "", bank_account_number: "", ifsc_code: "",
  },
  {
    name: "Sravan", email: "sravan@example.com", phone: "9876543210", role: "Teacher",
    qualification: "M.A. English", date_of_birth: "1988-11-03", date_of_join: "2023-06-15",
    emp_number: "", status: "active", department: "English", academic_year: "",
    bank_account_name: "", bank_account_number: "", ifsc_code: "",
  },
];

export function downloadStaffImportTemplate(): void {
  const sheet = XLSX.utils.json_to_sheet(TEMPLATE_SAMPLE_ROWS, { header: [...STAFF_IMPORT_COLUMNS] });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Staff");
  XLSX.writeFile(workbook, "staff_bulk_upload_template.xlsx");
}

// Renders only real backend-reported failures — never fabricated data.
export function downloadStaffImportErrorReport(result: StaffImportResponse): void {
  const failedRows = result.rows.filter((r) => r.status === "Failed");
  const sheet = XLSX.utils.json_to_sheet(
    failedRows.map((r) => ({ Row: r.row, Staff: r.staffName, Status: r.status, Reason: r.message ?? "" })),
    { header: ["Row", "Staff", "Status", "Reason"] }
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Failed Rows");
  XLSX.writeFile(workbook, "staff_import_errors.xlsx");
}
