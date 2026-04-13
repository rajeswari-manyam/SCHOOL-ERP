import { useState } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import typography from "../../../../styles/typography";
import { cn } from "../../../../utils/cn";

export function PaymentMethods() {
  const [selected, setSelected] = useState("upi");

  const methods = [
    {
      id: "upi",
      label: "UPI Payment",
      icon: (
        <div className="w-8 h-8 rounded-lg bg-[#5C3BC8] flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M5 12l3-8 3 8M6.5 9h3"
              stroke="white"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
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
            <rect
              x="1"
              y="3"
              width="14"
              height="10"
              rx="2"
              stroke="#374151"
              strokeWidth="1.2"
            />
            <path d="M1 6.5h14" stroke="#374151" strokeWidth="1.2" />
            <rect
              x="3"
              y="9"
              width="3"
              height="1.5"
              rx="0.5"
              fill="#374151"
            />
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
    <Card
      className="
        w-full sm:w-[320px]
        rounded-[24px]
        bg-white
        border border-[#C7C4D833]
        transition-all duration-300 ease-out
        hover:border-[#3525CD]
        hover:shadow-[0_6px_20px_rgba(53,37,205,0.12)]
      "
    >
      <CardContent className="p-3 sm:p-4 flex flex-col gap-3">

        {/* Title */}
        <p
          className={cn(
            typography.form.helper,
            "tracking-widest uppercase text-gray-400"
          )}
        >
          Payment Methods
        </p>

        {/* Methods */}
        <div className="flex flex-col gap-2">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg border transition-all text-left",
                "hover:border-[#C7C3F5]",
                selected === m.id
                  ? "border-[#3525CD]/30 bg-[#F5F4FF]"
                  : "border-[#E8EBF2] bg-white"
              )}
            >
              {m.icon}

              <span className={typography.form.label}>
                {m.label}
              </span>

              {selected === m.id && (
                <span className="ml-auto w-3.5 h-3.5 rounded-full border-2 border-[#3525CD] flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3525CD]" />
                </span>
              )}
            </button>
          ))}
        </div>

      </CardContent>
    </Card>
  );
}