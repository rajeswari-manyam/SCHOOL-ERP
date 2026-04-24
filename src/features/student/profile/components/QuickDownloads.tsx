import type { QuickDownload } from "../types/profile.types";
import { Button } from "@/components/ui/button";

interface QuickDownloadsProps {
  downloads: QuickDownload[];
  onDownload: (documentId: string, fileName: string) => void;
  downloadingId: string | null;
}

const QuickDownloads = ({ downloads, onDownload, downloadingId }: QuickDownloadsProps) => {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-950">Quick Downloads</h3>

      <div className="mt-5 space-y-3">
        {downloads.map((doc) => {
          const isDownloading = downloadingId === doc.id;

          return (
            <div
              key={doc.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-900">{doc.title}</p>
                <p className="text-xs text-slate-500">{doc.size}</p>
                <p className="text-xs text-slate-400">Last updated {doc.lastUpdated}</p>
              </div>
              <Button
                type="button"
                onClick={() => onDownload(doc.id, doc.title)}
                disabled={isDownloading}
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isDownloading ? "Downloading..." : "Download PDF"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickDownloads;
