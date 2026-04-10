import { useState } from "react";
import { useFees } from "../hooks/usefee";
import { FeeBanner } from "../components/FeeBanner";
import { FeeCard } from "../components/FeeCard";
import { FeeHistory } from "../components/FeeHistory";
import { FeeProgressCard } from "../components/FeeProgressCard";
import { PaymentModal } from "../components/FeePaymentModal";
import { PaymentSuccessModal } from "../components/PaymentSuccessModal";
import { SessionSummary } from "../components/SessionSummary";
import { PaymentMethods } from "../components/PaymentMethods";
import { StudentCard } from "../components/Studentcard";
import { AllPaidState } from "../components/AllPaidState";
import { HelpBar } from "../components/HelpBar";
import type { Fee } from "../types/fee.types";

type Tab = "pending" | "history" | "annual";
type ModalState = "none" | "pay" | "success";

const TABS: { id: Tab; label: string }[] = [
  { id: "pending", label: "Pending Fees" },
  { id: "history", label: "Payment History" },
  { id: "annual", label: "Annual Overview" },
];

export default function FeesPage() {
  const [tab, setTab] = useState<Tab>("pending");
  const [modal, setModal] = useState<ModalState>("none");
  const [paidFeeHead, setPaidFeeHead] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);

  const { history, pending, allPaid, selectedFee, setSelectedFee, markPaid } = useFees();

  const overdueList = pending.filter((f) => f.status === "overdue");

  const handlePayClick = (fee: Fee) => {
    setSelectedFee(fee);
    setModal("pay");
  };

  const handlePaySuccess = (mode: string, amount: number) => {
    if (selectedFee) {
      markPaid(selectedFee.id, mode);
      setPaidFeeHead(selectedFee.term);
      setPaidAmount(amount);
    }
    setModal("success");
  };

  const handleClose = () => {
    setModal("none");
    setSelectedFee(null);
  };

  return (
  <div className="max-w-[1280px] h-[777px] mx-auto p-8 bg-[#F8FAFF] opacity-100 flex flex-col gap-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-gray-400 mb-4">
        <span>🏠</span>
        <span>/</span>
        <span className="text-[#3525CD] font-bold uppercase tracking-wide">Fees</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-[22px] font-bold text-[#0B1C30]">Fee Management — Ravi Kumar</h1>
          <p className="text-[13px] text-gray-400 mt-0.5">Academic Year 2024-25 | Class 10A</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium
          text-[#3525CD] border border-[#DCE9FF] rounded-lg bg-white
          transition-all duration-200
          hover:bg-[#3525CD] hover:text-white hover:border-[#3525CD]
        ">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-colors duration-200">
            <path
              d="M7 1v8M4 6l3 3 3-3M1 12h12"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Download All Receipts
        </button>
      </div>

      {/* Two-column layout */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch min-h-full">

        {/* LEFT — banner + tabs + content */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Banner inside left col only — half width matching Figma */}
          {overdueList.length > 0 && (
            <FeeBanner
              text={`Rs.${overdueList[0].amount.toLocaleString("en-IN")} tuition fee due on ${overdueList[0].dueDate} — 3 days remaining`}
              onPayNow={() => handlePayClick(overdueList[0])}
            />
          )}

          {/* Tab bar */}
          <div className="flex border-b border-[#E8EBF2]">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2.5 text-[13px] font-semibold transition-colors border-b-2 -mb-px ${
                  tab === t.id
                    ? "border-[#3525CD] text-[#3525CD]"
                    : "border-transparent text-gray-400 hover:text-[#0B1C30]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === "pending" && (
            <div className="flex flex-col gap-3">
              {allPaid
                ? <AllPaidState onTabChange={setTab} />
                : pending.map((fee) => (
                    <FeeCard key={fee.id} fee={fee} onPay={() => handlePayClick(fee)} />
                  ))
              }
            </div>
          )}
          {tab === "history" && <FeeHistory data={history} />}
          {tab === "annual" && <FeeProgressCard />}
          {tab !== "annual" && !allPaid && <HelpBar />}
        </div>

        {/* RIGHT — sidebar: auto auto 1fr forces StudentCard to fill remaining height */}
     <div className="grid gap-4 h-full" style={{ gridTemplateRows: "auto auto 1fr" }}>
          <SessionSummary />
          <PaymentMethods />
          <StudentCard />
        </div>
      </div>

      {/* Modals */}
      {modal === "pay" && selectedFee && (
        <PaymentModal
          fee={selectedFee}
          onClose={handleClose}
          onSuccess={handlePaySuccess}
        />
      )}
      {modal === "success" && (
        <PaymentSuccessModal
          amount={paidAmount}
          feeHead={paidFeeHead}
          mode="UPI"
          onBack={handleClose}
        />
      )}
    </div>
  );
}