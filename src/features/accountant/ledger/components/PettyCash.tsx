// components/PettyCash.tsx
import { Card, CardContent } from "@/components/ui/card";  // FIX: Removed unused CardHeader, CardTitle
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "../utils/ledger.utils";
import type { PettyCashEntry } from "../types/Ledger.types";
import { AlertCircle, Receipt, FileX, Pencil } from "lucide-react";

interface PettyCashProps {
  entries: PettyCashEntry[];
  onAddEntry: () => void;
}

const categoryColors: Record<string, string> = {
  "Refreshments": "bg-pink-100 text-pink-700",
  "Courier": "bg-blue-100 text-blue-700",
  "Stationery": "bg-amber-100 text-amber-700",
  "Utilities": "bg-cyan-100 text-cyan-700",
  "Misc": "bg-gray-100 text-gray-700",
  "-": "bg-gray-50 text-gray-400",
};

export const PettyCash = ({ entries, onAddEntry }: PettyCashProps) => {
  const openingBalance = 5000;
  const spentThisMonth = Math.abs(entries.filter(e => e.amount < 0).reduce((a, b) => a + b.amount, 0));
  const currentBalance = entries[entries.length - 1]?.balanceAfter || openingBalance;

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

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
          Replenish Fund
        </Button>
        <Button 
          onClick={onAddEntry}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          + Add Petty Cash Entry
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
              <TableHead className="text-xs font-semibold text-gray-500 uppercase">Date</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase">Description</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase">Category</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase text-right">Amount</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase text-right">Balance After</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase">Authorized By</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase text-center">Receipt</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {entries.map((row) => (
              <TableRow key={row.id} className="hover:bg-gray-50/50 border-b border-gray-50 last:border-0">
                <TableCell className="text-sm text-gray-600 font-medium">
                  {formatDate(row.date)}
                </TableCell>
                <TableCell className="text-sm text-gray-700 max-w-xs">
                  {row.description}
                </TableCell>
                <TableCell>
                  {/* FIX: Remove variant="secondary" */}
                  <Badge 
                    className={`${categoryColors[row.category] || "bg-gray-100 text-gray-700"} text-xs font-medium px-2 py-0.5 border-0`}
                  >
                    {row.category}
                  </Badge>
                </TableCell>
                <TableCell className={`text-sm font-semibold text-right ${
                  row.amount >= 0 ? "text-emerald-600" : "text-rose-600"
                }`}>
                  {row.amount >= 0 ? "+" : ""}{formatCurrency(row.amount)}
                </TableCell>
                <TableCell className="text-sm font-semibold text-right text-gray-700">
                  {formatCurrency(row.balanceAfter)}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {row.authorizedBy}
                </TableCell>
                <TableCell className="text-center">
                  {row.receipt === "Receipt" ? (
                    <div className="flex items-center justify-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit mx-auto">
                      <Receipt className="w-3 h-3" />
                      <span>Receipt</span>
                    </div>
                  ) : row.receipt === "No receipt" ? (
                    <div className="flex items-center justify-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full w-fit mx-auto">
                      <FileX className="w-3 h-3" />
                      <span>No receipt</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {/* FIX: Use size="sm" with p-0 instead of size="icon" */}
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-500 flex justify-between items-center">
          <span>Showing {entries.length} of {entries.length} entries for April 2024</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-7 text-xs px-3" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs px-3">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};