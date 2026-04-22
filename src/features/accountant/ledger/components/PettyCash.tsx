import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "../../../../utils/formatters";
import { formatDate } from "../../../../utils/date";
import type { PettyCashEntry } from "../types/Ledger.types";
import { AlertCircle, Receipt, FileX, Pencil } from "lucide-react";

interface PettyCashProps {
  entries: PettyCashEntry[];
}

const categoryColors: Record<string, string> = {
  "Refreshments": "bg-pink-100 text-pink-700",
  "Courier":      "bg-blue-100 text-blue-700",
  "Stationery":   "bg-amber-100 text-amber-700",
  "Utilities":    "bg-cyan-100 text-cyan-700",
  "Misc":         "bg-gray-100 text-gray-700",
  "-":            "bg-gray-50 text-gray-400",
};

const columnHelper = createColumnHelper<PettyCashEntry>();

export const PettyCash = ({ entries }: PettyCashProps) => {
  const openingBalance = 5000;
  const spentThisMonth = Math.abs(
    entries.filter(e => e.amount < 0).reduce((a, b) => a + b.amount, 0)
  );
  const currentBalance = entries[entries.length - 1]?.balanceAfter || openingBalance;

  const columns = useMemo(() => [
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => (
        <span className="text-sm text-gray-600 font-medium whitespace-nowrap">
          {formatDate(info.getValue())}
        </span>
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
    columnHelper.accessor("category", {
      header: "Category",
      cell: (info) => (
        <Badge className={`${categoryColors[info.getValue()] || "bg-gray-100 text-gray-700"} text-xs font-medium px-2 py-0.5 border-0`}>
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor("amount", {
      header: () => <span className="block text-right">Amount</span>,
      cell: (info) => (
        <span className={`text-sm font-semibold block text-right ${info.getValue() >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
          {info.getValue() >= 0 ? "+" : ""}{formatCurrency(info.getValue())}
        </span>
      ),
    }),
    columnHelper.accessor("balanceAfter", {
      header: () => <span className="block text-right">Balance After</span>,
      cell: (info) => (
        <span className="text-sm font-semibold block text-right text-gray-700">
          {formatCurrency(info.getValue())}
        </span>
      ),
    }),
    columnHelper.accessor("authorizedBy", {
      header: "Authorized By",
      cell: (info) => (
        <span className="text-sm text-gray-600">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("receipt", {
      header: () => <span className="block text-center">Receipt</span>,
      cell: (info) => {
        const val = info.getValue();
        if (val === "Receipt") return (
          <div className="flex items-center justify-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit mx-auto">
            <Receipt className="w-3 h-3" /><span>Receipt</span>
          </div>
        );
        if (val === "No receipt") return (
          <div className="flex items-center justify-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full w-fit mx-auto">
            <FileX className="w-3 h-3" /><span>No receipt</span>
          </div>
        );
        return <span className="block text-center text-gray-400">—</span>;
      },
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="block text-center">Actions</span>,
      cell: () => (
        <div className="flex justify-center">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100">
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
      ),
    }),
  ], []);

  const table = useReactTable({
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-6">

      {/* Balance Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-indigo-50/50 border-indigo-100">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-indigo-600 uppercase mb-1">Opening Balance (April 1)</p>
            <p className="text-2xl font-bold text-indigo-700">{formatCurrency(openingBalance)}</p>
          </CardContent>
        </Card>
        <Card className="bg-rose-50/50 border-rose-100">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-rose-600 uppercase mb-1">Spent This Month</p>
            <p className="text-2xl font-bold text-rose-700">{formatCurrency(spentThisMonth)}</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-100">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-emerald-600 uppercase mb-1">Current Balance</p>
            <p className="text-2xl font-bold text-emerald-700">{formatCurrency(currentBalance)}</p>
            {currentBalance < 1000 && (
              <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                <AlertCircle className="w-3 h-3" />
                <span>Replenish when balance falls below ₹1,000</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* TanStack Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[900px] sm:min-w-full w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-gray-50/50 border-b border-gray-100">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
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
                    No entries found.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
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

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-500 flex justify-between items-center">
          <span>
            Showing {table.getRowModel().rows.length} of {entries.length} entries
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline" size="sm" className="h-7 text-xs px-3"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline" size="sm" className="h-7 text-xs px-3"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
};