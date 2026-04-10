import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent, ClipboardEvent } from "react";
import { Shield } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import typography, { combineTypography } from "@/styles/typography";

interface OtpInputProps {
  phone: string;
  onVerified?: () => void;
  onBack?: () => void;
}

/* ── 6-box OTP input ────────────────────────────── */
const OtpBoxes = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const vals = value.padEnd(6, "").split("").slice(0, 6);

  const handleChange = (idx: number, char: string) => {
    if (!/^\d?$/.test(char)) return;
    const next = [...vals];
    next[idx] = char;
    onChange(next.join("").trimEnd());
    if (char && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !vals[idx] && idx > 0) {
      const next = [...vals];
      next[idx - 1] = "";
      onChange(next.join("").trimEnd());
      inputs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, 5);
    inputs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
      {Array.from({ length: 6 }, (_, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={vals[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={`w-12 sm:w-14 h-12 sm:h-14 text-center text-lg sm:text-xl font-semibold rounded-lg border outline-none transition-all
            ${vals[i]
              ? "bg-indigo-50 border-indigo-500 text-indigo-700"
              : "bg-white border-gray-300 text-gray-900"
            } focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100`}
        />
      ))}
    </div>
  );
};

/* ── Main OTP Input ─────────────────────────────── */
export const OtpInput = ({ phone, onVerified, onBack }: OtpInputProps) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(45);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    setTimer(45);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const verify = () => {
    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (otp === "123456") {
        onVerified?.();
      } else {
        setError("Invalid OTP. Please try again.");
      }
    }, 500); // mock delay
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 space-y-5">
      {/* Info + back */}
      <div className="text-sm text-gray-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <p>
          OTP sent to <span className="font-semibold text-gray-800">+91 {phone}</span>
        </p>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-indigo-600 text-xs hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {/* OTP Boxes */}
      <div className="space-y-1">
        <Label required>Enter 6-digit OTP</Label>
        <OtpBoxes value={otp} onChange={setOtp} />
        {error && <p className={combineTypography(typography.form.error)}>{error}</p>}
      </div>

      {/* Timer / Resend */}
      <p className={combineTypography(typography.body.xs, "text-gray-400")}>
        {timer > 0 ? (
          <>Resend OTP in <span className="font-semibold text-gray-600">00:{String(timer).padStart(2, "0")}</span></>
        ) : (
          <button
            type="button"
            onClick={startTimer}
            className="text-indigo-600 hover:underline font-medium"
          >
            Resend OTP
          </button>
        )}
      </p>

      {/* Verify button */}
      <Button onClick={verify} disabled={loading || otp.length !== 6} className="w-full py-3">
        {loading ? "Verifying..." : "Verify & Login"}
      </Button>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 text-center sm:text-left">
        <Shield size={14} className="text-gray-400" />
        <p className={combineTypography(typography.body.xs, "text-gray-400")}>
          Secure encrypted login by Manyam
        </p>
      </div>

      {/* Mock OTP */}
      <p className={combineTypography(typography.body.xs, "text-gray-400 text-center sm:text-left")}>
        Mock OTP: <b>123456</b>
      </p>
    </div>
  );
};