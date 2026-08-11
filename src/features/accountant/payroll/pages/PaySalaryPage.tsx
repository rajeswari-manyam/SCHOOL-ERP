import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CreditCard, Loader2, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatINR as formatCurrency } from "@/utils/formatters";
import { useMonthlyPayrollData } from "../hooks/usePayrolls";
import type { StaffPayroll, PaySalaryFormData, PayslipResult } from "../types/payroll.types";

const PAYMENT_METHODS = ["Bank Transfer", "Cash", "UPI", "Cheque"] as const;

const ADJUSTMENTS: { key: keyof Pick<PaySalaryFormData, "bonus" | "overtime" | "extraClass">; label: string }[] = [
  { key: "bonus",      label: "Bonus" },
  { key: "overtime",   label: "Overtime" },
  { key: "extraClass", label: "Extra Class Payment" },
];

export default function PaySalaryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as { staff?: StaffPayroll; month?: number; year?: number } | null;
  const staff = state?.staff ?? null;
  const now = new Date();
  const month = state?.month ?? now.getMonth() + 1;
  const year  = state?.year  ?? now.getFullYear();

  const { generatePayslip } = useMonthlyPayrollData(month, year);

  const goBack = () => navigate("/accountant/payroll", { state: { activeTab: "monthly" } });

  const today   = new Date().toISOString().split("T")[0];
  const isDraft = staff?.status === "Draft";

  const [form, setForm] = useState<PaySalaryFormData>({
    bonus:           0,
    overtime:        0,
    extraClass:      0,
    leaveDeductions: 0,
    otherDeductions: 0,
    paymentMethod:   "Bank Transfer",
    paymentDate:     today,
    remarks:         "",
  });
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<PayslipResult | null>(null);

  const set = <K extends keyof PaySalaryFormData>(key: K, val: PaySalaryFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  if (!staff) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <button onClick={goBack} className="hover:text-gray-600 transition-colors">
            Payroll Management
          </button>
          <span>›</span>
          <span className="text-gray-700 font-semibold">Pay Salary</span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-sm text-slate-500">
          No staff selected. Please go back and choose a staff member to pay.
          <div className="mt-4">
            <Button onClick={goBack} variant="outline">Back to Payroll</Button>
          </div>
        </div>
      </div>
    );
  }

  const earningsAdj = form.bonus + form.overtime + form.extraClass;
  const adjustments = earningsAdj - form.otherDeductions;
  const previewNet  = staff.gross + adjustments - staff.deductions;

  const handleSubmit = async () => {
    if (!form.paymentDate) return;
    setLoading(true);
    try {
      const res = await generatePayslip(staff, form.bonus, form.overtime, form.extraClass);
      setResult(res);
    } catch {
      // error already shown via toast
    } finally {
      setLoading(false);
    }
  };

  const numCls =
    "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525CD]/20 focus:border-[#3525CD] text-right bg-white";
  const labelCls = "text-xs font-medium text-slate-600 sm:w-44 shrink-0";

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <button onClick={goBack} className="hover:text-gray-600 transition-colors">
          Payroll Management
        </button>
        <span>›</span>
        <span className="text-gray-700 font-semibold">{result ? "Payslip Generated" : "Pay Salary"}</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
              result ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"
            }`}>
              {result ? <CheckCircle2 className="w-5 h-5" /> : staff.initials}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                {result ? "Payslip Generated" : "Pay Salary"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">{staff.name} · {staff.role}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={goBack}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Banners */}
        {isDraft && !result && (
          <div className="mx-5 sm:mx-6 mt-4 flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
            <Info className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-blue-700 leading-relaxed">
              Attendance &amp; deductions are <strong>auto-calculated</strong> from records.
              Actual values appear after clicking "Confirm Payment".
            </p>
          </div>
        )}
        {result && (
          <div className="mx-5 sm:mx-6 mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <p className="text-[11px] text-emerald-700 font-medium">
              Payslip generated — status: <strong>Pending</strong>
            </p>
          </div>
        )}

        <div className="px-5 sm:px-6 py-5 space-y-5">

          {/* ── Attendance + Base Gross cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Present */}
            <div className={`rounded-xl px-3 py-2.5 ${result ? "bg-emerald-50 border border-emerald-100" : "bg-slate-50"}`}>
              <p className="text-[10px] text-slate-400 font-medium">Present</p>
              {result
                ? <p className="text-sm font-bold text-emerald-700 mt-0.5">{result.presentDays} days</p>
                : isDraft
                  ? <p className="text-xs mt-0.5 text-blue-500 font-medium">Auto</p>
                  : <p className="text-xs mt-0.5 text-slate-700">{staff.present} days</p>
              }
            </div>

            {/* Absent */}
            <div className={`rounded-xl px-3 py-2.5 ${result ? "bg-rose-50 border border-rose-100" : "bg-slate-50"}`}>
              <p className="text-[10px] text-slate-400 font-medium">Absent</p>
              {result
                ? <p className="text-sm font-bold text-rose-600 mt-0.5">{result.absentDays} days</p>
                : isDraft
                  ? <p className="text-xs mt-0.5 text-blue-500 font-medium">Auto</p>
                  : <p className={`text-xs mt-0.5 ${staff.absent > 0 ? "text-rose-600" : "text-slate-700"}`}>{staff.absent} days</p>
              }
            </div>

            {/* Base Gross */}
            <div className="bg-slate-50 rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-slate-400 font-medium">Base Gross</p>
              <p className="text-xs mt-0.5 text-emerald-700 font-semibold">{formatCurrency(staff.gross)}</p>
            </div>
          </div>

          {/* ── Earnings Adjustments ── */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Earnings Adjustments</p>
            <div className="space-y-2">
              {ADJUSTMENTS.map(({ key, label }) => (
                <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                  <label className={labelCls}>{label}</label>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">₹</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={form[key] === 0 ? "" : form[key]}
                      onChange={(e) => {
                        const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
                        set(key, isNaN(n) ? 0 : n);
                      }}
                      disabled={!!result}
                      className={`${numCls} pl-7 ${result ? "bg-slate-50 text-slate-500" : ""}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Deductions ── */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Deductions</p>
            <div className="space-y-2">
              {/* Statutory */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                <label className={labelCls}>Statutory (PF + PT)</label>
                <div className="flex-1 px-3 py-2 text-sm text-right font-medium bg-rose-50 rounded-lg border border-rose-100 text-rose-600">
                  {isDraft && !result ? "Auto" : formatCurrency(result ? result.totalDeductions : staff.deductions)}
                </div>
              </div>
              {/* Leave */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                <label className={labelCls}>Leave Deductions</label>
                <div className="flex-1 px-3 py-2 text-sm text-right font-medium bg-rose-50 rounded-lg border border-rose-100 text-rose-600">
                  {isDraft && !result ? "Auto" : formatCurrency(staff.leaveDeductions)}
                </div>
              </div>
              {/* Other */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                <label className={labelCls}>Other Deductions</label>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">₹</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={form.otherDeductions === 0 ? "" : form.otherDeductions}
                    onChange={(e) => {
                      const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
                      set("otherDeductions", isNaN(n) ? 0 : n);
                    }}
                    disabled={!!result}
                    className={`${numCls} pl-7 text-rose-600 ${result ? "bg-slate-50" : ""}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Net Salary banner ── */}
          <div className="bg-gradient-to-r from-[#3525CD] to-indigo-500 rounded-xl px-4 py-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[11px] text-white/70 font-medium">
                  {result ? "Net Salary (Pending)" : isDraft ? "Estimated Net Salary" : "Final Net Salary"}
                </p>
                <p className="text-2xl font-bold text-white">
                  {result
                    ? formatCurrency(result.netSalary)
                    : `${isDraft ? "~" : ""}${formatCurrency(previewNet)}`
                  }
                </p>
              </div>
              {result && (
                <div className="text-right text-white/80 text-xs space-y-0.5">
                  <p>Gross: {formatCurrency(result.grossSalary)}</p>
                  <p className="text-rose-300">Deductions: {formatCurrency(result.totalDeductions)}</p>
                </div>
              )}
              {!result && adjustments !== 0 && (
                <div className="text-right">
                  <p className="text-[10px] text-white/60 mb-0.5">Adjustments</p>
                  <p className={`text-sm font-bold ${adjustments > 0 ? "text-emerald-300" : "text-rose-300"}`}>
                    {adjustments > 0 ? "+" : ""}{formatCurrency(adjustments)}
                  </p>
                </div>
              )}
            </div>
            {isDraft && !result && (
              <p className="text-[10px] text-white/50 mt-1.5">
                * Actual values calculated from attendance when payslip is generated
              </p>
            )}
          </div>

          {/* Payment Details — hidden after generation */}
          {!result && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Payment Details</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => set("paymentMethod", e.target.value as PaySalaryFormData["paymentMethod"])}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525CD]/20 focus:border-[#3525CD]"
                  >
                    {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">
                    Payment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.paymentDate}
                    onChange={(e) => set("paymentDate", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525CD]/20 focus:border-[#3525CD]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">Remarks</label>
                  <textarea
                    rows={2}
                    value={form.remarks}
                    onChange={(e) => set("remarks", e.target.value)}
                    placeholder="Optional notes..."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525CD]/20 focus:border-[#3525CD] resize-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-1">
            {result ? (
              <Button
                onClick={goBack}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Done
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={goBack} className="w-full sm:w-auto border-slate-200">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !form.paymentDate}
                  className="w-full sm:w-auto bg-[#3525CD] hover:bg-[#2a1fb5] text-white gap-2 disabled:opacity-60"
                >
                  {loading
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <CreditCard className="w-4 h-4" />}
                  Confirm Payment
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
