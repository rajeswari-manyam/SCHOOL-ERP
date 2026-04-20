// pages/ReportsPage.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileText } from "lucide-react";

import { ReportCard } from "../components/ReportCard";
import { GenerateReportModal } from "../components/GenarateReportModal";
import { RecentReportsTable } from "../components/ReportTable";
import { useReports } from "../hooks/useReports";
import type { ReportType, ReportFormat } from "../types/reports.types";
import { Outlet } from "react-router-dom";


import { reportCards } from "../data/report.data";
import typography from "@/styles/typography";

export default function ReportsPage() {
type ReportCardItem = (typeof reportCards)[number];

const [selectedReport, setSelectedReport] = useState<ReportCardItem | null>(null);
  const { reports, generateReport } = useReports();

 const handleGenerate = (format: ReportFormat) => {
  if (!selectedReport) return;

  generateReport({
    asOfDate: new Date().toISOString().split("T")[0],
    classFilter: "all",
    minOverdue: "15+ Days",
    format,
    includeColumns: {
      studentName: true,
      parentContact: true,
      overdueAmount: true,
      daysOverdue: true,
      feeBreakdown: true,
    },
    sendTo: {
      myEmail: true,
      principal: false,
    },
  });
};
  return (
    <div className="flex min-h-screen bg-gray-50/50">

      
     <main className="flex-1 overflow-y-auto">
<div className="max-w-7xl mx-auto px-3 py-4 sm:p-6 space-y-6">
          {/* Header */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className={`${typography.body.xs} flex items-center gap-1.5 text-gray-400 mb-1`}>
                <span>Dashboard</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-600 font-medium">Reports</span>
              </div>
              <h1 className={`${typography.heading.h5} font-bold text-gray-900`}>Financial Reports</h1>
              <p className={`${typography.body.xs} text-gray-500`}>Generate and download financial reports</p>
            </div>
            
           <div className="flex items-center justify-between sm:justify-end gap-2">
              <span className={`${typography.body.small} text-gray-500 uppercase tracking-wide hidden md:inline`}>Academic Year</span>
              <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                <span className={`${typography.body.small} font-medium text-gray-700`}>2024-25</span>
              </div>
            </div>
          </div>

          {/* Report Cards Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportCards.map((card) => (
              <ReportCard
                key={card.id}
                {...card}
                onGenerate={() => setSelectedReport(card)}
              />
            ))}
          </div>

          {/* Generate Statement Button */}
          <div className="flex justify-center sm:justify-start">
        <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <FileText className="w-4 h-4" />
              Generate Statement
            </Button>
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