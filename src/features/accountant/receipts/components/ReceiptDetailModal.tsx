import { useState } from "react";
import { X, Download, Printer, Mail, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { numberToWords } from "../../../../utils/number";
import type { ReceiptDetail } from "../types/receipts.types";

interface ReceiptDetailModalProps {
  receipt: ReceiptDetail;
  onClose: () => void;
}

const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export const ReceiptDetailModal = ({
  receipt,
  onClose,
}: ReceiptDetailModalProps) => {
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const feeItems = [
    {
      head: receipt.feeHead,
      amount: receipt.amount,
      paid: receipt.amount,
      balance: 0,
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("receipt-content");
    if (!element) return;
    setIsPdfLoading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`receipt-${receipt.receiptNo}.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setIsPdfLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .fixed.inset-0 {
            position: static !important;
            background: transparent !important;
            backdrop-filter: none !important;
          }
          .fixed.inset-0 > div {
            max-height: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            width: 100% !important;
          }
          #receipt-content {
            padding: 24px !important;
          }
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm sm:p-4">
        <div className="bg-white rounded-t-xl sm:rounded-xl shadow-2xl w-full sm:max-w-md flex flex-col max-h-[92vh] sm:max-h-[90vh]">

          {/* ── Header ── */}
          <div className="no-print flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/60 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base flex-shrink-0">📄</span>
              <span className="text-sm font-semibold text-gray-900 truncate">
                Receipt — {receipt.receiptNo}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Receipt Content ── */}
          <div
            id="receipt-content"
            className="overflow-y-auto flex-1 p-4 sm:p-5 bg-white"
          >
            {/* School Header */}
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-[#3525CD] rounded-full flex items-center justify-center text-white font-bold text-base mx-auto mb-2">
                HP
              </div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                Hanamkonda Public School
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Plot 45, Hanamkonda Urban | Ph: +91 99999 12345
              </p>
            </div>

            {/* Receipt Title */}
            <div className="text-center mb-4 pb-4 border-b border-dashed border-gray-300">
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest">
                Fee Receipt
              </h4>
              <div className="flex justify-center gap-4 mt-1.5">
                <p className="text-xs text-gray-400">
                  No: <span className="font-medium text-gray-600">{receipt.receiptNo}</span>
                </p>
                <p className="text-xs text-gray-400">
                  Date: <span className="font-medium text-gray-600">{receipt.date}</span>
                </p>
              </div>
            </div>

            {/* Student Info */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm">
              <div>
                <span className="text-gray-400 block text-xs uppercase tracking-wide">Student</span>
                <span className="font-semibold text-gray-900 truncate block">{receipt.student}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs uppercase tracking-wide">Class</span>
                <span className="font-semibold text-gray-900">{receipt.className}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs uppercase tracking-wide">Father</span>
                <span className="font-semibold text-gray-900 truncate block">{receipt.fatherName}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs uppercase tracking-wide">Adm No</span>
                <span className="font-semibold text-gray-900">{receipt.admissionNo}</span>
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                Fee Breakdown
              </h5>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-200">
                    <th className="text-left pb-2 font-medium">Fee Head</th>
                    <th className="text-right pb-2 font-medium">Amount</th>
                    <th className="text-right pb-2 font-medium">Paid</th>
                    <th className="text-right pb-2 font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {feeItems.map((item, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 font-semibold text-gray-900">
                        {item.head}
                      </td>
                      <td className="py-2 text-right text-gray-600">
                        {formatINR(item.amount)}
                      </td>
                      <td className="py-2 text-right font-medium text-green-700">
                        {formatINR(item.paid)}
                      </td>
                      <td className="py-2 text-right text-gray-500">
                        {formatINR(item.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-300">
                    <td className="pt-2 font-bold text-gray-800">Total</td>
                    <td className="pt-2 text-right font-bold text-gray-800">
                      {formatINR(receipt.amount)}
                    </td>
                    <td className="pt-2 text-right font-bold text-green-700">
                      {formatINR(receipt.amount)}
                    </td>
                    <td className="pt-2 text-right font-bold text-gray-500">
                      ₹0
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Payment Details */}
            <div className="border-t border-gray-200 pt-3 mb-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Mode:</span>
                <span className="font-medium text-gray-900">{receipt.mode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reference No:</span>
                <span className="text-gray-600 font-mono text-xs break-all">
                  {receipt.referenceNo || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Period:</span>
                <span className="font-medium text-gray-900">{receipt.period}</span>
              </div>
            </div>

            {/* Amount in Words */}
            <div className="mb-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                Amount in Words
              </p>
              <p className="text-sm font-medium text-gray-800 italic break-words">
                {numberToWords(Number(receipt.amount))}
              </p>
            </div>

            {/* Signatures */}
            <div className="flex justify-between items-end pt-4 border-t border-gray-200">
              <div className="min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">Collected By:</p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {receipt.collectedBy}
                </p>
                <p className="text-xs text-gray-400 mt-3">Accountant Signature</p>
                <div className="w-24 h-px bg-gray-300 mt-1" />
              </div>

              <div className="text-center flex-shrink-0">
                <div className="w-14 h-14 border border-gray-300 rounded flex items-center justify-center text-xs text-gray-400">
                  [SEAL]
                </div>
                <p className="text-xs text-gray-400 mt-1">School Seal</p>
              </div>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="no-print grid grid-cols-2 gap-2 p-3 bg-gray-50 border-t border-gray-100 shrink-0">
            <Button
              className="h-10 sm:h-9 text-xs bg-[#3525CD] hover:bg-[#2a1fb5] text-white gap-1.5"
              onClick={handleDownloadPDF}
              disabled={isPdfLoading}
            >
              {isPdfLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">
                {isPdfLoading ? "Generating..." : "Download PDF"}
              </span>
              <span className="sm:hidden">
                {isPdfLoading ? "..." : "Download"}
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-10 sm:h-9 text-xs gap-1.5 border-gray-300 text-gray-700"
              onClick={handlePrint}
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </Button>

            <Button className="h-10 sm:h-9 text-xs bg-green-500 hover:bg-green-600 text-white gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send via WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </Button>

            <Button
              variant="outline"
              className="h-10 sm:h-9 text-xs gap-1.5 border-gray-300 text-gray-700"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send via Email</span>
              <span className="sm:hidden">Email</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
