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
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
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
        <button
          onClick={onDownload}
          className="flex items-center gap-2 flex-1 justify-center h-10 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download PDF
        </button>
        <button
          onClick={onWhatsApp}
          className="flex items-center gap-2 flex-1 justify-center h-10 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
          </svg>
          Send to My WA
        </button>
      </div>
    </div>
  );
};

export default CurrentSalaryCard;
