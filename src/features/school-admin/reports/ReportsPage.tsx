import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useReports, useGenerateReport } from "./hooks/useReports";
import ReportStatCards from "./components/Reportstatcards";
import ReportCardGrid from "./components/Reportcardgrid";
import RecentReportsTable from "./components/Recentreportstable";
import GenerateReportModal from "./components/Generatereportmodal";
import Pagination from "./components/Pagination";
import type { ReportType } from "./types/reports.types";
import { ACADEMIC_YEARS } from "./utils/Report config";

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

  const { form, generating, success, estimatedSize, openForType, setField, toggleSection, generate } =
    useGenerateReport(() => setShowModal(false));

  const handleGenerate = (type: ReportType) => {
    openForType(type);
    setShowModal(true);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <nav className="flex items-center gap-1 text-xs text-gray-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Admin</span>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <span className="font-semibold uppercase tracking-wider text-indigo-600">Reports</span>
          </nav>
          <h1 className="text-2xl font-extrabold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-400 mt-0.5">Generate and download school reports</p>
        </div>

        {/* Academic Year Picker */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white shadow-sm">
          <Calendar className="h-3.5 w-3.5 text-indigo-500" />
          <span className="text-xs font-bold text-gray-700">Academic Year {academicYear}</span>
          <div className="flex gap-1">
            <button
              onClick={() => {
                const idx = ACADEMIC_YEARS.indexOf(academicYear);
                if (idx < ACADEMIC_YEARS.length - 1) setAcademicYear(ACADEMIC_YEARS[idx + 1]);
              }}
              className="w-5 h-5 rounded flex items-center justify-center hover:bg-gray-100 text-gray-400"
            >
              <ChevronLeft className="h-2.5 w-2.5" />
            </button>
            <button
              onClick={() => {
                const idx = ACADEMIC_YEARS.indexOf(academicYear);
                if (idx > 0) setAcademicYear(ACADEMIC_YEARS[idx - 1]);
              }}
              className="w-5 h-5 rounded flex items-center justify-center hover:bg-gray-100 text-gray-400"
            >
              <ChevronRight className="h-2.5 w-2.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      {stats && !loading && <ReportStatCards stats={stats} />}

      {/* Report cards grid */}
      <ReportCardGrid onGenerate={handleGenerate} />

      {/* Recently Generated Reports */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-base font-bold text-gray-900">Recently Generated Reports</h2>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search reports..."
                className="pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 w-48"
              />
            </div>
            <button className="text-xs text-indigo-600 font-bold hover:underline">View All History</button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40 bg-white rounded-2xl border border-gray-100">
            <div className="w-7 h-7 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <RecentReportsTable reports={paginatedReports} onDownload={downloadReport} />
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">
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

      {/* Generate Report Modal */}
      {showModal && (
        <GenerateReportModal
          form={form}
          generating={generating}
          success={success}
          estimatedSize={estimatedSize}
          onClose={() => setShowModal(false)}
          onSetField={setField}
          onToggleSection={toggleSection}
          onGenerate={generate}
        />
      )}
    </div>
  );
};

export default ReportsPage;