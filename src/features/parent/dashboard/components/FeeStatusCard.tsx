import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDashboardStore } from "../store/uistore"
import { formatCurrency } from "../utils/dashboard.utils"

function SkeletonBlock() {
  return <div className="h-4 rounded bg-gray-200 animate-pulse w-full" />
}

export const FeeStatusCard = () => {
  const { fees, isPaid, isLoadingFees } = useDashboardStore()
  const [showAll, setShowAll] = useState(false)

  // ─── Loading skeleton ────────────────────────────────────
  if (isLoadingFees) {
    return (
      <Card className="rounded-xl border border-[#E8EBF2] shadow-none w-full">
        <CardContent className="flex flex-col gap-3 p-5">
          <SkeletonBlock />
          <SkeletonBlock />
          <SkeletonBlock />
        </CardContent>
      </Card>
    )
  }

  // Derive summary figures from live fees
  const pendingFees   = fees.filter((f) => f.status === "pending" || f.status === "due")
  const paidFees      = fees.filter((f) => f.status === "paid")
  const totalPending  = pendingFees.reduce((s, f) => s + (f.amount - f.amount_paid), 0)

  // Last payment from most-recently paid fee
  const lastPaid = [...paidFees].sort(
    (a, b) => new Date(b.payment_date ?? 0).getTime() - new Date(a.payment_date ?? 0).getTime()
  )[0]

  // Next due: earliest pending fee
  const nextDueFee = [...pendingFees].sort(
    (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  )[0]

  // ─── All paid view ────────────────────────────────────────
  if (isPaid) {
    return (
      <Card
        onClick={() => setShowAll((p) => !p)}
        className="cursor-pointer rounded-xl border border-[#E8EBF2] shadow-none w-full h-fit
          transition-all duration-200 ease-in-out hover:border-[#3525CD] hover:shadow-md hover:-translate-y-[2px]"
      >
        <CardContent className="flex flex-col gap-4 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-white border border-[#BBF7D0] flex items-center justify-center mt-0.5">
              <Check size={17} className="text-[#16A34A]" strokeWidth={2.5} />
            </div>
            <p className="text-[14px] font-semibold text-[#15803D]">
              All fees paid
            </p>
          </div>

          <div className="flex flex-col gap-1.5 text-[12px] text-[#4B7A5E]">
            {lastPaid && (
              <p>
                Last payment:{" "}
                <span className="font-semibold text-[#15803D]">
                  {formatCurrency(lastPaid.amount_paid)}
                </span>{" "}
                on{" "}
                {lastPaid.payment_date
                  ? new Date(lastPaid.payment_date).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })
                  : "—"}{" "}
                — {lastPaid.payment_method || "—"}
              </p>
            )}
          </div>

          {!showAll ? (
            <button
              onClick={(e) => { e.stopPropagation(); setShowAll(true) }}
              className="text-[13px] text-[#15803D] font-semibold text-left hover:underline"
            >
              View Fee History →
            </button>
          ) : (
            <>
              <div className="border-t pt-3 text-[13px] text-gray-700 space-y-1">
                {fees.map((fee) => (
                  <p key={fee.id}>
                    {fee.fee_type} — {formatCurrency(fee.amount)} (
                    <span className={fee.status === "paid" ? "text-green-600" : "text-red-500"}>
                      {fee.status}
                    </span>
                    )
                  </p>
                ))}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setShowAll(false) }}
                className="text-[12px] text-[#15803D] hover:underline"
              >
                Show Less
              </button>
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  // ─── Pending fees view ────────────────────────────────────
  return (
    <Card
      onClick={() => setShowAll((p) => !p)}
      className="cursor-pointer rounded-xl border border-[#E8EBF2] shadow-none w-full h-fit
        transition-all duration-200 ease-in-out hover:border-[#3525CD] hover:shadow-md hover:-translate-y-[2px]"
    >
      <CardContent className="flex flex-col gap-2 p-4 sm:p-5">
        <p className="text-[11px] text-gray-400">Fee Status</p>

        <h2 className="text-[26px] font-bold text-[#BA1A1A]">
          {formatCurrency(totalPending)}
        </h2>

        <p className="text-[11px] text-gray-400">Outstanding as of today</p>

        {nextDueFee && (
          <p className="text-[11px] text-gray-500">
            Next due:{" "}
            <span className="font-semibold text-[#BA1A1A]">
              {nextDueFee.fee_type}
            </span>{" "}
            on{" "}
            {new Date(nextDueFee.due_date).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </p>
        )}

        {!showAll ? (
          <div className="flex flex-col gap-2 mt-2">
            <Button className="w-full bg-[#006C49] text-white rounded-lg py-2.5 text-[13px] font-semibold">
              Pay Now
            </Button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowAll(true) }}
              className="text-[12px] text-[#006C49] text-center hover:underline"
            >
              View All Fees
            </button>
          </div>
        ) : (
          <>
            <div className="border-t pt-3 text-[13px] text-gray-700 space-y-1">
              {fees.map((fee) => (
                <p key={fee.id}>
                  {fee.fee_type} — {formatCurrency(fee.amount)} (
                  <span className={fee.status === "paid" ? "text-green-600" : "text-red-500"}>
                    {fee.status}
                  </span>
                  )
                </p>
              ))}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setShowAll(false) }}
              className="text-[12px] text-[#006C49] text-center hover:underline"
            >
              Show Less
            </button>
          </>
        )}
      </CardContent>
    </Card>
  )
}