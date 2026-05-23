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
      className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="px-5 sm:px-6 pt-7 pb-4 text-center border-b border-slate-100">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={26} className="text-green-700" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-green-600">
            Payment Recorded!
          </h2>
        </div>

        {/* Body (scrollable if needed) */}
        <div className="px-5 sm:px-6 py-4 space-y-4 overflow-y-auto">

          {/* Receipt */}
          <div className="bg-slate-50 rounded-xl px-3 py-3 text-xs sm:text-sm space-y-1">
            <p className="font-semibold text-slate-800 break-words">
              Receipt No: {receiptNo}
            </p>
            <p className="text-slate-500">
              ₹{amount.toLocaleString()} | {paymentMode} | {paymentDate}
            </p>
            <p className="text-slate-500 break-words">
              {studentName} — {studentClass}
            </p>
          </div>

          {/* WhatsApp */}
          <div className="flex items-center gap-2 px-3 py-2.5 bg-green-50 rounded-xl text-xs sm:text-sm text-green-800 font-medium">
            <MessageCircle size={14} className="text-green-700 flex-shrink-0" />
            <span className="truncate">
              WhatsApp receipt sent successfully
            </span>
            <Check size={14} className="ml-auto text-green-600" />
          </div>

          {/* Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={onRecordAnother}
              className="w-full py-3 rounded-xl bg-[#3525CD] hover:bg-[#2a1fb5] text-white text-sm font-semibold transition-colors active:scale-[0.98]"
            >
              Record Another Payment
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors active:scale-[0.98]"
            >
              Download Receipt PDF
            </button>
          </div>
        </div>
      </div>

      {showReminder && (
        <SendFeeReminderModal onClose={() => { setShowReminder(false); onClose(); }} />
      )}
    </div>
  );
}