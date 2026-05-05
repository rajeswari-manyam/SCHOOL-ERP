import { useState } from "react";
import { SendFeeReminderModal } from "./SendRemainderModal";
import type { Props } from "../types/fees.types";
import { CheckCircle2, MessageCircle, Check } from "lucide-react";

export function PaymentSuccessModal({
  receiptNo, amount, paymentMode, paymentDate,
  studentName, studentClass, onRecordAnother, onClose,
}: Props) {

  const [showReminder, setShowReminder] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 w-[340px] bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-8 pb-5 text-center border-b border-slate-100">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={28} strokeWidth={2.5} className="text-green-700" />
          </div>
          <h2 className="text-lg font-bold text-green-600">Payment Recorded!</h2>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">

          {/* Receipt details */}
          <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm space-y-1">
            <p className="font-semibold text-slate-800">Receipt No: {receiptNo}</p>
            <p className="text-slate-500">Rs.{amount.toLocaleString()} | {paymentMode} | {paymentDate}</p>
            <p className="text-slate-500">Student: {studentName} — {studentClass}</p>
          </div>

          {/* WhatsApp confirmation */}
          <div className="flex items-center gap-2 px-3 py-2.5 bg-green-50 rounded-xl text-xs text-green-800 font-medium">
            <MessageCircle size={14} strokeWidth={2} className="text-green-700 flex-shrink-0" />
            WhatsApp receipt sent to +91 98765 43210
            <Check size={14} strokeWidth={2.5} className="ml-auto text-green-600" />
          </div>

          <button
            onClick={onRecordAnother}
            className="w-full py-3 rounded-xl bg-[#3525CD] hover:bg-[#2a1fb5] text-white text-sm font-semibold transition-colors"
          >
            Record Another Payment
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Download Receipt PDF
          </button>
        </div>
      </div>

      {showReminder && (
        <SendFeeReminderModal onClose={() => { setShowReminder(false); onClose(); }} />
      )}
    </div>
  );
}