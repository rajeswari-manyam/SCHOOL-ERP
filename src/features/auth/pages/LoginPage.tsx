
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
  BookOpen,
  GraduationCap,
  Users,
  UserSquare2,
  ChevronDown,
} from "lucide-react";

import { sendOtp } from "../api/auth.api";
import { useAuthStore } from "@/store/authStore";
import { axiosInstance } from "@/config/axios";

// ─────────────────────────────────────────────────────────────
// SCHEMAS
// ─────────────────────────────────────────────────────────────

const staffLoginSchema = z.object({
  schoolcode: z.string().min(1, "Please select school"),

  phone: z
    .string()
    .min(10, "Enter valid mobile number")
    .max(10, "Enter valid mobile number")
    .regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
});

const studentLoginSchema = z.object({
  schoolcode: z.string().min(1, "Please select school"),

  admissionNumber: z
    .string()
    .min(3, "Admission number is required")
    .max(30, "Too long"),
});

type StaffLoginValues = z.infer<
  typeof staffLoginSchema
>;

type StudentLoginValues = z.infer<
  typeof studentLoginSchema
>;

type LoginMode = "staff" | "student";

type SchoolItem = {
  school_name: string;
  school_code: string;
};

// ─────────────────────────────────────────────────────────────
// ROLES
// ─────────────────────────────────────────────────────────────

