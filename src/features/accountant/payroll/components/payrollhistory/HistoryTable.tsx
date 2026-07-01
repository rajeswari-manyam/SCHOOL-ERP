import { useState } from "react";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { formatINR as formatCurrency } from "../../../../../utils/formatters";
import type { PayrollHistory, HistoryTableProps } from "../../types/payroll.types";

const StatusBadge = ({ status }: { status: PayrollHistory["status"] }) => {
  if (status === "Paid") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Paid
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      Pending
    </span>
  );
};


export const HistoryTable = ({ data }: HistoryTableProps) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const getKey = (item: PayrollHistory) => `${item.month}-${item.year}`;

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm font-medium">No payroll history found</p>
        <p className="text-xs mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-[780px] w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {[
                { label: "Month",       align: "left"  },
                { label: "Staff",       align: "right" },
                { label: "Gross",       align: "right" },
                { label: "Deductions",  align: "right" },
                { label: "Net Paid",    align: "right" },
                { label: "Mode",        align: "left"  },
                { label: "Status",      align: "left"  },
              ].map(({ label, align }) => (
                <th
                  key={label}
                  className={`px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider ${
                    align === "right" ? "text-right" : "text-left"
                  } ${label === "Month" ? "pl-5" : ""} ${label === "Net Paid" ? "text-[#3525CD]" : ""}`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr
                key={getKey(item)}
                className={`border-b border-slate-50 hover:bg-slate-50/60 transition-colors ${
                  i === data.length - 1 ? "border-0" : ""
                }`}
              >
                <td className="px-5 py-3.5">
                  <span className="text-sm font-semibold text-slate-800">
                    {item.month}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right text-xs text-slate-700">{item.staffCount}</td>
                <td className="px-4 py-3.5 text-right text-xs text-slate-700">{formatCurrency(item.totalGross)}</td>
                <td className="px-4 py-3.5 text-right text-xs text-rose-600">{formatCurrency(item.totalDeductions)}</td>
                <td className="px-4 py-3.5 text-right text-xs font-bold text-[#3525CD]">{formatCurrency(item.netPaid)}</td>
                <td className="px-4 py-3.5">
                  <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{item.mode}</span>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-slate-100">
        {data.map((item) => {
          const key        = getKey(item);
          const isExpanded = expandedCard === key;

          return (
            <div key={key} className="px-4 py-3">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedCard(isExpanded ? null : key)}
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.month}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusBadge status={item.status} />
                    <span className="text-[10px] text-slate-400">{item.staffCount} staff</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#3525CD]">{formatCurrency(item.netPaid)}</span>
                  {isExpanded
                    ? <ChevronUp className="w-4 h-4 text-slate-400" />
                    : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-3 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      ["Gross",      formatCurrency(item.totalGross),      "text-slate-700"],
                      ["Deductions", formatCurrency(item.totalDeductions),  "text-rose-600"],
                      ["Net Paid",   formatCurrency(item.netPaid),          "text-[#3525CD]"],
                      ["Mode",       item.mode,                             "text-slate-700"],
                    ].map(([label, val, cls]) => (
                      <div key={label} className="bg-slate-50 rounded-xl px-3 py-2">
                        <p className="text-slate-400 text-[10px] mb-0.5">{label}</p>
                        <p className={`font-semibold text-xs ${cls}`}>{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
