import { useCallback, useState } from "react";
import { studentsApi } from "@/services/student.api";
import { ALL_IMPORT_EXTENSIONS, getFileExtension, isTabularExtension } from "@/utils/importFileKind";
import {
  parseStudentExcelFile,
  downloadStudentImportTemplate,
  downloadImportErrorReport,
} from "../utils/studentImportExcel";
import type { StudentImportPreviewRow, StudentImportResponse, StudentImportRowResult } from "../types/studentImport.types";

/**
 * Drives the Student Import screen end to end:
 * file selection → frontend validation/preview (spreadsheets only — PDF/Word
 * aren't structured as rows/columns, so those skip preview) → import.
 *
 * POST /tenant/students/bulk (confirmed via Postman, 2026-08-13) takes the
 * whole file in ONE request — the backend parses every row and creates all
 * students itself, returning `{ inserted, skipped, invalid, data }`. The
 * per-row result table shown to the user is built by correlating that
 * response back to the rows the user previewed (matched by admission
 * number, the same key already used for the frontend's own duplicate-row
 * check), not by calling the API once per row.
 */
export function useStudentImport() {
  const [file, setFile] = useState<File | null>(null);
  const [isDocumentFile, setIsDocumentFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [previewRows, setPreviewRows] = useState<StudentImportPreviewRow[]>([]);
  const [missingColumns, setMissingColumns] = useState<string[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<StudentImportResponse | null>(null);

  const reset = useCallback(() => {
    setFile(null);
    setIsDocumentFile(false);
    setFileError(null);
    setParsing(false);
    setPreviewRows([]);
    setMissingColumns([]);
    setParseError(null);
    setImporting(false);
    setImportError(null);
    setImportResult(null);
  }, []);

  const selectFile = useCallback(async (selected: File) => {
    reset();
    const ext = getFileExtension(selected.name);
    if (!ALL_IMPORT_EXTENSIONS.includes(ext)) {
      setFileError("Unsupported file type. Please upload an Excel, CSV, PDF, or Word file.");
      return;
    }
    setFile(selected);

    // PDF/Word aren't tabular — there's no reliable way to extract exact
    // rows/columns from them client-side, so skip parsing/preview entirely.
    if (!isTabularExtension(ext)) {
      setIsDocumentFile(true);
      return;
    }

    setParsing(true);
    try {
      const parsed = await parseStudentExcelFile(selected);
      setMissingColumns(parsed.missingColumns);
      if (parsed.missingColumns.length === 0 && parsed.rows.length === 0) {
        setParseError("This file has no student rows below the header.");
      }
      setPreviewRows(parsed.rows);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Could not read this file.");
    } finally {
      setParsing(false);
    }
  }, [reset]);

  const startImport = useCallback(async () => {
    if (!file) return;
    if (isDocumentFile) {
      setImportError("PDF and Word files can't be imported yet — please use the Excel/CSV template.");
      return;
    }
    setImporting(true);
    setImportError(null);
    try {
      const apiResponse = await studentsApi.importStudentsBulk(file);

      // Every row the user previewed gets a real status derived from whether
      // it actually appears in the backend's `data` (created) list — never
      // fabricated. `invalid`'s exact per-entry shape is unconfirmed (no
      // failing-row example has been seen yet), so it's only consulted
      // opportunistically for a nicer message/Skipped-vs-Failed distinction;
      // a row not found in `data` is always shown as at least "Failed" even
      // if nothing in `invalid` could be matched to it.
      const insertedByAdmissionNo = new Map(
        (apiResponse.data ?? []).map((s) => [String(s.admission_number ?? "").toLowerCase(), s])
      );

      const invalidMessageByAdmissionNo = new Map<string, string>();
      for (const entry of apiResponse.invalid ?? []) {
        if (!entry || typeof entry !== "object") continue;
        const rec = entry as Record<string, unknown>;
        const admissionNo = String(
          rec.admission_number ?? rec.admissionNumber ?? rec.admission_no ?? ""
        ).toLowerCase();
        if (!admissionNo) continue;
        const message = String(rec.message ?? rec.reason ?? rec.error ?? "Import failed");
        invalidMessageByAdmissionNo.set(admissionNo, message);
      }

      const rows: StudentImportRowResult[] = previewRows.map((row) => {
        const admissionNo = row.data.admission_number.toLowerCase();
        const studentLabel = `${row.data.first_name} ${row.data.last_name}`.trim() || `Row ${row.rowNumber}`;
        if (insertedByAdmissionNo.has(admissionNo)) {
          return { row: row.rowNumber, student: studentLabel, status: "Imported" };
        }
        const message = invalidMessageByAdmissionNo.get(admissionNo);
        const looksSkipped = !!message && /duplicate|already exist|skip/i.test(message);
        return {
          row: row.rowNumber,
          student: studentLabel,
          status: looksSkipped ? "Skipped" : "Failed",
          message: message ?? "Not imported by the server",
        };
      });

      const result: StudentImportResponse = {
        totalRecords: previewRows.length,
        successCount: rows.filter((r) => r.status === "Imported").length,
        failedCount: rows.filter((r) => r.status === "Failed").length,
        skippedCount: rows.filter((r) => r.status === "Skipped").length,
        rows,
      };
      setImportResult(result);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Failed to import students.");
    } finally {
      setImporting(false);
    }
  }, [file, isDocumentFile, previewRows]);

  const canImport = !!file && !parsing && (
    isDocumentFile || (!parseError && missingColumns.length === 0 && previewRows.length > 0)
  );

  return {
    file,
    isDocumentFile,
    fileError,
    parsing,
    previewRows,
    missingColumns,
    parseError,
    importing,
    importError,
    importResult,
    canImport,
    selectFile,
    changeFile: reset,
    removeFile: reset,
    startImport,
    downloadTemplate: downloadStudentImportTemplate,
    downloadErrorReport: () => { if (importResult) downloadImportErrorReport(importResult); },
  };
}
