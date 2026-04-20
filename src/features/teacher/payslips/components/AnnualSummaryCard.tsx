import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_ANNUAL_SUMMARY } from "../hooks/usePayslip";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

interface Props {
  onDownload: () => void;
}

const AnnualSummaryCard = ({ onDownload }: Props) => {
  const s = MOCK_ANNUAL_SUMMARY;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">Annual Summary</p>
          <p className="text-base font-extrabold text-gray-900">FY {s.year}–{String(s.year + 1).slice(-2)}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center">
          <FileText size={16} className="text-indigo-600" strokeWidth={2} />
        </div>
      </div>

      {/* Three stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total Earned</p>
          <p className="text-base font-extrabold text-gray-900">{inr(s.totalEarned)}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-1">Deductions</p>
          <p className="text-base font-extrabold text-red-600">{inr(s.totalDeductions)}</p>
        </div>
        <div className="bg-indigo-50 rounded-xl p-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-1">Total Net</p>
          <p className="text-base font-extrabold text-indigo-700">{inr(s.totalNet)}</p>
        </div>
      </div>

      {/* Download Annual Statement */}
      <Button
        onClick={onDownload}
        variant="outline"
        className="gap-2 w-full justify-center border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white"
        style={{ height: 40 }}
      >
        <Download size={14} className="text-current" strokeWidth={2} />
        Download Annual Statement
      </Button>
    </div>
  );
};

export default AnnualSummaryCard;
