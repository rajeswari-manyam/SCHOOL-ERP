type Tab = "pending" | "history" | "annual";

interface AllPaidStateProps {
  onTabChange: (t: Tab) => void;
}

export function AllPaidState({ onTabChange }: AllPaidStateProps) {
  return (
    <div className="flex flex-col gap-5">

      {/* Green success banner */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7l3.5 3.5L12 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-[14px] font-bold text-emerald-700">All fees paid for April 2025</p>
            <p className="text-[12px] text-emerald-600 mt-0.5">Ravi Kumar has no outstanding dues for this month.</p>
            <p className="text-[12px] text-emerald-600 mt-1.5">
              📋 Last payment: Rs.8,500 on 1 April 2025 — UPI | Receipt: RCP-2025-0823
            </p>
            <p className="text-[12px] text-emerald-600 mt-0.5">📅 Next due: May fees on 5 May 2025</p>
          </div>
        </div>
      </div>

      {/* Quick nav links */}
      <div className="flex gap-4">
        <button
          onClick={() => onTabChange("history")}
          className="text-[13px] text-[#3525CD] font-medium hover:underline"
        >
          View Fee History
        </button>
        <button
          onClick={() => onTabChange("annual")}
          className="text-[13px] text-[#3525CD] font-medium hover:underline"
        >
          View Annual Overview
        </button>
      </div>

      {/* Empty state illustration */}
      <div className="flex flex-col items-center py-10">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M5 14l6 6L23 7"
              stroke="#16A34A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-[16px] font-bold text-[#0B1C30]">No pending fees</p>
        <p className="text-[13px] text-gray-400 mt-1 text-center max-w-xs">
          You will be notified via WhatsApp when new fees are due.
        </p>
        <p className="text-[12px] text-gray-400 mt-3">
          +91 98765 43210 will receive fee reminders automatically
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "BALANCE STATUS", value: "₹0.00", sub: "Fully Cleared", color: "" },
          { label: "PAYMENT STANDING", value: "Excellent", sub: "12 Consecutive on-time payments", color: "text-emerald-600" },
          { label: "NEED HELP?", value: "Contact School Accounts", sub: "Connect now →", color: "" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[#E8EBF2] bg-white p-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-2">{s.label}</p>
            <p className={`text-[16px] font-bold text-[#0B1C30] ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}