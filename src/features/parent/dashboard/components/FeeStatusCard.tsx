import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FeeStatusCardProps } from "../types/dashboard.types";

export const FeeStatusCard = ({
  isPaid = false,
  fees,
  lastPayment,
  nextDue,
}: FeeStatusCardProps) => {
  const [showAllFees, setShowAllFees] = useState(false);

  if (isPaid) {
    return (
      <Card
        onClick={() => setShowAllFees((prev) => !prev)}
        className="cursor-pointer rounded-xl border border-[#E8EBF2] shadow-none w-full h-fit 
        transition-all duration-200 ease-in-out
        hover:border-[#3525CD] hover:shadow-md hover:-translate-y-[2px]"
      >
        <CardContent className="flex flex-col gap-4 p-5 sm:p-6">

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-white border border-[#BBF7D0] flex items-center justify-center mt-0.5">
              <Check size={17} className="text-[#16A34A]" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#15803D]">
                All fees paid
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-[12px] text-[#4B7A5E]">
            {lastPayment && (
              <p>
                Last payment:{" "}
                <span className="font-semibold text-[#15803D]">
                  ₹{lastPayment.amount}
                </span>{" "}
                on {lastPayment.date} — {lastPayment.method}
              </p>
            )}

            {nextDue && (
              <p>
                Next due:{" "}
                <span className="font-semibold text-[#15803D]">
                  {nextDue.label}
                </span>{" "}
                on {nextDue.date}
              </p>
            )}
          </div>

          {!showAllFees ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAllFees(true);
              }}
              className="text-[13px] text-[#15803D] font-semibold text-left hover:underline"
            >
              View Fee History →
            </button>
          ) : (
            <>
              <div className="border-t pt-3 text-[13px] text-gray-700 space-y-1">
                {fees.map((fee) => (
                  <p key={fee.month}>
                    {fee.month} — ₹{fee.amount} ({fee.status})
                  </p>
                ))}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllFees(false);
                }}
                className="text-[12px] text-[#15803D] hover:underline"
              >
                Show Less
              </button>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

 
  return (
    <Card
      onClick={() => setShowAllFees((prev) => !prev)}
      className="cursor-pointer rounded-xl border border-[#E8EBF2] shadow-none w-full h-fit 
      transition-all duration-200 ease-in-out
      hover:border-[#3525CD] hover:shadow-md hover:-translate-y-[2px]"
    >
      <CardContent className="flex flex-col gap-2 p-4 sm:p-5">

        <p className="text-[11px] text-gray-400">Fee Status</p>

        <h2 className="text-[26px] font-bold text-[#BA1A1A]">
          ₹{fees.find(f => f.status === "pending")?.amount || 0}
        </h2>

        <p className="text-[11px] text-gray-400">
          Outstanding as of today
        </p>

        {!showAllFees ? (
          <div className="flex flex-col gap-2 mt-2">
            <Button className="w-full bg-[#006C49] text-white rounded-lg py-2.5 text-[13px] font-semibold">
              Pay Now
            </Button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAllFees(true);
              }}
              className="text-[12px] text-[#006C49] text-center hover:underline"
            >
              View All Fees
            </button>
          </div>
        ) : (
          <>
            <div className="border-t pt-3 text-[13px] text-gray-700 space-y-1">
              {fees.map((fee) => (
                <p key={fee.month}>
                  {fee.month} — ₹{fee.amount} ({fee.status})
                </p>
              ))}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAllFees(false);
              }}
              className="text-[12px] text-[#006C49] text-center hover:underline"
            >
              Show Less
            </button>
          </>
        )}

      </CardContent>
    </Card>
  );
};