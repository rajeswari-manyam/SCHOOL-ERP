import * as XLSX from "xlsx";
import {
  STUDENT_IMPORT_COLUMNS,
  type StudentImportColumn,
  type StudentImportPreviewRow,
  type StudentImportRow,
  type StudentImportResponse,
} from "../types/studentImport.types";

// Required on the frontend only for fields the UI itself needs to place a
// student (matches what AddStudentPage marks required). Everything else —
// including whether admission_number/class_name/section_name/academic_year/
// school_code already exist — is left to the backend's resolveAcademicContext.
const REQUIRED_COLUMNS: StudentImportColumn[] = [
  "first_name",
  "last_name",
  "gender",
  "class_name",
  "section_name",
  "academic_year",
  "school_code",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// class_name/section_name/academic_year are plain text now (e.g. "10", "A",
// "2025-2026") — the backend's resolveAcademicContext looks these up against
// real Class/Section/AcademicYear records server-side. There's nothing for
// the frontend to shape-validate here; an unresolvable value is reported by
// the backend per-row (see `invalid` in the import response) rather than
// caught client-side.

export interface ParsedStudentExcel {
  sheetName: string;
  missingColumns: StudentImportColumn[];
  rows: StudentImportPreviewRow[];
}

export async function parseStudentExcelFile(file: File): Promise<ParsedStudentExcel> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames.includes("Students") ? "Students" : workbook.SheetNames[0];
  if (!sheetName) throw new Error("This Excel file has no sheets.");
  const sheet = workbook.Sheets[sheetName];

  // Raw header row (row 1) — checked independently of data rows so a file
  // with the right headers but zero students still reports correctly.
  const headerRow = (XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false })[0] ?? []) as unknown[];
  const headers = headerRow.map((h) => String(h ?? "").trim());
  const missingColumns = STUDENT_IMPORT_COLUMNS.filter((c) => !headers.includes(c));

  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
  const seenKeys = new Set<string>();

  const rows: StudentImportPreviewRow[] = raw.map((record, idx) => {
    const data = STUDENT_IMPORT_COLUMNS.reduce((acc, col) => {
      const value = record[col];
      acc[col] = value === undefined || value === null ? "" : String(value).trim();
      return acc;
    }, {} as StudentImportRow);

    const errors: string[] = [];
    for (const col of REQUIRED_COLUMNS) {
      if (!data[col]) errors.push(`${col} is required`);
    }
    if (data.date_of_birth && !DATE_RE.test(data.date_of_birth)) {
      errors.push("date_of_birth must be in YYYY-MM-DD format");
    }
    if (data.father_email && !EMAIL_RE.test(data.father_email)) {
      errors.push("father_email is not a valid email");
    }
    if (data.mother_email && !EMAIL_RE.test(data.mother_email)) {
      errors.push("mother_email is not a valid email");
    }
    // Duplicate-within-file check only — never checked against the database here.
    const key = data.admission_number
      ? `adm:${data.admission_number.toLowerCase()}`
      : `name:${data.first_name.toLowerCase()}|${data.last_name.toLowerCase()}|${data.date_of_birth}`;
    if (seenKeys.has(key)) errors.push("Duplicate row within this file");
    else seenKeys.add(key);

    return { rowNumber: idx + 2, data, errors }; // +2: header is row 1, data starts row 2
  });

  return { sheetName, missingColumns, rows };
}

export function downloadStudentImportTemplate(): void {
  const sheet = XLSX.utils.json_to_sheet([], { header: [...STUDENT_IMPORT_COLUMNS] });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Students");
  XLSX.writeFile(workbook, "student_bulk_upload_template.xlsx");
}

// Renders only real backend-reported failures/skips — never fabricated data.
export function downloadImportErrorReport(result: StudentImportResponse): void {
  const failedRows = result.rows.filter((r) => r.status === "Failed" || r.status === "Skipped");
  const sheet = XLSX.utils.json_to_sheet(
    failedRows.map((r) => ({ Row: r.row, Student: r.student, Status: r.status, Reason: r.message ?? "" })),
    { header: ["Row", "Student", "Status", "Reason"] }
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Failed Rows");
  XLSX.writeFile(workbook, "student_import_errors.xlsx");
}