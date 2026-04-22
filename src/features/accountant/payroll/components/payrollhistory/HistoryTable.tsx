import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Eye, Download } from "lucide-react";
import { formatCurrency } from "../../../../../utils/formatters";
import type { PayrollHistory, HistoryTableProps } from "../../types/payroll.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";



const columnHelper = createColumnHelper<PayrollHistory>();

export const HistoryTable = ({ data }: HistoryTableProps) => {
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
      cell: () => <Badge variant="success">{status}</Badge>,
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

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-[750px] w-full text-sm">

        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
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
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-gray-400">
                No payroll history found.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
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
  );
};