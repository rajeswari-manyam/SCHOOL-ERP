// src/features/auth/pages/LoginPage.tsx
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  ArrowRight,
  Loader2,
  Phone,
  School,
  ShieldCheck,
  GraduationCap,
  UserSquare2,
  ChevronDown,
  ChevronRight,
  Mail,
  Lock,
  Headphones,
  MessageSquareText,
} from "lucide-react";

import { sendOtp, superAdminLogin } from "@/services/auth.api";
import { useAuthStore } from "@/store/authStore";
import { axiosInstance } from "@/config/axios";

// ── Schemas ────────────────────────────────────────────────────────────────────
const staffLoginSchema = z.object({
  schoolcode: z.string().min(1, "Please select school"),
  phone: z
    .string()
    .min(10, "Enter valid mobile number")
    .max(10, "Enter valid mobile number")
    .regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
});

const studentLoginSchema = z.object({
  schoolcode:       z.string().min(1, "Please select school"),
  admissionNumber:  z.string().min(3, "Admission number is required").max(30, "Too long"),
});

const superAdminLoginSchema = z.object({
  email:    z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type StaffLoginValues      = z.infer<typeof staffLoginSchema>;
type StudentLoginValues    = z.infer<typeof studentLoginSchema>;
type SuperAdminLoginValues = z.infer<typeof superAdminLoginSchema>;
type LoginMode             = "staff" | "student" | "superadmin";
type SchoolItem = {
  school_name: string;
  school_code: string;
  logo?: string | null;
  image?: string | null;
};

// ── Feature pills (branding panel) ────────────────────────────────────────────
const FEATURE_PILLS = ["Attendance Alerts", "Fee Reminders", "Broadcast Messages"];

// ── Mode metadata (icon/copy for the header + the alternate-login rows) ──────
const MODE_META: Record<LoginMode, { label: string; description: string; icon: typeof School }> = {
  staff: {
    label: "Staff Login",
    description: "Teachers and staff can login using their phone number.",
    icon: Phone,
  },
  student: {
    label: "Student Login",
    description: "Students can login using their registration number.",
    icon: GraduationCap,
  },
  superadmin: {
    label: "Super Admin Login",
    description: "System administrators can login using their email and password.",
    icon: ShieldCheck,
  },
};

// ── Dashboard-mockup card for the left branding panel ─────────────────────────
const MockupCard = ({ school, showLogoImage, onLogoError }: {
  school: SchoolItem | null;
  showLogoImage: boolean;
  onLogoError: () => void;
}) => (
  <div className="w-full max-w-sm mx-auto rounded-[28px] bg-[#1E2A2E] p-6 shadow-2xl">
    <div className="flex flex-col items-center text-center py-4">
      <div className="w-24 h-24 rounded-full bg-[#2C3B3F] border border-white/10 flex items-center justify-center mb-4 overflow-hidden p-3">
        {school && showLogoImage ? (
          <img
            src={(school.logo || school.image) as string}
            alt={school.school_name}
            className="w-full h-full object-contain"
            onError={onLogoError}
          />
        ) : (
          <GraduationCap size={32} className="text-white" />
        )}
      </div>
      <p className="text-white font-extrabold text-lg leading-tight tracking-tight uppercase">
        {school ? school.school_name : "School Management"}
      </p>
      <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">
        {school ? `Code: ${school.school_code}` : "Complete Management Suite"}
      </p>
    </div>
    <div className="space-y-2 mt-3">
      {["Attendance", "Fee Collection", "Communication"].map((label) => (
        <div key={label} className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="text-white/50 text-[11px] flex-1 text-left">{label}</span>
          <span className="w-16 h-1.5 rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  </div>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const login    = useAuthStore((s) => s.login);

  const [loading,        setLoading]        = useState(false);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const [schools,        setSchools]        = useState<SchoolItem[]>([]);
  const [loginMode,      setLoginMode]      = useState<LoginMode>("staff");
  // Tracks whether the currently-selected school's logo failed to load,
  // so we can fall back to the generic School icon instead of a broken <img>.
  const [logoFailed,     setLogoFailed]     = useState(false);
  const submittingRef = useRef(false);

  // ── Fetch schools ────────────────────────────────────────────────────────────
  useEffect(() => { fetchSchools(); }, []);

  const fetchSchools = async () => {
    try {
      setSchoolsLoading(true);
      const response = await axiosInstance.get("/organization/getallschooldetails");
      if (response?.data?.schools) setSchools(response.data.schools);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load schools");
    } finally {
      setSchoolsLoading(false);
    }
  };

  // ── Staff form ───────────────────────────────────────────────────────────────
  const {
    register: registerStaff,
    handleSubmit: handleStaffSubmit,
    formState: { errors: staffErrors },
    setValue: setStaffValue,
    watch: watchStaff,
  } = useForm<StaffLoginValues>({
    resolver: zodResolver(staffLoginSchema),
    defaultValues: { schoolcode: "", phone: "" },
  });

  // ── Student form ─────────────────────────────────────────────────────────────
  const {
    register: registerStudent,
    handleSubmit: handleStudentSubmit,
    formState: { errors: studentErrors },
    setValue: setStudentValue,
    watch: watchStudent,
  } = useForm<StudentLoginValues>({
    resolver: zodResolver(studentLoginSchema),
    defaultValues: { schoolcode: "", admissionNumber: "" },
  });

  // ── Super Admin form ──────────────────────────────────────────────────────────
  const {
    register: registerSuperAdmin,
    handleSubmit: handleSuperAdminSubmit,
    formState: { errors: superAdminErrors },
  } = useForm<SuperAdminLoginValues>({
    resolver: zodResolver(superAdminLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  // ── Sync school dropdown across both forms ───────────────────────────────────
  const handleSchoolChange = (schoolCode: string) => {
    setStaffValue("schoolcode", schoolCode);
    setStudentValue("schoolcode", schoolCode);
    // New school selected → reset the broken-image flag so its logo gets a fresh try.
    setLogoFailed(false);
  };

  // ── Selected school (for the left-panel branding) ─────────────────────────────
  const selectedSchoolCode =
    loginMode === "staff" ? watchStaff("schoolcode") : watchStudent("schoolcode");
  const selectedSchool = schools.find((s) => s.school_code === selectedSchoolCode) ?? null;
  const selectedSchoolImage = selectedSchool?.logo || selectedSchool?.image || null;

  // ── Staff login ──────────────────────────────────────────────────────────────
  const onStaffSubmit = async (values: StaffLoginValues) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setLoading(true);
    try {
      // Clear any stale OTP-session meta from a previous login attempt so
      // OtpPage can never read leftover values from a different phone/school.
      localStorage.removeItem("otp");
      localStorage.removeItem("phone");
      localStorage.removeItem("schoolcode");

      const response = await sendOtp({
        schoolcode: values.schoolcode,
        phone:      values.phone,
      });

      if (response?.status === true) {
        const school = schools.find((s) => s.school_code === values.schoolcode);

        // Save meta for OtpPage
        localStorage.setItem("phone",      values.phone);
        localStorage.setItem("schoolcode", values.schoolcode);
        localStorage.setItem("userType",   response.userType);
        localStorage.setItem("schoolName", school?.school_name ?? "");
        localStorage.setItem("schoolLogo", school?.logo || school?.image || "");

        if (import.meta.env.DEV && response.otp) {
          localStorage.setItem("otp", response.otp);
        }

        toast.success(response.message ?? "OTP sent successfully!");
        navigate("/otp");
      } else {
        toast.error(response.message ?? "Failed to send OTP");
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  // ── Student login ─────────────────────────────────────────────────────────────
  // Students log in with admission number (no OTP step).
  // The login() shim in authStore stores a minimal session;
  // the full profile will be loaded by the student dashboard on mount.
  const onStudentSubmit = async (values: StudentLoginValues) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/tenant/studentlogin", {
        school_code:      values.schoolcode,
        admission_number: values.admissionNumber,
      });

      if (response.data?.status === true) {
        const {
          id,
          first_name,
          last_name,
          school_code,
          class_id,
          section_id,
        } = response.data.data;

        login(
          response.data.token,
          {
            id,
            name:       `${first_name} ${last_name}`.trim(),
            schoolcode: school_code,
            phone:      "",
            class_id,
            section_id,
          },
          "Student"
        );

        toast.success(response.data.message ?? "Student login successful");
        navigate("/student/dashboard", { replace: true });
      } else {
        toast.error(response.data.message ?? "Student login failed");
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Student login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Super Admin login ──────────────────────────────────────────────────────────
  // Platform-level login — email/password, no school selection, no OTP step.
  const onSuperAdminSubmit = async (values: SuperAdminLoginValues) => {
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

  // ── Render ───────────────────────────────────────────────────────────────────
  const ModeIcon = MODE_META[loginMode].icon;
  const otherModes = (Object.keys(MODE_META) as LoginMode[]).filter((m) => m !== loginMode);
  const showLogoImage = !!selectedSchoolImage && !logoFailed;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F5F6FF]">

      {/* ── Left panel (school branding) ── */}
      <div
        className={`hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col justify-between relative overflow-hidden px-10 xl:px-16 py-12 ${
          showLogoImage ? "bg-cover bg-center" : "bg-gradient-to-br from-[#4B3AE0] via-[#5B3FE0] to-[#3D2FC4]"
        }`}
        style={showLogoImage ? { backgroundImage: `url(${selectedSchoolImage})` } : undefined}
      >
        {showLogoImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#3D2FC4]/90 via-[#4B3AE0]/85 to-[#3D2FC4]/90" />
        )}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-1/4 -left-16 w-64 h-64 rounded-full bg-violet-400/10 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg shrink-0">
              <GraduationCap size={24} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">VidyaTracker</p>
              <p className="text-indigo-200 text-xs">School Management System</p>
            </div>
          </div>

        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-start pt-2 gap-6">
          <MockupCard
            school={selectedSchool}
            showLogoImage={showLogoImage}
            onLogoError={() => setLogoFailed(true)}
          />

          <h1 className="text-xl xl:text-2xl font-bold text-white leading-snug text-center max-w-md">
            "Complete school management,
            <br />
            automated on WhatsApp."
          </h1>

          <div className="flex flex-wrap justify-center gap-2 max-w-sm">
            {FEATURE_PILLS.map((f) => (
              <span
                key={f}
                className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white text-[11px] font-medium"
              >
                {f}
              </span>
            ))}
          </div>

          <p className="text-indigo-200/70 text-[10px] font-semibold uppercase tracking-widest text-center">
            Trusted by 47+ schools across Telangana
          </p>
        </div>

        <button
          type="button"
          className="absolute bottom-6 right-6 z-20 flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500 text-white text-sm font-bold shadow-lg hover:bg-emerald-600 transition-colors"
        >
          <MessageSquareText size={16} />
          Get Help
        </button>
      </div>

      {/* ── Right panel (login form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 xs:px-6 py-8 sm:py-12 sm:px-10">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-indigo-100 border border-slate-100 p-6 sm:p-9">

          {/* Compact brand mark — desktop already has it on the left panel */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <GraduationCap size={16} className="text-white" />
            </div>
            <span className="text-base font-bold text-slate-900">VidyaTracker</span>
          </div>

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-7">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
              <ModeIcon size={28} className="text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back!</h1>
            <p className="text-sm text-slate-500 mt-1">Login to continue to your account</p>
            <div className="w-10 h-1 rounded-full bg-indigo-600 mt-3" />
          </div>

          {/* School dropdown — not applicable to the platform-level Super Admin login */}
          {loginMode !== "superadmin" && (
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                School
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10">
                  <School size={16} />
                </span>
                <select
                  value={
                    loginMode === "staff"
                      ? watchStaff("schoolcode")
                      : watchStudent("schoolcode")
                  }
                  onChange={(e) => handleSchoolChange(e.target.value)}
                  className="w-full h-12 pl-10 pr-10 rounded-xl border border-slate-200 bg-white text-sm outline-none appearance-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                >
                  <option value="">
                    {schoolsLoading ? "Loading schools..." : "Select your school"}
                  </option>
                  {schools.map((school) => (
                    <option key={school.school_code} value={school.school_code}>
                      {school.school_name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
              {loginMode === "staff"   && staffErrors.schoolcode   && (
                <p className="text-xs text-red-500 mt-1">{staffErrors.schoolcode.message}</p>
              )}
              {loginMode === "student" && studentErrors.schoolcode && (
                <p className="text-xs text-red-500 mt-1">{studentErrors.schoolcode.message}</p>
              )}
            </div>
          )}

          {/* Staff login form */}
          {loginMode === "staff" && (
            <form
              onSubmit={handleStaffSubmit(onStaffSubmit)}
              className="space-y-5"
              noValidate
            >
              <input type="hidden" {...registerStaff("schoolcode")} />
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Phone size={16} />
                  </span>
                  <span className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-500 text-sm border-r border-slate-200 pr-2">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Enter your phone number"
                    className={`w-full h-12 pl-[4.5rem] pr-4 rounded-xl border text-sm outline-none transition-all ${
                      staffErrors.phone
                        ? "border-red-400 bg-red-50"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    }`}
                    {...registerStaff("phone")}
                  />
                </div>
                {staffErrors.phone && (
                  <p className="text-xs text-red-500">{staffErrors.phone.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send OTP
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Student login form */}
          {loginMode === "student" && (
            <form
              onSubmit={handleStudentSubmit(onStudentSubmit)}
              className="space-y-5"
              noValidate
            >
              <input type="hidden" {...registerStudent("schoolcode")} />
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Admission Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <UserSquare2 size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter admission number"
                    className={`w-full h-12 pl-10 pr-4 rounded-xl border text-sm outline-none transition-all ${
                      studentErrors.admissionNumber
                        ? "border-red-400 bg-red-50"
                        : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    }`}
                    {...registerStudent("admissionNumber")}
                  />
                </div>
                {studentErrors.admissionNumber && (
                  <p className="text-xs text-red-500">
                    {studentErrors.admissionNumber.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Student Login
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Super Admin login form — email/password, no school, no OTP */}
          {loginMode === "superadmin" && (
            <form
              onSubmit={handleSuperAdminSubmit(onSuperAdminSubmit)}
              className="space-y-5"
              noValidate
            >
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    placeholder="admin@vidyatrack.com"
                    autoComplete="username"
                    className={`w-full h-12 pl-10 pr-4 rounded-xl border text-sm outline-none transition-all ${
                      superAdminErrors.email
                        ? "border-red-400 bg-red-50"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    }`}
                    {...registerSuperAdmin("email")}
                  />
                </div>
                {superAdminErrors.email && (
                  <p className="text-xs text-red-500">{superAdminErrors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={`w-full h-12 pl-10 pr-4 rounded-xl border text-sm outline-none transition-all ${
                      superAdminErrors.password
                        ? "border-red-400 bg-red-50"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    }`}
                    {...registerSuperAdmin("password")}
                  />
                </div>
                {superAdminErrors.password && (
                  <p className="text-xs text-red-500">{superAdminErrors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    Sign In
                  </>
                )}
              </button>
            </form>
          )}

          {/* "or" divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-[11px] text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          {/* Alternate login rows — switch to whichever mode isn't currently active */}
          <div className="space-y-2.5">
            {otherModes.map((mode) => {
              const meta = MODE_META[mode];
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setLoginMode(mode)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-indigo-100 bg-indigo-50/40 hover:bg-indigo-50 transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                    <meta.icon size={18} className="text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-indigo-700">{meta.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{meta.description}</p>
                  </div>
                  <ChevronRight size={16} className="text-indigo-300 group-hover:text-indigo-500 transition-colors shrink-0" />
                </button>
              );
            })}
          </div>

          <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mt-7">
            <Headphones size={13} />
            Need help?{" "}
            <a href="#" className="text-indigo-600 font-medium hover:underline">
              Contact your school administrator
            </a>
          </p>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-6">
          <ShieldCheck size={13} className="text-emerald-500" />
          Your data is 100% secure and encrypted
        </p>
      </div>

    </div>
  );
};

export default LoginPage;