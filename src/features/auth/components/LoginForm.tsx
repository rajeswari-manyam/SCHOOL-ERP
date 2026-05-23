// src/features/auth/components/LoginForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Loader2, Phone, School } from "lucide-react";
import { useLogin } from "../hooks/useAuth";

const loginSchema = z.object({
  schoolcode: z.string().min(1, "School code is required").max(20, "School code too long"),
  phone: z
    .string()
    .min(10, "Enter a valid 10-digit phone number")
    .max(10, "Enter a valid 10-digit phone number")
    .regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { schoolcode: "", phone: "" },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate({ schoolcode: values.schoolcode, phone: values.phone });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* School Code */}
      <div className="space-y-1.5">
        <label htmlFor="schoolcode" className="block text-sm font-semibold text-slate-700">
          School Code
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <School size={16} />
          </span>
          <input
            id="schoolcode"
            type="text"
            placeholder="e.g. 333333"
            autoComplete="organization"
            className={`w-full h-12 pl-10 pr-4 rounded-xl border text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 ${
              errors.schoolcode
                ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            }`}
            {...register("schoolcode")}
          />
        </div>
        {errors.schoolcode && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
            <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
            {errors.schoolcode.message}
          </p>
        )}
      </div>

      {/* Phone Number */}
      <div className="space-y-1.5">
        <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">
          Phone Number
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Phone size={16} />
          </span>
          <span className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium pointer-events-none select-none border-r border-slate-200 pr-2.5">
            +91
          </span>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            placeholder="9876543210"
            autoComplete="tel"
            maxLength={10}
            className={`w-full h-12 pl-[4.5rem] pr-4 rounded-xl border text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 ${
              errors.phone
                ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            }`}
            {...register("phone")}
          />
        </div>
        {errors.phone && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
            <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full h-12 flex items-center justify-center gap-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-200"
      >
        {loginMutation.isPending ? (
          <><Loader2 size={16} className="animate-spin" />Sending OTP…</>
        ) : (
          <>Send OTP <ArrowRight size={16} /></>
        )}
      </button>

      {import.meta.env.DEV && (
        <p className="text-xs text-center text-slate-400 bg-slate-50 rounded-lg px-3 py-2 border border-dashed border-slate-200">
          Dev: schoolcode <strong className="text-slate-600 font-mono">333333</strong> · phone{" "}
          <strong className="text-slate-600 font-mono">9876543210</strong>
        </p>
      )}
    </form>
  );
};
