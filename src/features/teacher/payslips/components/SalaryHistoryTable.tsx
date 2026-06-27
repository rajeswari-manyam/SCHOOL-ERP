import type { Payslip } from "../types/payslip.types";
import { Download } from "lucide-react";

const inr = (n: number | undefined | null) => "₹" + (n ?? 0).toLocaleString("en-IN");

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  PAID:       { label: "Paid",       cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  PENDING:    { label: "Pending",    cls: "bg-amber-50  text-amber-700  border border-amber-200"  },
  PROCESSING: { label: "Processing", cls: "bg-blue-50   text-blue-700   border border-blue-200"   },
};

const getCfg = (status: string) =>
  STATUS_CFG[status] ?? { label: status ?? "Unknown", cls: "bg-gray-100 text-gray-600 border border-gray-200" };

interface Props {
  payslips: Payslip[];
  onDownload: (payslip: Payslip) => void;
}

const SalaryHistoryTable = ({ payslips, onDownload }: Props) => {
  if (payslips.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm py-12 text-center">
        <p className="text-sm font-semibold text-gray-400">No salary history</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/60">
        <h3 className="text-sm font-bold text-gray-900">Salary History</h3>
      </div>

      {/* ── Mobile: stacked cards (hidden sm+) ──────────────────────── */}
      <div className="sm:hidden divide-y divide-gray-100">
        {payslips.map((p, idx) => {
          const s = getCfg(p.status);
          return (
            <div key={p.id ?? idx} className="p-4 hover:bg-gray-50/60 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-gray-900">{p.monthLabel ?? "—"}</p>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Gross</p>
                  <p className="text-xs font-extrabold text-gray-800 tabular-nums">{inr(p.grossSalary)}</p>
                </div>
                <div className="bg-rose-50 rounded-xl p-2.5 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400 mb-0.5">Deduct</p>
                  <p className="text-xs font-extrabold text-rose-600 tabular-nums">{inr(p.totalDeductions)}</p>
                </div>
                <div className="bg-indigo-50 rounded-xl p-2.5 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-0.5">Net</p>
                  <p className="text-xs font-extrabold text-indigo-700 tabular-nums">{inr(p.netSalary)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-gray-400">
                  {p.attendance?.presentDays ?? 0} / {p.attendance?.workingDays ?? 0} days present
                </p>
                <button
                  onClick={() => onDownload(p)}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <Download size={11} strokeWidth={2.5} />
                  PDF
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Desktop: table (hidden below sm) ───────────────────────── */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full min-w-[520px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["Month", "Gross", "Deductions", "Net Pay", "Status", ""].map((h) => (
                <th
                  key={h}
                  className={[
                    "text-left text-[11px] font-bold uppercase tracking-widest text-gray-400 px-5 sm:px-6 py-3",
                    h === "" ? "text-right" : "",
                  ].join(" ")}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payslips.map((p, idx) => {
              const s = getCfg(p.status);
              return (
                <tr
                  key={p.id ?? idx}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-5 sm:px-6 py-3.5">
                    <p className="text-sm font-semibold text-gray-900">{p.monthLabel ?? "—"}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {p.attendance?.presentDays ?? 0}/{p.attendance?.workingDays ?? 0} days
                    </p>
                  </td>
                  <td className="px-5 sm:px-6 py-3.5">
                    <span className="text-sm text-gray-700 tabular-nums">{inr(p.grossSalary)}</span>
                  </td>
                  <td className="px-5 sm:px-6 py-3.5">
                    <span className="text-sm text-rose-500 tabular-nums">−{inr(p.totalDeductions)}</span>
                  </td>
                  <td className="px-5 sm:px-6 py-3.5">
                    <span className="text-sm font-bold text-indigo-700 tabular-nums">{inr(p.netSalary)}</span>
                  </td>
                  <td className="px-5 sm:px-6 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${s.cls}`}>
                      {s.label}
                    </span>
                  </td>
                  <td className="px-5 sm:px-6 py-3.5 text-right">
                    <button
                      onClick={() => onDownload(p)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                    >
                      <Download size={11} strokeWidth={2.5} />
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
