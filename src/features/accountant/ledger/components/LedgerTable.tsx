// components/LedgerTable.tsx
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { LedgerEntry } from "../types/Ledger.types";
import { formatCurrency, formatDate } from "../utils/ledger.utils";

import typography, { combineTypography } from "@/styles/typography";

interface LedgerTableProps {
  data: LedgerEntry[];
  type: "income" | "expense";
}

const categoryColors: Record<string, string> = {
  "Fee Collection": "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
  "Other Income": "bg-violet-100 text-violet-700 hover:bg-violet-200",
  Salaries: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  Utilities: "bg-amber-100 text-amber-700 hover:bg-amber-200",
  Maintenance: "bg-orange-100 text-orange-700 hover:bg-orange-200",
  Stationery: "bg-pink-100 text-pink-700 hover:bg-pink-200",
  Transport: "bg-cyan-100 text-cyan-700 hover:bg-cyan-200",
  Miscellaneous: "bg-gray-100 text-gray-700 hover:bg-gray-200",
};

export const LedgerTable = ({ data, type }: LedgerTableProps) => {
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
            placeholder="Search entries..."
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* MOBILE SCROLL WRAPPER */}
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[900px] sm:min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
              <TableHead className="text-xs font-semibold text-gray-500 uppercase">
                Date
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase">
                Category
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase">
                Description
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase">
                Reference
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase text-right">
                Amount
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase">
                Recorded By
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-gray-50/50 border-b border-gray-50 last:border-0"
              >
                <TableCell className="text-sm text-gray-600 font-medium whitespace-nowrap">
                  {formatDate(row.date)}
                </TableCell>

                <TableCell>
                  <Badge
                    className={`${categoryColors[row.category] ||
                      "bg-gray-100 text-gray-700"
                      } text-xs font-medium px-2 py-0.5 border-0`}
                  >
                    {row.category}
                  </Badge>
                </TableCell>

                <TableCell className="text-sm text-gray-700 max-w-xs truncate">
                  {row.description}
                </TableCell>

                <TableCell className="text-sm text-gray-500 font-mono text-xs">
                  {row.reference || "-"}
                </TableCell>

                <TableCell
                  className={`text-sm font-semibold text-right whitespace-nowrap ${row.type === "Income"
                    ? "text-emerald-600"
                    : "text-rose-600"
                    }`}
                >
                  {formatCurrency(row.amount)}
                </TableCell>

                <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                  {row.recordedBy}
                </TableCell>

                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-rose-500 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* FOOTER */}
      <div className="px-3 sm:px-4 py-3 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-500 flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <span>
          Showing {data.length} of {data.length} entries
        </span>

        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="h-7 text-xs px-3" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs px-3">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};