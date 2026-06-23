import { Download } from "lucide-react";
import { ReportIcons } from "../utils/report-config";
import type { RecentlyGeneratedReport, ReportType } from "../types/reports.types";

interface Props {
  reports?: RecentlyGeneratedReport[];
  loading?: boolean;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) +
    ", " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
};

const AVATAR_COLORS: Record<string, string> = {
  MA: "bg-indigo-100 text-indigo-700",
  RK: "bg-emerald-100 text-emerald-700",
  SY: "bg-purple-100 text-purple-700",
  PS: "bg-pink-100 text-pink-700",
};

const FormatBadge = ({ format }: { format: string }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide ${
      format.toUpperCase() === "PDF" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
    }`}
  >
    {format.toUpperCase()}
  </span>
);

const TH = "px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap";

const RecentReportsTable = ({ reports, loading }: Props) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Recently Generated Reports</h2>
        </div>
        <div className="flex items-center justify-center h-32 text-sm text-gray-400">
          Loading reports…
        </div>
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Recently Generated Reports</h2>
        </div>
        <div className="flex items-center justify-center h-32 text-sm text-gray-400">
          No reports generated yet.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-900">Recently Generated Reports</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className={TH}>Report Type</th>
              <th className={TH}>Generated On</th>
              <th className={TH}>Period</th>
              <th className={TH}>Format</th>
              <th className={`${TH} text-right`}>Download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reports.map((r) => {
              const Icon = ReportIcons[r.report_type as ReportType] ?? ReportIcons.ATTENDANCE;
              return (
                <tr key={r.report_id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Icon size={14} />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">{r.report_type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(r.generated_on)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {r.report_period.from} – {r.report_period.to}
                  </td>
                  <td className="px-4 py-4">
                    <FormatBadge format={r.format} />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      title="Download"
                      className="p-1.5 rounded-lg text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentReportsTable;
