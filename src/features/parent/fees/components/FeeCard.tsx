import type { Fee } from "../types/fee.types";
import {Button} from "../../../../components/ui/button";
import { cn } from "../../../../utils/cn";
import typography from "@/styles/typography";

interface FeeCardProps {
  fee: Fee;
  onPay: () => void;
}

export function FeeCard({ fee, onPay }: FeeCardProps) {
  const isOverdue = fee.status === "overdue";
  const isUpcoming = fee.status === "upcoming";

  return (
    <div
      className="
        group
        w-full max-w-[864px]
        rounded-[16px]
        border border-[#E8EBF2]
        bg-white
        p-6
        flex flex-col gap-6
        transition-all duration-200
        hover:border-[#3525CD]
        hover:shadow-sm
      "
    >

      {/* TOP SECTION */}
      <div className="flex items-start justify-between gap-4">

        {/* LEFT */}
        <div className="flex items-start gap-3">

          <div
            className={`
              w-9 h-9 rounded-xl flex items-center justify-center shrink-0
              ${isOverdue ? "bg-red-50" : "bg-blue-50"}
            `}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect
                x="3"
                y="2"
                width="10"
                height="12"
                rx="2"
                stroke={isOverdue ? "#B45309" : "#3B82F6"}
                strokeWidth="1.3"
              />
              <path
                d="M6 6h4M6 9h2"
                stroke={isOverdue ? "#B45309" : "#3B82F6"}
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div>
            <p className={cn(typography.body.small, "font-semibold text-[#0B1C30]")}>
              {fee.term}
            </p>

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={cn(typography.body.xs, "text-gray-400")}>
                Due: {fee.dueDate}
              </span>

              {isOverdue && (
                <span className={cn(typography.body.xs, "text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B45309]/20 text-[#B45309]/80 tracking-wide")}>
                  OVERDUE · {fee.daysOverdue} DAYS PAST DUE
                </span>
              )}

              {isUpcoming && (
                <span className={cn(typography.body.xs, "text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3B82F6]/20 text-[#3B82F6]/80 tracking-wide")}>
                  UPCOMING
                </span>
              )}
            </div>
          </div>
        </div>

{/* RIGHT */}
<div className="text-right shrink-0 flex flex-col justify-center h-[56px]">

  {/* Amount */}
  <p
    className={cn(
  "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
  isOverdue ? "bg-red-50" : "bg-blue-50"
)}
  >
    Rs.{fee.amount.toLocaleString("en-IN")}
  </p>

  {/* Label */}
  <p className={cn(typography.body.xs, "text-[12px] leading-[16px] font-semibold tracking-[1.2px] text-gray-400 uppercase text-right")}>
    {isOverdue ? "PENDING AMOUNT" : "BALANCE DUE"}
  </p>

</div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between gap-3">

       <div className="flex items-center gap-2 text-[14px] leading-[20px] font-medium text-[#006C49]">

  {/* Icon */}
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    className="shrink-0"
  >
    <path
      d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z"
      stroke="#006C49"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>

  {fee.reminder && fee.reminder !== "No reminder sent yet" ? (
    <span>{fee.reminder}</span>
  ) : (
    <span>No reminder sent yet</span>
  )}

</div>

        <Button
          onClick={onPay}
          className="
            shrink-0
            bg-[#006C49]
            hover:bg-[#1a2f47]
            active:scale-[0.97]
            transition-all
            text-white
            text-[13px]
            font-semibold
            px-5 py-2
            rounded-xl
          "
        >
          Pay Rs.{fee.amount.toLocaleString("en-IN")} →
        </Button>

      </div>
    </div>
  );
}