import { useRef } from "react";
import { CreditCard, Eye, Pencil, Trash2 } from "lucide-react";
import { formatINR as formatCurrency } from "../../../../../utils/formatters";
import type { PayrollTableProps, PayrollStatus } from "../../types/payroll.types";

// ── Status Badge ──────────────────────────────────────────────────────────────

const STATUS_CFG: Record<PayrollStatus, { label: string; cls: string; dot: string }> = {
  Draft:   { label: "Draft",   cls: "bg-slate-100 text-slate-600",    dot: "bg-slate-400"   },
  Pending: { label: "Pending", cls: "bg-amber-100 text-amber-700",    dot: "bg-amber-500"   },
  Paid:    { label: "Paid",    cls: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  Failed:  { label: "Failed",  cls: "bg-red-100 text-red-700",        dot: "bg-red-500"     },
};

function StatusBadge({ status }: { status: PayrollStatus }) {
  const c = STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${c.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────

export const PayrollTable = ({
  data,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onPaySalary,
  onViewPayslip,
  onEdit,
  onDelete,
}: PayrollTableProps) => {
  const allSelected  = data.length > 0 && selectedIds.length === data.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const totalGross  = data.reduce((s, x) => s + x.gross, 0);
  const totalDeduct = data.reduce((s, x) => s + x.deductions, 0);
  const totalNet    = data.reduce((s, x) => s + x.net, 0);

  const headerCheckRef = useRef<HTMLInputElement>(null);
  if (headerCheckRef.current) headerCheckRef.current.indeterminate = someSelected;

  // ── Mobile Cards ─────────────────────────────────────────────────────────────
  const mobileView = (
    <div className="md:hidden divide-y divide-slate-50">
      {data.map((staff) => {
        const isSelected = selectedIds.includes(staff.id);
        const adj = staff.adjustments;

        return (
          <div
            key={staff.id}
            className={`px-4 py-3.5 transition-colors ${isSelected ? "bg-indigo-50/50" : ""}`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(staff.id)}
                className="mt-1 accent-[#3525CD] w-4 h-4 cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                {/* Row header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {staff.initials}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{staff.name}</p>
                      <p className="text-[10px] text-slate-400">{staff.role}</p>
                    </div>
                  </div>
                  <StatusBadge status={staff.status} />
                </div>

                {/* Salary grid */}
                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  <div className="bg-slate-50 rounded-lg px-2.5 py-2">
                    <p className="text-[10px] text-slate-400 mb-0.5">Gross</p>
                    <p className="font-semibold text-slate-700">{formatCurrency(staff.gross)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg px-2.5 py-2">
                    <p className="text-[10px] text-slate-400 mb-0.5">Adjustments</p>
                    <p className={`font-semibold ${adj === 0 ? "text-slate-400" : adj > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {adj === 0 ? "—" : `${adj > 0 ? "+" : ""}${formatCurrency(adj)}`}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-lg px-2.5 py-2">
                    <p className="text-[10px] text-slate-400 mb-0.5">Net</p>
                    <p className="font-bold text-[#3525CD]">{formatCurrency(staff.net)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {staff.status === "Draft" && (
                    <button
                      onClick={() => onPaySalary(staff)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-[#3525CD] hover:bg-[#2a1fb5] text-white text-[11px] font-semibold rounded-lg transition-colors"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Pay
                    </button>
                  )}
                  {staff.status === "Paid" && onViewPayslip && (
                    <button
                      onClick={() => onViewPayslip(staff)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-semibold rounded-lg transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Payslip
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(staff)}
                      className="flex items-center justify-center p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(staff)}
                      className="flex items-center justify-center p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // ── Desktop Table ─────────────────────────────────────────────────────────────
  const desktopView = (
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-[960px] w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="pl-5 pr-2 py-3 w-10">
              <input
                ref={headerCheckRef}
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="accent-[#3525CD] w-4 h-4 cursor-pointer"
              />
            </th>
            {[
              { h: "Employee Name", align: "left" },
              { h: "Gross Salary",  align: "right" },
              { h: "Adjustments",   align: "right" },
              { h: "Deductions",    align: "right" },
              { h: "Net Salary",    align: "right" },
              { h: "Status",        align: "left"  },
              { h: "Actions",       align: "right" },
            ].map(({ h, align }) => (
              <th
                key={h}
                className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-wider ${
                  align === "right" ? "text-right" : "text-left"
                } ${h === "Net Salary" ? "text-[#3525CD]" : "text-slate-400"}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((staff) => {
            const isSelected = selectedIds.includes(staff.id);
            const adj = staff.adjustments;

            return (
              <tr
                key={staff.id}
                className={`border-b border-slate-50 last:border-0 transition-colors ${
                  isSelected ? "bg-indigo-50/40" : "hover:bg-slate-50/60"
                }`}
              >
                {/* Checkbox */}
                <td className="pl-5 pr-2 py-3.5">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(staff.id)}
                    className="accent-[#3525CD] w-4 h-4 cursor-pointer"
                  />
                </td>

                {/* Employee */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {staff.initials}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{staff.name}</p>
                      <p className="text-[10px] text-slate-400">{staff.role}</p>
                    </div>
                  </div>
                </td>

                {/* Gross */}
                <td className="px-4 py-3.5 text-right text-xs text-slate-700">
                  {formatCurrency(staff.gross)}
                </td>

                {/* Adjustments */}
                <td className="px-4 py-3.5 text-right text-xs">
                  {adj === 0 ? (
                    <span className="text-slate-300">—</span>
                  ) : (
                    <span className={`font-medium ${adj > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {adj > 0 ? "+" : ""}{formatCurrency(adj)}
                    </span>
                  )}
                </td>

                {/* Deductions */}
                <td className="px-4 py-3.5 text-right text-xs text-rose-600">
                  {formatCurrency(staff.deductions)}
                </td>

                {/* Net */}
                <td className="px-4 py-3.5 text-right text-xs font-bold text-[#3525CD]">
                  {formatCurrency(staff.net)}
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <StatusBadge status={staff.status} />
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    {staff.status === "Draft" && (
                      <button
                        onClick={() => onPaySalary(staff)}
                        title="Pay Salary"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#3525CD] hover:bg-[#2a1fb5] text-white text-[11px] font-semibold transition-colors"
                      >
                        <CreditCard className="w-3 h-3" />
                        Pay
                      </button>
                    )}
                    {staff.status === "Paid" && onViewPayslip && (
                      <button
                        onClick={() => onViewPayslip(staff)}
                        title="View Payslip"
                        className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(staff)}
                        title="Edit"
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(staff)}
                        title="Delete"
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>

        {/* Totals Footer */}
        <tfoot>
          <tr className="bg-slate-50/80 border-t border-slate-200">
            <td colSpan={2} className="px-5 py-3 text-xs font-bold text-slate-700">
              Total ({data.length} staff)
            </td>
            <td className="px-4 py-3 text-right text-xs font-semibold text-slate-700">
              {formatCurrency(totalGross)}
            </td>
            <td className="px-4 py-3 text-right text-xs text-slate-400">—</td>
            <td className="px-4 py-3 text-right text-xs font-semibold text-rose-600">
              {formatCurrency(totalDeduct)}
            </td>
            <td className="px-4 py-3 text-right text-xs font-bold text-[#3525CD]">
              {formatCurrency(totalNet)}
            </td>
            <td colSpan={2} />
          </tr>
        </tfoot>
      </table>
    </div>
  );

  return (
    <div>
      {mobileView}
      {desktopView}
    </div>
  );
};
