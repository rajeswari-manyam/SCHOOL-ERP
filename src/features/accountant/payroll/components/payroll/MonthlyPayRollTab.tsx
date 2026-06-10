import { Download, Printer, FileText, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBanner } from "./StatusBanner";
import { PayrollStats } from "./PayrollStats";
import { PayrollTable } from "./PayrollTable";
import type { MonthlyPayrollTabProps } from "../../types/payroll.types";

export const MonthlyPayrollTab = ({
  staffData,
  summary,
  isProcessed,
  processedDate,
  processedBy,
  onStartProcessing,
  onViewPayslip,
}: MonthlyPayrollTabProps) => {
  return (
    <div className="space-y-3 md:space-y-4 px-2 sm:px-0">
      {/* Status Banner */}
      <StatusBanner
        isProcessed={isProcessed}
        summary={summary}
        processedDate={processedDate}
        processedBy={processedBy}
        onStartProcessing={onStartProcessing}
      />

      {/* Stats */}
      <PayrollStats summary={summary} />

      {/* Payslip Distribution */}
      {isProcessed && (
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Payslip Distribution
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            Notify staff and download documentation for your records.
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="w-full sm:w-auto h-9 text-xs bg-green-500 hover:bg-green-600 text-white gap-2">
              <MessageCircle className="w-3.5 h-3.5" />
              Send via WhatsApp
            </Button>

            <Button variant="outline" className="w-full sm:w-auto h-9 text-xs gap-2">
              <Download className="w-3.5 h-3.5" />
              Download ZIP
            </Button>

            <Button variant="outline" className="w-full sm:w-auto h-9 text-xs gap-2 text-[#3525CD]">
              <FileText className="w-3.5 h-3.5" />
              View Payslips
            </Button>
          </div>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header (no border) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-3 sm:px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900">
              Staff Payroll — April 2025
            </h3>

            {!isProcessed && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-medium rounded-full">
                DRAFT
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded text-gray-500">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded text-gray-500">
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <PayrollTable data={staffData} isProcessed={isProcessed} onViewPayslip={onViewPayslip} />
          </div>
        </div>

        {/* Pagination (no border) */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-3 sm:px-4 py-3">
          <span className="text-xs text-gray-500">
            {staffData.length} staff members
          </span>

          <div className="flex flex-wrap gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400">
              ‹
            </button>

            <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white text-xs">
              1
            </button>

            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-xs">
              2
            </button>

            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};