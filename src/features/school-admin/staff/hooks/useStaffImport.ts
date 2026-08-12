import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { createStaff, importStaffFromDocument } from "@/services/staff.api";
import { fetchDepartments } from "@/services/department.api";
import { getAllAcademicYears } from "@/services/academicYear.api";
import type { Department } from "@/features/school-admin/settings/types/settings.types";
import type { AcademicYearRecord } from "@/services/academicYear.api";
import { useStaffStore } from "../store/usestore";
import { ALL_IMPORT_EXTENSIONS, getFileExtension, isTabularExtension } from "@/utils/importFileKind";
import {
  parseStaffExcelFile,
  downloadStaffImportTemplate,
  downloadStaffImportErrorReport,
} from "../utils/staffImportExcel";
import type { StaffImportPreviewRow, StaffImportResponse, StaffImportRowResult } from "../types/staffImport.types";

const genEmpId = (base: number, offset: number) => `EMP-${String(base + offset).padStart(3, "0")}`;

/**
 * Drives the Staff Import screen end to end. For Excel/CSV this is fully
 * wired up — createStaff() is the same proven endpoint the existing Bulk Add
 * Staff form already uses (one call per row via Promise.allSettled), so
 * there's no invented API for that path. PDF/Word documents can't be parsed
 * into rows in the browser, so those go through importStaffFromDocument()
 * instead, which is a pending stub — see staff.api.ts for why.
 */
export function useStaffImport() {
  const schoolcode = useAuthStore((s) => s.user?.schoolcode ?? "");
  const schoolId = useAuthStore((s) => s.user?.id ?? "");
  const globalAcademicYearId = useUIStore((s) => s.academicYearId);
  const staffData = useStaffStore((s) => s.staffData);
  const loadStaff = useStaffStore((s) => s.loadStaff);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYearRecord[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const [isDocumentFile, setIsDocumentFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [previewRows, setPreviewRows] = useState<StaffImportPreviewRow[]>([]);
  const [missingColumns, setMissingColumns] = useState<string[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<StaffImportResponse | null>(null);

  useEffect(() => {
    fetchDepartments().then(setDepartments).catch(() => {});
    getAllAcademicYears().then((res) => setAcademicYears(res.data)).catch(() => {});
  }, []);

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
      const parsed = await parseStaffExcelFile(selected, departments, academicYears);
      setMissingColumns(parsed.missingColumns);

      // Auto-generate EMP numbers for rows that left it blank, continuing the
      // same sequence the manual Bulk Add Staff form uses.
      const nums = staffData
        .map((s) => /^EMP-(\d+)$/i.exec(s.employeeId?.trim() ?? "")?.[1])
        .map((n) => (n ? parseInt(n, 10) : NaN))
        .filter((n) => !isNaN(n) && n > 0);
      const base = nums.length > 0 ? Math.max(...nums) + 1 : 1;
      let offset = 0;
      const rowsWithEmpNumbers = parsed.rows.map((row) => {
        if (row.data.emp_number) return row;
        const empNumber = genEmpId(base, offset);
        offset += 1;
        return { ...row, data: { ...row.data, emp_number: empNumber } };
      });

      if (parsed.missingColumns.length === 0 && rowsWithEmpNumbers.length === 0) {
        setParseError("This file has no staff rows below the header.");
      }
      setPreviewRows(rowsWithEmpNumbers);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Could not read this file.");
    } finally {
      setParsing(false);
    }
  }, [reset, departments, academicYears, staffData]);

  const startImport = useCallback(async () => {
    if (!file) return;

    // PDF/Word: no parsed rows exist to submit via createStaff() — this
    // goes to the pending document-import stub instead (see staff.api.ts).
    if (isDocumentFile) {
      setImporting(true);
      setImportError(null);
      try {
        await importStaffFromDocument(file);
      } catch (err) {
        setImportError(err instanceof Error ? err.message : "Failed to import staff.");
      } finally {
        setImporting(false);
      }
      return;
    }

    if (!previewRows.length) return;
    if (!schoolcode) { setImportError("School code not found. Please log in again."); return; }

    setImporting(true);
    setImportError(null);
    try {
      const submittable = previewRows.filter((r) => r.errors.length === 0);
      const results = await Promise.allSettled(
        submittable.map((row) =>
          createStaff({
            school_id: schoolId,
            name: row.data.name,
            email: row.data.email,
            phone: row.data.phone.replace(/[^0-9]/g, ""),
            role: row.data.role,
            qualification: row.data.qualification,
            date_of_birth: row.data.date_of_birth || "2000-01-01",
            date_of_join: row.data.date_of_join || new Date().toISOString().slice(0, 10),
            emp_number: row.data.emp_number || "EMP-001",
            school_code: schoolcode,
            status: (row.data.status || "active").toUpperCase(),
            ...(row.departmentId ? { department_id: row.departmentId } : {}),
            ...(row.academicYearId || globalAcademicYearId
              ? { academicYearId: row.academicYearId || (globalAcademicYearId ?? undefined) }
              : {}),
            ...(row.data.bank_account_name ? { bank_account_name: row.data.bank_account_name } : {}),
            ...(row.data.bank_account_number ? { bank_account_number: row.data.bank_account_number } : {}),
            ...(row.data.ifsc_code ? { ifsc_code: row.data.ifsc_code.toUpperCase() } : {}),
          })
        )
      );

      let resultIdx = 0;
      const rows: StaffImportRowResult[] = previewRows.map((row) => {
        const staffName = row.data.name || `Row ${row.rowNumber}`;
        if (row.errors.length > 0) {
          return { row: row.rowNumber, staffName, status: "Failed", message: row.errors.join("; ") };
        }
        const outcome = results[resultIdx++];
        return outcome.status === "fulfilled"
          ? { row: row.rowNumber, staffName, status: "Imported" }
          : { row: row.rowNumber, staffName, status: "Failed", message: outcome.reason?.message ?? "Failed to create staff member" };
      });

      const successCount = rows.filter((r) => r.status === "Imported").length;
      setImportResult({
        totalRecords: rows.length,
        successCount,
        failedCount: rows.length - successCount,
        rows,
      });
      if (successCount > 0) loadStaff();
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Failed to import staff.");
    } finally {
      setImporting(false);
    }
  }, [file, isDocumentFile, previewRows, schoolcode, schoolId, globalAcademicYearId, loadStaff]);

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
    downloadTemplate: downloadStaffImportTemplate,
    downloadErrorReport: () => { if (importResult) downloadStaffImportErrorReport(importResult); },
  };
}
