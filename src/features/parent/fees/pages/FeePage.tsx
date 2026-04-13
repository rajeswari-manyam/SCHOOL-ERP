import { useState } from "react";
import { useOutletContext } from "react-router-dom";   // ← added
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
import Homeicon from "../../../../assets/icons/Home.png";
import typography from "@/styles/typography";
import { cn } from "@/utils/cn";

type Tab = "pending" | "history" | "annual";
type ModalState = "none" | "pay" | "success";

// ← added: same shape as AttendancePage
type ParentLayoutContext = {
  activeChild: {
    id: number;
    name: string;
    class: string;
    school: string;
    avatar: string;
  };
};

const TABS: { id: Tab; label: string }[] = [
  { id: "pending", label: "Pending Fees" },
  { id: "history", label: "Payment History" },
  { id: "annual", label: "Annual Overview" },
];

const DownloadIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path
      d="M7 1v8M4 6l3 3 3-3M1 12h12"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function FeesPage() {
  const [tab, setTab] = useState<Tab>("pending");
  const [modal, setModal] = useState<ModalState>("none");
  const [paidFeeHead, setPaidFeeHead] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);

  const { history, pending, allPaid, selectedFee, setSelectedFee, markPaid } = useFees();
  const { activeChild } = useOutletContext<ParentLayoutContext>(); // ← added

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

  /* ── Page Header ── */
  const PageHeader = () => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            className={cn(
              typography.heading.h6,
              "text-[18px] sm:text-[22px] font-bold text-[#0B1C30] leading-tight"
            )}
          >
            Fee Management — {activeChild.name} {/* ← dynamic */}
          </h1>
          <p className={cn(typography.body.xs, "text-gray-400 mt-0.5")}>
            Academic Year 2024-25 | Class {activeChild.class} {/* ← dynamic */}
          </p>
        </div>
        <button
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium
            text-[#3525CD] border border-[#DCE9FF] rounded-lg bg-white
            transition-all duration-200
            hover:bg-[#3525CD] hover:text-white hover:border-[#3525CD]"
        >
          <DownloadIcon />
          Download All Receipts
        </button>
      </div>
      <button
        className="sm:hidden flex items-center justify-center gap-2 w-full px-4 py-2.5
          text-[13px] font-medium text-[#3525CD] border border-[#DCE9FF] rounded-lg bg-white
          transition-all duration-200 active:bg-[#3525CD] active:text-white"
      >
        <DownloadIcon />
        Download All Receipts
      </button>
    </div>
 
          );
     

  /* ── Tab Bar ── */
  const TabBar = () => (
    <div
      className="flex border-b border-[#E8EBF2]
        overflow-x-auto scrollbar-none
        -mx-4 px-4 sm:mx-0 sm:px-0"
    >
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className={`
            px-4 py-2.5 text-[13px] font-semibold transition-colors border-b-2 -mb-px
            whitespace-nowrap shrink-0
            ${tab === t.id
              ? "border-[#3525CD] text-[#3525CD]"
              : "border-transparent text-gray-400 hover:text-[#0B1C30]"
            }
          `}
        >
          {t.label}
        </button>
      ))}
    </div>
  );

  
  return (
    <div
      className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4 sm:py-5
        bg-[#F8FAFF] min-h-screen flex flex-col gap-4
        pb-[env(safe-area-inset-bottom,16px)]"
    >
      {/* Breadcrumb ← updated to match attendance style */}
      <div className="flex items-center gap-2 text-[12px] text-gray-400">
        <img src={Homeicon} alt="home" className="w-3.5 h-3.5" />
        <span>/</span>
        <p className={cn(typography.body.xs, "text-gray-400")}>
          {activeChild.name} ›
          <span className="text-gray-600 font-medium"> Fees</span>
        </p>
      </div>
      {/* ══════════════════════════════════════════════
          PENDING TAB
          - allPaid → single full-width column, no sidebar
          - pending → 3-col grid with right sidebar
      ══════════════════════════════════════════════ */}
      {tab === "pending" && (
        <div
          className={cn(
            "grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 items-start",
            // Only show the 3-col layout (with sidebar) when there are pending fees
            !allPaid && "lg:grid-cols-3"
          )}
        >
          {/* Left / main content */}
          <div className={cn("flex flex-col gap-4", !allPaid && "lg:col-span-2")}>
            <PageHeader />

            {overdueList.length > 0 && (
              <FeeBanner
                text={`Rs.${overdueList[0].amount.toLocaleString("en-IN")} tuition fee due on ${overdueList[0].dueDate} — 3 days remaining`}
                onPayNow={() => handlePayClick(overdueList[0])}
              />
            )}

            <TabBar />

            <div className="flex flex-col gap-3">
              {allPaid
                ? <AllPaidState onTabChange={setTab} />
                : pending.map((fee) => (
                  <FeeCard key={fee.id} fee={fee} onPay={() => handlePayClick(fee)} />
                ))
              }
            </div>

            {!allPaid && <HelpBar variant="banner" />}
          </div>

          {/* Right sidebar — only rendered when fees are pending */}
          {!allPaid && (
            <div className="flex flex-col gap-3 lg:sticky lg:top-4">
              <SessionSummary />
              <PaymentMethods />
              <StudentCard />
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════
          ANNUAL OVERVIEW TAB — full width, no sidebar
      ══════════════════════════════════════════════ */}
      {tab === "annual" && (
        <div className="flex flex-col gap-4">
          <PageHeader />
          <TabBar />
          <FeeProgressCard />
        </div>
      )}

      {/* ══════════════════════════════════════════════
          HISTORY TAB — full width, no sidebar
      ══════════════════════════════════════════════ */}
      {tab === "history" && (
        <div className="flex flex-col gap-4">
          <PageHeader />

          {/* Tab bar row with desktop PDF button */}
          <div className="flex items-center justify-between gap-2">
            <TabBar />
            <button
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-[13px] font-medium
                text-[#3525CD] border border-[#DCE9FF] rounded-lg bg-white ml-4 shrink-0
                transition-all duration-200
                hover:bg-[#3525CD] hover:text-white hover:border-[#3525CD]"
            >
              <DownloadIcon size={13} />
              Download All as PDF
            </button>
          </div>

          <FeeHistory data={history} />

          {/* Mobile-only PDF button below table */}
          <button
            className="sm:hidden flex items-center justify-center gap-2 w-full
              px-4 py-2.5 text-[13px] font-medium
              text-[#3525CD] border border-[#DCE9FF] rounded-lg bg-white
              transition-all duration-200
              active:bg-[#3525CD] active:text-white"
          >
            <DownloadIcon size={13} />
            Download All as PDF
          </button>

          <HelpBar variant="cards" />
        </div>
      )}

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