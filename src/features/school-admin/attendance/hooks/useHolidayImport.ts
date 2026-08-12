import { useCallback, useState } from "react";
import { importHolidaysFromExcel } from "@/services/holidays.api";
import { ALL_IMPORT_EXTENSIONS, getFileExtension, isTabularExtension } from "@/utils/importFileKind";
import {
  parseHolidayExcelFile,
  downloadHolidayImportTemplate,
  downloadHolidayImportErrorReport,
} from "../utils/holidayImportExcel";
import type { HolidayImportPreviewRow, HolidayImportResponse } from "../types/holidayImport.types";

/**
 * Drives the Holiday Import screen end to end:
 * file selection → frontend validation/preview (spreadsheets only — PDF/Word
 * aren't structured as rows/columns, so those skip preview) → (pending)
 * backend import. See holidays.api.ts's importHolidaysFromExcel for why the
 * import step currently throws.
 */
export function useHolidayImport() {
  const [file, setFile] = useState<File | null>(null);
  const [isDocumentFile, setIsDocumentFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [previewRows, setPreviewRows] = useState<HolidayImportPreviewRow[]>([]);
  const [missingColumns, setMissingColumns] = useState<string[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<HolidayImportResponse | null>(null);

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

    if (!isTabularExtension(ext)) {
      setIsDocumentFile(true);
      return;
    }

    setParsing(true);
    try {
      const parsed = await parseHolidayExcelFile(selected);
      setMissingColumns(parsed.missingColumns);
      if (parsed.missingColumns.length === 0 && parsed.rows.length === 0) {
        setParseError("This file has no holiday rows below the header.");
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
    setImporting(true);
    setImportError(null);
    try {
      const result = await importHolidaysFromExcel(file);
      setImportResult(result);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Failed to import holidays.");
    } finally {
      setImporting(false);
    }
  }, [file]);

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
    downloadTemplate: downloadHolidayImportTemplate,
    downloadErrorReport: () => { if (importResult) downloadHolidayImportErrorReport(importResult); },
  };
}
