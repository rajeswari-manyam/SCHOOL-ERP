import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { formatCurrency } from "../../../../../utils/formatters";
import type { SalaryConfig, SalaryTableProps} from "../../types/payroll.types";



const columnHelper = createColumnHelper<SalaryConfig>();

export const SalaryTable = ({ data, onEdit }: SalaryTableProps) => {
  const columns = useMemo(() => [
    columnHelper.accessor("name", {
      header: "Staff Name",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-semibold">
            {info.row.original.initials}
          </div>
          <span className="text-sm font-medium text-gray-900">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("role", {
      header: "Role",
      cell: (info) => <span className="text-sm text-gray-600">{info.getValue()}</span>,
    }),
    columnHelper.accessor("basic", {
      header: "Basic",
      cell: (info) => <span className="text-sm text-gray-700">{formatCurrency(info.getValue())}</span>,
    }),
    columnHelper.accessor("hra", {
      header: "HRA",
      cell: (info) => <span className="text-sm text-gray-700">{formatCurrency(info.getValue())}</span>,
    }),
    columnHelper.accessor("transport", {
      header: "Transport",
      cell: (info) => <span className="text-sm text-gray-700">{formatCurrency(info.getValue())}</span>,
    }),
    columnHelper.accessor("other", {
      header: "Other",
      cell: (info) => <span className="text-sm text-gray-700">{formatCurrency(info.getValue())}</span>,
    }),
    columnHelper.accessor("pfPercentage", {
      header: "PF %",
      cell: (info) => (
        <span className="text-sm text-blue-600">{info.getValue()}%</span>
      ),
    }),
    columnHelper.accessor("professionalTax", {
      header: "Prof. Tax",
      cell: (info) => <span className="text-sm text-gray-700">{formatCurrency(info.getValue())}</span>,
    }),
    columnHelper.accessor("gross", {
      header: "Gross",
      cell: (info) => <span className="text-sm font-medium text-gray-900">{formatCurrency(info.getValue())}</span>,
    }),
    columnHelper.accessor("net", {
      header: () => <span className="text-[#3525CD]">Net</span>,
      cell: (info) => (
        <span className="text-sm font-semibold text-[#3525CD]">
          {formatCurrency(info.getValue())}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          onClick={() => onEdit(row.original)}
          className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Pencil className="w-4 h-4" />
        </button>
      ),
    }),
  ], [onEdit]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto no-scrollbar">
      <table className="min-w-[900px] w-full text-sm">

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
                No salary records found.
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