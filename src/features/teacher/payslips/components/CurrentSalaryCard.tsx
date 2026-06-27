import { Download, MessageCircle, User, Building2, CreditCard, FileText } from "lucide-react";
import type { Payslip } from "../types/payslip.types";

const inr = (n: number | undefined | null) => "₹" + (n ?? 0).toLocaleString("en-IN");

const ATTEND_BADGE: Record<string, string> = {
  Working:   "bg-gray-100  text-gray-700  border border-gray-200",
  Present:   "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Absent:    "bg-red-50   text-red-700   border border-red-200",
  "Half-day":"bg-amber-50 text-amber-700  border border-amber-200",
  Leave:     "bg-blue-50  text-blue-700  border border-blue-200",
};

interface Props {
  payslip: Payslip;
  onDownload: () => void;
  onWhatsApp: () => void;
}

const CurrentSalaryCard = ({ payslip, onDownload, onWhatsApp }: Props) => {
  const att = payslip.attendance ?? { workingDays: 0, presentDays: 0, absentDays: 0, halfDays: 0, leaveDays: 0 };

  const infoRows = [
    { icon: User,      label: "Employee ID",  value: payslip.employeeId   },
    { icon: User,      label: "Name",         value: payslip.employeeName },
    { icon: Building2, label: "Designation",  value: payslip.designation  },
    { icon: Building2, label: "Department",   value: payslip.department   },
    { icon: CreditCard,label: "Bank Account", value: payslip.bankAccount  },
    { icon: FileText,  label: "PAN",          value: payslip.pan          },
  ];

  const attendItems = [
    { label: "Working",   val: att.workingDays  },
    { label: "Present",   val: att.presentDays  },
    { label: "Absent",    val: att.absentDays   },
    { label: "Half-day",  val: att.halfDays     },
    { label: "Leave",     val: att.leaveDays    },
  ];

  return (
    <div className="space-y-4">

      {/* ── Employee Information ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/60">
          <h3 className="text-sm font-bold text-gray-900">Employee Information</h3>
        </div>
        <div className="px-5 sm:px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
          {infoRows.map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
              <p className="text-sm font-semibold text-gray-800 truncate">{value || "—"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Salary Breakdown ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/60">
          <h3 className="text-sm font-bold text-gray-900">Salary Breakdown</h3>
        </div>

        {/* Earnings | Deductions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">

          {/* Earnings */}
          <div className="px-5 sm:px-6 py-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 mb-3">Earnings</p>
            <div className="space-y-2.5">
              {(payslip.earnings ?? []).map((e, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-600 truncate">{e.label}</span>
                  <span className="text-sm font-semibold text-gray-900 tabular-nums whitespace-nowrap">{inr(e.amount)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 pt-3 mt-1 border-t border-gray-100">
                <span className="text-sm font-bold text-gray-700">Gross Total</span>
                <span className="text-sm font-extrabold text-gray-900 tabular-nums">{inr(payslip.grossSalary)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="px-5 sm:px-6 py-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-rose-500 mb-3">Deductions</p>
            <div className="space-y-2.5">
              {(payslip.deductions ?? []).length === 0 ? (
                <p className="text-xs text-gray-400">No deductions</p>
              ) : (payslip.deductions ?? []).map((d, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-600 truncate">{d.label}</span>
                  <span className="text-sm font-semibold text-rose-600 tabular-nums whitespace-nowrap">{inr(d.amount)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 pt-3 mt-1 border-t border-gray-100">
                <span className="text-sm font-bold text-gray-700">Total</span>
                <span className="text-sm font-extrabold text-rose-600 tabular-nums">{inr(payslip.totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Pay banner */}
        <div className="mx-4 sm:mx-6 mb-5 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Net Pay (Take Home)</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tabular-nums mt-0.5">
              {inr(payslip.netSalary)}
            </p>
          </div>
          {payslip.bankAccount && payslip.bankAccount !== "—" && (
            <div className="sm:text-right">
              <p className="text-[10px] text-indigo-300">Credited to</p>
              <p className="text-xs font-bold text-white">{payslip.bankAccount}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Attendance Summary ───────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 sm:px-6 py-5">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Attendance Summary</h3>
        <div className="flex flex-wrap gap-2">
          {attendItems.map(({ label, val }) => (
            <div
              key={label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${ATTEND_BADGE[label] ?? ATTEND_BADGE["Working"]}`}
            >
              <span className="font-extrabold tabular-nums">{val}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Action Buttons ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onDownload}
          className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md shadow-indigo-200"
        >
          <Download size={15} strokeWidth={2} />
          Download PDF
        </button>
        <button
          onClick={onWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-md shadow-emerald-200"
        >
          <MessageCircle size={15} strokeWidth={2} />
          Send to WhatsApp
        </button>
      </div>
    </div>
  );
};

export default CurrentSalaryCard;
