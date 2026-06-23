import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronDown, Plus } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { nanoid } from "nanoid";
import { createStaff } from "@/services/school-staff.api";
import { fetchDepartments } from "@/services/department.api";
import { useStaffStore } from "../store/usestore";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import type { CreateStaffPayload } from "../types/staff.types";
import type { Department } from "@/features/school-admin/settings/types/settings.types";

interface Props {
  onClose: () => void;
}

/* ── Styles ── */
const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-1.5";
const inputCls =
  "w-full h-11 px-3.5 rounded-xl bg-white border border-slate-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition";
const selectCls =
  "w-full h-11 pl-3.5 pr-9 rounded-xl bg-white border border-slate-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 appearance-none transition";

/* ── Field wrapper ── */
const Field = ({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className={labelCls}>
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {hint && !error && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
    {error && <p className="text-[10px] text-red-500 font-medium mt-1">{error}</p>}
  </div>
);

/* ── Phone input ── */
const PhoneInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex h-11 rounded-xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-300 focus-within:border-indigo-400 transition bg-white">
    <span className="flex items-center px-3.5 bg-slate-50 border-r border-slate-200 text-sm font-semibold text-gray-600 shrink-0">
      +91
    </span>
    <input
      type="tel"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="98765 43210"
      className="flex-1 h-full px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
    />
  </div>
);

/* ── Toggle ── */
const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      checked ? "bg-indigo-600" : "bg-gray-200"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

const ROLE_OPTIONS = [
  "Class Teacher",
  "Subject Teacher",
  "Principal",
  "Vice Principal",
  "Admin",
  "Librarian",
  "Lab Assistant",
  "Accountant",
  "Support Staff",
];

const SECTION_OPTIONS = ["A", "B", "C", "D", "E"];
const SUBJECT_OPTIONS = [
  "English", "Hindi", "Mathematics", "Science", "Social Science",
  "Physics", "Chemistry", "Biology", "History", "Geography",
  "Computer Science", "Physical Education", "Arts", "Music",
];
const CLASS_OPTIONS = [
  { label: "Class 1", value: "1" }, { label: "Class 2", value: "2" },
  { label: "Class 3", value: "3" }, { label: "Class 4", value: "4" },
  { label: "Class 5", value: "5" }, { label: "Class 6", value: "6" },
  { label: "Class 7", value: "7" }, { label: "Class 8", value: "8" },
  { label: "Class 9", value: "9" }, { label: "Class 10", value: "10" },
  { label: "Class 11", value: "11" }, { label: "Class 12", value: "12" },
];

interface SubjectRow {
  id: string;
  classId: string;
  section: string;
  subject: string;
}

const genEmpId = () => `EMP-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`;
const getToday = () => new Date().toISOString().slice(0, 10);

const INITIAL_FORM = {
  fullName: "",
  role: "",
  empNumber: "",
  phone: "",
  email: "",
  qualification: "",
  dob: "",
  salary: "",
  joiningDate: getToday(),
  departmentId: "",
  classTeacherOf: "",
};

export const AddStaffModal = ({ onClose }: Props) => {
  const schoolcode  = useAuthStore((s) => s.user?.schoolcode ?? "");
  const loadStaff   = useStaffStore((s) => s.loadStaff);
  const academicYearId = useUIStore.getState().academicYearId ?? "";

  const [form, setForm]         = useState(INITIAL_FORM);
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [loading, setLoading]   = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [autoGenEmp, setAutoGenEmp]   = useState(true);
  const [generatedEmpId]        = useState(genEmpId);
  const [subjectRows, setSubjectRows] = useState<SubjectRow[]>([
    { id: nanoid(), classId: "", section: "", subject: "" },
  ]);

  useEffect(() => {
    fetchDepartments().then(setDepartments).catch(() => {});
  }, []);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const clearErr = (field: string) => setErrors((prev) => ({ ...prev, [field]: "" }));

  const validate = () => {
    const errs: Record<string, string> = {};
    const cleanPhone = form.phone.trim().replace(/[^0-9]/g, "");
    if (!form.fullName.trim())           errs.fullName    = "This field is required";
    if (!form.role)                       errs.role        = "This field is required";
    if (!/^[0-9]{10}$/.test(cleanPhone)) errs.phone       = "Enter a valid 10-digit phone number";
    if (!form.joiningDate)               errs.joiningDate = "This field is required";
    return errs;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!schoolcode) { toast.error("Unable to determine school code."); return; }

    const payload: CreateStaffPayload = {
      name:           form.fullName.trim(),
      email:          form.email.trim(),
      phone:          form.phone.trim().replace(/[^0-9]/g, ""),
      emp_number:     autoGenEmp ? generatedEmpId : form.empNumber.trim() || genEmpId(),
      qualification:  form.qualification.trim(),
      salary:         form.salary ? Number(form.salary) : undefined,
      date_of_birth:  form.dob || getToday(),
      date_of_join:   form.joiningDate,
      school_code:    schoolcode,
      role:           form.role,
      ...(form.departmentId  && { department_id: form.departmentId }),
      ...(academicYearId     && { academicYearId }),
    };

    try {
      setLoading(true);
      await createStaff(payload);
      await loadStaff();
      toast.success("Staff member created successfully.");
      onClose();
    } catch (error: unknown) {
      let message = "Failed to create staff member. Please try again.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      const lowered = (message || "").toLowerCase();
      if (lowered.includes("email"))  setErrors((p) => ({ ...p, email: message }));
      else if (lowered.includes("phone")) setErrors((p) => ({ ...p, phone: message }));
      else toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const addSubjectRow = () =>
    setSubjectRows((prev) => [...prev, { id: nanoid(), classId: "", section: "", subject: "" }]);
  const removeSubjectRow = (id: string) =>
    setSubjectRows((prev) => prev.filter((r) => r.id !== id));
  const updateSubjectRow = (id: string, field: keyof Omit<SubjectRow, "id">, value: string) =>
    setSubjectRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden">

        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-3 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 shrink-0">
          <h2 className="text-lg font-bold text-gray-900">Add Staff Member</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
          <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 flex-1">

            {/* FULL NAME */}
            <Field label="Full Name" required error={errors.fullName}>
              <input
                className={inputCls}
                placeholder="Priya Reddy"
                value={form.fullName}
                onChange={set("fullName")}
              />
            </Field>

            {/* ROLE */}
            <Field label="Role" required error={errors.role}>
              <div className="relative">
                <select value={form.role} onChange={set("role")} className={selectCls}>
                  <option value="">Select role…</option>
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </Field>

            {/* PHONE NUMBER */}
            <div>
              <label className={labelCls}>
                Phone Number <span className="text-red-500">*</span>
              </label>
              <PhoneInput
                value={form.phone}
                onChange={(v) => {
                  setForm((p) => ({ ...p, phone: v }));
                  clearErr("phone");
                }}
              />
              <p className="text-[10px] text-gray-400 mt-1">Used for OTP login and WhatsApp</p>
              {errors.phone && (
                <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.phone}</p>
              )}
            </div>

            {/* EMPLOYEE ID with auto-generate toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`${labelCls} mb-0`}>Employee ID</label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Auto-Generate
                  </span>
                  <Toggle checked={autoGenEmp} onChange={setAutoGenEmp} />
                </div>
              </div>
              <input
                className={
                  inputCls +
                  (autoGenEmp ? " bg-slate-50 text-gray-500 cursor-not-allowed select-none" : "")
                }
                value={autoGenEmp ? generatedEmpId : form.empNumber}
                onChange={(e) => !autoGenEmp && setForm((p) => ({ ...p, empNumber: e.target.value }))}
                readOnly={autoGenEmp}
                placeholder="EMP-024"
              />
            </div>

            {/* EMAIL */}
            <Field label="Email" error={errors.email}>
              <input
                className={inputCls}
                type="email"
                placeholder="priya@hps.edu.in"
                value={form.email}
                onChange={set("email")}
              />
            </Field>

            {/* QUALIFICATION */}
            <Field label="Qualification">
              <input
                className={inputCls}
                placeholder="B.Ed, M.Sc"
                value={form.qualification}
                onChange={set("qualification")}
              />
            </Field>

            {/* DATE OF BIRTH */}
            <Field label="Date of Birth">
              <input className={inputCls} type="date" value={form.dob} onChange={set("dob")} />
            </Field>

            {/* MONTHLY SALARY */}
            <Field label="Monthly Salary (₹)">
              <div className="flex h-11 rounded-xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-300 focus-within:border-indigo-400 transition bg-white">
                <span className="flex items-center px-3.5 bg-slate-50 border-r border-slate-200 text-sm font-semibold text-gray-600 shrink-0">
                  ₹
                </span>
                <input
                  type="number"
                  value={form.salary}
                  onChange={set("salary")}
                  placeholder="25,000"
                  min="0"
                  className="flex-1 h-full px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
                />
              </div>
            </Field>

            {/* DATE OF JOINING */}
            <Field label="Date of Joining" required error={errors.joiningDate}>
              <input
                className={inputCls}
                type="date"
                value={form.joiningDate}
                onChange={set("joiningDate")}
              />
            </Field>

            {/* DEPARTMENT (shown only when data available) */}
            {departments.length > 0 && (
              <Field label="Department">
                <div className="relative">
                  <select
                    value={form.departmentId}
                    onChange={set("departmentId")}
                    className={selectCls}
                  >
                    <option value="">Select department…</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.departmentName}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </Field>
            )}

            {/* ── TEACHING ASSIGNMENTS ── */}
            <div className="col-span-full pt-2 space-y-3">
              <p className={labelCls}>Teaching Assignments</p>

              {/* Class Teacher of */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-36 shrink-0">Class Teacher of:</span>
                <div className="relative max-w-[200px] flex-1">
                  <select
                    value={form.classTeacherOf}
                    onChange={set("classTeacherOf")}
                    className="w-full h-10 pl-3 pr-8 rounded-xl border border-slate-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 appearance-none transition"
                  >
                    <option value="">Select class…</option>
                    {CLASS_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Subject Teacher rows */}
              <div className="space-y-2">
                <span className="text-sm text-gray-700">Subject Teacher for:</span>
                {subjectRows.map((row) => (
                  <div key={row.id} className="flex items-center gap-2">
                    {/* Class */}
                    <div className="relative flex-1">
                      <select
                        value={row.classId}
                        onChange={(e) => updateSubjectRow(row.id, "classId", e.target.value)}
                        className="w-full h-10 pl-3 pr-7 rounded-xl border border-slate-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 appearance-none"
                      >
                        <option value="">Class…</option>
                        {CLASS_OPTIONS.map((c) => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                    {/* Section */}
                    <div className="relative w-20 shrink-0">
                      <select
                        value={row.section}
                        onChange={(e) => updateSubjectRow(row.id, "section", e.target.value)}
                        className="w-full h-10 pl-3 pr-7 rounded-xl border border-slate-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 appearance-none"
                      >
                        <option value="">Sec…</option>
                        {SECTION_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                    {/* Subject */}
                    <div className="relative flex-[2]">
                      <select
                        value={row.subject}
                        onChange={(e) => updateSubjectRow(row.id, "subject", e.target.value)}
                        className="w-full h-10 pl-3 pr-7 rounded-xl border border-slate-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 appearance-none"
                      >
                        <option value="">Subject…</option>
                        {SUBJECT_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeSubjectRow(row.id)}
                      disabled={subjectRows.length === 1}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSubjectRow}
                  className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors mt-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Subject
                </button>
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="px-5 sm:px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm shadow-indigo-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating…" : "Add Staff Member"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
