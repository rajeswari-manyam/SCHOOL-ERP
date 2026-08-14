// src/features/auth/pages/OtpPage.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Loader2,
  RefreshCw,
  Shield,
  GraduationCap,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { verifyOtp, sendOtp, getUserById } from "@/services/auth.api";
import { initPushNotifications } from "@/utils/pushNotifications";
import { useAuthStore, USER_TYPE_ROUTE_MAP } from "@/store/authStore";
import type { UserType, AuthUser } from "../types/auth.types";

// ── Role → visual theming ──────────────────────────────────────────────────────
const ROLE_VISUAL: Record<
  string,
  { label: string; accent: string; light: string; dark: string }
> = {
  Teacher:    { label: "Teacher Portal",  accent: "bg-emerald-500", light: "bg-emerald-50", dark: "text-emerald-700" },
  SuperAdmin: { label: "Super Admin",     accent: "bg-indigo-600",  light: "bg-indigo-50",  dark: "text-indigo-700" },
  Admin:      { label: "Admin Portal",    accent: "bg-indigo-600",  light: "bg-indigo-50",  dark: "text-indigo-700" },
  Accountant: { label: "Accounts Portal", accent: "bg-amber-500",   light: "bg-amber-50",   dark: "text-amber-700"  },
  Parent:     { label: "Parent Portal",   accent: "bg-rose-500",    light: "bg-rose-50",    dark: "text-rose-700"   },
  Student:    { label: "Student Portal",  accent: "bg-violet-500",  light: "bg-violet-50",  dark: "text-violet-700" },
};

const RESEND_COUNTDOWN = 45;

