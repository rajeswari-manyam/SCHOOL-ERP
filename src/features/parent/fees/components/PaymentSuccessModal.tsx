interface PaymentSuccessModalProps {
  amount: number;
  feeHead: string;
  mode: string;
  onDownload?: () => void;
  onBack: () => void;
}

export function PaymentSuccessModal({
  amount,
  feeHead,
  mode,
  onDownload,
  onBack,
}: PaymentSuccessModalProps) {
  const receiptNo = "RCP-2025-0848";
  const date = "7 April 2025";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Success icon */}
        <div className="flex flex-col items-center pt-8 pb-5 px-6">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M5 14l6 6L23 7"
                stroke="#16A34A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-[18px] font-bold text-emerald-600">Payment Successful!</p>
          <p className="text-[13px] text-gray-400 mt-1">
            Rs.{amount.toLocaleString("en-IN")} paid for Ravi Kumar
          </p>
        </div>

        {/* Receipt details */}
        <div className="mx-5 mb-5 rounded-xl border border-[#E8EBF2] bg-[#F8F9FF] overflow-hidden">
          <div className="grid grid-cols-2 gap-0">
            <div className="px-4 py-3 border-b border-[#E8EBF2]">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Receipt No</p>
              <p className="text-[13px] font-semibold text-[#0B1C30] font-mono">{receiptNo}</p>
            </div>
            <div className="px-4 py-3 border-b border-l border-[#E8EBF2]">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Date</p>
              <p className="text-[13px] font-semibold text-[#0B1C30]">{date}</p>
            </div>
            <div className="px-4 py-3 border-b border-[#E8EBF2]">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Student Details</p>
              <p className="text-[13px] font-semibold text-[#0B1C30]">Ravi Kumar</p>
              <p className="text-[11px] text-gray-400">Class: 10A</p>
            </div>
            <div className="px-4 py-3 border-b border-l border-[#E8EBF2]">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Fee Head</p>
              <p className="text-[13px] font-semibold text-[#0B1C30]">{feeHead}</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Mode</p>
              <p className="text-[13px] font-semibold text-[#0B1C30]">{mode}</p>
            </div>
            <div className="px-4 py-3 border-l border-[#E8EBF2]">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Amount</p>
              <p className="text-[13px] font-semibold text-emerald-600">
                Rs.{amount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* WhatsApp note */}
          <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border-t border-[#E8EBF2]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6.5" fill="#25D366" />
              <path d="M9.5 8.5c-.3.5-1 1-1.5.9C6 9 5 8 4.6 6c-.1-.5.3-1.2.8-1.5.2-.1.5 0 .6.2l.5.9c.1.2 0 .4-.1.6l-.2.3c.2.5.7 1 1.2 1.2l.3-.2c.2-.1.4-.2.6-.1l.9.5c.2.1.3.4.3.6Z" fill="white" />
            </svg>
            <p className="text-[12px] text-emerald-700">Receipt sent to +91 98765 43210 via WhatsApp</p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pb-6 flex flex-col gap-2">
          <button
            onClick={onDownload}
            className="w-full py-3 rounded-xl border border-[#E8EBF2] text-[13px] font-semibold text-[#3525CD] hover:bg-[#F5F4FF] transition-colors flex items-center justify-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v8M4 6l3 3 3-3M1 12h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download Receipt PDF
          </button>
          <button
            onClick={onBack}
            className="w-full py-3 rounded-xl bg-[#3525CD] hover:bg-[#2a1db5] active:scale-[0.98] transition-all text-white text-[13px] font-bold"
          >
            Back to Fees
          </button>
        </div>
      </div>
    </div>
  );
}