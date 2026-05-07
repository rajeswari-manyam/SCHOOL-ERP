import { Plus, Save, FileText, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SalaryTable } from "./SalaryTable";
import { EditSalaryModal } from "./EditSalaryModal";
import { formatCurrency } from "../../../../../utils/formatters";

import typography from "@/styles/typography";
import type { SalaryConfigTabProps } from "../../types/payroll.types";

export const SalaryConfigTab = ({
  salaryData,
  isEditing,
  selectedStaff,
  onEdit,
  onClose,
  onSave,
  onAdd,
}: SalaryConfigTabProps) => {
  const totalGross = salaryData.reduce((sum, s) => sum + s.gross, 0);
  const totalNet = salaryData.reduce((sum, s) => sum + s.net, 0);

  return (
    <div className="space-y-4 pb-20 sm:pb-0">

      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white rounded-lg p-3 sm:p-4 border border-gray-200 hover:border-[#3525CD] transition-colors">
        <div className="min-w-0">
          <h3 className={`${typography.heading.h6} font-bold text-gray-900 text-sm sm:text-base`}>
            Staff Salary Configuration
          </h3>
          <p className={`${typography.body.small} text-gray-500 text-xs sm:text-sm`}>
            Effective from June 2024
          </p>
        </div>

        {/* Desktop buttons */}
        <div className="hidden sm:flex gap-2 items-center">
          <Button
            onClick={onAdd}
            variant="outline"
            className="h-9 text-xs gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Staff
          </Button>

          <Button className="h-9 text-xs bg-[#3525CD] text-white gap-2">
            <Save className="w-4 h-4" />
            Save
          </Button>
          <button className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
            <FileText className="w-3.5 h-3.5" />
            View Audit Log
          </button>
        </div>

        {/* Mobile: Audit log only in header */}
        <div className="sm:hidden flex justify-between items-center">
          <button className="text-xs text-blue-600 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            View Audit Log
          </button>
        </div>
      </div>

      {/* TABLE BLOCK */}
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#3525CD] transition-colors">

        {/* TABLE */}
        <div className="w-full overflow-x-auto no-scrollbar">
          <SalaryTable data={salaryData} onEdit={onEdit} />
        </div>

        {/* TOTALS */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50">
          <div className="text-center">
            <p className={`${typography.body.small} text-gray-500 uppercase mb-1 text-[10px] sm:text-xs`}>
              Total Monthly Gross
            </p>
            <p className="text-sm sm:text-base font-bold text-gray-900">
              {formatCurrency(totalGross)}
            </p>
          </div>

          <div className="text-center">
            <p className={`${typography.body.small} text-gray-500 uppercase mb-1 text-[10px] sm:text-xs`}>
              Total Net Payable
            </p>
            <p className="text-sm sm:text-base font-bold text-[#3525CD]">
              {formatCurrency(totalNet)}
            </p>
          </div>
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 hover:border-[#3525CD] hover:shadow-md transition-all duration-200">
          <div className="flex gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <h4 className={`${typography.body.small} font-semibold text-gray-900 text-xs sm:text-sm`}>
                Tax Compliance
              </h4>
              <p className={`${typography.body.small} text-gray-500 mt-1 text-[11px] sm:text-xs`}>
                PF & PT follow 2024-25 Telangana rules.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 hover:border-[#3525CD] hover:shadow-md transition-all duration-200">
          <div className="flex gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <h4 className={`${typography.body.small} font-semibold text-gray-900 text-xs sm:text-sm`}>
                Increment Cycle
              </h4>
              <p className={`${typography.body.small} text-gray-500 mt-1 text-[11px] sm:text-xs`}>
                Next cycle: June 1, 2025.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#3525CD] to-[#4f46e5] rounded-lg p-3 sm:p-4 text-white hover:shadow-lg transition-all duration-200">
          <h4 className={`${typography.body.small} font-semibold mb-1 text-xs sm:text-sm`}>
            Need Assistance?
          </h4>
          <p className={`${typography.body.small} text-white/80 mb-3 text-[11px] sm:text-xs`}>
            Contact admin for approvals.
          </p>
          <Button className="h-7 sm:h-8 text-xs bg-white text-[#3525CD] w-full">
            Contact Admin
          </Button>
        </div>

      </div>

      {/* MOBILE ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex gap-2 sm:hidden z-50 shadow-lg">
        <Button 
          onClick={onAdd}
          variant="outline"
          className="flex-1 h-10 text-xs gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Staff
        </Button>
        <Button 
          className="flex-1 h-10 text-xs bg-[#3525CD] text-white gap-1"
        >
          <Save className="w-4 h-4" />
          Save
        </Button>
      </div>

      {/* MODAL */}
      {isEditing && (
        <EditSalaryModal
          staff={selectedStaff}
          onClose={onClose}
          onSave={onSave}
        />
      )}
    </div>
  );
};