import {
  Download,
  Loader2,
  CheckCircle,
  FileText,
  IdCard,
  Receipt,
} from "lucide-react";
import type { QuickDownload, DocumentType } from "../types/profile.types";

// ─── Icon map ───────────────────────────────────────────────

const DOC_ICON: Record<DocumentType, React.ElementType> = {
  ACADEMIC: FileText,
  IDENTITY: IdCard,
  FINANCIAL: Receipt,
};

// ─── Row ─────────────────────────────────────────────────────

interface DownloadRowProps {
  doc: QuickDownload;
  isDownloading: boolean;
  isDone: boolean;
  onDownload: (id: string, title: string) => void;
}

function DownloadRow({
  doc,
  isDownloading,
  isDone,
  onDownload,
}: DownloadRowProps) {
  const Icon = DOC_ICON[doc.type];
  const busy = isDownloading || isDone;

  return (
    <div className="flex items-start sm:items-center gap-3 py-3 border-b border-slate-100 last:border-b-0">
      {/* Icon */}
      <div className="flex h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
        <Icon size={16} aria-hidden />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] sm:text-[13px] font-semibold text-slate-900">
          {doc.title}
        </p>

        <p className="mt-0.5 text-[10px] sm:text-[11px] text-slate-400 break-words">
          {doc.subtitle} · {doc.fileSize}
        </p>
      </div>

      {/* Button */}
      <button
        onClick={() => !busy && onDownload(doc.id, doc.title)}
        disabled={isDownloading}
        aria-label={`Download ${doc.title}`}
        className={`
          flex flex-shrink-0 items-center gap-1.5
          rounded-lg border px-2.5 sm:px-3 py-1.5
          text-[10px] sm:text-[11px] font-semibold
          transition-all duration-200 active:scale-[0.97]
          disabled:cursor-wait
          ${
            isDone
              ? "border-green-200 bg-green-50 text-green-700"
              : isDownloading
              ? "border-slate-200 bg-slate-100 text-slate-400"
              : "border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:border-indigo-300"
          }
        `}
      >
        {isDownloading && (
          <Loader2 size={12} className="animate-spin" aria-hidden />
        )}
        {isDone && <CheckCircle size={12} aria-hidden />}
        {!isDownloading && !isDone && <Download size={12} aria-hidden />}

        <span className="whitespace-nowrap">
          {isDownloading ? "Loading…" : isDone ? "Done" : "Download"}
        </span>
      </button>
    </div>
  );
}

// ─── Card ────────────────────────────────────────────────────

interface QuickDownloadsProps {
  downloads: QuickDownload[];
  downloadingId: string | null;
  downloadedId: string | null;
  onDownload: (id: string, title: string) => void;
}

export default function QuickDownloads({
  downloads,
  downloadingId,
  downloadedId,
  onDownload,
}: QuickDownloadsProps) {
  return (
    <div
      className="
        rounded-2xl border border-slate-200 bg-white
        p-4 sm:p-5
        shadow-sm
        transition-all duration-200
        hover:border-indigo-300 hover:shadow-md hover:-translate-y-[2px]
      "
    >
      {/* Header */}
      <h3 className="mb-3 sm:mb-4 text-[12px] sm:text-[13px] font-semibold text-slate-900 tracking-wide">
        Quick Downloads
      </h3>

      {/* List */}
      <div>
        {downloads.map((doc) => (
          <DownloadRow
            key={doc.id}
            doc={doc}
            isDownloading={downloadingId === doc.id}
            isDone={downloadedId === doc.id}
            onDownload={onDownload}
          />
        ))}
      </div>
    </div>
  );
}