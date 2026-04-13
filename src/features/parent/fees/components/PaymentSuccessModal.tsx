








import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import typography from "@/styles/typography";
import { cn } from "@/utils/cn";

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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onBack}
      />

      {/* CARD */}
      <Card className="relative z-10 w-full max-w-[400px] overflow-hidden">

        {/* SUCCESS HEADER */}
        <CardContent className="flex flex-col items-center pt-8 pb-5 px-6">

          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
              <path
                d="M5 14l6 6L23 7"
                stroke="#16A34A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className={cn(typography.heading.h6, "text-emerald-600")}>
            Payment Successful!
          </p>

          <p className={cn(typography.body.small, "text-gray-400 mt-1 text-center")}>
            Rs.{amount.toLocaleString("en-IN")} paid for Ravi Kumar
          </p>
        </CardContent>

        {/* DETAILS */}
        <CardContent className="mx-5 mb-4 rounded-xl overflow-hidden text-[#0B1C30] p-0">

          {/* Receipt + Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="px-4 py-3 bg-[#F8FAFC] hover:bg-[#3525CD] group transition-colors cursor-default">
              <p className="text-xs text-gray-400 uppercase group-hover:text-white/70">Receipt No</p>
              <p className="text-sm font-bold font-mono group-hover:text-white">{receiptNo}</p>
            </div>

            <div className="px-4 py-3 bg-[#F8FAFC] hover:bg-[#3525CD] group transition-colors cursor-default">
              <p className="text-xs text-gray-400 uppercase group-hover:text-white/70">Date</p>
              <p className="text-sm font-bold group-hover:text-white">{date}</p>
            </div>
          </div>

          {/* Student */}
          <div className="px-4 py-3 bg-[#F8FAFC] hover:bg-[#3525CD] group transition-colors cursor-default">
            <p className="text-xs text-gray-400 uppercase group-hover:text-white/70">Student Details</p>
            <p className="text-sm font-bold group-hover:text-white">
              Ravi Kumar{" "}
              <span className="text-gray-400 font-normal group-hover:text-white/70">Class: 10A</span>
            </p>
          </div>

          {/* Fee Head */}
          <div className="px-4 py-3 bg-[#F8FAFC] hover:bg-[#3525CD] group transition-colors cursor-default">
            <p className="text-xs text-gray-400 uppercase group-hover:text-white/70">Fee Head</p>
            <p className="text-sm font-bold group-hover:text-white">{feeHead}</p>
          </div>

          {/* Mode + Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="px-4 py-3 bg-[#F8FAFC] hover:bg-[#3525CD] group transition-colors cursor-default">
              <p className="text-xs text-gray-400 uppercase group-hover:text-white/70">Mode</p>
              <p className="text-sm font-bold group-hover:text-white">{mode}</p>
            </div>

            <div className="px-4 py-3 bg-[#F8FAFC] hover:bg-[#3525CD] group transition-colors cursor-default">
              <p className="text-xs text-gray-400 uppercase group-hover:text-white/70">Amount</p>
              <p className="text-sm font-bold text-emerald-600 group-hover:text-white">
                Rs.{amount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="8" fill="#25D366" />
              <path
                d="M10.8 9.7c-.3.6-1.1 1.1-1.8 1C7 10.3 5.7 9 5.4 7c-.1-.7.4-1.5 1-1.8.3-.1.6 0 .7.2l.6 1.1c.1.2 0 .5-.2.7l-.3.3c.3.6.8 1.1 1.4 1.4l.3-.3c.2-.2.5-.3.7-.2l1.1.6c.3.1.3.4.1.7Z"
                fill="white"
              />
            </svg>

            <p className="text-xs text-emerald-700">
              Receipt sent to +91 98765 43210 via WhatsApp
            </p>
          </div>
        </CardContent>

        {/* ACTIONS */}
        <CardContent className="px-5 pb-6 flex flex-col gap-2.5">

          <Button
            onClick={onDownload}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 text-[#3525CD] border-[#E8EBF2] hover:bg-[#F5F4FF]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 1v8M4 6l3 3 3-3M1 12h12"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Download Receipt PDF
          </Button>

          <Button
            onClick={onBack}
            className="w-full bg-[#3525CD] hover:bg-[#2a1db5] text-white"
          >
            Back to Fees
          </Button>

        </CardContent>

      </Card>
    </div>
  );
}