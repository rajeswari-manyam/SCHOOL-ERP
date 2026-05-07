import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileText } from "lucide-react";
import { ReceiptFilters } from "../components/ReceiptFilters";
import { ReceiptDetailModal } from "../components/ReceiptDetailModal";
import { ExportModal } from "../components/ExportModal";
import { GenerateReceiptModal } from "../components/GenerateReceiptModal";
import { useReceiptsManager } from "../hooks/useReceiptsManager";

import { formatCurrency } from "../../../../utils/formatters";
import { getModeBadge } from "../../../../utils/receipt";
import type { Receipt, ReceiptDetail } from "../types/receipts.types";
import Pagination from "../../../../components/ui/pagination";

export default function ReceiptsPage() {
  const { receipts } = useReceiptsManager();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptDetail | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const handleViewReceipt = (receipt: Receipt) => {
    const extendedReceipt: ReceiptDetail = {
      ...receipt,
      fatherName: "Suresh Kumar",
      admissionNo: "ADM001",
      referenceNo: "123456789012",
      period: "April 2025",
      collectedBy: "Ramu Teja",
    };
    setSelectedReceipt(extendedReceipt);
  };

  useEffect(() => {
    setPage(1);
  }, [receipts.length]);

  const total = receipts.length;

  const paginatedReceipts = receipts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="space-y-4 p-4 sm:p-6 bg-[#EFF4FF] min-h-screen">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Receipts & Invoices</h2>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
            All fee payment receipts and transactional logs
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none h-9 sm:h-8 text-xs gap-2"
            onClick={() => setShowExportModal(true)}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export All</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button
            size="sm"
            className="flex-1 sm:flex-none h-9 sm:h-8 text-xs bg-[#3525CD] hover:bg-[#2a1fb5] text-white gap-2"
            onClick={() => setShowGenerateModal(true)}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Generate Receipt</span>
            <span className="sm:hidden">Generate</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white p-1 rounded-lg border border-gray-200 w-full sm:w-fit overflow-x-auto no-scrollbar">
        {["All Receipts", "Generate Receipt", "Tax Invoices"].map((tab, idx) => (
          <button
            key={tab}
            onClick={() => { if (idx === 1) setShowGenerateModal(true); }}
            className={`px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-medium rounded-md transition-colors whitespace-nowrap flex-1 sm:flex-none ${
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

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {paginatedReceipts.map((receipt: Receipt) => (
          <div
            key={receipt.id}
            className="bg-white rounded-xl border border-gray-200 p-4 space-y-3"
          >
            {/* Top Row: Receipt No + Amount */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-blue-600">{receipt.receiptNo}</span>
                <div className="text-[10px] text-gray-500 mt-0.5">
                  {receipt.date} · {receipt.time}
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {formatCurrency(receipt.amount)}
              </span>
            </div>

            {/* Student Info */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div>
                <p className="text-xs font-medium text-gray-900">{receipt.student}</p>
                <p className="text-[10px] text-gray-500">{receipt.className} · {receipt.feeHead}</p>
              </div>
            </div>

            {/* Mode + Status */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium border ${getModeBadge(receipt.mode)}`}
              >
                {receipt.mode}
              </span>
              {receipt.waStatus === "Sent" ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-green-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />WA Sent
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />Not Sent
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewReceipt(receipt)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              {receipt.waStatus === "Not Sent" && (
                <button className="px-3 py-1.5 bg-blue-600 text-white text-[11px] font-medium rounded-lg hover:bg-blue-700">
                  Send Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block bg-white rounded-xl border border-gray-200 overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Receipt No", "Date & Time", "Student", "Class", "Fee Head", "Amount", "Mode", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedReceipts.map((receipt: Receipt) => (
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
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium border ${getModeBadge(receipt.mode)}`}
                  >
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
                    {receipt.waStatus === "Not Sent" && (
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
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        total={total}
        pageSize={pageSize}
        onChange={setPage}
        itemLabel="receipts"
        showPageNumbers={true}
      />

      {/* Generate Report */}
      <div className="flex justify-center">
        <Button variant="outline" className="h-9 px-6 text-xs bg-white border-gray-200 text-[#3525CD] hover:bg-gray-50">
          📊 Generate Report
        </Button>
      </div>

      {/* Modals */}
      {selectedReceipt && (
        <ReceiptDetailModal receipt={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}
      {showExportModal && (
        <ExportModal onClose={() => setShowExportModal(false)} />
      )}
      {showGenerateModal && (
        <GenerateReceiptModal
          onClose={() => setShowGenerateModal(false)}
          onSuccess={(receiptNo) => console.log("Created:", receiptNo)}
        />
      )}
    </div>
  );
}