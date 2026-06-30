import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import ReportCardGrid from "./components/Reportcardgrid";
import RecentReportsTable from "./components/Recentreportstable";
import GenerateReportModal from "./components/Generatereportmodal";
import AttendanceReportForm from "./components/AttendanceReportForm";
import StudentReportForm from "./components/StudentReportForm";
import FeeCollectionReportForm from "./components/FeeCollectionReportForm";
import { useReports } from "./hooks/useReports";
import { useAcademicYears } from "../../../components/common/hooks/useAcademicYears";
import type { ReportType } from "./types/reports.types";

const ReportsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [preselectedType, setPreselectedType] = useState<ReportType | undefined>();
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen]           = useState(false);
  const [feeCollectionModalOpen, setFeeCollectionModalOpen] = useState(false);
  const { years, activeYear, switchYear } = useAcademicYears();
  const yearIdx = years.findIndex((y) => y.id === activeYear?.id);

  const { data: recentData, isLoading } = useReports();

  const handleCardClick = (type: ReportType) => {
    if (type === "ATTENDANCE") {
      setAttendanceModalOpen(true);
    } else if (type === "STUDENT") {
      setStudentModalOpen(true);
    } else if (type === "FEE_COLLECTION") {
      setFeeCollectionModalOpen(true);
    } else {
      setPreselectedType(type);
      setModalOpen(true);
    }
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
          <h1 className="text-xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-400 mt-0.5">Generate and download school reports</p>
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

      {/* Generate modal (non-attendance) */}
      <GenerateReportModal
        open={modalOpen}
        preselectedType={preselectedType}
        onClose={() => {
          setModalOpen(false);
          setPreselectedType(undefined);
        }}
      />

      {/* Attendance report form */}
      <AttendanceReportForm
        open={attendanceModalOpen}
        onClose={() => setAttendanceModalOpen(false)}
      />

      {/* Student report form */}
      <StudentReportForm
        open={studentModalOpen}
        onClose={() => setStudentModalOpen(false)}
      />

      {/* Fee collection report form */}
      <FeeCollectionReportForm
        open={feeCollectionModalOpen}
        onClose={() => setFeeCollectionModalOpen(false)}
      />
    </div>
  );
};

export default ReportsPage;
