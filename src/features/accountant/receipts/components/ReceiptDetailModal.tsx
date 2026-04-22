import { X, Download, Printer, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { numberToWords } from "../../../../utils/number";
import type { ReceiptDetail } from "../types/receipts.types";

interface ReceiptDetailModalProps {
  receipt: ReceiptDetail;
  onClose: () => void;
}

export const ReceiptDetailModal = ({
  receipt,
  onClose,
}: ReceiptDetailModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/60 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base">📄</span>
            <span className="text-sm font-semibold text-gray-900">
              Receipt — {receipt.receiptNo}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="h-7 text-xs bg-[#3525CD] hover:bg-[#2a1fb5] text-white gap-1.5 px-3"
            >
              <Download className="w-3 h-3" />
              Download PDF
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Scrollable Content ── */}
        <div className="overflow-y-auto flex-1 p-5 bg-white">

          {/* School Header */}
          <div className="text-center mb-5">
            <div className="w-11 h-11 bg-[#3525CD] rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-2">
              HP
            </div>
            <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">
              Hanamkonda Public School
            </h3>
            <p className="text-[9px] text-gray-400 mt-0.5">
              Plot 45, Hanamkonda Urban | Ph: +91 99999 12345
            </p>
          </div>

          {/* Receipt Title */}
          <div className="text-center mb-4 pb-3 border-b border-dashed border-gray-300">
            <h4 className="text-[10px] font-bold text-gray-800 uppercase tracking-widest">
              Fee Receipt
            </h4>
            <p className="text-[9px] text-gray-400 mt-1">
              Receipt No: <span className="font-medium text-gray-600">{receipt.receiptNo}</span>
            </p>
            <p className="text-[9px] text-gray-400">
              Date: <span className="font-medium text-gray-600">{receipt.date}</span>
            </p>
          </div>

          {/* Student Info — 2-col grid like Figma */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-4 text-[11px]">
            <div>
              <span className="text-gray-400 block text-[9px] uppercase tracking-wide">Student</span>
              <span className="font-semibold text-gray-900">{receipt.student}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[9px] uppercase tracking-wide">Class</span>
              <span className="font-semibold text-gray-900">{receipt.className}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[9px] uppercase tracking-wide">Father</span>
              <span className="font-semibold text-gray-900">{receipt.fatherName}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[9px] uppercase tracking-wide">Adm No</span>
              <span className="font-semibold text-gray-900">{receipt.admissionNo}</span>
            </div>
          </div>

          {/* Fee Details Box */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4 text-[11px]">
            {/* Fee Head + Period row */}
            <div className="flex justify-between text-[9px] text-gray-400 uppercase tracking-wide mb-1">
              <span>Fee Head</span>
              <span>Period</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-900">{receipt.feeHead}</span>
              <span className="text-gray-600">{receipt.period}</span>
            </div>

            <div className="border-t border-gray-200 pt-2 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Mode:</span>
                <span className="font-medium text-gray-900">{receipt.mode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ref:</span>
                <span className="text-gray-600 font-mono text-[10px]">
                  {receipt.referenceNo || "—"}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center">
              <span className="font-semibold text-gray-800">Amount:</span>
              <span className="text-lg font-bold text-gray-900">
                Rs. {Number(receipt.amount).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="mb-5">
            <p className="text-[9px] text-gray-400 uppercase tracking-wide mb-1">
              Amount in Words:
            </p>
            <p className="text-[11px] font-medium text-gray-800 italic">
              {numberToWords(Number(receipt.amount))}
            </p>
          </div>

          {/* Signatures */}
          <div className="flex justify-between items-end pt-3 border-t border-gray-200">
            <div>
              <p className="text-[9px] text-gray-400 mb-0.5">Collected By:</p>
              <p className="text-[11px] font-semibold text-gray-900">{receipt.collectedBy}</p>
              <p className="text-[9px] text-gray-400 mt-3">Accountant Signature</p>
              <div className="w-24 h-px bg-gray-300 mt-1" />
            </div>

            <div className="text-center">
              <div className="w-14 h-14 border border-gray-300 rounded flex items-center justify-center text-[8px] text-gray-400">
                [SEAL]
              </div>
              <p className="text-[9px] text-gray-400 mt-1">School Seal</p>
            </div>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 border-t border-gray-100 shrink-0">
          <Button className="h-9 text-xs bg-[#3525CD] hover:bg-[#2a1fb5] text-white gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </Button>

          <Button variant="outline" className="h-9 text-xs gap-1.5 border-gray-300 text-gray-700">
            <Printer className="w-3.5 h-3.5" />
            Print
          </Button>

          <Button className="h-9 text-xs bg-green-500 hover:bg-green-600 text-white gap-1.5">
            <MessageCircle className="w-3.5 h-3.5" />
            Send via WhatsApp
          </Button>

          <Button variant="outline" className="h-9 text-xs gap-1.5 border-gray-300 text-gray-700">
            <Mail className="w-3.5 h-3.5" />
            Send via Email
          </Button>
        </div>
      </div>
    </div>
  );
};