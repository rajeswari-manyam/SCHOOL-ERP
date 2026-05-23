// src/features/auth/pages/OtpPage.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, RefreshCw, Shield, GraduationCap, ChevronLeft, Sparkles, CheckCircle2 } from "lucide-react";

import { verifyOtp } from "../api/auth.api";
import { sendOtp }   from "../api/auth.api";
import { useAuthStore, USER_TYPE_ROUTE_MAP } from "@/store/authStore";

// ── Role → visual theming ─────────────────────────────────────────────────────
const ROLE_VISUAL: Record<string, { label: string; accent: string; light: string; dark: string }> = {
  Teacher:     { label: "Teacher Portal",    accent: "bg-emerald-500", light: "bg-emerald-50", dark: "text-emerald-700" },
  // SchoolAdmin: { label: "Admin Portal",      accent: "bg-sky-500",     light: "bg-sky-50",     dark: "text-sky-700"    },
  SuperAdmin:  { label: "Super Admin",       accent: "bg-indigo-600",  light: "bg-indigo-50",  dark: "text-indigo-700" },
  Admin:       { label: "Admin Portal",      accent: "bg-indigo-600",  light: "bg-indigo-50",  dark: "text-indigo-700" },
  Accountant:  { label: "Accounts Portal",   accent: "bg-amber-500",   light: "bg-amber-50",   dark: "text-amber-700"  },
  Parent:      { label: "Parent Portal",     accent: "bg-rose-500",    light: "bg-rose-50",    dark: "text-rose-700"   },
  Student:     { label: "Student Portal",    accent: "bg-violet-500",  light: "bg-violet-50",  dark: "text-violet-700" },
};

const RESEND_COUNTDOWN = 45;