const ROLES = [
  {
    label: "Teachers",
    icon: BookOpen,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    label: "Students",
    icon: GraduationCap,
    color: "text-violet-500",
    bg: "bg-violet-50",
  },
  {
    label: "Parents",
    icon: Users,
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    label: "Accountants",
    icon: Shield,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
];

const LoginPage = () => {
  const navigate = useNavigate();

  const setLoginMeta = useAuthStore(
    (s) => s.setLoginMeta
  );

  const [loading, setLoading] =
    useState(false);

  const [schoolsLoading, setSchoolsLoading] =
    useState(false);

  const [schools, setSchools] = useState<
    SchoolItem[]
  >([]);

  const [loginMode, setLoginMode] =
    useState<LoginMode>("staff");

  // ───────────────────────────────────────────────────────────
  // FETCH SCHOOLS
  // ───────────────────────────────────────────────────────────

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setSchoolsLoading(true);

      const response = await axiosInstance.get(
        "/organization/getallschools"
      );

      if (response?.data?.schools) {
        setSchools(response.data.schools);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load schools"
      );
    } finally {
      setSchoolsLoading(false);
    }
  };

  // ───────────────────────────────────────────────────────────
  // STAFF FORM
  // ───────────────────────────────────────────────────────────

  const {
    register: registerStaff,
    handleSubmit: handleStaffSubmit,
    formState: { errors: staffErrors },
    setValue: setStaffValue,
    watch: watchStaff,
  } = useForm<StaffLoginValues>({
    resolver: zodResolver(staffLoginSchema),

    defaultValues: {
      schoolcode: "",
      phone: "",
    },
  });

  // ───────────────────────────────────────────────────────────
  // STUDENT FORM
  // ───────────────────────────────────────────────────────────

  const {
    register: registerStudent,
    handleSubmit: handleStudentSubmit,
    formState: { errors: studentErrors },
    setValue: setStudentValue,
    watch: watchStudent,
  } = useForm<StudentLoginValues>({
    resolver: zodResolver(studentLoginSchema),

    defaultValues: {
      schoolcode: "",
      admissionNumber: "",
    },
  });

  // ───────────────────────────────────────────────────────────
  // SELECT SCHOOL
  // ───────────────────────────────────────────────────────────

  const handleSchoolChange = (
    schoolCode: string
  ) => {
    setStaffValue(
      "schoolcode",
      schoolCode
    );

    setStudentValue(
      "schoolcode",
      schoolCode
    );
  };

  // ───────────────────────────────────────────────────────────
  // STAFF LOGIN
  // ───────────────────────────────────────────────────────────

  const onStaffSubmit = async (
    values: StaffLoginValues
  ) => {
    setLoading(true);

    try {
      const payload = {
        schoolcode: values.schoolcode,
        phone: values.phone,
      };

      const response = await sendOtp(payload);

      if (response?.status === true) {
        setLoginMeta(
          response.userType,
          values.phone,
          values.schoolcode
        );

        localStorage.setItem(
          "phone",
          values.phone
        );

        localStorage.setItem(
          "schoolcode",
          values.schoolcode
        );

        localStorage.setItem(
          "userType",
          response.userType
        );

        if (
          import.meta.env.DEV &&
          response.otp
        ) {
          localStorage.setItem(
            "otp",
            response.otp
          );
        }

        toast.success(
          response.message ??
            "OTP sent successfully!"
        );

        navigate("/otp");
      } else {
        toast.error(
          response.message ??
            "Failed to send OTP"
        );
      }
    } catch (err: unknown) {
      const msg =
        (
          err as {
            response?: {
              data?: {
                message?: string;
              };
            };
          }
        )?.response?.data?.message ??
        "Something went wrong";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ───────────────────────────────────────────────────────────
  // STUDENT LOGIN
  // ───────────────────────────────────────────────────────────

  const onStudentSubmit = async (
    values: StudentLoginValues
  ) => {
    setLoading(true);

    try {
      const payload = {
        school_code: values.schoolcode,
        admission_number:
          values.admissionNumber,
      };

      const response = await axiosInstance.post(
        "/tenant/studentlogin",
        payload
      );

      if (response.data?.status === true) {
        localStorage.setItem(
          "student_token",
          response.data.token
        );

        localStorage.setItem(
          "student_data",
          JSON.stringify(
            response.data.student
          )
        );

        localStorage.setItem(
          "student_role",
          "student"
        );

        toast.success(
          response.data.message ??
            "Student login successful"
        );

        navigate("/student/dashboard", {
          replace: true,
        });
      } else {
        toast.error(
          response.data.message ??
            "Student login failed"
        );
      }
    } catch (err: unknown) {
      const msg =
        (
          err as {
            response?: {
              data?: {
                message?: string;
              };
            };
          }
        )?.response?.data?.message ??
        "Student login failed";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* LEFT PANEL */}

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          {/* LOGO */}

          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
                <GraduationCap
                  size={18}
                  className="text-white"
                />
              </div>

              <span className="text-lg font-bold text-slate-900 tracking-tight">
                School
                <span className="text-indigo-600">
                  ERP
                </span>
              </span>
            </div>

            <p className="text-[10px] text-slate-400 uppercase tracking-widest ml-10">
              Manyam Technologies
            </p>
          </div>

          {/* HEADER */}

          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">
                  Welcome back
                </h1>

                <p className="text-sm text-slate-500 whitespace-nowrap">
                  Login to continue
                </p>
              </div>
            </div>

            {/* SMALL TOGGLE */}

            <div
              className={`relative flex items-center w-[44px] h-5 p-[2px] rounded-full transition-all duration-300 ${
                loginMode === "staff"
                  ? "bg-indigo-600"
                  : "bg-emerald-600"
              }`}
            >
              <div
                className={`absolute top-[2px] w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
                  loginMode === "staff"
                    ? "left-[2px]"
                    : "left-[26px]"
                }`}
              />

              <button
                type="button"
                onClick={() =>
                  setLoginMode("staff")
                }
                className="relative z-10 flex-1 h-full"
              />

              <button
                type="button"
                onClick={() =>
                  setLoginMode("student")
                }
                className="relative z-10 flex-1 h-full"
              />
            </div>
          </div>

          {/* SCHOOL DROPDOWN */}

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
                    ? watchStaff(
                        "schoolcode"
                      )
                    : watchStudent(
                        "schoolcode"
                      )
                }
                onChange={(e) =>
                  handleSchoolChange(
                    e.target.value
                  )
                }
                className="w-full h-12 pl-10 pr-10 rounded-xl border border-slate-200 bg-white text-sm outline-none appearance-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              >
                <option value="">
                  {schoolsLoading
                    ? "Loading schools..."
                    : "Select School"}
                </option>

                {schools.map((school) => (
                  <option
                    key={school.school_code}
                    value={
                      school.school_code
                    }
                  >
                    {school.school_name}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            {loginMode === "staff" &&
              staffErrors.schoolcode && (
                <p className="text-xs text-red-500 mt-1">
                  {
                    staffErrors.schoolcode
                      .message
                  }
                </p>
              )}

            {loginMode === "student" &&
              studentErrors.schoolcode && (
                <p className="text-xs text-red-500 mt-1">
                  {
                    studentErrors.schoolcode
                      .message
                  }
                </p>
              )}
          </div>

          {/* STAFF LOGIN */}

          {loginMode === "staff" && (
            <form
              onSubmit={handleStaffSubmit(
                onStaffSubmit
              )}
              className="space-y-5"
              noValidate
            >
              <input
                type="hidden"
                {...registerStaff(
                  "schoolcode"
                )}
              />

              {/* PHONE */}

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
                  <p className="text-xs text-red-500">
                    {staffErrors.phone.message}
                  </p>
                )}
              </div>

              {/* BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
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

          {/* STUDENT LOGIN */}

          {loginMode === "student" && (
            <form
              onSubmit={handleStudentSubmit(
                onStudentSubmit
              )}
              className="space-y-5"
              noValidate
            >
              <input
                type="hidden"
                {...registerStudent(
                  "schoolcode"
                )}
              />

              {/* ADMISSION NUMBER */}

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
                    {...registerStudent(
                      "admissionNumber"
                    )}
                  />
                </div>

                {studentErrors.admissionNumber && (
                  <p className="text-xs text-red-500">
                    {
                      studentErrors
                        .admissionNumber
                        .message
                    }
                  </p>
                )}
              </div>

              {/* BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
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

          {/* FOOTER */}

          <p className="text-center text-xs text-slate-400 mt-8">
            Need access?{" "}
            <a
              href="#"
              className="text-indigo-600 hover:underline"
            >
              Contact your school administrator
            </a>
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}

      <div className="hidden lg:flex w-[480px] xl:w-[520px] flex-col bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

          <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl" />
        </div>

        <div className="relative flex flex-col justify-center px-12 h-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium w-fit mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Trusted by 200+ schools
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            One platform.
            <br />
            Every role.
            <br />
            <span className="text-indigo-200">
              Fully connected.
            </span>
          </h2>

          <p className="text-indigo-200 text-sm leading-relaxed mb-10 max-w-xs">
            From classrooms to boardrooms —
            SchoolERP connects teachers,
            students, parents and admins
            into one secure ecosystem.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {ROLES.map(
              ({
                label,
                icon: Icon,
                color,
                bg,
              }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-white/10 border border-white/15"
                >
                  <div
                    className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}
                  >
                    <Icon
                      size={15}
                      className={color}
                    />
                  </div>

                  <span className="text-white text-sm font-medium">
                    {label}
                  </span>
                </div>
              )
            )}
          </div>

          <div className="mt-12 flex items-center gap-2 text-indigo-300/70 text-xs">
            <Shield size={12} />

            <span>
              256-bit encrypted · ISO 27001
              certified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;