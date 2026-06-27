import { useState } from "react";
import { X, Pencil, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useUpdateReport } from "../hooks/useReports";
import type { RawReport } from "../types/reports.types";

interface Props {
  report: RawReport | null;
  onClose: () => void;
}

const ReportEditModal = ({ report, onClose }: Props) => {
  const [from, setFrom]             = useState(report?.from ?? "");
  const [to, setTo]                 = useState(report?.to ?? "");
  const [fmt, setFmt]               = useState(report?.format ?? "json");
  const [emailreport, setEmailreport] = useState(report?.emailreport ?? false);

  const { mutateAsync: updateReport, isPending } = useUpdateReport();

  if (!report) return null;

  const handleSave = async () => {
    if (!from || !to) { toast.error("Please select both from and to dates"); return; }
    try {
      await updateReport({ id: report.id, payload: { from, to, format: fmt, emailreport } });
      toast.success("Report updated successfully");
      onClose();
    } catch {
      toast.error("Failed to update report");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4">
        <div
          className="bg-white w-full sm:max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Pencil size={16} />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Edit Report</h2>
                <p className="text-[11px] text-gray-400">{report.reportype}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-5 py-5 space-y-4">
            {/* Date range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">From Date</label>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">To Date</label>
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                />
              </div>
            </div>

            {/* Format */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600">Format</label>
              <select
                value={fmt}
                onChange={(e) => setFmt(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              >
                <option value="json">JSON</option>
                <option value="PDF">PDF</option>
                <option value="CSV">CSV</option>
              </select>
            </div>

            {/* Email toggle */}
            <label className="flex items-center gap-3 cursor-pointer bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors">
              <input
                type="checkbox"
                checked={emailreport}
                onChange={(e) => setEmailreport(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-600 shrink-0"
              />
              <span className="text-sm text-gray-700 font-medium">Email Report</span>
            </label>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-5 pb-5">
            <button
              onClick={onClose}
              className="flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending
                ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
                : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportEditModal;
