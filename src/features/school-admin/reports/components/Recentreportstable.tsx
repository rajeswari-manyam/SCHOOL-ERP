import { useState, useCallback } from "react";
import { Download, Users, CalendarCheck, Eye, Pencil, Trash2 } from "lucide-react";
import { ReportIcons } from "../utils/report-config";
import type { RawReport, ReportType } from "../types/reports.types";
import { reportsApi } from "@/services/school-reports.api";
import { downloadBlob } from "@/features/school-admin/attendance/utils/attendance.utils";
import { useDeleteReport } from "../hooks/useReports";
import ReportViewModal from "./ReportViewModal";
import ReportEditModal from "./ReportEditModal";
import toast from "react-hot-toast";

interface Props {
  reports?: RawReport[];
  loading?: boolean;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    ", " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
};

const FormatBadge = ({ format }: { format: string }) => {
  const f = format.toUpperCase();
  const styles =
    f === "PDF"  ? "bg-red-100 text-red-600" :
    f === "CSV"  ? "bg-green-100 text-green-700" :
    f === "JSON" ? "bg-blue-100 text-blue-700" :
                   "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide ${styles}`}>
      {f}
    </span>
  );
};

const TH = "px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap";

const DownloadButton = ({ reportId, reportType }: { reportId: string; reportType: string }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const { blob, filename } = await reportsApi.download(reportId);
      downloadBlob(blob, filename || `${reportType.replace(/\s+/g, "-")}-${reportId.slice(0, 8)}.csv`);
    } catch {
      toast.error("Failed to download report");
    } finally {
      setDownloading(false);
    }
  }, [reportId, reportType]);

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      title="Download"
      className="p-1.5 rounded-lg text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className={`w-4 h-4 ${downloading ? "animate-bounce" : ""}`} />
    </button>
  );
};

const REPORT_TYPE_MAP: Record<string, ReportType> = {
  "attendance report": "ATTENDANCE",
  "attendance":        "ATTENDANCE",
  "fee collection":    "FEE_COLLECTION",
  "fee":               "FEE_COLLECTION",
  "student report":    "STUDENT",
  "student":           "STUDENT",
  "whatsapp":          "WHATSAPP_ACTIVITY",
  "admissions":        "ADMISSIONS",
  "staff report":      "STAFF",
  "staff":             "STAFF",
};

function toReportType(reportype: string): ReportType {
  return REPORT_TYPE_MAP[reportype.toLowerCase().trim()] ?? "ATTENDANCE";
}

const RecentReportsTable = ({ reports, loading }: Props) => {
  const [viewReport, setViewReport]         = useState<RawReport | null>(null);
  const [editReport, setEditReport]         = useState<RawReport | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { mutateAsync: deleteReport, isPending: deleting } = useDeleteReport();

  const handleDelete = async (id: string) => {
    try {
      await deleteReport(id);
      toast.success("Report deleted");
    } catch {
      toast.error("Failed to delete report");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Generated Reports</h2>
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
          <h2 className="text-base font-bold text-gray-900">Generated Reports</h2>
        </div>
        <div className="flex items-center justify-center h-32 text-sm text-gray-400">
          No reports generated yet.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Generated Reports</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-semibold">
            {reports.length} total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className={TH}>Report Type</th>
                <th className={TH}>Class · Section</th>
                <th className={TH}>Academic Year</th>
                <th className={TH}>Period</th>
                <th className={TH}>Stats</th>
                <th className={TH}>Generated On</th>
                <th className={TH}>Format</th>
                <th className={`${TH} text-right min-w-[160px]`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map((r) => {
                const type = toReportType(r.reportype);
                const Icon = ReportIcons[type] ?? ReportIcons.ATTENDANCE;
                const generatedAt = r.generated_at ?? r.createdAt;
                const stats = r.dashboard_stats;

                return (
                  <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">

                    {/* Report type */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <Icon size={14} />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                          {r.reportype}
                        </span>
                      </div>
                    </td>

                    {/* Class · Section */}
                    <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {r.class_name ?? <span className="text-gray-300">—</span>}
                      {r.section_name && (
                        <span className="text-gray-400"> · {r.section_name}</span>
                      )}
                    </td>

                    {/* Academic Year */}
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {r.academic_year ?? <span className="text-gray-300">—</span>}
                    </td>

                    {/* Period */}
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {r.from} – {r.to}
                    </td>

                    {/* Stats (attendance only) */}
                    <td className="px-4 py-4">
                      {stats ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                            <Users size={11} className="text-indigo-400" />
                            <span>{stats.total_students} students</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                            <CalendarCheck size={11} className="text-green-500" />
                            <span>{stats.average_attendance}% avg</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-300 text-sm">—</span>
                      )}
                    </td>

                    {/* Generated on */}
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(generatedAt)}
                    </td>

                    {/* Format */}
                    <td className="px-4 py-4">
                      <FormatBadge format={r.format} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 flex-nowrap">
                        {/* View */}
                        <button
                          onClick={() => setViewReport(r)}
                          title="View"
                          className="p-1.5 rounded-lg text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => setEditReport(r)}
                          title="Edit"
                          className="p-1.5 rounded-lg text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* Delete with inline confirm */}
                        {confirmDeleteId === r.id ? (
                          <div className="flex items-center gap-1 flex-nowrap whitespace-nowrap">
                            <button
                              onClick={() => handleDelete(r.id)}
                              disabled={deleting}
                              className="px-2 py-1 rounded text-[11px] font-bold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                              {deleting ? "…" : "Yes"}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 rounded text-[11px] font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(r.id)}
                            title="Delete"
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                        {/* Download */}
                        <DownloadButton reportId={r.id} reportType={r.reportype} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewReport && (
        <ReportViewModal report={viewReport} onClose={() => setViewReport(null)} />
      )}

      {/* Edit Modal */}
      {editReport && (
        <ReportEditModal report={editReport} onClose={() => setEditReport(null)} />
      )}
    </>
  );
};

export default RecentReportsTable;
