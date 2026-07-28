import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Download, Home, Loader2, AlertCircle } from "lucide-react";
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
import typography from "@/styles/typography";
import { cn } from "@/utils/cn";

type Tab = "pending" | "history" | "annual";
type ModalState = "none" | "pay" | "success";

type ParentLayoutContext = {
  activeChild: {
    id: string;
    studentId: string;
    name: string;
    rollNumber: string;
    admissionNumber: string;
    classDetail: { id: string; className: string } | null;
    sectionDetail: { id: string; sectionName: string } | null;
    school: string;
    avatar: string;
  };
};

const TABS: { id: Tab; label: string }[] = [
  { id: "pending",  label: "Pending Fees"    },
  { id: "history",  label: "Payment History" },
  { id: "annual",   label: "Annual Overview" },
];

export default function FeesPage() {
  const [tab, setTab] = useState<Tab>("pending");
  const [modal, setModal] = useState<ModalState>("none");

  // Payment success details — populated from the modal callback
  const [paidFeeHead, setPaidFeeHead]     = useState("");
  const [paidAmount, setPaidAmount]       = useState(0);
  const [paidMode, setPaidMode]           = useState("");
  const [paidReceiptNo, setPaidReceiptNo] = useState("");
  const [paidDate, setPaidDate]           = useState("");

  const { activeChild } = useOutletContext<ParentLayoutContext>();

  const studentId = activeChild?.studentId;
  const className = activeChild?.classDetail?.className ?? "";
  const {
    history, pending, allPaid, selectedFee, setSelectedFee,
    loading, error, fetchFees, deletePayment,
    tuitionMonths, examTerms, annualSummary,
  } = useFees(studentId);

  // Guard placed after every hook above has run, so this doesn't violate
  // Rules of Hooks — activeChild can briefly be missing right after login,
  // on a page refresh, or during a route transition.
  if (!activeChild) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <Loader2 size={28} className="animate-spin text-[#3525CD]" />
      </div>
    );
  }

  const overdueList = pending.filter((f) => f.status === "overdue");

  // ── Derive AllPaidState props from real data ───────────────────────────────
  const lastPaid = history[0] ?? null;
  const paidMonth = lastPaid ? lastPaid.date : "";
  const standing =
    history.length >= 10 ? "Excellent" :
    history.length >= 5  ? "Good"      : "Fair";

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handlePayClick = (fee: Fee) => {
    setSelectedFee(fee);
    setModal("pay");
  };

  const handlePaySuccess = (
    mode: string,
    amount: number,
    txnId: string,
    date: string
  ) => {
    if (selectedFee) {
      setPaidFeeHead(selectedFee.term);
      setPaidAmount(amount);
      setPaidMode(mode);
      setPaidReceiptNo(txnId);
      setPaidDate(date);
    }
    setModal("success");
  };

  const handleClose = () => {
    setModal("none");
    setSelectedFee(null);
  };

  /* ── Loading state ── */
  if (loading && pending.length === 0 && history.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 size={28} className="animate-spin text-[#3525CD]" />
          <p className="text-sm">Loading fees…</p>
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (error && pending.length === 0 && history.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="flex flex-col items-center gap-3 text-red-500 max-w-xs text-center">
          <AlertCircle size={28} />
          <p className="text-sm font-medium">{error}</p>
          <button
            onClick={() => fetchFees(studentId)}
            className="text-[13px] text-[#3525CD] underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  /* ── Page Header ── */
  const PageHeader = () => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-sm font-semibold text-[#0B1C30] leading-tight">
            Fee Management — {activeChild.name}
          </h1>
          <p className={cn(typography.body.xs, "text-gray-400 mt-0.5")}>
            Academic Year 2024-25 | Class {className}
          </p>
        </div>
        <button
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium
            text-[#3525CD] border border-[#DCE9FF] rounded-lg bg-white
            transition-all duration-200
            hover:bg-[#3525CD] hover:text-white hover:border-[#3525CD]"
        >
          <Download size={14} strokeWidth={1.5} />
          Download All Receipts
        </button>
      </div>
      <button
        className="sm:hidden flex items-center justify-center gap-2 w-full px-4 py-2.5
          text-[13px] font-medium text-[#3525CD] border border-[#DCE9FF] rounded-lg bg-white
          transition-all duration-200 active:bg-[#3525CD] active:text-white"
      >
        <Download size={14} strokeWidth={1.5} />
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
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-gray-400">
        <Home size={14} strokeWidth={1.5} className="text-gray-400" />
        <span>/</span>
        <p className={cn(typography.body.xs, "text-gray-400")}>
          {activeChild.name} ›
          <span className="text-gray-600 font-medium"> Fees</span>
        </p>
      </div>

      {/* PENDING TAB */}
      {tab === "pending" && (
        <div
          className={cn(
            "grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 items-start",
            !allPaid && "lg:grid-cols-3"
          )}
        >
          <div className={cn("flex flex-col gap-4", !allPaid && "lg:col-span-2")}>
            <PageHeader />

            {overdueList.length > 0 && (
              <FeeBanner
                text={`Rs.${overdueList[0].amount.toLocaleString("en-IN")} ${overdueList[0].term} due on ${overdueList[0].dueDate}${
                  overdueList[0].daysOverdue ? ` — ${overdueList[0].daysOverdue} days past due` : ""
                }`}
                onPayNow={() => handlePayClick(overdueList[0])}
              />
            )}

            <TabBar />

            {loading && (
              <div className="flex items-center gap-2 text-[13px] text-gray-400">
                <Loader2 size={14} className="animate-spin" />
                Refreshing…
              </div>
            )}

            <div className="flex flex-col gap-3">
              {allPaid
                ? (
                  <AllPaidState
                    onTabChange={setTab}
                    studentName={activeChild.name}
                    month={paidMonth}
                    lastPayment={
                      lastPaid
                        ? { amount: lastPaid.amount, date: lastPaid.date, mode: lastPaid.mode }
                        : null
                    }
                    balance={annualSummary.totalPending}
                    standing={standing}
                    consecutiveOnTime={history.length}
                  />
                )
                : pending.map((fee) => (
                    <FeeCard key={fee.id} fee={fee} onPay={() => handlePayClick(fee)} />
                  ))
              }
            </div>

            {!allPaid && <HelpBar variant="banner" />}
          </div>

          {!allPaid && (
            <div className="flex flex-col gap-3 lg:sticky lg:top-4">
              <SessionSummary
                totalFees={annualSummary.totalAmount}
                paidAmount={annualSummary.totalPaid}
                currency="INR"
              />
              <PaymentMethods />
              <StudentCard
                name={activeChild.name}
                className={className}
                rollNo={activeChild.rollNumber ?? activeChild.admissionNumber ?? ""}
                status="good"
              />
            </div>
          )}
        </div>
      )}

      {/* ANNUAL OVERVIEW TAB */}
      {tab === "annual" && (
        <div className="flex flex-col gap-4">
          <PageHeader />
          <TabBar />
          {loading ? (
            <div className="flex items-center justify-center gap-2 text-[13px] text-gray-400 py-16">
              <Loader2 size={18} className="animate-spin text-[#3525CD]" />
              Loading annual overview…
            </div>
          ) : (
            <FeeProgressCard
              tuitionMonths={tuitionMonths}
              examTerms={examTerms}
              annualSummary={annualSummary}
              onPayNow={() => setTab("pending")}
            />
          )}
        </div>
      )}

      {/* HISTORY TAB */}
      {tab === "history" && (
        <div className="flex flex-col gap-4">
          <PageHeader />

          <div className="flex items-center justify-between gap-2">
            <TabBar />
            <button
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-[13px] font-medium
                text-[#3525CD] border border-[#DCE9FF] rounded-lg bg-white ml-4 shrink-0
                transition-all duration-200
                hover:bg-[#3525CD] hover:text-white hover:border-[#3525CD]"
            >
              <Download size={13} strokeWidth={1.5} />
              Download All as PDF
            </button>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-[13px] text-gray-400 py-8 justify-center">
              <Loader2 size={18} className="animate-spin text-[#3525CD]" />
              Loading payment history…
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              No payment history found.
            </div>
          ) : (
            <FeeHistory
              data={history}
              onDelete={(id) => deletePayment(id, studentId)}
            />
          )}

          <button
            className="sm:hidden flex items-center justify-center gap-2 w-full
              px-4 py-2.5 text-[13px] font-medium
              text-[#3525CD] border border-[#DCE9FF] rounded-lg bg-white
              transition-all duration-200
              active:bg-[#3525CD] active:text-white"
          >
            <Download size={13} strokeWidth={1.5} />
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
          studentId={studentId}
          studentName={activeChild.name}
          studentClass={className}
        />
      )}
      {modal === "success" && (
        <PaymentSuccessModal
          amount={paidAmount}
          feeHead={paidFeeHead}
          mode={paidMode}
          receiptNo={paidReceiptNo}
          date={paidDate}
          studentName={activeChild.name}
          className={className}
          onBack={handleClose}
        />
      )}
    </div>
  );
}