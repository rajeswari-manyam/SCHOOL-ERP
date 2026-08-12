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
// including whether admission_number/class_id/sectionId/academicYearId/
// school_code already exist — is left to the backend.
const REQUIRED_COLUMNS: StudentImportColumn[] = [
  "first_name",
  "last_name",
  "gender",
  "class_id",
  "sectionId",
  "school_code",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

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

// The exact two example rows from the backend-provided
// student_bulk_upload_sample(2).xlsx — kept identical so the generated
// template matches the source-of-truth format precisely.
const TEMPLATE_SAMPLE_ROWS: StudentImportRow[] = [
  {
    first_name: "Rahul", last_name: "Sharma", gender: "male", date_of_birth: "2012-05-14",
    blood_group: "B+", address: "12 MG Road, Pune", class_id: "1", sectionId: "1", academicYearId: "1",
    roll_number: "101", admission_number: "ADM2024001", school_code: "SCH001",
    father_name: "Suresh Sharma", mother_name: "Anita Sharma",
    father_email: "suresh.sharma@example.com", mother_email: "anita.sharma@example.com",
    father_phone: "9876543210", mother_phone: "9876543211",
    father_occupation: "Engineer", mother_occupation: "Teacher",
  },
  {
    first_name: "Priya", last_name: "Verma", gender: "female", date_of_birth: "2012-08-22",
    blood_group: "O+", address: "45 Park Street, Pune", class_id: "1", sectionId: "1", academicYearId: "1",
    roll_number: "102", admission_number: "ADM2024002", school_code: "SCH001",
    father_name: "Rajesh Verma", mother_name: "Sunita Verma",
    father_email: "rajesh.verma@example.com", mother_email: "sunita.verma@example.com",
    father_phone: "9876543212", mother_phone: "9876543213",
    father_occupation: "Doctor", mother_occupation: "Nurse",
  },
];

export function downloadStudentImportTemplate(): void {
  const sheet = XLSX.utils.json_to_sheet(TEMPLATE_SAMPLE_ROWS, { header: [...STUDENT_IMPORT_COLUMNS] });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Students");
  XLSX.writeFile(workbook, "student_bulk_upload_template.xlsx");
}

// Renders only real backend-reported failures — never fabricated data.
export function downloadImportErrorReport(result: StudentImportResponse): void {
  const failedRows = result.rows.filter((r) => r.status === "Failed");
  const sheet = XLSX.utils.json_to_sheet(
    failedRows.map((r) => ({ Row: r.row, Student: r.student, Status: r.status, Reason: r.message ?? "" })),
    { header: ["Row", "Student", "Status", "Reason"] }
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Failed Rows");
  XLSX.writeFile(workbook, "student_import_errors.xlsx");
}
