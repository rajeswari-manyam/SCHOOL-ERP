import React from "react";
import { formatCurrency } from "../utils/Fee.utils";

interface PaymentSuccessModalProps {
  receipt: {
    receiptNo: string;
    studentName: string;
    class: string;
    admissionNo: string;
    feeHead: string;
    amount: number;
    mode: string;
    upiRef?: string;
    date: string;
    parentPhone: string;
  };
  schoolName?: string;
  onRecordAnother: () => void;
  onClose: () => void;
}

export function PaymentSuccessModal({
  receipt,
  schoolName = "Hanamkonda Public School",
  onRecordAnother,
  onClose,
}: PaymentSuccessModalProps) {
  const handleDownloadPDF = () => {
    alert("PDF download would be triggered here");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        {/* Success header */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <span className="text-green-500 text-2xl">✓</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Payment Recorded Successfully!</h2>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
            <span>Receipt sent to parent via WhatsApp</span>
            <span className="text-green-500">💬</span>
          </div>
        </div>

        {/* Receipt card */}
        <div className="mx-6 mb-4 border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 text-center border-b border-gray-200">
            <div className="text-xs font-semibold text-gray-600 uppercase">{schoolName}</div>
            <div className="text-sm font-bold text-gray-800">Fee Receipt</div>
          </div>
          <div className="px-4 py-3 space-y-2 text-sm">
            <ReceiptRow label="Receipt No:" value={receipt.receiptNo} bold />
            <ReceiptRow label="Student:" value={receipt.studentName} bold />
            <ReceiptRow label="Class:" value={`${receipt.class} | Adm: ${receipt.admissionNo}`} />
            <ReceiptRow label="Fee Head:" value={receipt.feeHead} />
            <ReceiptRow label="Amount:" value={formatCurrency(receipt.amount)} bold accent />
            <ReceiptRow
              label="Mode:"
              value={`${receipt.mode}${receipt.upiRef ? ` | Ref: ${receipt.upiRef}` : ""}`}
            />
            <ReceiptRow label="Date:" value={receipt.date} />
          </div>
          <div className="border-t border-gray-100 px-4 py-2">
            <div className="flex items-center gap-1.5 text-xs text-green-600">
              <span>✓</span>
              <span>WhatsApp sent to {receipt.parentPhone}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 space-y-2">
          <button
            onClick={onRecordAnother}
            className="w-full py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Record Another Payment
          </button>
          <button
            onClick={handleDownloadPDF}
            className="w-full py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <span>📄</span> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function ReceiptRow({
  label,
  value,
  bold,
  accent,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-gray-500 flex-shrink-0">{label}</span>
      <span className={`text-right ${bold ? "font-semibold" : ""} ${accent ? "text-indigo-600" : "text-gray-800"}`}>
        {value}
      </span>
    </div>
  );
}