import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import ReportCardGrid from "./components/Reportcardgrid";
import RecentReportsTable from "./components/Recentreportstable";
import GenerateReportModal from "./components/Generatereportmodal";
import { useRecentlyGeneratedReports } from "./hooks/useReports";
import type { ReportType } from "./types/reports.types";

const ACADEMIC_YEARS = ["2022-23", "2023-24", "2024-25", "2025-26"];

const ReportsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [preselectedType, setPreselectedType] = useState<ReportType | undefined>();
  const [yearIdx, setYearIdx] = useState(2);

  const { data: recentData, isLoading } = useRecentlyGeneratedReports();

  const handleCardClick = (type: ReportType) => {
    setPreselectedType(type);
    setModalOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <nav className="flex items-center gap-1 text-xs text-gray-400 mb-1.5">
            <span className="font-bold uppercase tracking-wider">Admin</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-bold uppercase tracking-wider text-indigo-600">Reports</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-400 mt-0.5">Generate and download school reports</p>
        </div>

        {/* Academic Year picker */}
        <div className="flex items-center gap-1.5 border border-gray-200 rounded-xl px-3 py-2 bg-white shadow-sm">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-bold text-gray-700 mx-1">
            Academic Year {ACADEMIC_YEARS[yearIdx]}
          </span>
          <button
            onClick={() => setYearIdx((i) => Math.max(0, i - 1))}
            disabled={yearIdx === 0}
            className="w-6 h-6 flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setYearIdx((i) => Math.min(ACADEMIC_YEARS.length - 1, i + 1))}
            disabled={yearIdx === ACADEMIC_YEARS.length - 1}
            className="w-6 h-6 flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Report type cards */}
      <ReportCardGrid onGenerate={handleCardClick} />

      {/* Recently generated */}
      <RecentReportsTable
        reports={recentData?.data}
        loading={isLoading}
      />

      {/* Generate modal */}
      <GenerateReportModal
        open={modalOpen}
        preselectedType={preselectedType}
        onClose={() => {
          setModalOpen(false);
          setPreselectedType(undefined);
        }}
      />
    </div>
  );
};

export default ReportsPage;
