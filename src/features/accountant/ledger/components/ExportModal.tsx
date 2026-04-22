import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Download, Mail } from "lucide-react";
import { useState } from "react";
import { Toggle } from "../../../../components/ui/toggle";
import typography, { combineTypography } from "@/styles/typography";
interface ExportModalProps {
  onClose: () => void;
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span
    className={combineTypography(
      typography.body.xs,
      "font-semibold text-gray-500 uppercase tracking-wide block mb-1.5"
    )}
  >
    {children}
  </span>
);

const chipCls = (active: boolean, dark = false) =>
  `${combineTypography(typography.body.xs)} px-3 py-1.5 sm:px-4 sm:py-2 font-medium rounded-lg transition-all ${
    active
      ? dark
        ? "bg-gray-800 text-white"
        : "bg-indigo-600 text-white"
      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
  }`;

const inputDateCls =
  "w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-[#EFF4FF] text-gray-700 h-8";

export const ExportModal = ({ onClose }: ExportModalProps) => {
  const [period, setPeriod] = useState<"thisMonth" | "lastMonth" | "custom">("thisMonth");
  const [format, setFormat] = useState<"pdf" | "excel" | "csv">("pdf");
  const [groupBy, setGroupBy] = useState<"date" | "category">("date");
  const [includeIncome, setIncludeIncome] = useState(true);
  const [emailReport, setEmailReport] = useState(true);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      {/* White card, fixed max-height, flex column */}
      <Card
        className="w-full max-w-md bg-white shadow-xl flex flex-col overflow-hidden"
        style={{ maxHeight: "85vh" }}
      >
        {/* ── Sticky Header ── */}
        <CardHeader className="flex flex-row items-center justify-between py-3 px-5 border-b border-gray-100 shrink-0 bg-white">
          <div>
            <CardTitle className={combineTypography(typography.heading.h6, "text-gray-800")}>Export Ledger</CardTitle>
            <p className={combineTypography(typography.body.xs, "text-gray-400 mt-0.5")}>
              Download financial records for the selected period
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </CardHeader>

        {/* ── Scrollable Body ── */}
        <CardContent className="px-5 py-3 space-y-4 overflow-y-auto flex-1 bg-white">

          {/* Period */}
          <div>
            <SectionLabel>Period</SectionLabel>
            <div className="flex gap-2">
              <button onClick={() => setPeriod("thisMonth")} className={chipCls(period === "thisMonth")}>
                This Month
              </button>
              <button onClick={() => setPeriod("lastMonth")} className={chipCls(period === "lastMonth")}>
                Last Month
              </button>
              <button onClick={() => setPeriod("custom")} className={chipCls(period === "custom")}>
                Custom Range
              </button>
            </div>

            {period === "custom" && (
              <div className="grid grid-cols-2 gap-3 mt-2.5">
                <div>
                  <span className={combineTypography(
  typography.body.xs,
  "font-semibold text-gray-500 uppercase tracking-wide block mb-1"
)}>
                    From *
                  </span>
                  <input type="date" defaultValue="2025-04-01" className={inputDateCls} />
                </div>
                <div>
                  <span className={combineTypography(
  typography.body.xs,
  "font-semibold text-gray-500 uppercase tracking-wide block mb-1"
)}>
                    To *
                  </span>
                  <input type="date" defaultValue="2025-04-07" className={inputDateCls} />
                </div>
              </div>
            )}
          </div>

          {/* Include */}
          <div>
            <SectionLabel>Include</SectionLabel>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={combineTypography(typography.body.small, "text-gray-700")}>Income entries</span>
                <Toggle
                  checked={includeIncome}
                  onCheckedChange={setIncludeIncome}
                />
              </div>
            </div>
          </div>

          {/* Format */}
          <div>
            <SectionLabel>Format *</SectionLabel>
            <div className="flex gap-2">
              <button onClick={() => setFormat("pdf")} className={chipCls(format === "pdf")}>
                PDF Report
              </button>
              <button onClick={() => setFormat("excel")} className={chipCls(format === "excel")}>
                Excel
              </button>
              <button onClick={() => setFormat("csv")} className={chipCls(format === "csv")}>
                CSV
              </button>
            </div>
          </div>

          {/* Group By */}
          <div>
            <SectionLabel>Group By</SectionLabel>
            <div className="flex gap-2">
              <button onClick={() => setGroupBy("date")} className={chipCls(groupBy === "date", true)}>
                Date
              </button>
              <button onClick={() => setGroupBy("category")} className={chipCls(groupBy === "category", true)}>
                Category
              </button>
            </div>
          </div>

          {/* Email checkbox */}
          <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="email"
              checked={emailReport}
              onChange={(e) => setEmailReport(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded border-gray-300 shrink-0"
            />
            <label htmlFor="email" className="text-xs text-gray-700 flex items-center gap-1.5 cursor-pointer">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              Email report to{" "}
              <span className="text-indigo-600 font-medium">ramu@hps.edu.in</span>
            </label>
          </div>

          {/* Info note */}
          <div className="text-[11px] text-gray-500 bg-gray-50 px-3 py-2 rounded-lg leading-relaxed">
            <p>Export will include 18 income entries and 8 expense entries for April 2025.</p>
            <p className="mt-0.5">Estimated file size: ~0.4MB PDF</p>
          </div>

        </CardContent>

        {/* ── Sticky Footer ── */}
        <div className="flex gap-3 px-5 py-3 border-t border-gray-100 shrink-0 bg-white">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-8 text-sm text-gray-600"
          >
            Cancel
          </Button>
          <Button className="flex-1 h-8 text-sm bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Export Ledger
          </Button>
        </div>
      </Card>
    </div>
  );
};