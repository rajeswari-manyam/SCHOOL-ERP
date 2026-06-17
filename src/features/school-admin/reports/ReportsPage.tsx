import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, Search, X, CheckCircle } from "lucide-react";
import { useReports, useGenerateReport } from "./hooks/useReports";
import ReportStatCards from "./components/Reportstatcards";
import ReportCardGrid from "./components/Reportcardgrid";
import RecentReportsTable from "./components/Recentreportstable";
import GenerateReportModal from "./components/Generatereportmodal";
import Pagination from "./components/Pagination";
import { Input } from "@/components/ui/input";
import type { ReportType } from "./types/reports.types";
import { ACADEMIC_YEARS } from "./utils/Report config";

const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-white rounded-xl shadow-lg border border-emerald-100 px-5 py-4 animate-slide-in">
      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
        <CheckCircle className="w-5 h-5 text-emerald-600" />
      </div>
      <p className="text-sm font-medium text-gray-900">{message}</p>
      <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const ReportsPage = () => {
  const {
    paginatedReports,
    filteredReports,
    stats,
    loading,
    academicYear,
    setAcademicYear,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    downloadReport,
  } = useReports();

  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<ReportType | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const { form, generating, success, estimatedSize, openForType, setField, toggleSection, generate } =
    useGenerateReport(() => {
      setShowModal(false);
      setGeneratingId(null);
      showToast("Report Generated Successfully");
    });

  const handleGenerate = (type: ReportType, period: string, format: string) => {
    setGeneratingId(type);
    openForType(type);
    setField("format", format as import("./types/reports.types").ReportFormat);

    const periodMap: Record<string, "This Month" | "Last Month" | "Custom Range"> = {
      Weekly: "This Month",
      Monthly: "This Month",
      Custom: "Custom Range",
    };
    const mappedPeriod = periodMap[period] || "This Month";
    setField("dateRangeType", mappedPeriod);

    if (period === "Custom") {
      setShowModal(true);
    } else {
      generate();
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Admin</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-semibold uppercase tracking-wider text-indigo-600">Reports</span>
          </nav>
          <h1 className="text-xl font-semibold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500 mt-0.5">Generate and download school reports</p>
        </div>

        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-white shadow-sm">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-medium text-gray-700">Academic Year {academicYear}</span>
          <div className="flex gap-1 ml-1">
            <button
              onClick={() => {
                const idx = ACADEMIC_YEARS.indexOf(academicYear);
                if (idx < ACADEMIC_YEARS.length - 1) setAcademicYear(ACADEMIC_YEARS[idx + 1]);
              }}
              className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100 text-gray-400"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                const idx = ACADEMIC_YEARS.indexOf(academicYear);
                if (idx > 0) setAcademicYear(ACADEMIC_YEARS[idx - 1]);
              }}
              className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100 text-gray-400"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {stats && !loading && <ReportStatCards stats={stats} />}

      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Report Categories</h2>
        <ReportCardGrid onGenerate={handleGenerate} generatingId={generating ? generatingId : null} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-base font-semibold text-gray-900">Generated Reports</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 w-3.5 h-3.5 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
              className="pl-8 pr-3 py-2 text-sm w-48"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40 bg-white rounded-xl border border-gray-100">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <RecentReportsTable reports={paginatedReports} onDownload={downloadReport} />
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {paginatedReports.length} of {filteredReports.length} reports
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>

      {showModal && (
        <GenerateReportModal
          form={form}
          generating={generating}
          success={success}
          estimatedSize={estimatedSize}
          onClose={() => {
            setShowModal(false);
            setGeneratingId(null);
          }}
          onSetField={setField}
          onToggleSection={toggleSection}
          onGenerate={generate}
        />
      )}
    </div>
  );
};

export default ReportsPage;
