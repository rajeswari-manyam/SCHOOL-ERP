import { useState } from "react";
import { useReports, useGenerateReport } from "../hooks/useReports";
import ReportStatCards from "../components/Reportstatcards";
import ReportCardGrid from "../components/Reportcardgrid";
import RecentReportsTable from "../components/Recentreportstable";
import GenerateReportModal from "../components/Generatereportmodal";
import Pagination from "../components/Pagination";
import type { ReportType } from "../types/reports.types";
import { ACADEMIC_YEARS } from "../utils/Report config";

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
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span className="font-semibold uppercase tracking-wider text-indigo-600">Reports</span>
          </nav>
          <h1 className="text-2xl font-extrabold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-400 mt-0.5">Generate and download school reports</p>
        </div>

        {/* Academic Year Picker */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white shadow-sm">
          <svg width="14" height="14" className="text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="text-xs font-bold text-gray-700">Academic Year {academicYear}</span>
          <div className="flex gap-1">
            <button
              onClick={() => {
                const idx = ACADEMIC_YEARS.indexOf(academicYear);
                if (idx < ACADEMIC_YEARS.length - 1) setAcademicYear(ACADEMIC_YEARS[idx + 1]);
              }}
              className="w-5 h-5 rounded flex items-center justify-center hover:bg-gray-100 text-gray-400"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={() => {
                const idx = ACADEMIC_YEARS.indexOf(academicYear);
                if (idx > 0) setAcademicYear(ACADEMIC_YEARS[idx - 1]);
              }}
              className="w-5 h-5 rounded flex items-center justify-center hover:bg-gray-100 text-gray-400"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
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
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
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