import { useState } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import typography from "../../../../styles/typography";
import { cn } from "../../../../utils/cn";

import type { PaymentMethodsProps } from "../types/fee.types";
import { paymentMethods } from "../data/fee.data";

export function PaymentMethods({
  defaultSelected = "upi",
  onChange,
}: PaymentMethodsProps) {
  const [selected, setSelected] = useState(defaultSelected);

  const handleSelect = (id: string) => {
    setSelected(id);
    onChange?.(id);
  };

  return (
    <Card className="w-full sm:w-[320px] rounded-[24px] bg-white border border-[#C7C4D833] hover:border-[#3525CD] hover:shadow-[0_6px_20px_rgba(53,37,205,0.12)] transition-all">

      <CardContent className="p-3 sm:p-4 flex flex-col gap-3">

        <p className={cn(
          typography.form.helper,
          "tracking-widest uppercase text-gray-400"
        )}>
          Payment Methods
        </p>

        <div className="flex flex-col gap-2">
          {paymentMethods.map(({ id, label, Icon }) => {
            const isSelected = selected === id;

            return (
              <button
                key={id}
                onClick={() => handleSelect(id)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg border text-left transition-all",
                  "hover:border-[#C7C3F5]",
                  isSelected
                    ? "border-[#3525CD]/30 bg-[#F5F4FF]"
                    : "border-[#E8EBF2] bg-white"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                    isSelected ? "bg-[#3525CD]" : "bg-[#F3F4F6]"
                  )}
                >
                  <Icon
                    size={16}
                    className={isSelected ? "text-white" : "text-gray-600"}
                    strokeWidth={1.5}
                  />
                </div>

                <span className={cn(typography.form.label, "flex-1")}>
                  {label}
                </span>

                {isSelected && (
                  <span className="ml-auto w-3.5 h-3.5 rounded-full border-2 border-[#3525CD] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3525CD]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </CardContent>
    </Card>
  );
}