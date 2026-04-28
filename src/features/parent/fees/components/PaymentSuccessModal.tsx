import { useEffect } from "react";
import { Check, MessageCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import typography from "@/styles/typography";
import { cn } from "@/utils/cn";

import type { PaymentSuccessModalProps } from "../types/fee.types";
import { paymentSuccessDefaults } from "../data/fee.data";

export function PaymentSuccessModal({
  amount,
  feeHead,
  mode,
  receiptNo = paymentSuccessDefaults.receiptNo,
  date = paymentSuccessDefaults.date,
  studentName = paymentSuccessDefaults.studentName,
  className = paymentSuccessDefaults.className,
  whatsappNumber = paymentSuccessDefaults.whatsappNumber,
  onDownload,
  onBack,
}: PaymentSuccessModalProps) {

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

      <Card className="relative z-10 w-full max-w-[400px] overflow-hidden">

        {/* HEADER */}
        <CardContent className="flex flex-col items-center pt-8 pb-5 px-6">

          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <Check size={26} className="text-emerald-600" />
          </div>

          <p className={cn(typography.heading.h6, "text-emerald-600")}>
            Payment Successful!
          </p>

          <p className={cn(typography.body.small, "text-gray-400 mt-1 text-center")}>
            Rs.{amount.toLocaleString("en-IN")} paid for {studentName}
          </p>

        </CardContent>

        {/* DETAILS */}
        <CardContent className="mx-5 mb-4 rounded-xl overflow-hidden p-0 text-[#0B1C30]">

          <div className="grid grid-cols-1 sm:grid-cols-2">
            <Detail label="Receipt No" value={receiptNo} mono />
            <Detail label="Date" value={date} />
          </div>

          <Detail
            label="Student Details"
            value={`${studentName} | Class: ${className}`}
          />

          <Detail label="Fee Head" value={feeHead} />

          <div className="grid grid-cols-1 sm:grid-cols-2">
            <Detail label="Mode" value={mode} />
            <Detail
              label="Amount"
              value={`Rs.${amount.toLocaleString("en-IN")}`}
              highlight
            />
          </div>

          {/* WhatsApp */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50">
            <MessageCircle size={16} className="text-emerald-600" />
            <p className="text-xs text-emerald-700">
              Receipt sent to {whatsappNumber} via WhatsApp
            </p>
          </div>

        </CardContent>

        {/* ACTIONS */}
        <CardContent className="px-5 pb-6 flex flex-col gap-2.5">

          <Button
            onClick={onDownload}
            variant="outline"
            className="w-full flex items-center gap-2 text-[#3525CD]"
          >
            <Download size={14} />
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

/* ---------- reusable sub-component ---------- */

function Detail({
  label,
  value,
  mono,
  highlight,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="px-4 py-3 bg-[#F8FAFC] hover:bg-[#3525CD] group transition-colors">
      <p className="text-xs text-gray-400 uppercase group-hover:text-white/70">
        {label}
      </p>

      <p
        className={cn(
          "text-sm font-bold group-hover:text-white",
          mono && "font-mono",
          highlight && "text-emerald-600 group-hover:text-white"
        )}
      >
        {value}
      </p>
    </div>
  );
}