const OtpPage = () => {
  const navigate = useNavigate();
  const setAuth          = useAuthStore((s) => s.setAuth);
  const setUserProfile   = useAuthStore((s) => s.setUserProfile);
  const setParentSession = useAuthStore((s) => s.setParentSession);

  // ── Read meta saved by LoginPage after sendOtp ──────────────────────────────
  const phone       = localStorage.getItem("phone")      ?? "";
  const schoolcode  = localStorage.getItem("schoolcode") ?? "";
  const rawUserType = localStorage.getItem("userType")   ?? "Teacher";
  const devOtp      = localStorage.getItem("otp")        ?? "";
  const schoolName  = localStorage.getItem("schoolName") || "";
  const schoolLogo  = localStorage.getItem("schoolLogo") || "";

  const normalizedUserType =
    rawUserType.charAt(0).toUpperCase() + rawUserType.slice(1).toLowerCase();
  const visual = ROLE_VISUAL[normalizedUserType] ?? ROLE_VISUAL["Teacher"];

  // ── Guard: no phone → back to login ────────────────────────────────────────
  useEffect(() => {
    if (!phone) navigate("/login", { replace: true });
  }, [phone, navigate]);

  // Log OTP in dev exactly once per value — ref prevents StrictMode double-fire
  const loggedOtpRef = useRef("");
  useEffect(() => {
    if (import.meta.env.DEV && devOtp && devOtp !== loggedOtpRef.current) {
      loggedOtpRef.current = devOtp;
      console.log(
        "%c🔑 DEV OTP:",
        "font-size:16px; font-weight:bold; color:#d97706;",
        devOtp
      );
    }
  }, [devOtp]);

  // ── State ───────────────────────────────────────────────────────────────────
  const [otp,       setOtp]       = useState("");
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [timer,     setTimer]     = useState(RESEND_COUNTDOWN);
  const [canResend, setCanResend] = useState(false);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const submittingRef = useRef(false);

  // ── Countdown ───────────────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    setCanResend(false);
    setTimer(RESEND_COUNTDOWN);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  // ── Resend OTP ──────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (!canResend) return;
    try {
      setOtp("");
      setError("");
      const res = await sendOtp({ schoolcode, phone });
      if (import.meta.env.DEV && res.otp) {
        console.log(
          "%c🔑 DEV OTP (resent):",
          "font-size:16px; font-weight:bold; color:#d97706;",
          res.otp
        );
      }
      toast.success("OTP resent successfully!");
      startTimer();
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  // ── Verify OTP ──────────────────────────────────────────────────────────────
  const handleVerifyOtp = async (otpToVerify = otp) => {
    if (otpToVerify.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    if (submittingRef.current) return;
    submittingRef.current = true;
    setError("");
    setLoading(true);

    try {
      // ── Step 1: verify OTP ───────────────────────────────────────────────
const response = await verifyOtp({
  schoolcode,
  phone,
  otp: otpToVerify,
});

      if (!response?.status) {
        setError(response?.message ?? "Invalid OTP");
        toast.error(response?.message ?? "OTP Verification Failed");
        return;
      }

      const token  = response.token ?? `token-${Date.now()}`;
      const userId = response.userId ?? response.user?.id ?? response.data?.id ?? response.parent?.id ?? "";

      // Use the verified userType from the OTP response if available;
      // fall back to the one returned by sendOtp (stored in localStorage).
      const verifiedUserType = (response.userType ?? rawUserType) as UserType;
      const isParent = verifiedUserType.toLowerCase() === "parent";

      // ── Guard: unrecognized role ───────────────────────────────────────────
      // If this account's stored role doesn't match any known portal role
      // (e.g. it was saved as "Accountent" — a typo of "Accountant" — when
      // the staff record was created), USER_TYPE_ROUTE_MAP has no entry for
      // it. Without this check, the code below would still commit a token
      // to the auth store and then silently redirect back to /login (since
      // ProtectedRoute's role check would fail too) with no explanation —
      // looking exactly like "the OTP was right but login didn't work."
      if (!USER_TYPE_ROUTE_MAP[verifiedUserType]) {
        const msg = `Your account's role ("${verifiedUserType}") isn't recognized by the system. Please contact your school administrator to fix this.`;
        setError(msg);
        toast.error(msg);
        return;
      }

      // ── Step 2: commit token to Zustand IMMEDIATELY ───────────────────────
      // The axios interceptor reads useAuthStore.getState().token — NOT
      // localStorage directly.  setAuth must run before getUserById so the
      // Bearer header is present on that request.
      const initialUser: AuthUser = {
        id:          userId,
        name:        response.parent?.parent_name ?? response.name ?? "User",
        phone:       response.parent?.phone ?? phone,
        email:       response.parent?.email ?? response.email,
        userType:    verifiedUserType,
        schoolcode:  schoolcode,
        role:        response.role,
        permissions: response.permissions,
      };
      setAuth(initialUser, token);
      localStorage.setItem("userId", userId);

      // ── Push notifications — request permission + register FCM token ─────
      // Fire-and-forget: unsupported browsers, denied permission, or a
      // missing backend endpoint must never block navigation after login.
      initPushNotifications().catch(() => {});

      // ── Parent Portal — seed parent + students[], auto-select if only one ──
      let landingRoute = USER_TYPE_ROUTE_MAP[verifiedUserType] ?? "/login";
      if (isParent && response.parent) {
        setParentSession(response.parent, response.students ?? []);
        const students = response.students ?? [];
        const { selectedStudent } = useAuthStore.getState();
        if (students.length > 1 && !selectedStudent) {
          landingRoute = "/parent/select-student";
        }
      }

      toast.success("OTP Verified Successfully!");
      navigate(landingRoute, { replace: true });

      // ── Step 4: enrich profile after navigation (non-fatal) ─────────────
      // Moved after navigate so a 401 on getUserById doesn't kill the session
      // before the user reaches the dashboard (the 401 interceptor logs out).
      // Not needed for Parent — the OTP response already carries parent + students.
      if (isParent) return;
      try {
        getUserById(userId).then((userProfile) => {
          if (userProfile?.status) setUserProfile(userProfile);
        });
      } catch {
        // Silently ignored — user already on dashboard
      }

    } catch (err: unknown) {
      console.error("OTP Verify Error:", err);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "OTP Verification Failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  // ── 6-box OTP input ─────────────────────────────────────────────────────────
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const vals = Array.from({ length: 6 }, (_, i) => otp[i] ?? "");

  const handleBoxChange = (idx: number, raw: string) => {
    const char = raw.replace(/\D/g, "").slice(-1);
    const next = Array.from({ length: 6 }, (_, i) => vals[i] ?? "");
    next[idx] = char;
    const newOtp = next.join("");
    setOtp(newOtp);
    setError("");
    if (char && idx < 5) inputs.current[idx + 1]?.focus();
    if (newOtp.length === 6 && !newOtp.includes("")) {
      setTimeout(() => handleVerifyOtp(newOtp), 200);
    }
  };

  const handleBoxKey = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      const next = Array.from({ length: 6 }, (_, i) => vals[i] ?? "");
      if (next[idx]) {
        next[idx] = "";
        setOtp(next.join(""));
      } else if (idx > 0) {
        next[idx - 1] = "";
        setOtp(next.join(""));
        inputs.current[idx - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft"  && idx > 0) inputs.current[idx - 1]?.focus();
    else if   (e.key === "ArrowRight" && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    setOtp(pasted);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F5F6FF]">

      {/* ── Left: School branding panel ── */}
      <div className="hidden lg:flex lg:w-[600px] xl:w-[720px] items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl" />
        </div>
        <div className="relative text-center px-12">
          {/* Mockup frame */}
        <div className="relative w-full max-w-md h-80 xl:h-96 rounded-[2rem] bg-violet-600/90 border border-white/20 shadow-2xl overflow-hidden flex flex-col items-center justify-center mb-8 mx-auto">
            {schoolLogo ? (
              <>
                <img
                  src={schoolLogo}
                  alt={schoolName}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="relative mt-auto mb-5 text-center">
                  <p className="text-white font-bold text-sm tracking-wide uppercase">{schoolName}</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                  <GraduationCap size={32} className="text-white" />
                </div>
                <p className="mt-4 text-white font-bold text-sm tracking-wide uppercase">
                  {schoolName || "School Management"}
                </p>
              </>
            )}
          </div>

          <div className="flex justify-center gap-2 mb-10">
            {["●", "●", "●", "●", "●", "●"].map((dot, i) => (
              <div
                key={i}
                className={`w-10 h-12 rounded-lg flex items-center justify-center text-xl font-bold border-2 transition-all duration-300 ${
                  i < 3
                    ? `${visual.accent} border-transparent text-white shadow-lg`
                    : "border-white/20 bg-white/5 text-white/20"
                }`}
              >
                {i < 3 ? dot : "–"}
              </div>
            ))}
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Verify your identity
          </h3>
          <p className="text-indigo-200 text-sm leading-relaxed max-w-xs mx-auto">
            Enter the one-time password sent to your registered mobile number to
            continue.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-indigo-300/70 text-xs">
            <Shield size={11} />
            <span>Valid for 10 minutes · Do not share</span>
          </div>
        </div>
      </div>

      {/* ── Right: OTP panel ──
          justify-start (not center) on mobile: once the OTP keyboard opens,
          mobile browsers shrink the visual viewport, and a vertically-centered
          layout would shove the input boxes/verify button off-screen. Anchoring
          to the top + min-h-screen (not h-screen) + overflow-y-auto keeps the
          whole form reachable and scrollable no matter how short the viewport
          actually is. Centering only kicks in from sm: up, where there's room. */}
      <div className="flex-1 flex flex-col items-center justify-start sm:justify-center overflow-y-auto px-4 xs:px-6 py-6 sm:py-12 sm:px-10">
        <div className="w-full max-w-md">

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-4 group"
          >
            <ChevronLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Back to login
          </button>

          <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 border border-slate-100 p-6 sm:p-9">

            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-6 sm:mb-8">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
                <GraduationCap size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                Vidya<span className="text-indigo-600">Tracker</span>
              </span>
            </div>

            {/* Role badge + heading */}
            <div className="mb-6 sm:mb-8">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${visual.light} ${visual.dark} text-xs font-semibold mb-3 border border-current/10`}
              >
                <Sparkles size={11} />
                {visual.label}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">OTP Verification</h1>
              <p className="text-sm text-slate-500 mt-1">
                A 6-digit code has been sent to your number
              </p>
            </div>

            {/* Phone + role badge */}
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 text-sm mb-5">
              <p className="text-slate-600 break-words">
                OTP sent to{" "}
                <span className="font-semibold text-slate-800">+91 {phone}</span>
              </p>
              <div className="inline-flex items-center gap-1 text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full font-semibold w-fit shrink-0">
                <CheckCircle2 size={11} />
                {rawUserType}
              </div>
            </div>

            {/* 6-box OTP input */}
            <div className="space-y-2 mb-6">
              <div
                className="flex justify-center gap-1.5 xs:gap-2 sm:gap-3"
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
                      className={`w-10 xs:w-12 sm:w-13 h-11 xs:h-12 sm:h-14 rounded-xl border-2 text-center text-lg xs:text-xl font-bold outline-none transition-all duration-200 caret-transparent focus:scale-105 ${cls}`}
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
                <button
                  type="button"
                  onClick={handleResend}
                  className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors"
                >
                  <RefreshCw size={13} />
                  Resend OTP
                </button>
              ) : (
                <p className="text-xs text-slate-400">
                  Resend OTP in{" "}
                  <span className="font-semibold text-slate-600 tabular-nums">
                    00:{String(timer).padStart(2, "0")}
                  </span>
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
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Verifying…
                </>
              ) : (
                "Verify & Continue"
              )}
            </button>

            {/* Dev OTP hint */}
            {import.meta.env.DEV && devOtp && (
              <p className="text-xs text-center text-slate-400 bg-amber-50 rounded-lg px-3 py-2 border border-dashed border-amber-200 mt-4">
                🔑 Dev OTP logged to console — open{" "}
                <kbd className="px-1 py-0.5 rounded bg-amber-100 text-amber-800 font-mono">
                  F12
                </kbd>{" "}
                to view
              </p>
            )}
          </div>

          <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mt-6">
            <Shield size={12} className="text-emerald-500" />
            Secure encrypted verification · Manyam Technologies
          </p>
        </div>
      </div>

    </div>
  );
};

export default OtpPage;