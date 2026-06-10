import { X, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "../../../../utils/formatters";
import { numberToWords } from "../../../../utils/number";

interface PayslipModalProps {
  staff: {
    name: string;
    role: string;
    basic: number;
    hra: number;
    transport: number;
    other: number;
    pfPercentage: number;
    professionalTax: number;
    gross: number;
    net: number;
    deductions?: number;
  };
  month: string;
  onClose: () => void;
}

export const PayslipModal = ({ staff, month, onClose }: PayslipModalProps) => {
  const pfAmount = Math.round((staff.basic * staff.pfPercentage) / 100);
  const totalDeductions = pfAmount + staff.professionalTax;
  const otherDeductions = staff.deductions
    ? Math.max(0, staff.deductions - totalDeductions)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm sm:p-4">
      <div className="bg-white rounded-t-xl sm:rounded-xl shadow-2xl w-full sm:max-w-lg flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/60 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-semibold text-gray-900 truncate">
              Payslip — {month}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable Content ── */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5 bg-white">
          {/* School Header */}
          <div className="text-center mb-4 sm:mb-5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#3525CD] rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-2">
              S
            </div>
            <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">
              School Name
            </h3>
            <p className="text-[9px] text-gray-400 mt-0.5">
              Address Line | Ph: +91 99999 12345
            </p>
          </div>

          {/* Payslip Title */}
          <div className="text-center mb-3 sm:mb-4 pb-3 border-b border-dashed border-gray-300">
            <h4 className="text-[10px] font-bold text-gray-800 uppercase tracking-widest">
              Salary Slip
            </h4>
            <div className="flex justify-center gap-3 mt-1">
              <p className="text-[9px] text-gray-400">
                Month: <span className="font-medium text-gray-600">{month}</span>
              </p>
            </div>
          </div>

          {/* Employee Details */}
          <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-1.5 mb-3 sm:mb-4 text-[11px]">
            <div>
              <span className="text-gray-400 block text-[9px] uppercase tracking-wide">Employee Name</span>
              <span className="font-semibold text-gray-900 truncate block">{staff.name}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[9px] uppercase tracking-wide">Role</span>
              <span className="font-semibold text-gray-900">{staff.role}</span>
            </div>
          </div>

          {/* Earnings */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3 text-[11px]">
            <h5 className="text-[9px] text-gray-400 uppercase tracking-wide mb-2 font-semibold">
              Earnings
            </h5>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-600">Basic</span>
                <span className="font-medium text-gray-900">{formatCurrency(staff.basic)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">HRA</span>
                <span className="font-medium text-gray-900">{formatCurrency(staff.hra)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transport Allowance</span>
                <span className="font-medium text-gray-900">{formatCurrency(staff.transport)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Other Allowances</span>
                <span className="font-medium text-gray-900">{formatCurrency(staff.other)}</span>
              </div>
              <div className="border-t border-gray-200 pt-1.5 flex justify-between font-semibold">
                <span className="text-gray-800">Gross Pay</span>
                <span className="text-gray-900">{formatCurrency(staff.gross)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3 text-[11px]">
            <h5 className="text-[9px] text-gray-400 uppercase tracking-wide mb-2 font-semibold">
              Deductions
            </h5>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-600">Provident Fund ({staff.pfPercentage}%)</span>
                <span className="font-medium text-gray-900">{formatCurrency(pfAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Professional Tax</span>
                <span className="font-medium text-gray-900">{formatCurrency(staff.professionalTax)}</span>
              </div>
              {otherDeductions > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Other Deductions</span>
                  <span className="font-medium text-gray-900">{formatCurrency(otherDeductions)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-1.5 flex justify-between font-semibold">
                <span className="text-red-600">Total Deductions</span>
                <span className="text-red-600">{formatCurrency(totalDeductions + otherDeductions)}</span>
              </div>
            </div>
          </div>

          {/* Net Pay */}
          <div className="bg-[#F5F3FF] rounded-lg p-3 mb-3 sm:mb-4 text-center">
            <p className="text-[9px] text-gray-400 uppercase tracking-wide mb-1">Net Pay</p>
            <p className="text-xl sm:text-2xl font-bold text-[#3525CD]">
              {formatCurrency(staff.net)}
            </p>
          </div>

          {/* Amount in Words */}
          <div className="mb-4 sm:mb-5">
            <p className="text-[9px] text-gray-400 uppercase tracking-wide mb-1">
              Amount in Words:
            </p>
            <p className="text-[11px] font-medium text-gray-800 italic break-words">
              {numberToWords(staff.net)}
            </p>
          </div>

          {/* Signatures */}
          <div className="flex justify-between items-end pt-3 border-t border-gray-200">
            <div className="min-w-0">
              <p className="text-[9px] text-gray-400 mb-0.5">Prepared By:</p>
              <p className="text-[11px] font-semibold text-gray-900 truncate">Accountant</p>
              <div className="w-20 sm:w-24 h-px bg-gray-300 mt-1" />
              <p className="text-[9px] text-gray-400 mt-3">Signature</p>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 border border-gray-300 rounded flex items-center justify-center text-[8px] text-gray-400">
                [SEAL]
              </div>
              <p className="text-[9px] text-gray-400 mt-1">Authorised Signatory</p>
            </div>
          </div>
        </div>

        {/* ── Footer Actions ── */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 border-t border-gray-100 shrink-0">
          <Button className="h-10 sm:h-9 text-xs bg-[#3525CD] hover:bg-[#2a1fb5] text-white gap-1.5">
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">Download</span>
          </Button>
          <Button variant="outline" className="h-10 sm:h-9 text-xs gap-1.5 border-gray-300 text-gray-700">
            <Printer className="w-3.5 h-3.5" />
            Print
          </Button>
        </div>
      </div>
    </div>
  );
};
