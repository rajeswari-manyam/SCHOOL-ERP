import { Card, CardContent } from "../../../../components/ui/card";
import typography, { combineTypography } from "../../../../styles/typography";
import {
  Check,
  Calendar,
  Receipt,
  MessageCircle,
  CreditCard,
  Star,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

import type { AllPaidStateProps } from "../types/fee.types";
import { paidFeeSummary } from "../data/fee.data";

export function AllPaidState({ onTabChange }: AllPaidStateProps) {
  return (
    <div className="flex flex-col gap-5">

      {/* Top Paid Card */}
      <Card className="border border-transparent hover:border-[#3525CD] transition-colors duration-200">
        <CardContent className="p-5">
          <div className="flex gap-3">

            <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center mt-0.5 shrink-0">
              <Check size={14} color="white" strokeWidth={2} />
            </div>

            <div className="flex flex-col gap-1">
              <p className={combineTypography(typography.body.xs, "text-emerald-700")}>
                All fees paid for {paidFeeSummary.month}
              </p>

              <p className={combineTypography(typography.body.xs, "text-emerald-600")}>
                {paidFeeSummary.studentName} has no outstanding dues for this month.
              </p>

              <div className="flex items-center gap-1.5 mt-1">
                <Receipt size={12} color="#16A34A" strokeWidth={1.5} />
                <p className={combineTypography(typography.body.xs, "text-emerald-600")}>
                  Last payment: <b>₹{paidFeeSummary.lastPayment.amount}</b>{" "}
                  on {paidFeeSummary.lastPayment.date} |{" "}
                  {paidFeeSummary.lastPayment.mode}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar size={12} color="#16A34A" strokeWidth={1.5} />
                <p className={combineTypography(typography.body.xs, "text-emerald-600")}>
                  Next due: <b>{paidFeeSummary.nextDue.label}</b> on{" "}
                  {paidFeeSummary.nextDue.date}
                </p>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-5">
        <button
          onClick={() => onTabChange("history")}
          className={combineTypography(typography.body.xs, "text-[#3525CD] hover:underline")}
        >
          View Fee History
        </button>

        <button
          onClick={() => onTabChange("annual")}
          className={combineTypography(typography.body.xs, "text-[#3525CD] hover:underline")}
        >
          View Annual Overview
        </button>
      </div>

      {/* No Pending */}
      <Card className="border border-transparent hover:border-[#3525CD] transition-colors duration-200">
        <CardContent className="flex flex-col items-center py-8">

          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <Check size={28} color="#10B981" strokeWidth={2} />
          </div>

          <p className={combineTypography(typography.body.xs, "text-[#0B1C30]")}>
            No pending fees
          </p>

          <p className={combineTypography(typography.body.xs, "text-gray-400 text-center max-w-[260px] mt-1")}>
            You will be notified via WhatsApp when new fees are due.
          </p>

          <div className="flex items-center gap-2 mt-4 px-3 py-2 rounded-full bg-[#F0FDF4] border border-emerald-200">
            <div className="w-[14px] h-[14px] rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
              <MessageCircle size={8} color="white" strokeWidth={2} />
            </div>
            <p className={combineTypography(typography.body.xs, "text-gray-600")}>
              {paidFeeSummary.phone} will receive reminders
            </p>
          </div>

        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

        <Card className="border border-transparent hover:border-[#3525CD] transition-colors duration-200">
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <CreditCard size={18} color="#3525CD" strokeWidth={1.4} />
              <p className={combineTypography(typography.body.xs, "text-gray-400 uppercase")}>
                Balance Status
              </p>
            </div>
            <p className={combineTypography(typography.body.xs, "text-[#0B1C30]")}>
              ₹{paidFeeSummary.balance}
            </p>
            <span className={combineTypography(typography.body.xs, "text-emerald-700 px-2 py-1 rounded-full")}>
              Fully Cleared
            </span>
          </CardContent>
        </Card>

        <Card className="border border-transparent hover:border-[#3525CD] transition-colors duration-200">
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Star size={18} color="#F59E0B" strokeWidth={1.4} />
              <p className={combineTypography(typography.body.xs, "text-gray-400 uppercase")}>
                Payment Standing
              </p>
            </div>
            <p className={combineTypography(typography.body.xs, "text-emerald-600")}>
              {paidFeeSummary.standing}
            </p>
            <p className={combineTypography(typography.body.xs, "text-gray-400 mt-1")}>
              {paidFeeSummary.consecutiveOnTime} Consecutive on-time payments
            </p>
          </CardContent>
        </Card>

        <Card className="border border-transparent hover:border-[#3525CD] transition-colors duration-200">
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle size={18} color="#6B7280" strokeWidth={1.4} />
              <p className={combineTypography(typography.body.xs, "text-gray-400 uppercase")}>
                Need Help?
              </p>
            </div>
            <p className={combineTypography(typography.body.xs, "text-[#0B1C30]")}>
              Contact Accounts
            </p>
            <button
              className={combineTypography(
                typography.body.xs,
                "text-[#3525CD] mt-2 hover:underline flex items-center gap-1"
              )}
            >
              Connect now <ArrowRight size={11} strokeWidth={2} />
            </button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}