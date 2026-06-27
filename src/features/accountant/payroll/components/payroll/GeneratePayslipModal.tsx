import { useState } from "react";
import { X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/utils/formatters";
import type { StaffPayroll } from "../../types/payroll.types";

interface Props {
  staff: StaffPayroll;
  monthLabel: string;
  onClose: () => void;
  onGenerate: (bonus: number, overtime: number, extraClass: number) => Promise<void>;
}

export function GeneratePayslipModal({ staff, monthLabel, onClose, onGenerate }: Props) {
  const [bonus,      setBonus]      = useState(0);
  const [overtime,   setOvertime]   = useState(0);
  const [extraClass, setExtraClass] = useState(0);
  const [loading,    setLoading]    = useState(false);

  const totalEarnings    = bonus + overtime + extraClass;
  const estimatedGross   = staff.gross + totalEarnings;
  const estimatedNet     = estimatedGross - staff.deductions;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onGenerate(bonus, overtime, extraClass);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg " +
    "focus:outline-none focus:ring-2 focus:ring-[#3525CD]/20 focus:border-[#3525CD] " +
    "text-right bg-white";

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm px-2 sm:px-4">
      <div className="bg-white rounded-t-xl md:rounded-xl shadow-2xl w-full max-w-[460px] max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b border-slate-100 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold shrink-0">
              {staff.initials}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Generate Payslip</h2>
              <p className="text-[11px] text-slate-400">{staff.name} · {staff.role} · {monthLabel}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">

          {/* Base salary info */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Base Gross",  value: formatINR(staff.gross),      cls: "text-emerald-700 font-semibold" },
              { label: "Deductions",  value: formatINR(staff.deductions),  cls: "text-rose-600" },
            ].map(({ label, value, cls }) => (
              <div key={label} className="bg-slate-50 rounded-xl px-3 py-2.5">
                <p className="text-[10px] text-slate-400 font-medium">{label}</p>
                <p className={`text-xs mt-0.5 ${cls}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Earnings additions */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Additional Earnings
            </p>
            <div className="space-y-2">
              {([
                { label: "Bonus",               value: bonus,      setter: setBonus },
                { label: "Overtime",            value: overtime,   setter: setOvertime },
                { label: "Extra Class Payment", value: extraClass, setter: setExtraClass },
              ] as const).map(({ label, value, setter }) => (
                <div key={label} className="flex items-center gap-3">
                  <label className="text-xs font-medium text-slate-600 w-44 shrink-0">{label}</label>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">₹</span>
                    <input
                      type="number" min="0" value={value}
                      onChange={(e) => setter(Math.max(0, Number(e.target.value)))}
                      className={`${inputCls} pl-7`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estimated Net Salary */}
          <div className="bg-gradient-to-r from-[#3525CD] to-indigo-500 rounded-xl px-4 py-3.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-white/70 font-medium">Estimated Net Salary</p>
              <p className="text-2xl font-bold text-white">{formatINR(estimatedNet)}</p>
              <p className="text-[10px] text-white/50 mt-0.5">Gross {formatINR(estimatedGross)} − Deductions {formatINR(staff.deductions)}</p>
            </div>
            {totalEarnings > 0 && (
              <div className="text-right">
                <p className="text-[10px] text-white/60 mb-0.5">Extra Earnings</p>
                <p className="text-sm font-bold text-emerald-300">+{formatINR(totalEarnings)}</p>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-5 py-4 flex gap-2.5">
          <Button variant="outline" onClick={onClose} className="flex-1 border-slate-200">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#3525CD] hover:bg-[#2a1fb5] text-white gap-2 disabled:opacity-60"
          >
            {loading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <FileText className="w-4 h-4" />}
            Generate Payslip
          </Button>
        </div>
      </div>
    </div>
  );
}
