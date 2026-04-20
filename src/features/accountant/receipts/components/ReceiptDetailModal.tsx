// components/ReceiptDetailModal.tsx
import { X, Download, Printer, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Receipt } from "../types/receipts.types";

// Extended interface that includes all fields needed for display
interface ReceiptDetailData extends Receipt {
  fatherName: string;
  admissionNo: string;
  referenceNo: string;
  period: string;
  collectedBy: string;
}

interface ReceiptDetailModalProps {
  receipt: ReceiptDetailData;
  onClose: () => void;
}

export const ReceiptDetailModal = ({ receipt, onClose }: ReceiptDetailModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 text-sm">📄</span>
            <span className="text-sm font-semibold text-gray-900">
              Receipt — {receipt.receiptNo}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1.5 px-3"
            >
              <Download className="w-3 h-3" />
              Download PDF
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6 bg-white">
          {/* School Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
              HP
            </div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Hanamkonda Public School
            </h3>
            <p className="text-[10px] text-gray-500 mt-1">
              Plot 45, Hanamkonda Urban | Ph: +91 99999 12345
            </p>
          </div>

          {/* Receipt Title */}
          <div className="text-center mb-4 pb-4 border-b border-dashed border-gray-300">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Fee Receipt
            </h4>
            <p className="text-[10px] text-gray-500 mt-1">
              Receipt No: {receipt.receiptNo}
            </p>
            <p className="text-[10px] text-gray-500">
              Date: {receipt.date}
            </p>
          </div>

          {/* Student Details */}
          <div className="space-y-2 mb-4 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Student:</span>
              <span className="font-medium text-gray-900">{receipt.student}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Father:</span>
              <span className="font-medium text-gray-900">{receipt.fatherName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Class:</span>
              <span className="font-medium text-gray-900">{receipt.className}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Adm No:</span>
              <span className="font-medium text-gray-900">{receipt.admissionNo}</span>
            </div>
          </div>

          {/* Fee Details */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-gray-500 uppercase">Fee Head</span>
              <span className="text-[10px] text-gray-500 uppercase">Period</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-gray-900">{receipt.feeHead}</span>
              <span className="text-xs text-gray-600">{receipt.period}</span>
            </div>
            
            <div className="border-t border-gray-200 pt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Mode:</span>
                <span className="font-medium text-gray-900">{receipt.mode}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Ref:</span>
                <span className="text-gray-600 font-mono text-[10px]">{receipt.referenceNo}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center">
              <span className="text-xs font-semibold text-gray-900">Amount:</span>
              <span className="text-lg font-bold text-gray-900">
                Rs. {receipt.amount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="mb-6">
            <p className="text-[10px] text-gray-500 uppercase mb-1">Amount in Words:</p>
            <p className="text-xs font-medium text-gray-900 italic">
              {numberToWords(receipt.amount)}
            </p>
          </div>

          {/* Signatures */}
          <div className="flex justify-between items-end pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-[10px] text-gray-500 mb-1">Collected By:</p>
              <p className="text-xs font-medium text-gray-900">{receipt.collectedBy}</p>
              <p className="text-[10px] text-gray-400 mt-2">Accountant Signature</p>
              <div className="w-24 h-px bg-gray-300 mt-1"></div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 border border-gray-300 rounded flex items-center justify-center text-[8px] text-gray-400 mb-1">
                [SEAL]
              </div>
              <p className="text-[10px] text-gray-400">School Seal</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 border-t border-gray-100">
          <Button
            className="h-9 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            className="h-9 text-xs gap-2 border-gray-300"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </Button>
          <Button
            className="h-9 text-xs bg-green-500 hover:bg-green-600 text-white gap-2"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Send via WhatsApp
          </Button>
          <Button
            variant="outline"
            className="h-9 text-xs gap-2 border-gray-300"
          >
            <Mail className="w-3.5 h-3.5" />
            Send via Email
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper function to convert number to words
function numberToWords(num: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  
  if (num === 0) return "Zero Rupees Only";
  
  let words = "";
  
  // Thousands
  if (num >= 1000) {
    words += ones[Math.floor(num / 1000)] + " Thousand ";
    num %= 1000;
  }
  
  // Hundreds
  if (num >= 100) {
    words += ones[Math.floor(num / 100)] + " Hundred ";
    num %= 100;
  }
  
  // Tens and ones
  if (num >= 20) {
    words += tens[Math.floor(num / 10)] + " ";
    num %= 10;
  } else if (num >= 10) {
    words += teens[num - 10] + " ";
    num = 0;
  }
  
  if (num > 0) {
    words += ones[num] + " ";
  }
  
  return words.trim() + " Rupees Only";
}