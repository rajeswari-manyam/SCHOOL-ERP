import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { LedgerEntry } from "../types/Ledger.types";
import { formatCurrency } from "../../../../utils/formatters";
import { formatDate } from "../../../../utils/date";
import typography, { combineTypography } from "@/styles/typography";
import { getPaginationRowModel } from "@tanstack/react-table";
interface LedgerTableProps {
  data: LedgerEntry[];
  type: "income" | "expense";
  onEdit: (entry: LedgerEntry) => void;
  onDelete?: (entry: LedgerEntry) => void;
}

const categoryColors: Record<string, string> = {
  "Fee Collection": "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
  "Other Income":   "bg-violet-100 text-violet-700 hover:bg-violet-200",
  Salaries:         "bg-blue-100 text-blue-700 hover:bg-blue-200",
  Utilities:        "bg-amber-100 text-amber-700 hover:bg-amber-200",
  Maintenance:      "bg-orange-100 text-orange-700 hover:bg-orange-200",
  Stationery:       "bg-pink-100 text-pink-700 hover:bg-pink-200",
  Transport:        "bg-cyan-100 text-cyan-700 hover:bg-cyan-200",
  Miscellaneous:    "bg-gray-100 text-gray-700 hover:bg-gray-200",
};

const columnHelper = createColumnHelper<LedgerEntry>();

export const LedgerTable = ({ data, type, onEdit, onDelete }: LedgerTableProps) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => (
          <span className="text-sm text-gray-600 font-medium whitespace-nowrap">
            {formatDate(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("category", {
        header: "Category",
        cell: (info) => (
          <Badge
            className={`${
              categoryColors[info.getValue()] || "bg-gray-100 text-gray-700"
            } text-xs font-medium px-2 py-0.5 border-0`}
          >
            {info.getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => (
          <span className="text-sm text-gray-700 max-w-xs truncate block">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("reference", {
        header: "Reference",
        cell: (info) => (
          <span className="text-xs text-gray-500 font-mono">
            {info.getValue() || "-"}
          </span>
        ),
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => (
          <span
            className={`text-sm font-semibold whitespace-nowrap ${
              info.row.original.type === "Income"
                ? "text-emerald-600"
                : "text-rose-600"
            }`}
          >
            {formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("recordedBy", {
        header: "Recorded By",
        cell: (info) => (
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(row.original)}
              className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete?.(row.original)}
              className="h-8 w-8 p-0 text-rose-500 hover:bg-rose-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ),
      }),
    ],
    [onEdit, onDelete]
  );

const table = useReactTable({
  data,
  columns,
  state: { globalFilter, sorting },
  onGlobalFilterChange: setGlobalFilter,
  onSortingChange: setSorting,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(), 
});
  const rows = table.getRowModel().rows;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">

      {/* HEADER */}
      <div className="px-3 sm:px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <h3
          className={combineTypography(
            typography.form.label,
            "text-gray-700 uppercase tracking-wide"
          )}
        >
          {type === "income" ? "Income Ledger" : "Recent Expense Entries"}
        </h3>

        {/* SEARCH */}
       <div className="relative w-full sm:w-64">
  <input
    type="text"
    value={globalFilter}
    onChange={(e) => setGlobalFilter(e.target.value)}
    placeholder="Search entries..."
    className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
</div>
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-[900px] sm:min-w-full w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-50/50 border-b border-gray-100">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide select-none ${
                      header.column.getCanSort()
                        ? "cursor-pointer hover:text-gray-700"
                        : ""
                    } ${header.id === "amount" ? "text-right" : ""} ${
                      header.id === "actions" ? "text-center" : ""
                    }`}
                  >
                    <div className={`flex items-center gap-1 ${
                      header.id === "amount" ? "justify-end" : ""
                    } ${header.id === "actions" ? "justify-center" : ""}`}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="text-gray-400">
                          {header.column.getIsSorted() === "asc"  ? <ArrowUp className="w-3 h-3" />
                          : header.column.getIsSorted() === "desc" ? <ArrowDown className="w-3 h-3" />
                          : <ArrowUpDown className="w-3 h-3" />}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  No entries found.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`px-4 py-3 ${
                        cell.column.id === "amount" ? "text-right" : ""
                      } ${cell.column.id === "actions" ? "text-center" : ""}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="px-3 sm:px-4 py-3 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-500 flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <span>
          Showing {rows.length} of {data.length} entries
        </span>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs px-3"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs px-3"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

    </div>
  );
};