import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, FileSpreadsheet, FileText, Upload, Download, X, Loader2,
  CheckCircle2, XCircle, AlertTriangle, RefreshCw,
} from "lucide-react";
import { useHolidayImport } from "./hooks/useHolidayImport";
import { HOLIDAY_IMPORT_COLUMNS } from "./types/holidayImport.types";
import { IMPORT_FILE_ACCEPT } from "@/utils/importFileKind";

const PREVIEW_ROW_LIMIT = 50;

const ImportHolidaysExcelPage = () => {
  const navigate = useNavigate();
  const goBackToHolidays = () => navigate("/schooladmin/holidays");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    file, isDocumentFile, fileError, parsing, previewRows, missingColumns, parseError,
    importing, importError, importResult, canImport,
    selectFile, changeFile, removeFile, startImport,
    downloadTemplate, downloadErrorReport,
  } = useHolidayImport();

  const handleFilePicked = (f: File | null) => {
    if (f) void selectFile(f);
  };

  const rowsWithIssues = previewRows.filter((r) => r.errors.length > 0).length;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <button type="button" onClick={goBackToHolidays} className="hover:text-indigo-600 transition-colors font-medium">
          Holidays
        </button>
        <span>›</span>
        <span className="text-gray-700 font-semibold">Import</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-5 sm:px-7 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Import Holidays</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {importResult ? "Import result" : file ? "Review the file before importing" : "Upload an Excel, CSV, PDF, or Word file containing holiday records"}
            </p>
          </div>
          <button onClick={goBackToHolidays} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-6 space-y-5">
          {/* ── Import Result (only ever populated from a real backend response) ── */}
          {importResult ? (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Records</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{importResult.totalRecords}</p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Successfully Imported</p>
                  <p className="text-xl font-bold text-emerald-700 mt-1">{importResult.successCount}</p>
                </div>
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">Failed</p>
                  <p className="text-xl font-bold text-red-600 mt-1">{importResult.failedCount}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="text-left px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">Row</th>
                        <th className="text-left px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">Holiday</th>
                        <th className="text-left px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {importResult.rows.map((r) => (
                        <tr key={r.row} className={r.status === "Failed" ? "bg-red-50/40" : ""}>
                          <td className="px-4 py-2 text-gray-500">{r.row}</td>
                          <td className="px-4 py-2 text-gray-800 font-medium">{r.holidayName}</td>
                          <td className="px-4 py-2">
                            {r.status === "Imported" ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Imported
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500" title={r.message}>
                                <XCircle className="w-3.5 h-3.5" /> Failed
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* ── Step 1: no file selected yet ── */}
              {!file && (
                <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-slate-50/50 px-6 py-10 flex flex-col items-center text-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <FileSpreadsheet className="w-7 h-7 text-indigo-500" />
                  </div>
                  <p className="text-sm text-gray-500 max-w-sm">
                    Upload the file containing holiday records — using the provided Excel template gives the best results.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={IMPORT_FILE_ACCEPT}
                    className="hidden"
                    onChange={(e) => handleFilePicked(e.target.files?.[0] ?? null)}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-sm"
                  >
                    <Upload className="w-4 h-4" /> Choose File
                  </button>
                  <p className="text-[11px] text-gray-400">Supported: Excel (.xlsx, .xls), CSV, PDF, Word (.doc, .docx)</p>
                  <button
                    type="button"
                    onClick={downloadTemplate}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Excel Template
                  </button>
                  {fileError && (
                    <div className="flex items-center gap-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {fileError}
                    </div>
                  )}
                </div>
              )}

              {/* ── Step 2: file selected ── */}
              {file && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-slate-50/60 px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                        <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Selected File</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={IMPORT_FILE_ACCEPT}
                        className="hidden"
                        onChange={(e) => handleFilePicked(e.target.files?.[0] ?? null)}
                      />
                      <button
                        type="button"
                        onClick={() => { changeFile(); fileInputRef.current?.click(); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Change File
                      </button>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {isDocumentFile && (
                    <div className="flex items-start gap-2.5 text-xs text-gray-600 bg-slate-50 border border-gray-200 rounded-lg px-3.5 py-3">
                      <FileText className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
                      <span>
                        PDF and Word files can't be read row-by-row in the browser like a spreadsheet, so there's no preview here.
                        The file is ready to send — reading its contents happens once the import is connected to a backend.
                      </span>
                    </div>
                  )}

                  {parsing && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 py-6 justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" /> Reading file…
                    </div>
                  )}

                  {!parsing && missingColumns.length > 0 && (
                    <div className="flex items-start gap-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-3.5 py-3">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        This file is missing required column(s): <strong>{missingColumns.join(", ")}</strong>.
                        Please use the provided template — column names must match exactly.
                      </span>
                    </div>
                  )}

                  {!parsing && !missingColumns.length && parseError && (
                    <div className="flex items-center gap-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-3.5 py-3">
                      <AlertTriangle className="w-4 h-4 shrink-0" /> {parseError}
                    </div>
                  )}

                  {!parsing && !missingColumns.length && !parseError && previewRows.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <p className="text-xs font-semibold text-gray-600">
                          Preview — {previewRows.length} row{previewRows.length === 1 ? "" : "s"}
                          {rowsWithIssues > 0 && (
                            <span className="text-amber-600 font-medium"> · {rowsWithIssues} with issues</span>
                          )}
                        </p>
                        {previewRows.length > PREVIEW_ROW_LIMIT && (
                          <p className="text-[11px] text-gray-400">Showing first {PREVIEW_ROW_LIMIT} of {previewRows.length} rows</p>
                        )}
                      </div>
                      <div className="rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto max-h-96">
                          <table className="text-xs w-max min-w-full">
                            <thead className="bg-gray-50 sticky top-0">
                              <tr>
                                <th className="text-left px-3 py-2 font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">Row</th>
                                {HOLIDAY_IMPORT_COLUMNS.map((col) => (
                                  <th key={col} className="text-left px-3 py-2 font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {previewRows.slice(0, PREVIEW_ROW_LIMIT).map((row) => (
                                <tr key={row.rowNumber} className={row.errors.length > 0 ? "bg-amber-50/50" : ""}>
                                  <td className="px-3 py-2 text-gray-400 whitespace-nowrap">
                                    {row.rowNumber}
                                    {row.errors.length > 0 && (
                                      <span title={row.errors.join("; ")}>
                                        <AlertTriangle className="inline-block w-3 h-3 text-amber-500 ml-1" />
                                      </span>
                                    )}
                                  </td>
                                  {HOLIDAY_IMPORT_COLUMNS.map((col) => (
                                    <td key={col} className="px-3 py-2 text-gray-700 whitespace-nowrap">
                                      {row.data[col] || <span className="text-gray-300">—</span>}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {importError && (
                    <div className="flex items-start gap-2 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-3">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> {importError}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-t border-gray-100 shrink-0">
          <button onClick={goBackToHolidays} className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">
            {importResult ? "Close" : "Cancel"}
          </button>

          <div className="flex items-center gap-2">
            {importResult ? (
              importResult.failedCount > 0 && (
                <button
                  onClick={downloadErrorReport}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" /> Download Error Report
                </button>
              )
            ) : (
              file && !parsing && (isDocumentFile || (!missingColumns.length && !parseError && previewRows.length > 0)) && (
                <button
                  onClick={startImport}
                  disabled={!canImport || importing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 shadow-sm"
                >
                  {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  {importing ? "Importing…" : "Import Holidays"}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportHolidaysExcelPage;
