import * as XLSX from "xlsx";
import {
  HOLIDAY_IMPORT_COLUMNS,
  type HolidayImportColumn,
  type HolidayImportPreviewRow,
  type HolidayImportRow,
  type HolidayImportResponse,
} from "../types/holidayImport.types";

const REQUIRED_COLUMNS: HolidayImportColumn[] = ["holidayname", "from_date", "to_date", "type"];
const VALID_TYPES = new Set(["public", "optional", "restricted"]);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export interface ParsedHolidayExcel {
  sheetName: string;
  missingColumns: HolidayImportColumn[];
  rows: HolidayImportPreviewRow[];
}

export async function parseHolidayExcelFile(file: File): Promise<ParsedHolidayExcel> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames.includes("Holidays") ? "Holidays" : workbook.SheetNames[0];
  if (!sheetName) throw new Error("This Excel file has no sheets.");
  const sheet = workbook.Sheets[sheetName];

  // Raw header row (row 1) — checked independently of data rows so a file
  // with the right headers but zero holidays still reports correctly.
  const headerRow = (XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false })[0] ?? []) as unknown[];
  const headers = headerRow.map((h) => String(h ?? "").trim());
  const missingColumns = HOLIDAY_IMPORT_COLUMNS.filter((c) => !headers.includes(c));

  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
  const seenKeys = new Set<string>();

  const rows: HolidayImportPreviewRow[] = raw.map((record, idx) => {
    const data = HOLIDAY_IMPORT_COLUMNS.reduce((acc, col) => {
      const value = record[col];
      acc[col] = value === undefined || value === null ? "" : String(value).trim();
      return acc;
    }, {} as HolidayImportRow);

    const errors: string[] = [];
    for (const col of REQUIRED_COLUMNS) {
      if (!data[col]) errors.push(`${col} is required`);
    }
    if (data.from_date && !DATE_RE.test(data.from_date)) {
      errors.push("from_date must be in YYYY-MM-DD format");
    }
    if (data.to_date && !DATE_RE.test(data.to_date)) {
      errors.push("to_date must be in YYYY-MM-DD format");
    }
    if (data.from_date && data.to_date && DATE_RE.test(data.from_date) && DATE_RE.test(data.to_date) && data.from_date > data.to_date) {
      errors.push("to_date is before from_date");
    }
    if (data.type && !VALID_TYPES.has(data.type.toLowerCase())) {
      errors.push('type must be "public", "optional", or "restricted"');
    }

    // Duplicate-within-file check — same name + same from_date.
    const key = `${data.holidayname.toLowerCase()}|${data.from_date}`;
    if (seenKeys.has(key)) errors.push("Duplicate row within this file");
    else seenKeys.add(key);

    return { rowNumber: idx + 2, data, errors }; // +2: header is row 1, data starts row 2
  });

  return { sheetName, missingColumns, rows };
}

// Mirrors the fields an admin would type into the existing Add Holiday form.
const TEMPLATE_SAMPLE_ROWS: HolidayImportRow[] = [
  { holidayname: "Independence Day", from_date: "2026-08-15", to_date: "2026-08-15", type: "public",   note: "National holiday" },
  { holidayname: "Diwali",           from_date: "2026-11-08", to_date: "2026-11-09", type: "optional", note: "Festival break"   },
];

export function downloadHolidayImportTemplate(): void {
  const sheet = XLSX.utils.json_to_sheet(TEMPLATE_SAMPLE_ROWS, { header: [...HOLIDAY_IMPORT_COLUMNS] });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Holidays");
  XLSX.writeFile(workbook, "holiday_bulk_upload_template.xlsx");
}

// Renders only real backend-reported failures — never fabricated data.
export function downloadHolidayImportErrorReport(result: HolidayImportResponse): void {
  const failedRows = result.rows.filter((r) => r.status === "Failed");
  const sheet = XLSX.utils.json_to_sheet(
    failedRows.map((r) => ({ Row: r.row, Holiday: r.holidayName, Status: r.status, Reason: r.message ?? "" })),
    { header: ["Row", "Holiday", "Status", "Reason"] }
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Failed Rows");
  XLSX.writeFile(workbook, "holiday_import_errors.xlsx");
}