const OtpPage = () => {
  const navigate = useNavigate();
  const login    = useAuthStore((s) => s.login);

  // ── Read saved data from localStorage (written by LoginPage after sendOtp) ─
  const phone      = localStorage.getItem("phone")      ?? "";
  const schoolcode = localStorage.getItem("schoolcode") ?? "";
  const rawUserType = localStorage.getItem("userType")  ?? "Teacher";
  // Dev: API returns OTP in response; LoginPage saves it
  const devOtp     = localStorage.getItem("otp")        ?? "";

  const visual = ROLE_VISUAL[rawUserType] ?? ROLE_VISUAL["Teacher"];

  // ── Guard: if no phone saved, send back to login ──────────────────────────
  useEffect(() => {
    if (!phone) navigate("/login", { replace: true });
  }, [phone, navigate]);

  // ── OTP state ─────────────────────────────────────────────────────────────
  const [otp,       setOtp]       = useState(devOtp); // pre-fill in dev
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [timer,     setTimer]     = useState(RESEND_COUNTDOWN);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Countdown timer ───────────────────────────────────────────────────────
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

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (!canResend) return;
    try {
      setOtp(""); setError("");
      const res = await sendOtp({ schoolcode, phone });
      if (import.meta.env.DEV && res.otp) {
        localStorage.setItem("otp", res.otp);
        setOtp(res.otp);
      }
      toast.success("OTP resent successfully!");
      startTimer();
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  // ── Verify OTP ────────────────────────────────────────────────────────────
  const handleVerifyOtp = async (otpToVerify = otp) => {
    if (otpToVerify.length !== 6) { setError("Please enter all 6 digits"); return; }
    setError("");
    setLoading(true);

    try {
      const payload = { schoolcode, phone, otp: otpToVerify };
      console.log("VERIFY OTP PAYLOAD →", payload);

      const response = await verifyOtp(payload);
      console.log("VERIFY OTP RESPONSE →", response);

      if (response?.status === true) {
        // rawUserType from localStorage — e.g. "Teacher", "SchoolAdmin"
        console.log("USER TYPE →", rawUserType);

        // ✅ Save full session to Zustand + localStorage
        login(
          response?.token ?? `token-${Date.now()}`,
          response?.user  ?? {},
          rawUserType,           // "Teacher" | "SchoolAdmin" | etc.
        );

        toast.success("OTP Verified Successfully!");

        // ✅ Navigate to correct dashboard
        const route = USER_TYPE_ROUTE_MAP[rawUserType] ?? "/teacher/dashboard";
        console.log("NAVIGATING TO →", route);
        navigate(route, { replace: true });

      } else {
        setError(response?.message ?? "Invalid OTP");
        toast.error(response?.message ?? "OTP Verification Failed");
      }

    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "OTP Verification Failed";
      console.error(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── 6-box OTP input helpers ───────────────────────────────────────────────
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const vals   = otp.padEnd(6, "").split("").slice(0, 6);

  const handleBoxChange = (idx: number, raw: string) => {
    const char = raw.replace(/\D/g, "").slice(-1);
    const next = [...vals]; next[idx] = char;
    const newOtp = next.join("").trimEnd();
    setOtp(newOtp); setError("");
    if (char && idx < 5) inputs.current[idx + 1]?.focus();
    if (newOtp.length === 6) setTimeout(() => handleVerifyOtp(newOtp), 200);
  };

  const handleBoxKey = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (vals[idx]) { const n = [...vals]; n[idx] = ""; setOtp(n.join("").trimEnd()); }
      else if (idx > 0) { const n = [...vals]; n[idx-1] = ""; setOtp(n.join("").trimEnd()); inputs.current[idx-1]?.focus(); }
    } else if (e.key === "ArrowLeft"  && idx > 0) inputs.current[idx-1]?.focus();
    else if   (e.key === "ArrowRight" && idx < 5) inputs.current[idx+1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    setOtp(pasted);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* ── Left: OTP panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">

          {/* Back */}
          <button type="button" onClick={() => navigate("/login")}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-8 group">
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to login
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              School<span className="text-indigo-600">ERP</span>
            </span>
          </div>

          {/* Role badge + heading */}
          <div className="mb-8">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${visual.light} ${visual.dark} text-xs font-semibold mb-3 border border-current/10`}>
              <Sparkles size={11} />{visual.label}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">OTP Verification</h1>
            <p className="text-sm text-slate-500 mt-1">A 6-digit code has been sent to your number</p>
          </div>

          {/* Phone + change */}
          <div className="flex items-center justify-between text-sm mb-5">
            <p className="text-slate-600">
              OTP sent to <span className="font-semibold text-slate-800">+91 {phone}</span>
            </p>
            <div className="inline-flex items-center gap-1 text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full font-semibold">
              <CheckCircle2 size={11} />{rawUserType}
            </div>
          </div>

          {/* 6-box OTP input */}
          <div className="space-y-2 mb-6">
            <div
              className="flex justify-center gap-2 sm:gap-3"
              onPaste={handlePaste}
              role="group"
              aria-label="OTP input"
            >
              {Array.from({ length: 6 }, (_, i) => {
                const filled = !!vals[i];
                const cls = error
                  ? "border-red-300 bg-red-50 text-red-600 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : filled
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm"
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
                    onChange={(e) => handleBoxChange(i, e.target.value)}
                    onKeyDown={(e) => handleBoxKey(i, e)}
                    onFocus={(e) => e.target.select()}
                    className={`w-11 sm:w-13 h-12 sm:h-14 rounded-xl border-2 text-center text-xl font-bold outline-none transition-all duration-200 caret-transparent focus:scale-105 ${cls}`}
                  />
                );
              })}
            </div>
            {error && (
              <p className="text-center text-xs text-red-500">{error}</p>
            )}
          </div>

          {/* Resend timer */}
          <div className="text-center mb-5">
            {canResend ? (
              <button type="button" onClick={handleResend}
                className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors">
                <RefreshCw size={13} />Resend OTP
              </button>
            ) : (
              <p className="text-xs text-slate-400">
                Resend OTP in <span className="font-semibold text-slate-600 tabular-nums">00:{String(timer).padStart(2,"0")}</span>
              </p>
            )}
          </div>

          {/* Verify button */}
          <button
            type="button"
            onClick={() => handleVerifyOtp()}
            disabled={loading || otp.length !== 6}
            className="w-full h-12 flex items-center justify-center gap-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
          >
            {loading
              ? <><Loader2 size={16} className="animate-spin" />Verifying…</>
              : "Verify & Continue"
            }
          </button>

          {/* Dev: click-to-fill OTP */}
          {import.meta.env.DEV && devOtp && (
            <p className="text-xs text-center text-slate-400 bg-amber-50 rounded-lg px-3 py-2 border border-dashed border-amber-200 mt-4">
              Dev OTP from API:{" "}
              <button type="button" className="font-bold font-mono text-amber-700 hover:underline"
                onClick={() => { setOtp(devOtp); }}>
                {devOtp}
              </button>{" "}(click to fill)
            </p>
          )}

          <div className="flex items-center gap-2 mt-8 text-xs text-slate-400">
            <Shield size={12} />
            <span>Secure encrypted verification · Manyam Technologies</span>
          </div>
        </div>
      </div>

      {/* ── Right: Dark accent panel ── */}
      <div className="hidden lg:flex w-[480px] xl:w-[520px] items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute -top-20 -right-20 w-80 h-80 rounded-full ${visual.accent} opacity-15 blur-3xl`} />
          <div className={`absolute -bottom-20 -left-20 w-64 h-64 rounded-full ${visual.accent} opacity-10 blur-2xl`} />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        </div>
        <div className="relative text-center px-12">
          <div className="flex justify-center gap-2 mb-10">
            {["●","●","●","●","●","●"].map((dot, i) => (
              <div key={i} className={`w-10 h-12 rounded-lg flex items-center justify-center text-xl font-bold border-2 transition-all duration-300 ${i < 3 ? `${visual.accent} border-transparent text-white shadow-lg` : "border-white/20 bg-white/5 text-white/20"}`}>
                {i < 3 ? dot : "–"}
              </div>
            ))}
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Verify your identity</h3>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
            Enter the one-time password sent to your registered mobile number to continue.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-xs">
            <Shield size={11} /><span>Valid for 10 minutes · Do not share</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default OtpPage;
