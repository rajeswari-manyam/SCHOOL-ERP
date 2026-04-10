import type { Fee } from "../types/fee.types";

interface FeeCardProps {
    fee: Fee;
    onPay: () => void;
}

export function FeeCard({ fee, onPay }: FeeCardProps) {
    const isOverdue = fee.status === "overdue";
    const isUpcoming = fee.status === "upcoming";

    return (
        <div className="group w-[814px] flex flex-col rounded-2xl border border-[#E8EBF2] hover:border-[#3525CD] bg-white overflow-hidden opacity-100 transition-colors duration-200">

            {/* Top section */}
            <div className="px-6 pt-6 pb-3 flex items-start justify-between gap-4">

                {/* Left: icon + title + badges */}
                <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isOverdue ? "bg-red-50" : "bg-blue-50"}`}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <rect x="3" y="2" width="10" height="12" rx="2"
                                stroke={isOverdue ? "#DC2626" : "#3B82F6"} strokeWidth="1.3" />
                            <path d="M6 6h4M6 9h2"
                                stroke={isOverdue ? "#DC2626" : "#3B82F6"}
                                strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                    </div>

                    <div>
                        <p className="text-[14px] font-semibold text-[#0B1C30]">{fee.term}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-[12px] text-gray-400">Due: {fee.dueDate}</span>
                            {isOverdue && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 tracking-wide">
                                    OVERDUE · {fee.daysOverdue} DAYS PAST DUE
                                </span>
                            )}
                            {isUpcoming && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 tracking-wide">
                                    UPCOMING
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: amount */}
                <div className="text-right shrink-0">
                    <p className={`text-[18px] font-bold ${isOverdue ? "text-[#BA1A1A]" : "text-[#0B1C30]"}`}>
                        Rs.{fee.amount.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                        {isOverdue ? "PENDING AMOUNT" : "BALANCE DUE"}
                    </p>
                </div>
            </div>

            {/* Footer: no divider line, just spacing */}
            <div className="h-[56px] px-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
                    {fee.reminder && fee.reminder !== "No reminder sent yet" ? (
                        <>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                            <span>{fee.reminder}</span>
                        </>
                    ) : (
                        <span className="text-gray-300">{fee.reminder ?? "No reminder sent yet"}</span>
                    )}
                </div>
                <button
                    onClick={onPay}
                    className="shrink-0 bg-[#0B1C30] hover:bg-[#1a2f47] active:scale-[0.97] transition-all text-white text-[13px] font-semibold px-5 py-2 rounded-xl"
                >
                    Pay Rs.{fee.amount.toLocaleString("en-IN")} →
                </button>
            </div>
        </div>
    );
}