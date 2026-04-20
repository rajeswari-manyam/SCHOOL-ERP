
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Phone, Mail, ArrowRight } from "lucide-react";

import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";

import typography, { combineTypography } from "@/styles/typography";
import { useAuthStore } from "../../../store/authStore";

/* ─── helpers ──────────────────────────────────── */
const isEmailVal = (val: string) => val.includes("@");

/* ─── schema ────────────────────────────────────── */
const loginSchema = z.object({
  identifier: z.string().min(3, "Enter a valid email or phone"),
  password: z.string().optional(), // ✅ FIX
});

type LoginFormData = z.infer<typeof loginSchema>;

/* ─── dummy credentials ─────────────────────────── */
const DUMMY_USERS = [
  { email: "superadmin@manyam.in", password: "Super@123", role: "superadmin" },
  { email: "schooladmin@demo.school", password: "School@123", role: "schooladmin" },
  { email: "ravi.kumar@demo.school", password: "Teacher@123", role: "teacher" },
  { email: "priya.sharma@demo.school", password: "Accounts@123", role: "accountant" },
  { email: "suresh.reddy@parent.in", password: "Parent@123", role: "parent" },
  { email: "anjali.reddy@student.in", password: "Student@123", role: "student" },
];

const roleRedirect = (role?: string): string => {
  switch (role) {
    case "superadmin": return "/superadmin/dashboard";
    case "schooladmin": return "/schooladmin/dashboard";
    case "accountant": return "/accountant/dashboard";
    case "teacher": return "/teacher/dashboard";
    case "student": return "/student/dashboard";
    case "parent": return "/parent/dashboard";
    default: return "/login";
  }
};

const inputCls =
  "w-full h-11 px-3.5 rounded-lg border border-gray-300 text-sm text-gray-900 " +
  "placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 " +
  "focus:ring-indigo-100 transition";

/* ═══════════════════════════════════════════════ */
export const LoginForm = () => {
  const [showPw, setShowPw] = useState(false);
  const [inputType, setInputType] = useState<"unknown" | "email" | "phone">("unknown");

  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const form = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
  const identifier = form.watch("identifier") ?? "";

  /* Detect input type as user types */
  // With this:
  useEffect(() => {
    if (!identifier) { setInputType("unknown"); return; }
    // Strip +91, spaces, hyphens, then check if remaining is digits
    const stripped = identifier.replace(/^\+91[\s-]?/, "").replace(/\s/g, "");
    if (/^\d+$/.test(stripped)) { setInputType("phone"); return; }
    if (isEmailVal(identifier)) { setInputType("email"); return; }
    setInputType("unknown");
  }, [identifier]);
  const onSubmit = (data: LoginFormData) => {
    setError(null);

    if (inputType === "phone") {
      // Strip +91 prefix and spaces before sending
      const phone = data.identifier.replace(/^\+91[\s-]?/, "").replace(/\s/g, "");
      navigate("/otp", { state: { phone } });
      return;
    }

    /* Email → validate password */
    if (!data.password) {
      form.setError("password", { message: "Password is required" });
      return;
    }

    const user = DUMMY_USERS.find(
      (u) => u.email === data.identifier && u.password === data.password
    );

    if (!user) {
      setError("Invalid email or password. Use the test credentials below.");
      return;
    }

    setAuth(
      { id: "dummy-id", name: "Dummy User", email: user.email, role: user.role },
      "dummy-token"
    );
    navigate(roleRedirect(user.role));
  };



  /* ── OTP view (same page, no route change) ── */


  const IdentifierIcon =
    inputType === "phone" ? Phone :
      inputType === "email" ? Mail : null;

  /* ── Login form ── */
  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 space-y-5">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* Identifier */}
        <div className="space-y-1">
          <Label required>Email or Phone</Label>
          <div className="relative">
            <Input
              type="text"
              placeholder="admin@manyam.in or 9876543210"
              className={`${inputCls} ${IdentifierIcon ? "pr-10" : ""}`}
              {...form.register("identifier")}
              autoComplete="username"
            />
            {IdentifierIcon && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <IdentifierIcon size={16} />
              </span>
            )}
          </div>
          {form.formState.errors.identifier && (
            <p className={combineTypography(typography.form.error)}>
              {form.formState.errors.identifier.message}
            </p>
          )}
        </div>

        {/* Password — only for email */}
        {inputType === "email" && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label required>Password</Label>
              <button type="button" className="text-xs text-indigo-600 hover:underline">
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Input
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                className={`${inputCls} pr-10`}
                {...form.register("password")}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className={combineTypography(typography.form.error)}>
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
        )}

        {/* Phone hint */}
        {inputType === "phone" && (
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <Phone size={12} />
            We'll send a one-time OTP to this number
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="default"
          size="md"
          className="w-full py-3 flex items-center justify-center gap-2"
        >
          {inputType === "phone" ? (
            <>Send OTP <ArrowRight size={16} /></>
          ) : (
            "Sign In"
          )}
        </Button>

      </form>
    </div>
  );
};