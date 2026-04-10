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

export function FeeProgressCard() {
  return (
    <div className="flex flex-col gap-5">

      {/* Summary banner */}
      <div className="rounded-2xl border border-[#E8EBF2] bg-white p-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="3" width="12" height="9" rx="1.5" stroke="#3525CD" strokeWidth="1.2" />
                <path d="M5 1v3M9 1v3M1 7h12" stroke="#3525CD" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[14px] font-semibold text-[#0B1C30]">Academic Year Overview</p>
          </div>
          <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">55.9% COLLECTED</span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-4 mb-4">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Total Paid</p>
            <p className="text-[22px] font-bold text-[#0B1C30]">Rs.71,500</p>
            <p className="text-[11px] text-gray-400 mt-0.5">↑ Updated today at 09:42 AM</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Pending Amount</p>
            <p className="text-[22px] font-bold text-[#BA1A1A]">Rs.56,500</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Next due date: Nov 15th</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Annual Total</p>
            <p className="text-[22px] font-bold text-[#0B1C30]">Rs.1,28,000</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Inclusive of all categories</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full rounded-full bg-[#F0F1F5] overflow-hidden mb-1">
          <div className="h-2 rounded-full bg-[#3525CD]" style={{ width: "55.9%" }} />
        </div>
        <div className="flex justify-between text-[11px] text-gray-400">
          <span>PROGRESS BAR · 55.9% COMPLETION</span>
          <span>44.1% REMAINING</span>
        </div>
      </div>

      {/* Tuition Fee calendar */}
      <div className="rounded-2xl border border-[#E8EBF2] bg-white p-5">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[13px] font-semibold text-[#0B1C30]">TUITION FEE</p>
          <div className="flex gap-4 text-[12px]">
            <span className="text-gray-400">Monthly Rs.8,500 × 12 = <span className="text-[#3525CD] font-semibold">Rs.1,02,000</span></span>
          </div>
          <div className="flex gap-4 text-[12px]">
            <span className="text-gray-400">PAID <span className="font-semibold text-[#0B1C30]">Rs.51,000</span></span>
            <span className="text-gray-400">PENDING <span className="font-semibold text-[#BA1A1A]">Rs.51,000</span></span>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-2 mt-4">
          {tuitionMonths.map((m) => (
            <div
              key={m.label}
              className={`flex flex-col items-center py-2 rounded-xl text-[11px] font-semibold ${
                m.paid
                  ? "bg-emerald-100 text-emerald-700"
                  : m.pending
                  ? "bg-amber-100 text-amber-700"
                  : "bg-[#F0F1F5] text-gray-400"
              }`}
            >
              {m.paid && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mb-1">
                  <path d="M2 6l2.5 2.5L10 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {m.pending && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mb-1">
                  <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M6 4v2.5l1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              )}
              {m.upcoming && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mb-1">
                  <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3" strokeDasharray="2 2" />
                </svg>
              )}
              {m.label}
            </div>
          ))}
        </div>
      </div>

      {/* Exam fee terms */}
      <div className="rounded-2xl border border-[#E8EBF2] bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[13px] font-semibold text-[#0B1C30]">EXAMINATION FEE</p>
          <span className="text-[12px] text-gray-400">Quarterly × 4 = <span className="text-[#3525CD] font-semibold">Rs.8,000</span></span>
        </div>
        <div className="flex flex-col gap-2">
          {examTerms.map((t) => (
            <div
              key={t.label}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl ${
                t.paid ? "bg-emerald-50" : t.pending ? "bg-amber-50 border border-amber-200" : "bg-[#F8F9FF]"
              }`}
            >
              <div className="flex items-center gap-2">
                {t.paid && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" fill="#16A34A" />
                    <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {t.pending && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" stroke="#D97706" strokeWidth="1.3" />
                    <path d="M7 4v3.5l2 1" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                )}
                {t.upcoming && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="#9CA3AF" strokeWidth="1.3" strokeDasharray="2 2" />
                  </svg>
                )}
                <span className="text-[13px] font-semibold text-[#0B1C30]">{t.label}</span>
              </div>
              <span className={`text-[13px] font-semibold ${t.paid ? "text-emerald-600" : t.pending ? "text-amber-600" : "text-gray-400"}`}>
                Rs.{t.amount.toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}