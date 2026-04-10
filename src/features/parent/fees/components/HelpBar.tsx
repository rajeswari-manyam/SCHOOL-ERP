export function HelpBar() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 rounded-2xl border border-[#E8EBF2] bg-white">
      <div className="flex items-start gap-3 flex-1">
        <div className="w-8 h-8 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="#3525CD" strokeWidth="1.2" />
            <path d="M7 6.5v4" stroke="#3525CD" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="7" cy="4.5" r="0.6" fill="#3525CD" />
          </svg>
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[#0B1C30]">Need help with fee payments?</p>
          <p className="text-[12px] text-gray-400">
            Contact the school accounts department for any discrepancies.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button className="px-4 py-2 rounded-lg border border-[#E8EBF2] text-[12px] font-semibold text-[#0B1C30] hover:bg-[#F8F9FF] transition-colors">
          Call Office
        </button>
        <button className="px-4 py-2 rounded-lg bg-[#3525CD] text-white text-[12px] font-semibold hover:bg-[#2a1db5] transition-colors">
          Raise Query
        </button>
      </div>
    </div>
  );
}