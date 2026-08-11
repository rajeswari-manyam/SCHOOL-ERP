import { useNavigate } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SalaryTable } from "./SalaryTable";
import { EditSalaryModal } from "./EditSalaryModal";
import type { SalaryConfigTabProps } from "../../types/payroll.types";

export const SalaryConfigTab = ({
  salaryData,
  isLoading,
  isEditing,
  selectedStaff,
  onEdit,
  onClose,
  onSave,
  onDelete,
}: SalaryConfigTabProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-5 pb-20 sm:pb-0">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Staff Salary Configuration</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {salaryData.length} staff configured
          </p>
        </div>
        <div className="hidden sm:flex gap-2 items-center">
          <Button
            onClick={() => navigate("/accountant/payroll/salary/add")}
            variant="outline"
            className="h-9 text-xs gap-2 border-slate-200"
          >
            <Plus className="w-4 h-4" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Staff Salary Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h4 className="text-sm font-semibold text-slate-800">Staff Salary Details</h4>
          {isLoading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
            : <span className="text-[11px] text-slate-400">{salaryData.length} records</span>
          }
        </div>
        <div className="w-full overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading salary data…</span>
            </div>
          ) : (
            <SalaryTable data={salaryData} onEdit={onEdit} onDelete={onDelete} />
          )}
        </div>
      </div>

      {/* Mobile Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex gap-2 sm:hidden z-50 shadow-lg">
        <Button
          onClick={() => navigate("/accountant/payroll/salary/add")}
          variant="outline"
          className="flex-1 h-10 text-xs gap-1 border-slate-200"
        >
          <Plus className="w-4 h-4" />
          Add Staff
        </Button>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <EditSalaryModal staff={selectedStaff} onClose={onClose} onSave={onSave} />
      )}
    </div>
  );
};
