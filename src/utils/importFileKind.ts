
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
