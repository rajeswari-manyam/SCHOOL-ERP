// src/features/auth/pages/LoginPage.tsx
import { useEffect, useState } from "react";
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
  Shield,
  GraduationCap,
  UserSquare2,
  ChevronDown,
  MessageCircle,
} from "lucide-react";

import { sendOtp } from "@/services/auth.api";
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

type StaffLoginValues   = z.infer<typeof staffLoginSchema>;
type StudentLoginValues = z.infer<typeof studentLoginSchema>;
type LoginMode          = "staff" | "student";
type SchoolItem = {
  school_name: string;
  school_code: string;
  logo?: string | null;
  image?: string | null;
};

// ── Feature pills (branding panel) ────────────────────────────────────────────
const FEATURE_PILLS = ["Attendance Alerts", "Fee Reminders", "Broadcast Messages"];

const LoginPage = () => {
  const navigate = useNavigate();
  const login    = useAuthStore((s) => s.login);

  const [loading,        setLoading]        = useState(false);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const [schools,        setSchools]        = useState<SchoolItem[]>([]);
  const [loginMode,      setLoginMode]      = useState<LoginMode>("staff");

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

  // ── Sync school dropdown across both forms ───────────────────────────────────
  const handleSchoolChange = (schoolCode: string) => {
    setStaffValue("schoolcode", schoolCode);
    setStudentValue("schoolcode", schoolCode);
  };

  // ── Selected school (for the right-panel logo) ────────────────────────────────
  const selectedSchoolCode =
    loginMode === "staff" ? watchStaff("schoolcode") : watchStudent("schoolcode");
  const selectedSchool = schools.find((s) => s.school_code === selectedSchoolCode) ?? null;
  const selectedSchoolLogo = selectedSchool?.logo || selectedSchool?.image || null;

  // ── Staff login ──────────────────────────────────────────────────────────────
  const onStaffSubmit = async (values: StaffLoginValues) => {
    setLoading(true);
    try {
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

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex bg-white">

      {/* ── Left panel (school branding) ── */}
<div className="hidden lg:flex w-[600px] xl:w-[720px] 2xl:w-[820px] flex-col bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl" />
        </div>

        <div className="relative flex flex-col items-center justify-center px-10 h-full text-center">
          {/* Mockup frame */}
          <div className="relative w-full max-w-sm h-64 rounded-[2rem] bg-violet-600/90 border border-white/20 shadow-2xl overflow-hidden flex flex-col items-center justify-center mb-8">
            {selectedSchoolLogo ? (
              <>
                <img
                  src={selectedSchoolLogo}
                  alt={selectedSchool?.school_name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="relative mt-auto mb-5 text-center">
                  <p className="text-white font-bold text-sm tracking-wide uppercase">
                    {selectedSchool?.school_name}
                  </p>
                  <p className="text-indigo-200 text-xs mt-1">Code: {selectedSchool?.school_code}</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                  <GraduationCap size={32} className="text-white" />
                </div>
                <p className="mt-4 text-white font-bold text-sm tracking-wide uppercase">
                  {selectedSchool ? selectedSchool.school_name : "School Management"}
                </p>
                {selectedSchool && (
                  <p className="text-indigo-200 text-xs mt-1">Code: {selectedSchool.school_code}</p>
                )}
              </>
            )}
          </div>

          {/* Quote */}
          <h2 className="text-2xl xl:text-[28px] font-bold text-white leading-snug max-w-sm">
            "Complete school management,<br />automated on WhatsApp."
          </h2>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-7 max-w-sm">
            {FEATURE_PILLS.map((label) => (
              <span
                key={label}
                className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium"
              >
                {label}
              </span>
            ))}
          </div>

          {/* Trust caption */}
          <p className="mt-7 text-indigo-200/80 text-[11px] font-semibold uppercase tracking-widest">
            Trusted by 200+ schools across India
          </p>

          <div className="mt-8 flex items-center gap-2 text-indigo-300/70 text-xs">
            <Shield size={12} />
            <span>256-bit encrypted · ISO 27001 certified</span>
          </div>
        </div>

        {/* Floating help button */}
        <a
          href="#"
          className="absolute bottom-6 right-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-lg transition-colors"
        >
          <MessageCircle size={15} />
          Get Help
        </a>
      </div>

      {/* ── Right panel (login form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 xs:px-6 py-8 sm:py-12 sm:px-10 bg-[#F8F9FF]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-indigo-100 border border-slate-100 p-6 sm:p-8">

          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 overflow-hidden rounded-lg bg-white/5 flex items-center justify-center shadow-md shadow-indigo-200">
                <img
                  src="/favicon.png"
                  alt="VidyaTracker logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                Vidya<span className="text-indigo-600">Tracker</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest ml-10">
              Manyam Technologies
            </p>
          </div>

          {/* Header + toggle */}
          <div className="flex items-start justify-between gap-3 mb-6 sm:mb-8">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Welcome back</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Login to continue</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider hidden xs:inline">
                {loginMode === "staff" ? "Staff" : "Student"}
              </span>
              <button
                type="button"
                onClick={() =>
                  setLoginMode(loginMode === "staff" ? "student" : "staff")
                }
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                  loginMode === "staff" ? "bg-indigo-600" : "bg-emerald-600"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${
                    loginMode === "staff"
                      ? "left-0.5"
                      : "left-[calc(100%-22px)]"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* School dropdown */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              School Name
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
                  {schoolsLoading ? "Loading schools..." : "Select School"}
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
                    placeholder="9876543210"
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

          <p className="text-center text-xs text-slate-400 mt-8">
            Need access?{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              Contact your school administrator
            </a>
          </p>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
