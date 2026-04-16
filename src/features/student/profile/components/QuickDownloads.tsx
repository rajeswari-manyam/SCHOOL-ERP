interface DownloadItem {
  id: string;
  title: string;
  size: string;
  downloadUrl: string;
}

interface QuickDownloadsProps {
  downloads: DownloadItem[];
}

const QuickDownloads = ({ downloads }: QuickDownloadsProps) => {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-950">Quick Downloads</h3>

      <div className="mt-5 space-y-3">
        {downloads.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
          >
            <div>
              <p className="font-medium text-slate-900">{doc.title}</p>
              <p className="text-xs text-slate-500">{doc.size}</p>
            </div>
            <button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
              Download PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickDownloads;
