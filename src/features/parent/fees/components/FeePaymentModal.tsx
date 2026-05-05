import { useEffect, useState } from "react";
import { X, Shield } from "lucide-react";
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
import { feeDummy } from "../data/fee.data";

export function PaymentModal({
  fee = feeDummy,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const [custom, setCustom] = useState(false);
  const [value, setValue] = useState(fee.amount);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
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
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </CardHeader>

        {/* STUDENT INFO */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#3525CD] flex items-center justify-center text-white text-sm font-bold">
            RK
          </div>
          <span className={cn(typography.body.small, "text-[#0B1C30]")}>
            Ravi Kumar | Class 10A | ADM-001
          </span>
        </div>

        {/* FEE INFO */}
        <CardContent className="p-0 space-y-1">
          <p className="font-bold text-[#0B1C30]">{fee.term}</p>
          <p className="text-sm text-gray-500">
            Amount: Rs.{fee.amount.toLocaleString("en-IN")}
          </p>
          <p className="text-sm text-[#E07B2A] font-medium">
            Due: {fee.dueDate}
          </p>
        </CardContent>

        {/* OPTIONS */}
        <div className="flex flex-col gap-3">

          {/* FULL */}
          <button
            onClick={() => { setCustom(false); setValue(fee.amount); }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2",
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
            className={cn(
              "w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2",
              custom ? "border-[#3525CD] bg-[#F5F4FF]" : "border-[#E8EBF2]"
            )}
          >
            <span className="text-sm font-semibold">
              Pay Custom Amount
            </span>
          </button>

          {/* INPUT */}
          {custom && (
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full border-2 border-[#3525CD] rounded-xl px-4 py-3 text-sm"
            />
          )}
        </div>

        {/* BUTTON */}
        <CardFooter className="p-0">
          <Button
            onClick={() => onSuccess("UPI", value)}
            className="w-full bg-[#006C49] hover:bg-[#005538] text-white py-3"
          >
            Proceed to Razorpay
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