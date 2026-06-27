import { useState } from "react";
import {
  Users, CheckCircle2, Clock, TrendingUp, Wallet, AlertCircle,
  Download, CreditCard, RefreshCw, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PayrollTable } from "./PayrollTable";
import { PaySalaryModal } from "./PaySalaryModal";
import { BulkPayModal } from "./BulkPayModal";

import { formatINR as formatCurrency } from "../../../../../utils/formatters";
import type {
  MonthlyPayrollTabProps, StaffPayroll, PaySalaryFormData,
} from "../../types/payroll.types";

export const MonthlyPayrollTab = ({
  staffData,
  summary,
  isProcessed,
  isLoading,
  processedDate,
  processedBy,
  onStartProcessing,
  onViewPayslip,
  onPaySalary,
  onPaySelected,
  onDeletePayslip,
  onGeneratePayslip,
}: MonthlyPayrollTabProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [payTarget,   setPayTarget]   = useState<StaffPayroll | null>(null);
  const [showBulkPay, setShowBulkPay] = useState(false);

  // ── Derived counts & amounts ──────────────────────────────────────────────
  const paidStaff    = staffData.filter((s) => s.status === "Paid");
  const pendingStaff = staffData.filter((s) => s.status === "Pending");
  const draftStaff   = staffData.filter((s) => s.status === "Draft");
  const paidAmount   = paidStaff.reduce((s, x) => s + x.net, 0);
  const remaining    = summary.totalNet - paidAmount;

  // ── Selection helpers ────────────────────────────────────────────────────
  const toggleSelect = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const selectAll = (checked: boolean) =>
    setSelectedIds(checked ? staffData.map((s) => s.id) : []);

  const selectedStaff = staffData.filter((s) => selectedIds.includes(s.id));

  // ── Pay handlers ──────────────────────────────────────────────────────────
  const handlePayConfirm = async (staffId: string, data: PaySalaryFormData) => {
    if (payTarget && onGeneratePayslip) {
      return await onGeneratePayslip(payTarget, data.bonus, data.overtime, data.extraClass);
    } else {
      onPaySalary(staffId, data);
    }
  };

  const handleBulkPayConfirm = (ids: string[], data: PaySalaryFormData) => {
    onPaySelected(ids, data);
    setSelectedIds([]);
    setShowBulkPay(false);
  };

  // ── 6 mini KPI cards ──────────────────────────────────────────────────────
  const kpis = [
    {
      label: "Total Staff",
      value: String(summary.totalStaff),
      sub: "on payroll",
      icon: <Users className="w-3.5 h-3.5" />,
      bg: "bg-white", txt: "text-slate-800", iconCls: "bg-slate-100 text-slate-600",
    },
    {
      label: "Paid",
      value: String(paidStaff.length),
      sub: `of ${summary.totalStaff} staff`,
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      bg: "bg-white", txt: "text-emerald-700", iconCls: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Pending",
      value: String(pendingStaff.length),
      sub: "awaiting payment",
      icon: <Clock className="w-3.5 h-3.5" />,
      bg: "bg-white", txt: "text-amber-700", iconCls: "bg-amber-100 text-amber-600",
    },
    {
      label: "Total Payroll",
      value: formatCurrency(summary.totalNet),
      sub: "net payable",
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      bg: "bg-white", txt: "text-[#3525CD]", iconCls: "bg-[#EEF2FF] text-[#3525CD]",
    },
    {
      label: "Paid Amount",
      value: formatCurrency(paidAmount),
      sub: "disbursed",
      icon: <Wallet className="w-3.5 h-3.5" />,
      bg: "bg-white", txt: "text-green-700", iconCls: "bg-green-100 text-green-600",
    },
    {
      label: "Remaining",
      value: formatCurrency(remaining),
      sub: "to disburse",
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      bg: "bg-white", txt: remaining > 0 ? "text-rose-700" : "text-slate-400",
      iconCls: remaining > 0 ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-400",
    },
  ];

  return (
    <div className="space-y-4">

      {/* ── Status Banner ────────────────────────────────────────────────────── */}
      {!isProcessed ? (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
          <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800">Payroll Not Generated</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Click "Generate Payroll" to calculate salaries and move all staff to Pending status before processing individual payments.
            </p>
          </div>
          <Button
            size="sm"
            className="shrink-0 h-8 text-xs bg-[#3525CD] hover:bg-[#2a1fb5] text-white px-3 gap-1.5"
            onClick={onStartProcessing}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Generate Payroll
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <p className="text-xs text-emerald-700 flex-1">
            Payroll generated on <strong>{processedDate}</strong> by {processedBy} ·{" "}
            <strong>{paidStaff.length}/{summary.totalStaff}</strong> payments completed
          </p>
          {draftStaff.length === 0 && pendingStaff.length === 0 && (
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
              All Paid ✓
            </span>
          )}
        </div>
      )}

      {/* ── 6 Mini KPI Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {kpis.map((k) => (
          <div key={k.label} className={`${k.bg} rounded-xl px-3 py-3 border border-slate-100 shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide leading-tight">
                {k.label}
              </p>
              <div className={`w-6 h-6 rounded-md ${k.iconCls} flex items-center justify-center shrink-0`}>
                {k.icon}
              </div>
            </div>
            <p className={`text-sm font-bold ${k.txt} leading-none truncate`}>{k.value}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Table Card ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">

        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Staff Payroll — {summary.month} {summary.year}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {staffData.length} staff members · individual salary processing
            </p>
          </div>
          <button
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors self-start sm:self-auto"
            title="Download payroll report"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Bulk Action Bar (shown when rows are selected) */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 px-5 py-3 bg-[#EEF2FF] border-b border-[#3525CD]/10">
            <span className="text-xs font-semibold text-[#3525CD]">
              {selectedIds.length} selected
            </span>
            <div className="flex flex-wrap gap-2 ml-auto">
              <Button
                size="sm"
                className="h-8 text-xs bg-[#3525CD] hover:bg-[#2a1fb5] text-white gap-1.5"
                onClick={() => setShowBulkPay(true)}
              >
                <CreditCard className="w-3.5 h-3.5" />
                Pay Selected ({selectedIds.length})
              </Button>
              <button
                onClick={() => setSelectedIds([])}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors px-1"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading payroll data…</span>
          </div>
        ) : (
          <PayrollTable
            data={staffData}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onSelectAll={selectAll}
            onPaySalary={setPayTarget}
            onViewPayslip={onViewPayslip}
            onEdit={setPayTarget}
            onDelete={onDeletePayslip}
          />
        )}

        {/* Card Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 bg-slate-50/60 border-t border-slate-100">
          <div className="flex items-center gap-4 text-xs">
            {paidStaff.length > 0 && (
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {paidStaff.length} Paid
              </span>
            )}
            {pendingStaff.length > 0 && (
              <span className="flex items-center gap-1 text-amber-600">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {pendingStaff.length} Pending
              </span>
            )}
            {draftStaff.length > 0 && (
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                {draftStaff.length} Draft
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {["‹", "1", "›"].map((label, i) => (
              <button
                key={i}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-colors ${
                  label === "1" ? "bg-[#3525CD] text-white" : "hover:bg-slate-200 text-slate-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pay Salary Modal (single employee) ─────────────────────────────── */}
      {payTarget && (
        <PaySalaryModal
          staff={payTarget}
          onClose={() => setPayTarget(null)}
          onPay={handlePayConfirm}
        />
      )}

      {/* ── Bulk Pay Modal ──────────────────────────────────────────────────── */}
      {showBulkPay && selectedStaff.length > 0 && (
        <BulkPayModal
          staff={selectedStaff}
          onClose={() => setShowBulkPay(false)}
          onPay={handleBulkPayConfirm}
        />
      )}

    </div>
  );
};
