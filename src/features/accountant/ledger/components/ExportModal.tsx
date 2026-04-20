// components/ExportModal.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Download, Mail } from "lucide-react";
import { useState } from "react";

interface ExportModalProps {
  onClose: () => void;
}

// FIX: Add className prop to Label component
const Label = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2 ${className}`}>
    {children}
  </span>
);

const ToggleRow = ({ 
  label, 
  checked, 
  onChange 
}: { 
  label: string; 
  checked: boolean; 
  onChange: (val: boolean) => void;
}) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-700">{label}</span>
    <button
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors relative ${
        checked ? "bg-emerald-500" : "bg-gray-200"
      }`}
    >
      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
        checked ? "translate-x-5" : "translate-x-0"
      }`} />
    </button>
  </div>
);

export const ExportModal = ({ onClose }: ExportModalProps) => {
  const [period, setPeriod] = useState<"thisMonth" | "lastMonth" | "custom">("thisMonth");
  const [format, setFormat] = useState<"pdf" | "excel" | "csv">("pdf");
  const [groupBy, setGroupBy] = useState<"date" | "category">("date");
  const [includeIncome, setIncludeIncome] = useState(true);
  const [includeExpense, setIncludeExpense] = useState(true);
  const [includeBalance, setIncludeBalance] = useState(true);
  const [includeDetails, setIncludeDetails] = useState(false);
  const [emailReport, setEmailReport] = useState(true);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-800">Export Ledger</CardTitle>
            <p className="text-xs text-gray-500 mt-0.5">Download financial records for the selected period</p>
          </div>
          {/* FIX: Use size="sm" with p-0 instead of size="icon" */}
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 text-gray-500">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Period */}
          <div className="space-y-2">
            <Label>Period</Label>
            <div className="flex gap-2">
              <button
                onClick={() => setPeriod("thisMonth")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  period === "thisMonth" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setPeriod("lastMonth")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  period === "lastMonth" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                Last Month
              </button>
              <button
                onClick={() => setPeriod("custom")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  period === "custom" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                Custom Range
              </button>
            </div>
            
            {period === "custom" && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  {/* FIX: Added className prop support to Label */}
                  <Label className="text-xs mb-1 block">From *</Label>
                  <input type="date" defaultValue="2025-04-01" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" />
                </div>
                <div>
                  <Label className="text-xs mb-1 block">To *</Label>
                  <input type="date" defaultValue="2025-04-07" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" />
                </div>
              </div>
            )}
          </div>

          {/* Include */}
          <div className="space-y-2">
            <Label>Include</Label>
            <div className="space-y-2">
              <ToggleRow 
                label="Income entries" 
                checked={includeIncome} 
                onChange={setIncludeIncome} 
              />
              <ToggleRow 
                label="Expense entries" 
                checked={includeExpense} 
                onChange={setIncludeExpense} 
              />
              <ToggleRow 
                label="Balance summary" 
                checked={includeBalance} 
                onChange={setIncludeBalance} 
              />
              <ToggleRow 
                label="Transaction details" 
                checked={includeDetails} 
                onChange={setIncludeDetails} 
              />
            </div>
          </div>

          {/* Format */}
          <div className="space-y-2">
            <Label>Format *</Label>
            <div className="flex gap-2">
              {(["pdf", "excel", "csv"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
                    format === f ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {f === "pdf" ? "PDF Report" : f}
                </button>
              ))}
            </div>
          </div>

          {/* Group By */}
          <div className="space-y-2">
            <Label>Group By</Label>
            <div className="flex gap-2">
              <button
                onClick={() => setGroupBy("date")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  groupBy === "date" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                Date
              </button>
              <button
                onClick={() => setGroupBy("category")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  groupBy === "category" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                Category
              </button>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="email"
              checked={emailReport}
              onChange={(e) => setEmailReport(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-gray-300"
            />
            <label htmlFor="email" className="text-sm text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              Email report to <span className="text-indigo-600 font-medium">ramu@hps.edu.in</span>
            </label>
          </div>

          {/* Info */}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p>Export will include 18 income entries and 8 expense entries for April 2025.</p>
            <p className="mt-1">Estimated file size: ~0.4MB PDF</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Download className="w-4 h-4" />
              Export Ledger
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};