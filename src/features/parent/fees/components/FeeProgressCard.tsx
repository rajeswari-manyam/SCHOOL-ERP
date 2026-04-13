













const tuitionMonths = [
  { label: "OCT", paid: true }, { label: "NOV", paid: true }, { label: "DEC", paid: true },
  { label: "JAN", paid: true }, { label: "FEB", paid: true }, { label: "MAR", paid: true },
  { label: "APR", pending: true }, { label: "MAY", upcoming: true }, { label: "JUN", upcoming: true },
  { label: "JUL", upcoming: true }, { label: "AUG", upcoming: true }, { label: "SEP", upcoming: true },
];

const examTerms = [
  { label: "Term 1", amount: 2000, paid: true },
  { label: "Term 2", amount: 2000, paid: true },
  { label: "Term 3", amount: 2000, pending: true },
  { label: "Term 4", amount: 2000, upcoming: true },
];

const TickCircle = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" fill="#16A34A" />
    <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PendingCircle = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" stroke="#D97706" strokeWidth="1.4" />
    <path d="M8 5v3.5l2 1.2" stroke="#D97706" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const LockCircle = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="4" y="7.5" width="8" height="6" rx="1.4" stroke="#9CA3AF" strokeWidth="1.3" />
    <path d="M6 7.5V6a2 2 0 014 0v1.5" stroke="#9CA3AF" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export function FeeProgressCard() {
  return (
    <div className="flex flex-col gap-4">

      {/* SUMMARY BANNER */}
      {/* SUMMARY BANNER */}
      <div className="rounded-2xl border border-[#E8EBF2] bg-white p-5 sm:p-8 transition-all duration-200 hover:border-[#3525CD] hover:shadow-sm">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="3" width="12" height="9" rx="1.5" stroke="#3525CD" strokeWidth="1.2" />
                <path d="M5 1v3M9 1v3M1 7h12" stroke="#3525CD" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>

            <p className="text-[13px] sm:text-[14px] font-semibold text-[#0B1C30]">
              Academic Year Overview
            </p>
          </div>

          <span className="self-start sm:self-auto text-[10px] sm:text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            55.9% COLLECTED
          </span>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-5 sm:mb-6">

          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
              Total Paid
            </p>
            <p className="text-[18px] sm:text-[20px] font-bold text-[#0B1C30]">
              Rs.71,500
            </p>
            <p className="text-[10px] text-gray-400 mt-1">
              ↑ Updated today at 09:42 AM
            </p>
          </div>

          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
              Pending Amount
            </p>
            <p className="text-[18px] sm:text-[20px] font-bold text-[#BA1A1A]">
              Rs.56,500
            </p>
            <p className="text-[10px] text-gray-400 mt-1">
              Next due date: Nov 15th
            </p>
          </div>

          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
              Annual Total
            </p>
            <p className="text-[18px] sm:text-[20px] font-bold text-[#0B1C30]">
              Rs.1,28,000
            </p>
            <p className="text-[10px] text-gray-400 mt-1">
              Inclusive of all categories
            </p>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="h-2 w-full rounded-full bg-[#F0F1F5] overflow-hidden mb-2">
          <div
            className="h-2 rounded-full bg-[#3525CD] transition-all"
            style={{ width: "55.9%" }}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-[10px] text-gray-400">
          <span>PROGRESS BAR · 55.9% COMPLETION</span>
          <span>44.1% REMAINING</span>
        </div>
      </div>


      {/* MAIN BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <div className="flex flex-col gap-4">

          {/* TUITION FEE */}
          <div className="rounded-2xl border border-[#E8EBF2] bg-white p-5 sm:p-6 transition-all duration-200 hover:border-[#3525CD] hover:shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <p className="text-[11px] font-bold text-[#00714D] uppercase tracking-widest">Tuition Fee</p>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px]">
                <span className="text-[#0B1C30]">Monthly | Rs.8,500 × 12 = <span className="text-[#3525CD] font-semibold">Rs.1,02,000</span></span>
                <span className="text-gray-400">PAID <span className="font-semibold text-[#0B1C30]">Rs.51,000</span></span>
                <span className="text-gray-400">PENDING <span className="font-semibold text-[#BA1A1A]">Rs.51,000</span></span>
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5">
              {tuitionMonths.map((m) => (
                <div key={m.label} className={`flex flex-col items-center py-2 sm:py-2.5 rounded-xl text-[9px] sm:text-[11px] font-bold tracking-wide ${m.paid ? "bg-emerald-100 text-emerald-700" : m.pending ? "bg-amber-100 text-amber-700" : "bg-[#F0F1F5] text-gray-400"}`}>
                  {m.paid && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="mb-0.5"><path d="M2 6l2.5 2.5L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  {m.pending && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="mb-0.5"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3" /><path d="M6 4v2.5l1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>}
                  {m.upcoming && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="mb-0.5"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3" strokeDasharray="2 2" /></svg>}
                  {m.label}
                </div>
              ))}
            </div>
          </div>

          {/* TRANSPORT FEE */}
          <div className="rounded-2xl border border-[#E8EBF2] bg-white p-5 sm:p-6 transition-all duration-200 hover:border-[#3525CD] hover:shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <p className="text-[11px] font-bold text-[#0B1C30] uppercase tracking-widest">Transport Fee</p>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px]">
                <span className="text-gray-400">Monthly × 12 = <span className="text-[#3525CD] font-semibold">Rs.18,000</span></span>
                <span className="text-gray-400">PAID <span className="font-semibold text-[#0B1C30]">Rs.9,000</span></span>
                <span className="text-gray-400">PENDING <span className="font-semibold text-[#BA1A1A]">Rs.9,000</span></span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 flex-1 px-3 sm:px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-[11px] sm:text-[12px] w-full">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l2.5 2.5L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                OCT–MAR
              </div>
              <div className="flex items-center gap-2 flex-1 px-3 sm:px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-[11px] sm:text-[12px]">
                <PendingCircle size={14} />
                <span>Apr–Sep installments pending (Rs.1,500 / month)</span>
              </div>
            </div>
          </div>
        </div>

        {/* EXAMINATION FEE */}
        <div className="rounded-2xl border border-[#E8EBF2] bg-white p-5 sm:p-6 transition-all duration-200 hover:border-[#3525CD] hover:shadow-sm">
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-widest">Examination Fee</p>
            <p className="text-[14px] font-bold text-[#0B1C30] mt-0.5">Quarterly × 4 = <span className="text-[#3525CD] font-semibold">Rs.8,000</span></p>
          </div>
          <div className="flex flex-col gap-3">
            {examTerms.map((t) => (
              <div key={t.label} className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${t.paid ? "bg-emerald-50" : t.pending ? "bg-amber-50 border border-[#EFF4FF]" : "bg-[#EFF4FF]"}`}>
                <div className="flex items-center gap-2">
                  {t.paid && <TickCircle />}
                  {t.pending && <PendingCircle />}
                  {t.upcoming && <LockCircle />}
                  <span className="text-[13px] font-semibold text-[#006C49]">{t.label}</span>
                </div>
                <span className={`text-[13px] font-semibold ${t.paid ? "text-[#006C49]" : t.pending ? "text-amber-600" : "text-gray-400"}`}>
                  Rs.{t.amount.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-[#E8EBF2] flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-gray-400">Paid Amount</span>
              <span className="font-semibold text-[#006C49]">Rs.4,000</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-gray-400">Balance</span>
              <span className="font-semibold text-[#BA1A1A]">Rs.4,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── PURPLE PAY BAR ── */}
      <div className="rounded-2xl bg-[#3525CD] px-5 py-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-[15px] font-bold text-white">Outstanding Balance: Rs.56,500</p>
          <p className="text-[11px] text-white/70 mt-0.5">Pay current installments to avoid late fees</p>
        </div>
        <button className="shrink-0 bg-white text-[#3525CD] font-bold text-[13px] px-7 py-3 rounded-xl hover:bg-indigo-50 active:scale-[0.97] transition-all">
          Pay Now
        </button>
      </div>

    </div>
  );
}