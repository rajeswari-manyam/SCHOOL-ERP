import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReportCardGrid from "./components/Reportcardgrid";
import RecentReportsTable from "./components/Recentreportstable";
import { useReports } from "./hooks/useReports";
import { useAcademicYears } from "../../../components/common/hooks/useAcademicYears";
import type { ReportType } from "./types/reports.types";

const ReportsPage = () => {
  const navigate = useNavigate();
  const { years, activeYear, switchYear } = useAcademicYears();
  const yearIdx = years.findIndex((y) => y.id === activeYear?.id);

  const { data: recentData, isLoading } = useReports();

  const handleCardClick = (type: ReportType) => {
    if (type === "ATTENDANCE") {
      navigate("/schooladmin/reports/attendance");
    } else if (type === "STUDENT") {
      navigate("/schooladmin/reports/student");
    } else if (type === "FEE_COLLECTION") {
      navigate("/schooladmin/reports/fee-collection");
    } else if (type === "STAFF") {
      navigate("/schooladmin/reports/staff");
    } else {
      navigate(`/schooladmin/reports/generate?type=${type}`);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-base font-semibold text-gray-900">Reports</h1>
          <p className="text-xs text-gray-400 mt-0.5">Generate and download school reports</p>
        </div>

        {/* Academic Year picker */}
        <div className="flex items-center gap-1.5 border border-gray-200 rounded-xl px-3 py-2 bg-white shadow-sm">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-bold text-gray-700 mx-1">
            Academic Year {activeYear?.yearName ?? "—"}
          </span>
          <button
            onClick={() => yearIdx > 0 && switchYear(years[yearIdx - 1])}
            disabled={yearIdx <= 0}
            className="w-6 h-6 flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => yearIdx < years.length - 1 && switchYear(years[yearIdx + 1])}
            disabled={yearIdx >= years.length - 1}
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
        reports={recentData}
        loading={isLoading}
      />
    </div>
  );
};

export default ReportsPage;
