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
}: MonthlyPayrollTabProps) => {
  return (
    <div className="space-y-4">
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

      {/* Payslip Distribution — shown after processing */}
      {isProcessed && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Payslip Distribution
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            Notify staff and download documentation for your records.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              className="h-8 text-xs bg-green-500 hover:bg-green-600 text-white gap-2"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Send All Payslips via WhatsApp
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-2">
              <Download className="w-3.5 h-3.5" />
              Download All Payslips ZIP
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-2 text-[#3525CD]"
            >
              <FileText className="w-3.5 h-3.5" />
              View Individual Payslips
            </Button>
          </div>
        </div>
      )}

      {/* Staff Payroll Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900">
              Staff Payroll — April 2025
            </h3>
            {!isProcessed && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-medium rounded-full">
                DRAFT — NOT PROCESSED
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400">
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        <PayrollTable data={staffData} isProcessed={isProcessed} />

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <span className="text-xs text-gray-500">
            Showing {staffData.length} of {staffData.length} staff members
          </span>
          <div className="flex gap-1">
            <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50">
              ‹
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded bg-blue-600 text-white text-xs">
              1
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs">
              2
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};