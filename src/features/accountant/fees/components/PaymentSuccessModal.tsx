
import { useState } from "react";
import { SendFeeReminderModal } from "./SendRemainderModal";
import type{Props} from "../types/fees.types";


export function PaymentSuccessModal({
  receiptNo, amount, paymentMode, paymentDate,
  studentName, studentClass, onRecordAnother, onClose,
}: Props) {

  const [showReminder, setShowReminder] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 w-[340px] bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-8 pb-5 text-center border-b border-slate-100">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
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
            <svg className="w-3.5 h-3.5 text-green-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z"/>
            </svg>
            WhatsApp receipt sent to +91 98765 43210
            <svg className="ml-auto w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          </div>

        <button
          onClick={onRecordAnother}
          className="w-full py-3 rounded-xl bg-[#3525CD] hover:bg-[#2a1fb5] text-white text-sm font-semibold transition-colors"
        >
          Record Another Payment
        </button>
          <button onClick={onClose} className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
            Download Receipt PDF
          </button>
        </div>
      </div>
      // Add at the bottom before closing tag:
{showReminder && (
  <SendFeeReminderModal onClose={() => { setShowReminder(false); onClose(); }} />
)}
    </div>
    
  );
}