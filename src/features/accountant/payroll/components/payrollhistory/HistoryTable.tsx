import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Eye, Download, ChevronDown, ChevronUp } from "lucide-react";
import { formatCurrency } from "../../../../../utils/formatters";
import type { PayrollHistory, HistoryTableProps } from "../../types/payroll.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const columnHelper = createColumnHelper<PayrollHistory>();

export const HistoryTable = ({ data }: HistoryTableProps) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (key: string) => {
    setExpandedCard((prev) => (prev === key ? null : key));
  };

  // Generate unique key from month+year since there's no id
  const getItemKey = (item: PayrollHistory) => `${item.month}-${item.year}`;

  const columns = useMemo(() => [
    columnHelper.accessor((row) => `${row.month} ${row.year}`, {
      id: "month",
      header: "Month",
      cell: (info) => (
        <span className="font-medium text-gray-900">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("staffCount", {
      header: "Staff",
      cell: (info) => <span className="text-sm text-gray-700">{info.getValue()}</span>,
    }),
    columnHelper.accessor("totalGross", {
      header: "Gross",
      cell: (info) => (
        <span className="text-sm text-gray-700">{formatCurrency(info.getValue())}</span>
      ),
    }),
    columnHelper.accessor("totalDeductions", {
      header: "Deductions",
      cell: (info) => (
        <span className="text-sm text-red-500">{formatCurrency(info.getValue())}</span>
      ),
    }),
    columnHelper.accessor("netPaid", {
      header: () => <span className="text-[#3525CD]">Net</span>,
      cell: (info) => (
        <span className="text-sm font-semibold text-[#3525CD]">
          {formatCurrency(info.getValue())}
        </span>
      ),
    }),
    columnHelper.accessor("paymentDate", {
      header: "Date",
      cell: (info) => <span className="text-sm text-gray-700">{info.getValue()}</span>,
    }),
    columnHelper.accessor("mode", {
      header: "Mode",
      cell: (info) => <span className="text-sm text-gray-700">{info.getValue()}</span>,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => <Badge variant="success">{info.getValue()}</Badge>,
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: () => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100">
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      ),
    }),
  ], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();
  const headerGroups = table.getHeaderGroups();

  return (
    <div>
      {/* DESKTOP: Table */}
      <div className="hidden md:block w-full overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-[750px] w-full text-sm">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-50/50 border-b border-gray-100">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-gray-400">
                  No payroll history found.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE: Cards */}
      <div className="md:hidden space-y-3">
        {data.map((item) => {
          const itemKey = getItemKey(item);
          const isExpanded = expandedCard === itemKey;
          
          return (
            <div
              key={itemKey}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
            >
              {/* Card Header */}
              <div
                className="flex items-center justify-between p-3 cursor-pointer active:bg-gray-50"
                onClick={() => toggleCard(itemKey)}
              >
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {item.month} {item.year}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    {item.staffCount} staff · {item.paymentDate}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#3525CD]">
                    {formatCurrency(item.netPaid)}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-3 pb-3 border-t border-gray-100">
                  <div className="pt-3 space-y-2.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Gross</span>
                      <span className="font-medium text-gray-700">{formatCurrency(item.totalGross)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Deductions</span>
                      <span className="font-medium text-red-600">{formatCurrency(item.totalDeductions)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Net Paid</span>
                      <span className="font-medium text-[#3525CD]">{formatCurrency(item.netPaid)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Payment Mode</span>
                      <span className="font-medium text-gray-700">{item.mode}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Status</span>
                      <Badge variant="success" className="text-[10px]">{item.status}</Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-gray-50">
                      <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium active:bg-gray-200">
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium active:bg-gray-200">
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {data.length === 0 && (
          <div className="text-center py-10 text-sm text-gray-400 bg-white rounded-xl border border-gray-200">
            No payroll history found.
          </div>
        )}
      </div>
    </div>
  );
};