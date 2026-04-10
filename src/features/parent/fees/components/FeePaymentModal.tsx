import { useState } from "react";
import type { Fee } from "../types/fee.types";

interface PaymentModalProps {
  fee: Fee;
  onClose: () => void;
  onSuccess: (mode: string, amount: number) => void;
}

export function PaymentModal({ fee, onClose, onSuccess }: PaymentModalProps) {
  const [isCustom, setIsCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState(fee.amount);

  const finalAmount = isCustom ? customAmount : fee.amount;

  const handleProceed = () => {
    onSuccess("UPI", finalAmount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4F6FA]">
          <p className="text-[16px] font-bold text-[#0B1C30]">Pay Fee Online</p>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">

          {/* Student info */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F8F9FF] border border-[#E8EBF2]">
            <div className="w-8 h-8 rounded-full bg-[#3525CD] flex items-center justify-center text-[12px] font-bold text-white shrink-0">
              RK
            </div>
            <p className="text-[13px] font-semibold text-[#0B1C30]">Ravi Kumar | Class 10A | ADM-001</p>
          </div>

          {/* Fee details */}
          <div>
            <p className="text-[14px] font-bold text-[#0B1C30]">{fee.term}</p>
            <p className="text-[12px] text-gray-400 mt-0.5">Amount: Rs.{fee.amount.toLocaleString("en-IN")}</p>
            <p className="text-[12px] text-[#BA1A1A] mt-0.5">Due: {fee.dueDate}</p>
          </div>

          {/* Payment options */}
          <div className="flex flex-col gap-2">
            {/* Full amount option */}
            <button
              onClick={() => setIsCustom(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                !isCustom
                  ? "border-[#3525CD] bg-[#F5F4FF]"
                  : "border-[#E8EBF2] hover:border-[#C7C3F5]"
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${!isCustom ? "border-[#3525CD]" : "border-gray-300"}`}>
                {!isCustom && <div className="w-2 h-2 rounded-full bg-[#3525CD]" />}
              </div>
              <span className="text-[13px] font-semibold text-[#0B1C30]">
                Pay Full Amount: Rs.{fee.amount.toLocaleString("en-IN")}
              </span>
            </button>

            {/* Custom amount option */}
            <button
              onClick={() => setIsCustom(true)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                isCustom
                  ? "border-[#3525CD] bg-[#F5F4FF]"
                  : "border-[#E8EBF2] hover:border-[#C7C3F5]"
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isCustom ? "border-[#3525CD]" : "border-gray-300"}`}>
                {isCustom && <div className="w-2 h-2 rounded-full bg-[#3525CD]" />}
              </div>
              <span className="text-[13px] font-semibold text-[#0B1C30]">Pay Custom Amount</span>
            </button>

            {isCustom && (
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-gray-400">Rs.</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E8EBF2] text-[13px] font-semibold text-[#0B1C30] focus:outline-none focus:border-[#3525CD]"
                />
              </div>
            )}
          </div>

          {/* Proceed button */}
          <button
            onClick={handleProceed}
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] transition-all text-white text-[14px] font-bold"
          >
            Proceed to Razorpay
          </button>

          {/* Security note */}
          <p className="text-center text-[11px] text-gray-400">
            🔒 Secure payment powered by Razorpay — 256-bit SSL
          </p>
        </div>
      </div>
    </div>
  );
}