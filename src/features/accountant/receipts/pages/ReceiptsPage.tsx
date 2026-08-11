import { useState, useEffect } from "react";
import { Download, Eye, Loader2, Trash2 } from "lucide-react";
import { ReceiptFilters } from "../components/ReceiptFilters";
import { ReceiptDetailModal } from "../components/ReceiptDetailModal";
import { useReceiptsManager } from "../hooks/useReceiptsManager";
import { downloadRecordFeePayment } from "@/services/fee.api";

import { formatINR } from "../../../../utils/formatters";
import { getModeBadge } from "../../../../utils/receipt";
import type { Receipt, ReceiptDetail } from "../types/receipts.types";
import Pagination from "../../../../components/ui/pagination";

export default function ReceiptsPage() {
  const { receipts, isLoadingReceipts, handleDelete } = useReceiptsManager();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptDetail | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (id: string) => {
    setDownloadingId(id);
    try { await downloadRecordFeePayment(id); } finally { setDownloadingId(null); }
  };

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
  }, [(receipts || []).length]);

  const total = (receipts || []).length;

  const paginatedReceipts = (receipts || []).slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="space-y-4 px-4 sm:px-6 pt-2 pb-6 bg-white/50 min-h-screen -mx-4 md:-mx-6 lg:-mx-8 -mt-4 md:-mt-6 lg:-mt-8">

      {/* Header */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Receipts & Invoices</h2>
        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
          All fee payment receipts and transactional logs
        </p>
      </div>

      {/* Filters */}
      <ReceiptFilters />

      {/* Empty State */}
      {isLoadingReceipts ? (
        <div className="flex items-center justify-center py-16 bg-white rounded-xl border border-gray-200">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : (receipts || []).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-white rounded-xl border border-gray-200">
          <span className="text-4xl mb-3">🧾</span>
          <p className="text-sm font-medium">No receipts found</p>
          <p className="text-xs mt-1">Receipts will appear here once payments are recorded</p>
        </div>
      ) : (
      <>
      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {(paginatedReceipts || []).map((receipt: Receipt) => (
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
                {formatINR(receipt.amount)}
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
                <button
                  onClick={() => handleDownload(receipt.id)}
                  disabled={downloadingId === receipt.id}
                  className="p-2 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 disabled:opacity-50"
                >
                  {downloadingId === receipt.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDelete(receipt.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
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
            {(paginatedReceipts || []).map((receipt: Receipt) => (
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
                  <span className="text-xs font-semibold text-gray-900">{formatINR(receipt.amount)}</span>
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
                    <button
                      onClick={() => handleDownload(receipt.id)}
                      disabled={downloadingId === receipt.id}
                      className="p-1.5 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600 disabled:opacity-50"
                    >
                      {downloadingId === receipt.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(receipt.id)}
                      className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
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

      </>
      )}

      {/* Modals */}
      {selectedReceipt && (
        <ReceiptDetailModal receipt={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}
    </div>
  );
}