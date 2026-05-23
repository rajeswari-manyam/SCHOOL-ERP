// src/features/auth/components/OtpForm.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, RefreshCw, CheckCircle2 } from "lucide-react";
import { OtpBoxes } from "./OtpBoxes";
import { useVerifyOtp, useLogin } from "../hooks/useAuth";
import type { OtpRouteState } from "../types/auth.types";

interface OtpFormProps {
  routeState: OtpRouteState;
  onBack: () => void;
}

const RESEND_COUNTDOWN = 45;

export const OtpForm = ({ routeState, onBack }: OtpFormProps) => {
  const { phone, schoolcode, userType, otp: devOtp } = routeState;
  const [otp,       setOtp]       = useState("");
  const [error,     setError]     = useState("");
  const [timer,     setTimer]     = useState(RESEND_COUNTDOWN);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const verifyMutation = useVerifyOtp();
  const loginMutation  = useLogin();

  const startTimer = useCallback(() => {
    setCanResend(false);
    setTimer(RESEND_COUNTDOWN);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); setCanResend(true); return 0; }
        return t - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => { startTimer(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, [startTimer]);

  const handleResend = () => {
    if (!canResend) return;
    setOtp(""); setError("");
    loginMutation.mutate({ schoolcode, phone });
    startTimer();
  };

  const handleVerify = (otpVal = otp) => {
    if (otpVal.length !== 6) { setError("Please enter all 6 digits"); return; }
    setError("");
    verifyMutation.mutate({ schoolcode, phone, otp: otpVal });
  };

  const handleOtpChange = (val: string) => {
    setOtp(val); setError("");
    if (val.length === 6) setTimeout(() => handleVerify(val), 200);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm">
        <p className="text-slate-600">
          OTP sent to <span className="font-semibold text-slate-800">+91 {phone}</span>
        </p>
        <button type="button" onClick={onBack} className="text-indigo-600 hover:text-indigo-700 text-xs font-medium hover:underline transition-colors">
          Change
        </button>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
        <CheckCircle2 size={12} />{userType}
      </div>

      <div className="space-y-2">
        <OtpBoxes value={otp} onChange={handleOtpChange} hasError={!!error || verifyMutation.isError} />
        {(error || verifyMutation.isError) && (
          <p className="text-center text-xs text-red-500 mt-2">
            {error || "Invalid OTP. Please try again."}
          </p>
        )}
      </div>

      <div className="text-center">
        {canResend ? (
          <button type="button" onClick={handleResend} disabled={loginMutation.isPending}
            className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors disabled:opacity-50">
            <RefreshCw size={13} className={loginMutation.isPending ? "animate-spin" : ""} />
            Resend OTP
          </button>
        ) : (
          <p className="text-xs text-slate-400">
            Resend OTP in <span className="font-semibold text-slate-600 tabular-nums">00:{String(timer).padStart(2, "0")}</span>
          </p>
        )}
      </div>

      <button type="button" onClick={() => handleVerify()} disabled={verifyMutation.isPending || otp.length !== 6}
        className="w-full h-12 flex items-center justify-center gap-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-200">
        {verifyMutation.isPending ? (
          <><Loader2 size={16} className="animate-spin" />Verifying…</>
        ) : "Verify & Continue"}
      </button>

      {import.meta.env.DEV && devOtp && (
        <p className="text-xs text-center text-slate-400 bg-amber-50 rounded-lg px-3 py-2 border border-dashed border-amber-200">
          Dev OTP from API:{" "}
          <button type="button" className="font-bold font-mono text-amber-700 hover:underline" onClick={() => handleOtpChange(devOtp)}>
            {devOtp}
          </button>{" "}(click to fill)
        </p>
      )}
    </div>
  );
};
