// src/features/auth/components/OtpBoxes.tsx
import { useRef } from "react";
import type { KeyboardEvent, ClipboardEvent } from "react";

interface OtpBoxesProps {
  value: string;
  onChange: (val: string) => void;
  length?: number;
  hasError?: boolean;
}

export const OtpBoxes = ({ value, onChange, length = 6, hasError = false }: OtpBoxesProps) => {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const vals   = value.padEnd(length, "").split("").slice(0, length);

  const handleChange = (idx: number, raw: string) => {
    const char = raw.replace(/\D/g, "").slice(-1);
    const next = [...vals];
    next[idx]  = char;
    onChange(next.join("").trimEnd());
    if (char && idx < length - 1) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (vals[idx]) {
        const next = [...vals]; next[idx] = ""; onChange(next.join("").trimEnd());
      } else if (idx > 0) {
        const next = [...vals]; next[idx - 1] = ""; onChange(next.join("").trimEnd());
        inputs.current[idx - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft"  && idx > 0)          inputs.current[idx - 1]?.focus();
    else if   (e.key === "ArrowRight" && idx < length - 1) inputs.current[idx + 1]?.focus();
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted   = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
    inputs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste} role="group" aria-label="OTP input">
      {Array.from({ length }, (_, i) => {
        const isFilled = !!vals[i];
        const cls = hasError
          ? "border-red-300 bg-red-50 text-red-600 focus:border-red-500 focus:ring-2 focus:ring-red-100"
          : isFilled
          ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100"
          : "border-slate-200 bg-white text-slate-900 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";
        return (
          <input
            key={i}
            ref={(el) => { inputs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={vals[i] ?? ""}
            aria-label={`OTP digit ${i + 1}`}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={(e) => e.target.select()}
            className={`w-11 sm:w-13 h-12 sm:h-14 rounded-xl border-2 text-center text-xl font-bold outline-none transition-all duration-200 caret-transparent select-none focus:scale-105 ${cls}`}
          />
        );
      })}
    </div>
  );
};
