import { useState } from "react";

export function PaymentMethods() {
    const [selected, setSelected] = useState("upi");

    const methods = [
        {
            id: "upi",
            label: "UPI Payment",
            icon: (
                <div className="w-8 h-8 rounded-lg bg-[#5C3BC8] flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M5 12l3-8 3 8M6.5 9h3" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                </div>
            ),
        },
        {
            id: "card",
            label: "Credit/Debit Card",
            icon: (
                <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="1" y="3" width="14" height="10" rx="2" stroke="#374151" strokeWidth="1.2" />
                        <path d="M1 6.5h14" stroke="#374151" strokeWidth="1.2" />
                        <rect x="3" y="9" width="3" height="1.5" rx="0.5" fill="#374151" />
                    </svg>
                </div>
            ),
        },
        {
            id: "bank",
            label: "Net Banking",
            icon: (
                <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                            d="M2 6.5h12M8 2l6 4.5H2L8 2ZM4 6.5v6M8 6.5v6M12 6.5v6M2 12.5h12"
                            stroke="#374151"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
            ),
        },
    ];

    return (
        <div className="w-[320px] h-[249px] p-6 rounded-[24px] border border-[#C7C4D833] bg-white flex flex-col gap-4">

            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                Payment Methods
            </p>

            {methods.map((m) => (
                <button
                    key={m.id}
                    onClick={() => setSelected(m.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left ${selected === m.id
                            ? "border-[#3525CD]/30 bg-[#F5F4FF]"
                            : "border-[#E8EBF2] bg-white hover:border-[#C7C3F5]"
                        }`}
                >
                    {m.icon}

                    <span className="text-[13px] font-medium text-[#0B1C30]">
                        {m.label}
                    </span>

                    {selected === m.id && (
                        <span className="ml-auto w-4 h-4 rounded-full border-2 border-[#3525CD] flex items-center justify-center shrink-0">
                            <span className="w-2 h-2 rounded-full bg-[#3525CD]" />
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}