// Shared file-type classification for the Excel-import-style screens
// (Students, Staff, Holidays). Spreadsheet formats are genuinely tabular —
// SheetJS (xlsx) parses .xlsx/.xls/.csv into rows/columns reliably. PDF and
// Word documents are NOT structured that way: there's no reliable way to
// extract exact rows/columns from an arbitrary PDF or .docx in the browser
// (scanned pages, multi-column layouts, merged cells, etc. all break simple
// heuristics). Those are accepted as uploads, but skip the in-browser
// preview — actually reading their content has to happen server-side once a
// real document-import API exists.
export const TABULAR_EXTENSIONS = [".xlsx", ".xls", ".csv"];
export const DOCUMENT_EXTENSIONS = [".pdf", ".doc", ".docx"];
export const ALL_IMPORT_EXTENSIONS = [...TABULAR_EXTENSIONS, ...DOCUMENT_EXTENSIONS];

export const IMPORT_FILE_ACCEPT = ALL_IMPORT_EXTENSIONS.join(",");

export function getFileExtension(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  return dot >= 0 ? fileName.slice(dot).toLowerCase() : "";
}

export function isTabularExtension(ext: string): boolean {
  return TABULAR_EXTENSIONS.includes(ext);
}

export function isDocumentExtension(ext: string): boolean {
  return DOCUMENT_EXTENSIONS.includes(ext);
}
