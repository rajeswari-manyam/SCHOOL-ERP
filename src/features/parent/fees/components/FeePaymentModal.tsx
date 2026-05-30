import { useEffect, useState } from "react";
import { X, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import typography from "@/styles/typography";
import { cn } from "@/utils/cn";

import type { PaymentModalProps } from "../types/fee.types";
import { useFeeStore } from "../store/fee.store";

const generateTxnId = () =>
  `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export function PaymentModal({
  fee,
  onClose,
  onSuccess,
  studentId,
  studentName,
  studentClass,
}: PaymentModalProps) {
  const [custom, setCustom] = useState(false);
  const [value, setValue] = useState(fee.amount);
  const [paymentMethod, setPaymentMethod] = useState<string>("UPI");
  const [apiError, setApiError] = useState<string | null>(null);

  const { recordPayment, paying } = useFeeStore();

  // Derive initials from the real student name
  const initials = studentName
    ? studentName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "ST";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleProceed = async () => {
    setApiError(null);
    const txnId = generateTxnId();
    const date = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    try {
      await recordPayment(
        fee.id,
        {
          amount_paid: value,
          payment_method: paymentMethod,
          transaction_id: txnId,
        },
        studentId ?? ""
      );

      onSuccess(paymentMethod, value, txnId, date);
    } catch (e: any) {
      setApiError(e?.message ?? "Payment failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={!paying ? onClose : undefined}
      />

      {/* MODAL */}
      <Card className={cn(
        "relative z-10 w-full sm:w-[520px] rounded-t-2xl sm:rounded-2xl",
        "p-5 sm:p-6 flex flex-col gap-5",
        "max-h-[90vh] overflow-y-auto"
      )}>

        {/* HANDLE */}
        <div className="sm:hidden flex justify-center">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* HEADER */}
        <CardHeader className="flex flex-row items-center justify-between p-0">
          <CardTitle className={typography.heading.h5}>
            Pay Fee Online
          </CardTitle>

          <button
            onClick={onClose}
            disabled={paying}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </CardHeader>

        {/* STUDENT INFO */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#3525CD] flex items-center justify-center text-white text-sm font-bold">
            {initials}
          </div>
          <span className={cn(typography.body.small, "text-[#0B1C30]")}>
            {studentName ?? "Student"}
            {studentClass ? ` | Class ${studentClass}` : ""}
          </span>
        </div>

        {/* FEE INFO */}
        <CardContent className="p-0 space-y-1">
          <p className="font-bold text-[#0B1C30]">{fee.term}</p>
          <p className="text-sm text-gray-500">
            Amount Due: Rs.{fee.amount.toLocaleString("en-IN")}
          </p>
          <p className="text-sm text-[#E07B2A] font-medium">
            Due: {fee.dueDate}
          </p>
        </CardContent>

        {/* AMOUNT OPTIONS */}
        <div className="flex flex-col gap-3">

          {/* FULL */}
          <button
            onClick={() => { setCustom(false); setValue(fee.amount); }}
            disabled={paying}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2 disabled:opacity-50",
              !custom ? "border-[#3525CD] bg-[#F5F4FF]" : "border-[#E8EBF2]"
            )}
          >
            <span className="text-sm font-semibold">
              Pay Full Amount: Rs.{fee.amount.toLocaleString("en-IN")}
            </span>
          </button>

          {/* CUSTOM */}
          <button
            onClick={() => setCustom(true)}
            disabled={paying}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2 disabled:opacity-50",
              custom ? "border-[#3525CD] bg-[#F5F4FF]" : "border-[#E8EBF2]"
            )}
          >
            <span className="text-sm font-semibold">Pay Custom Amount</span>
          </button>

          {/* CUSTOM INPUT */}
          {custom && (
            <input
              type="number"
              value={value}
              min={1}
              max={fee.amount}
              onChange={(e) => setValue(Number(e.target.value))}
              disabled={paying}
              className="w-full border-2 border-[#3525CD] rounded-xl px-4 py-3 text-sm disabled:opacity-50"
            />
          )}
        </div>

        {/* PAYMENT METHOD SELECTOR */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-[#0B1C30]">Payment Method</p>
          <div className="flex gap-2 flex-wrap">
            {["UPI", "Net Banking", "Card", "Cash"].map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                disabled={paying}
                className={cn(
                  "px-3 py-1.5 rounded-lg border text-sm font-medium transition-all disabled:opacity-50",
                  paymentMethod === method
                    ? "border-[#3525CD] bg-[#F5F4FF] text-[#3525CD]"
                    : "border-[#E8EBF2] text-gray-500 hover:border-gray-300"
                )}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* API ERROR */}
        {apiError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {apiError}
          </div>
        )}

        {/* PROCEED BUTTON */}
        <CardFooter className="p-0">
          <Button
            onClick={handleProceed}
            disabled={paying || value <= 0}
            className="w-full bg-[#006C49] hover:bg-[#005538] text-white py-3 disabled:opacity-60"
          >
            {paying ? (
              <span className="flex items-center gap-2">
                <Loader2 size={15} className="animate-spin" />
                Processing Payment…
              </span>
            ) : (
              `Proceed to Pay Rs.${value.toLocaleString("en-IN")} →`
            )}
          </Button>
        </CardFooter>

        {/* SECURITY */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <Shield size={13} />
          Secure payment powered by Razorpay
        </div>

      </Card>
    </div>
  );
}
