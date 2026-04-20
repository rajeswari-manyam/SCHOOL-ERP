// components/ReceiptsPage.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileText } from "lucide-react";
import { ReceiptFilters } from "../components/ReceptFilter";
import { ReceiptDetailModal } from "../components/ReceiptDetailModal";
import { ExportModal } from "../components/ExportModal";
import { GenerateReceiptModal } from "../components/GenarateReceiptModal"; // ← NEW
import { useReceipts } from "../hooks/useReceipts";
import { formatCurrency } from "../utils/recept.utils";
import type { Receipt, PaymentMode } from "../types/receipts.types";

const getModeBadge = (mode: PaymentMode) => {
  const styles = {
    UPI: "bg-purple-100 text-purple-700 border-purple-200",
    Cash: "bg-green-100 text-green-700 border-green-200",
    Cheque: "bg-blue-100 text-blue-700 border-blue-200",
  };
  return styles[mode] || "bg-gray-100 text-gray-700";
};

const getModeIcon = (mode: PaymentMode) => {
  switch (mode) {
    case "UPI":    return <span className="text-xs">⚡</span>;
    case "Cash":   return <span className="text-xs">💵</span>;
    case "Cheque": return <span className="text-xs">📄</span>;
    default:       return null;
  }
};

interface ReceiptDetailData extends Receipt {
  fatherName: string;
  admissionNo: string;
  referenceNo: string;
  period: string;
  collectedBy: string;
}

export default function ReceiptsPage() {
  const { data } = useReceipts();
  const [selectedReceipt, setSelectedReceipt]     = useState<ReceiptDetailData | null>(null);
  const [showExportModal, setShowExportModal]       = useState(false);
  const [showGenerateModal, setShowGenerateModal]   = useState(false); // ← NEW

  const handleViewReceipt = (receipt: Receipt) => {
    const extendedReceipt: ReceiptDetailData = {
      ...receipt,
      fatherName:  "Suresh Kumar",
      admissionNo: "ADM001",
      referenceNo: "123456789012",
      period:      "April 2025",
      collectedBy: "Ramu Teja",
    };
    setSelectedReceipt(extendedReceipt);
  };

  return (
    <div className="space-y-4 p-6 bg-[#EFF4FF] min-h-screen">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Receipts & Invoices</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            All fee payment receipts and transactional logs
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 md:flex-none h-8 text-xs gap-2"
            onClick={() => setShowExportModal(true)}
          >
            <Download className="w-3.5 h-3.5" />
            Export All
          </Button>

          {/* ── GENERATE RECEIPT button — opens modal ── */}
          <Button
            size="sm"
            className="flex-1 md:flex-none h-8 text-xs bg-[#3525CD] hover:bg-[#2a1fb5] text-white gap-2"
            onClick={() => setShowGenerateModal(true)}
          >
            <FileText className="w-3.5 h-3.5" />
            Generate Receipt
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white p-1 rounded-lg border border-gray-200 w-full md:w-fit overflow-x-auto no-scrollbar">
        {["All Receipts", "Generate Receipt", "Tax Invoices"].map((tab, idx) => (
          <button
            key={tab}
            onClick={() => idx === 1 && setShowGenerateModal(true)} // ← tab also triggers modal
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex-1 md:flex-none ${
              idx === 0
                ? "bg-[#3525CD] text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <ReceiptFilters />

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Receipt No","Date & Time","Student","Class","Fee Head","Amount","Mode","Status","Actions"].map((h) => (
                <th key={h} className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((receipt) => (
              <tr key={receipt.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className="text-xs font-medium text-blue-600">{receipt.receiptNo}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs text-gray-900">{receipt.date}</div>
                  <div className="text-[10px] text-gray-500">{receipt.time}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-medium text-gray-900">{receipt.student}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-gray-600">{receipt.className}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-gray-600">{receipt.feeHead}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold text-gray-900">{formatCurrency(receipt.amount)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium border ${getModeBadge(receipt.mode)}`}>
                    {getModeIcon(receipt.mode)}
                    {receipt.mode}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {receipt.waStatus === "Sent" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-green-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />WA Sent
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />Not Sent
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleViewReceipt(receipt)} className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600">
                      <Download className="w-4 h-4" />
                    </button>
                    {receipt.status === "Not Sent" && (
                      <button className="px-2 py-1 bg-blue-600 text-white text-[10px] font-medium rounded hover:bg-blue-700">
                        Send Now
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <span className="text-xs text-gray-500">Showing 1-10 of 24</span>
          <div className="flex gap-1">
            <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50">‹</button>
            <button className="w-7 h-7 flex items-center justify-center rounded bg-blue-600 text-white text-xs">1</button>
            <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs">2</button>
            <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50">›</button>
          </div>
        </div>
      </div>

      {/* Generate Report */}
      <div className="flex justify-center">
        <Button variant="outline" className="h-9 px-6 text-xs bg-white border-gray-200 text-[#3525CD] hover:bg-gray-50">
          📊 Generate Report
        </Button>
      </div>

      {/* ── MODALS ── */}
      {selectedReceipt && (
        <ReceiptDetailModal receipt={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}
      {showExportModal && (
        <ExportModal onClose={() => setShowExportModal(false)} />
      )}
      {/* NEW ↓ */}
      {showGenerateModal && (
        <GenerateReceiptModal
          onClose={() => setShowGenerateModal(false)}
          onSuccess={(receiptNo) => console.log("Created:", receiptNo)}
        />
      )}
    </div>
  );
}