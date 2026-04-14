import type { Payslip, PayslipStatus } from "../types/payslip.types";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

const STATUS_CONFIG: Record<PayslipStatus, { label: string; classes: string }> = {
  PAID:       { label: "Paid",       classes: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  PENDING:    { label: "Pending",    classes: "bg-amber-50 text-amber-700 border border-amber-200" },
  PROCESSING: { label: "Processing", classes: "bg-blue-50 text-blue-700 border border-blue-200" },
};

interface Props {
  payslips: Payslip[];
  onDownload: (payslip: Payslip) => void;
}

const SalaryHistoryTable = ({ payslips, onDownload }: Props) => {
  if (payslips.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-12 text-center">
        <p className="text-sm font-semibold text-gray-400">No salary history available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Salary History</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["Month", "Gross", "Deductions", "Net", "Status", ""].map((h) => (
                <th
                  key={h}
                  className={`text-left text-[11px] font-bold uppercase tracking-widest text-gray-400 px-5 py-3 ${
                    h === "" ? "text-right" : ""
                  } ${["Deductions", "Gross", "Net"].includes(h) ? "hidden sm:table-cell" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payslips.map((p) => {
              const cfg = STATUS_CONFIG[p.status];
              return (
                <tr
                  key={p.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-semibold text-gray-900">{p.monthLabel}</p>
                    <p className="text-[11px] text-gray-400">
                      {p.attendance.presentDays}/{p.attendance.workingDays} days
                    </p>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="text-sm text-gray-700">{inr(p.grossSalary)}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="text-sm text-red-500">- {inr(p.totalDeductions)}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="text-sm font-extrabold text-indigo-700">{inr(p.netSalary)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${cfg.classes}`}>
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => onDownload(p)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors inline-flex items-center gap-1"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      PDF
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryHistoryTable;
