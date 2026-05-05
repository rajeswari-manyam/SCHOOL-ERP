import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { formatCurrency } from "../../../../../utils/formatters";
import type { StaffPayroll,PayrollTableProps } from "../../types/payroll.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import typography, { combineTypography } from "@/styles/typography";



const columnHelper = createColumnHelper<StaffPayroll>();

export const PayrollTable = ({ data, isProcessed = false }: PayrollTableProps) => {
  const totalPresent    = data.reduce((sum: number, s: StaffPayroll) => sum + s.present, 0);
  const totalAbsent     = data.reduce((sum: number, s: StaffPayroll) => sum + s.absent, 0);
  const totalGross      = data.reduce((sum: number, s: StaffPayroll) => sum + s.gross, 0);
  const totalDeductions = data.reduce((sum: number, s: StaffPayroll) => sum + s.deductions, 0);
  const totalNet        = data.reduce((sum: number, s: StaffPayroll) => sum + s.net, 0);

  const columns = useMemo(() => [
    columnHelper.accessor("name", {
      header: "Staff",
      cell: (info) => (
        <div className="flex items-center gap-2 sm:gap-3">
          <Avatar fallback={info.row.original.initials} size="sm" />
          <span className={combineTypography(typography.body.small, "font-medium text-gray-900")}>
            {info.getValue()}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("role", {
      header: "Role",
      cell: (info) => (
        <span className={combineTypography(typography.body.xs, "text-gray-600")}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("present", {
      header: "Present",
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor("absent", {
      header: "Absent",
      cell: (info) => (
        <span className={info.getValue() > 0 ? "text-red-500 font-medium" : ""}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("gross", {
      header: "Gross",
      cell: (info) => <span>{formatCurrency(info.getValue())}</span>,
    }),
    columnHelper.accessor("deductions", {
      header: "Deductions",
      cell: (info) => (
        <span className="text-red-500">{formatCurrency(info.getValue())}</span>
      ),
    }),
    columnHelper.accessor("net", {
      header: () => <span className="text-[#3525CD]">Net</span>,
      cell: (info) => (
        <span className="font-semibold text-[#3525CD]">
          {formatCurrency(info.getValue())}
        </span>
      ),
    }),
    columnHelper.display({
      id: "status",
      header: "Status",
      cell: () => (
        <Badge variant={isProcessed ? "success" : "warning"}>
          {isProcessed ? "Processed" : "Draft"}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Action",
      cell: () => (
        <Button variant="ghost" size="sm">
          <Pencil className="w-4 h-4" />
        </Button>
      ),
    }),
  ], [isProcessed]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#3525CD] transition-all">
      <div className="overflow-x-auto no-scrollbar">
        <table className="min-w-[900px] w-full text-sm">

          {/* Header */}
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

          {/* Body */}
          <tbody>
            {table.getRowModel().rows.map((row) => (
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
            ))}

            {/* Totals Row */}
            <tr className="bg-blue-50/40 border-t border-gray-100">
              <td className="px-4 py-3 font-semibold text-gray-700">Total</td>
              <td className="px-4 py-3 text-gray-400">-</td>
              <td className="px-4 py-3 font-medium">{totalPresent}</td>
              <td className="px-4 py-3 font-medium text-red-500">{totalAbsent}</td>
              <td className="px-4 py-3 font-medium">{formatCurrency(totalGross)}</td>
              <td className="px-4 py-3 font-medium text-red-500">{formatCurrency(totalDeductions)}</td>
              <td className="px-4 py-3 font-bold text-[#3525CD]">{formatCurrency(totalNet)}</td>
              <td className="px-4 py-3" />
              <td className="px-4 py-3" />
            </tr>
          </tbody>

        </table>
      </div>
    </div>
  );
};