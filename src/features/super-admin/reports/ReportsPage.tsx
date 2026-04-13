import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReportCardGrid from "./components/ReportCardGrid";
import RecentReportsTable from "./components/RecentReportsTable";
import GenerateReportModal from "./components/GenerateReportModal";
import { useReports } from "./hooks/useReports";
import type { ReportType } from "./types/reports.types";
import { Button } from "@/components/ui/button";
const ReportsPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [preselectedType, setPreselectedType] = useState<ReportType | undefined>();

  const { data, isLoading } = useReports(page, 4);

  const handleCardClick = (type: ReportType) => {
    setPreselectedType(type);
    setModalOpen(true);
  };

  const handleGenerateClick = () => {
    setPreselectedType(undefined);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 min-h-full">

      

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate and download platform reports
          </p>
        </div>
        <Button
          onClick={handleGenerateClick}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm flex-shrink-0 self-start sm:self-auto"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Generate Report
        </Button>
      </div>

      {/* Report type cards */}
      <ReportCardGrid onGenerate={handleCardClick} />

      {/* Recent reports table */}
      <RecentReportsTable
        records={data?.data ?? []}
        isLoading={isLoading}
        total={data?.total ?? 0}
        page={page}
        pageSize={4}
        onPageChange={setPage}
        onViewAll={() => navigate("/super-admin/reports/history")}
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
