import { useState } from "react";
import { X, Loader2, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  generateMonthlyFeeCollectionReport,
  downloadReportById,
  deleteReportById,
  type MonthlyFeeCollectionPayload,
  type MonthlyFeeCollectionResponse,
} from "@/services/accountant-reports.api";

interface GeneratedReport {
  id: string;
  studentName: string;
  totalOriginal: number;
  totalDiscount: number;
  totalFinal: number;
  totalPaid: number;
  totalDue: number;
  overallStatus: string;
  details: MonthlyFeeCollectionResponse["data"]["details"];
  createdAt: string;
}

interface Props {
  onClose: () => void;
}

const defaultPayload: MonthlyFeeCollectionPayload = {
  academic_year_id: "",
  class_id: "",
  section_id: "",
  student_id: "",
  report_range: "this_month",
  from_date: "",
  to_date: "",
  include_sections: {
    monthly_collection_summary: true,
    student_overdue_list: true,
    fee_breakdown: true,
    partial_payments: true,
    late_fee_report: true,
  },
};

export const GenerateMonthlyReportModal = ({ onClose }: Props) => {
  const [payload, setPayload] = useState<MonthlyFeeCollectionPayload>(defaultPayload);
  const [generating, setGenerating] = useState(false);
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savedReportId, setSavedReportId] = useState("");
  const [savedActionLoading, setSavedActionLoading] = useState(false);

  const update = (field: keyof MonthlyFeeCollectionPayload, value: any) =>
    setPayload((prev) => ({ ...prev, [field]: value }));

  const updateInclude = (field: keyof typeof payload.include_sections, value: boolean) =>
    setPayload((prev) => ({
      ...prev,
      include_sections: { ...prev.include_sections, [field]: value },
    }));

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await generateMonthlyFeeCollectionReport(payload);
      if (!res.status) {
        setError("Failed to generate report");
        return;
      }
      const report: GeneratedReport = {
        id: crypto.randomUUID(),
        studentName: res.data.student.name,
        totalOriginal: res.data.summary.totalOriginal,
        totalDiscount: res.data.summary.totalDiscount,
        totalFinal: res.data.summary.totalFinal,
        totalPaid: res.data.summary.totalPaid,
        totalDue: res.data.summary.totalDue,
        overallStatus: res.data.summary.overallStatus,
        details: res.data.details,
        createdAt: new Date().toLocaleString(),
      };
      setReports((prev) => [report, ...prev]);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (report: GeneratedReport) => {
    setDownloadingId(report.id);
    try {
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `fee-report-${report.studentName.replace(/\s+/g, "-")}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setReports((prev) => prev.filter((r) => r.id !== id));
    setDeletingId(null);
  };

  const handleSavedDownload = async () => {
    if (!savedReportId) return;
    setSavedActionLoading(true);
    try { await downloadReportById(savedReportId); } finally { setSavedActionLoading(false); }
  };

  const handleSavedDelete = async () => {
    if (!savedReportId) return;
    setSavedActionLoading(true);
    try {
      await deleteReportById(savedReportId);
      setSavedReportId("");
    } catch { } finally {
      setSavedActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-xl rounded-t-2xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900">
            Generate Monthly Fee Collection Report
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-4 sm:px-5 py-4 space-y-4">
          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Academic Year ID</label>
              <input
                type="text"
                value={payload.academic_year_id}
                onChange={(e) => update("academic_year_id", e.target.value)}
                placeholder="e.g. 9dec4bb4-..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#3525CD] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Class ID</label>
              <input
                type="text"
                value={payload.class_id}
                onChange={(e) => update("class_id", e.target.value)}
                placeholder="e.g. f172c913-..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#3525CD] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Section ID</label>
              <input
                type="text"
                value={payload.section_id}
                onChange={(e) => update("section_id", e.target.value)}
                placeholder="e.g. 17b0024f-..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#3525CD] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Student ID</label>
              <input
                type="text"
                value={payload.student_id}
                onChange={(e) => update("student_id", e.target.value)}
                placeholder="e.g. c3d1dce5-..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#3525CD] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Report Range</label>
              <select
                value={payload.report_range}
                onChange={(e) => update("report_range", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#3525CD] focus:bg-white"
              >
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="custom">Custom Range</option>
                <option value="this_year">This Year</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">From Date</label>
              <input
                type="date"
                value={payload.from_date}
                onChange={(e) => update("from_date", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#3525CD] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">To Date</label>
              <input
                type="date"
                value={payload.to_date}
                onChange={(e) => update("to_date", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#3525CD] focus:bg-white"
              />
            </div>
          </div>

          {/* Include Sections */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Include Sections</p>
            <div className="flex flex-wrap gap-3">
              {([
                ["monthly_collection_summary", "Monthly Collection Summary"],
                ["student_overdue_list", "Student Overdue List"],
                ["fee_breakdown", "Fee Breakdown"],
                ["partial_payments", "Partial Payments"],
                ["late_fee_report", "Late Fee Report"],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={payload.include_sections[key]}
                    onChange={(e) => updateInclude(key, e.target.checked)}
                    className="accent-[#3525CD]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full bg-[#3525CD] hover:bg-[#2a1eb0] text-white h-10"
          >
            {generating ? (
              <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Generating...</span>
            ) : (
              "Generate Report"
            )}
          </Button>

          {/* Generated Reports */}
          {reports.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">Generated Reports</h3>
              {reports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{report.studentName}</p>
                      <p className="text-xs text-gray-400">{report.createdAt}</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      report.overallStatus === "PAID" ? "bg-green-100 text-green-700" :
                      report.overallStatus === "PARTIAL" ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {report.overallStatus}
                    </span>
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                      <p className="text-[10px] text-gray-400">Original</p>
                      <p className="text-sm font-bold text-gray-900">₹{report.totalOriginal.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                      <p className="text-[10px] text-gray-400">Paid</p>
                      <p className="text-sm font-bold text-green-600">₹{report.totalPaid.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                      <p className="text-[10px] text-gray-400">Due</p>
                      <p className="text-sm font-bold text-red-600">₹{report.totalDue.toLocaleString("en-IN")}</p>
                    </div>
                  </div>

                  {/* Details table */}
                  {report.details.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left px-2 py-1.5 font-medium text-gray-500">Fee Head</th>
                            <th className="text-right px-2 py-1.5 font-medium text-gray-500">Original</th>
                            <th className="text-right px-2 py-1.5 font-medium text-gray-500">Discount</th>
                            <th className="text-right px-2 py-1.5 font-medium text-gray-500">Final</th>
                            <th className="text-right px-2 py-1.5 font-medium text-gray-500">Paid</th>
                            <th className="text-right px-2 py-1.5 font-medium text-gray-500">Due</th>
                            <th className="text-center px-2 py-1.5 font-medium text-gray-500">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {report.details.map((d) => (
                            <tr key={d.id} className="border-t border-gray-100">
                              <td className="px-2 py-1.5 font-medium text-gray-900">{d.feeHeadName}</td>
                              <td className="px-2 py-1.5 text-right text-gray-700">₹{d.originalAmount.toLocaleString("en-IN")}</td>
                              <td className="px-2 py-1.5 text-right text-gray-700">₹{d.discountAmount.toLocaleString("en-IN")}</td>
                              <td className="px-2 py-1.5 text-right text-gray-700">₹{d.finalAmount.toLocaleString("en-IN")}</td>
                              <td className="px-2 py-1.5 text-right text-green-600 font-medium">₹{d.paidAmount.toLocaleString("en-IN")}</td>
                              <td className="px-2 py-1.5 text-right text-red-600 font-medium">₹{d.dueAmount.toLocaleString("en-IN")}</td>
                              <td className="px-2 py-1.5 text-center">
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                                  d.status === "PAID" ? "bg-green-100 text-green-700" :
                                  d.status === "PARTIAL" ? "bg-amber-100 text-amber-700" :
                                  "bg-red-100 text-red-700"
                                }`}>
                                  {d.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(report)}
                      disabled={downloadingId === report.id}
                      className="text-xs gap-1.5 h-8"
                    >
                      {downloadingId === report.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(report.id)}
                      disabled={deletingId === report.id}
                      className="text-xs gap-1.5 h-8 text-red-500 border-red-200 hover:bg-red-50"
                    >
                      {deletingId === report.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Report Actions */}
        <div className="pt-2 border-t border-gray-100 space-y-2">
          <p className="text-xs font-medium text-gray-500">Saved Report Actions</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={savedReportId}
              onChange={(e) => setSavedReportId(e.target.value)}
              placeholder="Enter report ID to download / delete"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#3525CD] focus:bg-white"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleSavedDownload}
              disabled={savedActionLoading || !savedReportId}
              className="text-xs gap-1.5 h-9"
            >
              {savedActionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              Download
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSavedDelete}
              disabled={savedActionLoading || !savedReportId}
              className="text-xs gap-1.5 h-9 text-red-500 border-red-200 hover:bg-red-50"
            >
              {savedActionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              Delete
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex justify-end pt-3">
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 transition-colors py-1">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
