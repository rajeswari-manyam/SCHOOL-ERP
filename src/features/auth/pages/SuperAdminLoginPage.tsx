// src/features/auth/pages/SuperAdminLoginPage.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, Loader2, Mail, Lock, ShieldCheck } from "lucide-react";

import { superAdminLogin } from "@/services/auth.api";
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

const SuperAdminLoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const res = await superAdminLogin(values);
      if (res.status && res.token) {
        login(
          res.token,
          {
            id: res.user.email,
            name: res.user.email,
            email: res.user.email,
            phone: "",
            schoolcode: "",
            permissions: res.user.permissions,
          },
          "SuperAdmin"
        );
        toast.success(res.message ?? "Login successful");
        navigate("/superadmin/dashboard", { replace: true });
      } else {
        toast.error(res.message ?? "Login failed");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a2130] px-4">
      <div className="w-full max-w-sm bg-[#232B39] border border-white/[0.08] rounded-2xl shadow-2xl p-8">

        {/* Logo / badge */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#6C63FF]/15 border border-[#6C63FF]/30 flex items-center justify-center mb-4">
            <ShieldCheck size={26} className="text-[#6C63FF]" />
          </div>
          <h1 className="text-xl font-bold text-white">Super Admin</h1>
          <p className="text-sm text-slate-400 mt-1">Platform management portal</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                placeholder="admin@vidyatrack.com"
                autoComplete="username"
                className={`w-full h-11 pl-10 pr-3.5 rounded-xl border text-sm text-white bg-white/[0.04] outline-none transition-colors placeholder:text-slate-500 ${
                  errors.email
                    ? "border-red-400/60 focus:border-red-400"
                    : "border-white/10 focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20"
                }`}
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className={`w-full h-11 pl-10 pr-3.5 rounded-xl border text-sm text-white bg-white/[0.04] outline-none transition-colors placeholder:text-slate-500 ${
                  errors.password
                    ? "border-red-400/60 focus:border-red-400"
                    : "border-white/10 focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20"
                }`}
                {...register("password")}
              />
            </div>
            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-[#6C63FF] hover:bg-[#5b52ee] text-white text-sm font-semibold transition-all disabled:opacity-60 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-8">
          Not a super admin?{" "}
          <a href="/login" className="text-[#6C63FF] hover:underline">
            Go to school login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SuperAdminLoginPage;
