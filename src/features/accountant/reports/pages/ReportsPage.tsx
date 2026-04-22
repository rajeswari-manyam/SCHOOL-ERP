import { useState, useRef, useEffect } from "react";
import { ChevronRight, ChevronDown, Check } from "lucide-react";

import { ReportCard } from "../components/ReportCard";
import { GenerateReportModal } from "../components/GenerateReportModal";
import { RecentReportsTable } from "../components/RecentReportsTable";
import { useReports } from "../hooks/useReports";
import { useReportsStore } from "../store/useReportStore";
import { Outlet } from "react-router-dom";
import type { GenerateReportInput } from "../types/reports.types";
import { reportCards } from "../data/report.data";



const ACADEMIC_YEARS = ["2024-25", "2023-24", "2022-23", "2021-22", "2020-21"];



interface AcademicYearDropdownProps {
  value: string;
  onChange: (year: string) => void;
}

const AcademicYearDropdown = ({ value, onChange }: AcademicYearDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm text-sm font-medium text-gray-700 hover:border-[#3525CD] hover:text-[#3525CD] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3525CD]/20 min-w-[110px] cursor-pointer"
      >
        <span className="flex-1 text-left">{value}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-[130px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 overflow-hidden">
          {ACADEMIC_YEARS.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => {
                onChange(year);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors ${
                year === value
                  ? "bg-indigo-50 text-[#3525CD] font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>{year}</span>
              {year === value && <Check className="w-3.5 h-3.5 text-[#3525CD]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};



export default function ReportsPage() {
  type ReportCardItem = (typeof reportCards)[number];

  const [selectedReport, setSelectedReport] = useState<ReportCardItem | null>(null);

 
  const { academicYear, setAcademicYear } = useReportsStore();

  const { reports, generateReport } = useReports();

  const handleGenerate = (data: GenerateReportInput) => {
    if (!selectedReport) return;
    generateReport({
      reportType: selectedReport.id,
      asOfDate: data.asOfDate,
      classFilter: data.classFilter,
      minOverdue: data.minOverdue,
      format: data.format,
      includeColumns: data.includeColumns,
      sendTo: data.sendTo,
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-3 py-4 sm:p-6 space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-xs flex items-center gap-1.5 text-gray-400 mb-1">
                <span>Dashboard</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-600 font-medium">Reports</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Financial Reports</h1>
              <p className="text-sm text-gray-500">Generate and download financial reports</p>
            </div>

            {/* Academic Year */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-gray-400 uppercase tracking-wide hidden sm:inline">
                Academic Year
              </span>
              <AcademicYearDropdown value={academicYear} onChange={setAcademicYear} />
            </div>
          </div>

          {/* Report Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportCards.map((card) => (
              <ReportCard
                key={card.id}
                {...card}
                onGenerate={() => setSelectedReport(card)}
              />
            ))}
          </div>

          {/* Recent Reports Table */}
          <div className="overflow-x-auto">
            <RecentReportsTable data={reports} />
          </div>

          <Outlet />
        </div>
      </main>

      {/* Generate Modal */}
      {selectedReport && (
        <GenerateReportModal
          reportType={selectedReport.id}
          title={selectedReport.title}
          onClose={() => setSelectedReport(null)}
          onSubmit={handleGenerate}
        />
      )}
    </div>
  );
}