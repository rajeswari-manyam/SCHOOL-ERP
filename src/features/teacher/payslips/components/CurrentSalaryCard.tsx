import { Calendar, Download, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Payslip } from "../types/payslip.types";

const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN");

interface Props {
  payslip: Payslip;
  onDownload: () => void;
  onWhatsApp: () => void;
}

const StatusBadge = ({ status }: { status: Payslip["status"] }) => {
  const cfg = {
    PAID:       { label: "Paid",       classes: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
    PENDING:    { label: "Pending",    classes: "bg-amber-50 text-amber-700 border border-amber-200" },
    PROCESSING: { label: "Processing", classes: "bg-blue-50 text-blue-700 border border-blue-200" },
  }[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
};

const CurrentSalaryCard = ({ payslip, onDownload, onWhatsApp }: Props) => {
  const att = payslip.attendance;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* Header row */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">
            Current Month Salary
          </p>
          <p className="text-base font-extrabold text-gray-900">{payslip.monthLabel}</p>
        </div>
        <StatusBadge status={payslip.status} />
      </div>

      {/* Gross / Deductions / Net — two-column layout */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* Left column */}
        <div className="flex flex-col gap-3">
          <div className="bg-gray-50 rounded-xl p-3.5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">Gross Salary</p>
            <p className="text-xl font-extrabold text-gray-800">{inr(payslip.grossSalary)}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3.5 border border-red-100">
            <p className="text-[11px] font-bold uppercase tracking-widest text-red-400 mb-1">Total Deductions</p>
            <p className="text-xl font-extrabold text-red-600">- {inr(payslip.totalDeductions)}</p>
          </div>
        </div>

        {/* Right column — large net pay */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-xl p-4 flex flex-col justify-between">
          <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-200">Net Pay</p>
          <div>
            <p className="text-3xl font-extrabold text-white leading-tight">{inr(payslip.netSalary)}</p>
            <p className="text-[11px] text-indigo-200 mt-1">Credited to {payslip.bankAccount}</p>
          </div>
        </div>
      </div>

      {/* Attendance info row */}
      <div className="flex items-center gap-2 flex-wrap bg-gray-50 rounded-xl px-4 py-3 mb-5">
        <Calendar size={13} className="text-gray-500" strokeWidth={2} />
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mr-2">Attendance</span>
        {[
          { label: "Working",  val: att.workingDays,  color: "text-gray-600" },
          { label: "Present",  val: att.presentDays,  color: "text-emerald-600" },
          { label: "Absent",   val: att.absentDays,   color: "text-red-500" },
          { label: "Half-day", val: att.halfDays,      color: "text-amber-500" },
          { label: "Leave",    val: att.leaveDays,    color: "text-blue-500" },
        ].map(({ label, val, color }) => (
          <span key={label} className="flex items-center gap-1 text-xs">
            <span className={`font-extrabold ${color}`}>{val}</span>
            <span className="text-gray-400">{label}</span>
            <span className="text-gray-200 last:hidden">·</span>
          </span>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onDownload}
          className="gap-2 flex-1 justify-center bg-indigo-600 text-white hover:bg-indigo-700"
          style={{ height: 40 }}
        >
          <Download size={14} className="text-current" strokeWidth={2} />
          Download PDF
        </Button>
        <Button
          onClick={onWhatsApp}
          className="gap-2 flex-1 justify-center bg-emerald-500 text-white hover:bg-emerald-600"
          style={{ height: 40 }}
        >
          <MessageCircle size={14} className="text-current" strokeWidth={2} />
          Send to My WA
        </Button>
      </div>
    </div>
  );
};

export default CurrentSalaryCard;
